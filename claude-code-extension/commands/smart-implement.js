#!/usr/bin/env node

/**
 * /initrepo-implement slash command handler
 *
 * Intelligent implementation planning using direct MCP context retrieval.
 * Provides detailed implementation guidance with dependencies and specifications.
 */

import MCPContextManager from '../mcp-manager.js';

export default async function handleInitRepoImplement(context, feature) {
  const mcpManager = new MCPContextManager();

  if (!feature) {
    return {
      success: false,
      message: '❌ Feature/task required. Usage: /initrepo-implement <feature>',
      examples: [
        '/initrepo-implement email warming',
        '/initrepo-implement T-025',
        '/initrepo-implement user authentication'
      ]
    };
  }

  try {
    console.log('🔨 InitRepo Smart Implementation');
    console.log('================================');
    console.log(`📁 Working Directory: ${process.cwd()}`);
    console.log(`🎯 Feature: "${feature}"`);
    console.log('🤖 Analyzing implementation requirements...\n');

    // Initialize MCP connection
    const initialized = await mcpManager.initialize();
    if (!initialized) {
      return {
        success: false,
        message: '❌ Failed to connect to MCP server. Ensure InitRepo MCP server is available.'
      };
    }

    // Search for implementation context
    const searchResult = await mcpManager.searchForContext(feature, {
      includeImplementation: true,
      includeTestStrategy: true,
      includeEdgeCases: true
    });

    if (!searchResult.found) {
      await mcpManager.cleanup();
      return {
        success: false,
        message: searchResult.message,
        suggestions: searchResult.suggestions
      };
    }

    // Get implementation plan
    const taskIds = searchResult.matches.filter(id => id.startsWith('T-'));
    const implementationPlan = await mcpManager.getImplementationPlan(taskIds);

    // Format comprehensive implementation response
    let response = `## 🎯 Implementation Plan for "${feature}"\n\n`;

    // Show found items
    response += `### 📋 Related Documentation\n`;
    searchResult.contexts.forEach(({ id, context, implementationBrief }) => {
      response += `**${id}**: ${context.content.split('\n')[0]}\n`;

      if (implementationBrief) {
        response += `- **Approach**: ${implementationBrief.technicalApproach}\n`;
        if (implementationBrief.acceptanceCriteria) {
          response += `- **Success Criteria**: ${implementationBrief.acceptanceCriteria}\n`;
        }
        if (implementationBrief.estimatedEffort) {
          response += `- **Effort**: ${implementationBrief.estimatedEffort}\n`;
        }
      }
      response += '\n';
    });

    // Show dependencies and order
    if (implementationPlan && implementationPlan.dependencies) {
      response += `### 🔗 Implementation Dependencies\n`;

      if (implementationPlan.dependencies.prerequisites?.length > 0) {
        response += `**Prerequisites** (complete first):\n`;
        implementationPlan.dependencies.prerequisites.forEach(prereq => {
          response += `- ${prereq}\n`;
        });
        response += '\n';
      }

      if (implementationPlan.recommendedOrder?.length > 0) {
        response += `**Recommended Implementation Order**:\n`;
        implementationPlan.recommendedOrder.forEach((taskId, index) => {
          response += `${index + 1}. ${taskId}\n`;
        });
        response += '\n';
      }

      if (implementationPlan.dependencies.estimatedEffort) {
        response += `**Total Estimated Effort**: ${implementationPlan.dependencies.estimatedEffort}\n\n`;
      }
    }

    // Show implementation details
    const implementationDetails = searchResult.contexts
      .filter(ctx => ctx.implementationBrief)
      .map(ctx => ctx.implementationBrief);

    if (implementationDetails.length > 0) {
      response += `### 🛠️ Technical Implementation\n`;

      implementationDetails.forEach((brief, index) => {
        if (brief.codeExamples) {
          response += `**Code Approach**:\n\`\`\`\n${brief.codeExamples}\n\`\`\`\n\n`;
        }

        if (brief.testingStrategy) {
          response += `**Testing Strategy**: ${brief.testingStrategy}\n\n`;
        }

        if (brief.edgeCases?.length > 0) {
          response += `**Edge Cases to Consider**:\n`;
          brief.edgeCases.forEach(edgeCase => {
            response += `- ${edgeCase}\n`;
          });
          response += '\n';
        }
      });
    }

    // Add next action suggestions
    response += `### 🚀 Next Actions\n`;
    response += `Choose your next step:\n\n`;
    response += `- 🔨 **Start Implementation**: Begin with ${taskIds[0] || 'first task'}\n`;
    response += `- 📋 **Show Detailed Specs**: Get comprehensive specifications\n`;
    response += `- 🧪 **Generate Tests**: Create test cases for implementation\n`;
    response += `- ⚡ **Run Full Agent**: Execute complete systematic build\n`;
    response += `- 🔍 **Explore Dependencies**: Deep dive into prerequisites\n`;

    await mcpManager.cleanup();

    return {
      success: true,
      message: response,
      data: {
        command: 'initrepo-implement',
        feature,
        matches: searchResult.matches,
        contexts: searchResult.contexts,
        implementationPlan,
        taskIds,
        timestamp: new Date().toISOString(),
        actionSuggestions: [
          { command: `/initrepo-task ${taskIds[0]}`, label: '🔨 Start first task' },
          { command: `/initrepo-specs ${feature}`, label: '📋 Show specifications' },
          { command: `/initrepo-test ${feature}`, label: '🧪 Generate tests' },
          { command: `/initrepo-build`, label: '⚡ Full build' }
        ]
      }
    };

  } catch (error) {
    await mcpManager.cleanup();

    return {
      success: false,
      message: `❌ Implementation planning failed: ${error.message}`,
      error: error.message,
      data: {
        command: 'initrepo-implement',
        feature,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const feature = process.argv.slice(2).join(' ');
  handleInitRepoImplement(null, feature).then(result => {
    console.log(result.message);
    if (result.data?.actionSuggestions) {
      console.log('\n🎯 Suggested next actions:');
      result.data.actionSuggestions.forEach(action => {
        console.log(`   ${action.label}: ${action.command}`);
      });
    }
    process.exit(result.success ? 0 : 1);
  });
}