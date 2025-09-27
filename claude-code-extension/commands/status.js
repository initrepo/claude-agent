#!/usr/bin/env node

/**
 * /initrepo-status slash command handler
 *
 * Shows current project progress, task status, and agent health.
 * Helps monitor autonomous agent progress with minimal human intervention.
 */

import MCPContextManager from '../mcp-manager.js';

export default async function handleInitRepoStatus(context) {
  const mcpManager = new MCPContextManager();

  try {
    console.log('📊 InitRepo Project Status');
    console.log('==========================');
    console.log(`📁 Working Directory: ${process.cwd()}`);
    console.log('🔍 Analyzing current project state...\n');

    // Initialize MCP connection
    const initialized = await mcpManager.initialize();
    if (!initialized) {
      return {
        success: false,
        message: '❌ Failed to connect to MCP server. Run /initrepo-check first to validate setup.'
      };
    }

    // Get comprehensive project status
    const projectStatus = await mcpManager.callMCPTool('getProjectStatus');
    const healthReport = await mcpManager.callMCPTool('generateProjectHealthReport');
    const criticalTasks = await mcpManager.callMCPTool('identifyNextCriticalTasks');

    // Get documentation validation
    const docValidation = await mcpManager.callMCPTool('validateDocumentationCompleteness');
    const docGaps = await mcpManager.callMCPTool('checkDocumentationGaps');

    await mcpManager.cleanup();

    // Generate status report
    const statusReport = generateStatusReport({
      projectStatus,
      healthReport,
      criticalTasks,
      docValidation,
      docGaps
    });

    return {
      success: true,
      message: statusReport,
      data: {
        command: 'initrepo-status',
        projectStatus,
        healthReport,
        criticalTasks,
        docValidation,
        docGaps,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    await mcpManager.cleanup();

    return {
      success: false,
      message: `❌ Status check failed: ${error.message}`,
      error: error.message,
      data: {
        command: 'initrepo-status',
        timestamp: new Date().toISOString()
      }
    };
  }
}

function generateStatusReport(data) {
  const { projectStatus, healthReport, criticalTasks, docValidation, docGaps } = data;

  let report = `## 📊 Project Status Report\n\n`;

  // Project Health Overview
  const healthScore = healthReport?.healthScore || 0;
  const healthEmoji = healthScore >= 85 ? '🟢' : healthScore >= 60 ? '🟡' : '🔴';

  report += `### 🏥 Project Health\n`;
  report += `${healthEmoji} **Overall Health**: ${healthScore}%\n`;
  report += `📋 **Documentation Complete**: ${docValidation?.isComplete ? '✅ Yes' : '❌ No'}\n`;
  report += `🎯 **Ready for Implementation**: ${healthScore >= 60 ? '✅ Yes' : '❌ No'}\n\n`;

  // Task Status
  if (criticalTasks?.tasks?.length > 0) {
    report += `### 📋 Critical Tasks (${criticalTasks.tasks.length})\n`;

    const tasksByStatus = criticalTasks.tasks.reduce((acc, task) => {
      const status = task.status || 'pending';
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {});

    Object.entries(tasksByStatus).forEach(([status, tasks]) => {
      const statusEmoji = {
        'completed': '✅',
        'in_progress': '🔄',
        'pending': '⏳',
        'blocked': '🚫'
      }[status] || '❓';

      report += `**${statusEmoji} ${status.toUpperCase()}** (${tasks.length}):\n`;
      tasks.forEach(task => {
        report += `- ${task.id}: ${task.title || task.description || 'No description'}\n`;
      });
      report += '\n';
    });
  } else {
    report += `### 📋 Task Status\n`;
    report += `🎉 **No critical tasks found** - Project may be complete or needs task identification.\n\n`;
  }

  // Documentation Issues
  if (docGaps?.gaps?.length > 0) {
    report += `### 📚 Documentation Gaps (${docGaps.gaps.length})\n`;
    docGaps.gaps.forEach(gap => {
      report += `- ⚠️ ${gap.description || gap.issue || gap}\n`;
    });
    report += '\n';
  }

  // Project Information
  if (projectStatus) {
    report += `### 📂 Project Information\n`;
    report += `- **Name**: ${projectStatus.name || 'Unknown'}\n`;
    report += `- **Path**: ${projectStatus.path || process.cwd()}\n`;
    report += `- **Last Updated**: ${projectStatus.lastUpdated || 'Unknown'}\n\n`;
  }

  // Next Actions
  report += `### 🚀 Recommended Next Actions\n`;

  if (healthScore < 60) {
    report += `- 🔧 **Fix Issues**: Address documentation gaps and project health issues\n`;
    report += `- 📋 **Run Setup**: Use /initrepo-check to identify specific problems\n`;
  } else if (criticalTasks?.tasks?.some(t => (t.status || 'pending') === 'pending')) {
    report += `- 🤖 **Continue Building**: Run /initrepo-agent to continue autonomous implementation\n`;
    report += `- 🎯 **Implement Tasks**: Focus on pending critical tasks\n`;
  } else {
    report += `- ✅ **Quality Check**: Run /initrepo-verify to validate completed work\n`;
    report += `- 🎉 **Deploy**: Project appears ready for deployment\n`;
  }

  report += `\n**Status checked at**: ${new Date().toLocaleString()}`;

  return report;
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  handleInitRepoStatus().then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  });
}