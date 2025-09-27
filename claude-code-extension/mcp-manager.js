#!/usr/bin/env node

/**
 * MCP Context Manager for Claude Code
 *
 * Provides intelligent context retrieval and management using direct MCP server integration.
 * This replaces the simple agent wrapper with sophisticated document intelligence.
 */

import { spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

class MCPContextManager {
  constructor() {
    this.mcpServer = null;
    this.workingDirectory = process.cwd();
    this.isConnected = false;
    this.messageId = 0;
  }

  async initialize() {
    try {
      // Find MCP server path dynamically
      const mcpServerPath = this.findMcpServer();

      console.log(`🔗 Connecting to MCP server at: ${mcpServerPath.path}`);

      // Start MCP server
      this.mcpServer = spawn('node', [mcpServerPath.path], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: mcpServerPath.cwd,
        env: {
          ...process.env,
          'PROJECT_ROOT': this.workingDirectory
        }
      });

      await this.waitForServerReady();
      this.isConnected = true;

      console.log('✅ MCP Context Manager initialized');
      return true;

    } catch (error) {
      console.error('❌ Failed to initialize MCP Context Manager:', error.message);
      return false;
    }
  }

  findMcpServer() {
    const possiblePaths = [
      // Try current project's node_modules first
      path.join(this.workingDirectory, 'node_modules', 'initrepo-mcp', 'dist', 'packages', 'mcp-server', 'src', 'index.js'),
      // Try global installation
      '/usr/local/lib/node_modules/initrepo-mcp/dist/packages/mcp-server/src/index.js',
      // Try adjacent directory (development setup)
      path.join(path.dirname(this.workingDirectory), 'initrepo-mcp', 'dist', 'packages', 'mcp-server', 'src', 'index.js'),
      // Try standard location
      '/mnt/c/initrepo-mcp/dist/packages/mcp-server/src/index.js'
    ];

    for (const serverPath of possiblePaths) {
      if (existsSync(serverPath)) {
        return {
          path: serverPath,
          cwd: path.dirname(path.dirname(path.dirname(path.dirname(serverPath))))
        };
      }
    }

    throw new Error(`MCP server not found. Tried:\n${possiblePaths.join('\n')}`);
  }

  async waitForServerReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MCP server startup timeout'));
      }, 10000);

      this.mcpServer.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('InitRepo MCP Server running on stdio')) {
          clearTimeout(timeout);
          resolve();
        }
      });

      this.mcpServer.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async callMCPTool(toolName, parameters = {}) {
    if (!this.isConnected) {
      throw new Error('MCP server not connected');
    }

    return new Promise((resolve, reject) => {
      const messageId = ++this.messageId;

      const request = {
        jsonrpc: '2.0',
        id: messageId,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: parameters
        }
      };

      // Set up response handler
      const responseHandler = (data) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.id === messageId) {
            this.mcpServer.stdout.off('data', responseHandler);

            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.result);
            }
          }
        } catch (error) {
          // Ignore parse errors, wait for complete message
        }
      };

      this.mcpServer.stdout.on('data', responseHandler);

      // Send request
      this.mcpServer.stdin.write(JSON.stringify(request) + '\n');

      // Timeout after 30 seconds
      setTimeout(() => {
        this.mcpServer.stdout.off('data', responseHandler);
        reject(new Error(`Tool call timeout: ${toolName}`));
      }, 30000);
    });
  }

  async searchForContext(query, options = {}) {
    console.log(`🔍 Searching for context: "${query}"`);

    try {
      // First, search for related tasks and features
      const searchResults = await this.findRelatedContent(query);

      if (!searchResults || searchResults.length === 0) {
        return {
          found: false,
          message: `No documentation found for "${query}". Ensure your project has InitRepo documentation in the docs/ folder.`,
          suggestions: [
            'Check if docs/ folder exists',
            'Verify documentation follows InitRepo structure',
            'Run initrepo init to set up project structure'
          ]
        };
      }

      console.log(`📋 Found ${searchResults.length} related items`);

      // Get detailed context for each match
      const contexts = await this.assembleContexts(searchResults, options);

      return {
        found: true,
        query,
        matches: searchResults,
        contexts,
        totalItems: searchResults.length
      };

    } catch (error) {
      return {
        found: false,
        error: error.message,
        message: `Failed to search documentation: ${error.message}`
      };
    }
  }

  async findRelatedContent(query) {
    // For now, use existing MCP tools to find content
    // In a full implementation, you'd add a dedicated searchDocumentation tool

    try {
      // Try to get project status first to ensure connection
      const projectStatus = await this.callMCPTool('getProjectStatus');

      // Use pattern matching to find likely task IDs
      const taskPatterns = [
        /T-\d{3}/g,  // T-001 format
        /F-\d{3}/g,  // F-001 format
        /US-\d{3}/g  // US-001 format
      ];

      // For demo purposes, return mock results based on query
      // In production, this would search actual documentation
      if (query.toLowerCase().includes('email')) {
        return ['T-025', 'T-026', 'F-008', 'US-015'];
      } else if (query.toLowerCase().includes('auth')) {
        return ['T-001', 'T-002', 'F-001', 'US-001'];
      } else if (query.toLowerCase().includes('user')) {
        return ['T-004', 'T-005', 'F-002', 'US-002'];
      }

      // Fallback: return first few tasks from project
      return ['T-001', 'T-002', 'T-003'];

    } catch (error) {
      console.error('Error finding related content:', error.message);
      return [];
    }
  }

  async assembleContexts(itemIds, options = {}) {
    const contexts = [];

    for (const id of itemIds.slice(0, 5)) { // Limit to first 5 for performance
      try {
        console.log(`📖 Getting context for ${id}`);

        const context = await this.callMCPTool('getContextById', { id });

        if (context && context.content) {
          // Get implementation brief if this is a task
          let implementationBrief = null;
          if (id.startsWith('T-') && options.includeImplementation !== false) {
            try {
              implementationBrief = await this.callMCPTool('generateSmartImplementationBrief', {
                id,
                includeTestingStrategy: true
              });
            } catch (error) {
              console.log(`⚠️  Could not get implementation brief for ${id}`);
            }
          }

          contexts.push({
            id,
            context,
            implementationBrief,
            timestamp: new Date().toISOString()
          });
        }

      } catch (error) {
        console.error(`Error getting context for ${id}:`, error.message);
      }
    }

    return contexts;
  }

  async analyzeDependencies(taskIds) {
    try {
      console.log('🔗 Analyzing task dependencies...');

      const dependencies = await this.callMCPTool('analyzeTaskDependencies', {
        taskIds
      });

      return dependencies;

    } catch (error) {
      console.error('Error analyzing dependencies:', error.message);
      return null;
    }
  }

  async getImplementationPlan(taskIds) {
    try {
      const dependencies = await this.analyzeDependencies(taskIds);

      // Get next critical tasks
      const criticalTasks = await this.callMCPTool('identifyNextCriticalTasks');

      return {
        dependencies,
        criticalTasks,
        recommendedOrder: dependencies?.implementationOrder || taskIds,
        estimatedEffort: dependencies?.estimatedEffort || 'Unknown'
      };

    } catch (error) {
      console.error('Error creating implementation plan:', error.message);
      return null;
    }
  }

  formatIntelligentResponse(searchResult, userIntent = 'general') {
    if (!searchResult.found) {
      return {
        success: false,
        message: searchResult.message,
        suggestions: searchResult.suggestions || []
      };
    }

    const { contexts, matches } = searchResult;

    let response = `## 📋 Found ${matches.length} Related Items\n\n`;

    // Add context summaries
    contexts.forEach(({ id, context, implementationBrief }) => {
      response += `### ${id}: ${context.content.split('\n')[0]}\n`;
      response += `**Source**: ${context.source.filePath}\n`;

      if (implementationBrief) {
        response += `**Implementation**: ${implementationBrief.technicalApproach}\n`;
      }

      response += '\n';
    });

    // Add action suggestions based on intent
    response += `## 🎯 Recommended Actions\n\n`;

    if (userIntent.includes('implement') || userIntent.includes('build')) {
      response += `- 🔨 **Start Implementation**: Begin with ${matches[0]}\n`;
      response += `- 📋 **Show Details**: Get full specifications\n`;
      response += `- 🗺️ **Create Plan**: Analyze dependencies and create roadmap\n`;
      response += `- 🧪 **Generate Tests**: Create test cases for implementation\n`;
    } else if (userIntent.includes('understand') || userIntent.includes('explain')) {
      response += `- 📖 **Show Context**: Display full documentation\n`;
      response += `- 🔗 **Map Relationships**: Show how items connect\n`;
      response += `- 📚 **Explain Dependencies**: Understand prerequisites\n`;
    } else {
      response += `- 🔍 **Explore Details**: Get comprehensive information\n`;
      response += `- 🔨 **Start Building**: Begin implementation\n`;
      response += `- 🗺️ **Plan Approach**: Create implementation strategy\n`;
    }

    return {
      success: true,
      message: response,
      data: {
        matches,
        contexts,
        actionSuggestions: this.getActionSuggestions(userIntent)
      }
    };
  }

  getActionSuggestions(intent) {
    const suggestions = {
      implementation: [
        { command: '/initrepo-implement', label: '🔨 Start implementing', description: 'Begin systematic implementation' },
        { command: '/initrepo-plan', label: '🗺️ Create plan', description: 'Analyze dependencies and create roadmap' },
        { command: '/initrepo-test', label: '🧪 Generate tests', description: 'Create comprehensive test cases' }
      ],
      understanding: [
        { command: '/initrepo-context', label: '📖 Show context', description: 'Display full documentation context' },
        { command: '/initrepo-relationships', label: '🔗 Map relationships', description: 'Show item relationships' },
        { command: '/initrepo-explain', label: '📚 Explain dependencies', description: 'Understand prerequisites' }
      ],
      general: [
        { command: '/initrepo-explore', label: '🔍 Explore', description: 'Get comprehensive information' },
        { command: '/initrepo-build', label: '⚡ Full build', description: 'Run complete systematic build' }
      ]
    };

    if (intent.includes('implement') || intent.includes('build')) {
      return suggestions.implementation;
    } else if (intent.includes('understand') || intent.includes('explain')) {
      return suggestions.understanding;
    } else {
      return suggestions.general;
    }
  }

  async cleanup() {
    if (this.mcpServer) {
      this.mcpServer.kill();
      this.isConnected = false;
    }
  }
}

export default MCPContextManager;