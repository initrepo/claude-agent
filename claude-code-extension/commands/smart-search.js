#!/usr/bin/env node

/**
 * /initrepo-search slash command handler
 *
 * Intelligent context search using direct MCP integration.
 * This replaces generic agent calls with sophisticated document intelligence.
 */

import MCPContextManager from '../mcp-manager.js';

export default async function handleInitRepoSearch(context, searchQuery) {
  const mcpManager = new MCPContextManager();

  if (!searchQuery) {
    return {
      success: false,
      message: '❌ Search query required. Usage: /initrepo-search <query>',
      examples: [
        '/initrepo-search email warming',
        '/initrepo-search user authentication',
        '/initrepo-search payment system'
      ]
    };
  }

  try {
    console.log('🔍 InitRepo Smart Search');
    console.log('========================');
    console.log(`📁 Working Directory: ${process.cwd()}`);
    console.log(`🔎 Query: "${searchQuery}"`);
    console.log('🤖 Using intelligent MCP context retrieval...\n');

    // Initialize MCP connection
    const initialized = await mcpManager.initialize();
    if (!initialized) {
      return {
        success: false,
        message: '❌ Failed to connect to MCP server. Ensure InitRepo MCP server is available.',
        suggestions: [
          'Install initrepo-mcp package',
          'Verify MCP server configuration',
          'Check project documentation structure'
        ]
      };
    }

    // Perform intelligent context search
    const searchResult = await mcpManager.searchForContext(searchQuery, {
      includeImplementation: true,
      includeRelated: true
    });

    // Format intelligent response
    const response = mcpManager.formatIntelligentResponse(searchResult, searchQuery);

    // Cleanup
    await mcpManager.cleanup();

    if (response.success) {
      return {
        success: true,
        message: response.message,
        data: {
          ...response.data,
          command: 'initrepo-search',
          query: searchQuery,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        success: false,
        message: response.message,
        suggestions: response.suggestions || [],
        data: {
          command: 'initrepo-search',
          query: searchQuery,
          timestamp: new Date().toISOString()
        }
      };
    }

  } catch (error) {
    await mcpManager.cleanup();

    return {
      success: false,
      message: `❌ Search failed: ${error.message}`,
      error: error.message,
      data: {
        command: 'initrepo-search',
        query: searchQuery,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const query = process.argv.slice(2).join(' ');
  handleInitRepoSearch(null, query).then(result => {
    console.log(result.message);
    if (!result.success && result.suggestions) {
      console.log('\n💡 Suggestions:');
      result.suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
    }
    process.exit(result.success ? 0 : 1);
  });
}