#!/usr/bin/env node

/**
 * /initrepo-verify slash command handler
 *
 * Verifies completed tasks, validates implementation quality, and ensures
 * the autonomous agent completed work correctly.
 */

import MCPContextManager from '../mcp-manager.js';

export default async function handleInitRepoVerify(context, taskId = null) {
  const mcpManager = new MCPContextManager();

  try {
    console.log('✅ InitRepo Task Verification');
    console.log('=============================');
    console.log(`📁 Working Directory: ${process.cwd()}`);

    if (taskId) {
      console.log(`🎯 Verifying specific task: ${taskId}`);
    } else {
      console.log('🔍 Running comprehensive project verification...');
    }

    console.log();

    // Initialize MCP connection
    const initialized = await mcpManager.initialize();
    if (!initialized) {
      return {
        success: false,
        message: '❌ Failed to connect to MCP server. Run /initrepo-check first to validate setup.'
      };
    }

    let verificationResult;

    if (taskId) {
      // Verify specific task
      verificationResult = await verifySpecificTask(mcpManager, taskId);
    } else {
      // Comprehensive project verification
      verificationResult = await verifyProject(mcpManager);
    }

    await mcpManager.cleanup();

    return verificationResult;

  } catch (error) {
    await mcpManager.cleanup();

    return {
      success: false,
      message: `❌ Verification failed: ${error.message}`,
      error: error.message,
      data: {
        command: 'initrepo-verify',
        taskId,
        timestamp: new Date().toISOString()
      }
    };
  }
}

async function verifySpecificTask(mcpManager, taskId) {
  try {
    console.log(`   🔍 Getting task context for ${taskId}...`);

    // Get task context and validation
    const taskContext = await mcpManager.callMCPTool('getContextById', { id: taskId });

    if (!taskContext) {
      return {
        success: false,
        message: `❌ Task ${taskId} not found in documentation.`,
        data: { taskId, found: false }
      };
    }

    console.log('   📋 Validating context understanding...');
    const contextValidation = await mcpManager.callMCPTool('validateContextUnderstanding', {
      id: taskId,
      context: taskContext
    });

    console.log('   🔗 Checking cross-references...');
    const crossRefCheck = await mcpManager.callMCPTool('validateCrossReferences');

    // Generate task-specific verification report
    const verificationReport = generateTaskVerificationReport(taskId, {
      taskContext,
      contextValidation,
      crossRefCheck
    });

    const isValid = contextValidation?.isValid &&
                   (!crossRefCheck?.issues || crossRefCheck.issues.length === 0);

    return {
      success: isValid,
      message: verificationReport,
      data: {
        command: 'initrepo-verify',
        taskId,
        taskContext,
        contextValidation,
        crossRefCheck,
        isValid,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ Failed to verify task ${taskId}: ${error.message}`,
      error: error.message
    };
  }
}

async function verifyProject(mcpManager) {
  try {
    console.log('   🏥 Generating comprehensive health report...');
    const healthReport = await mcpManager.callMCPTool('generateProjectHealthReport');

    console.log('   📋 Validating documentation completeness...');
    const docValidation = await mcpManager.callMCPTool('validateDocumentationCompleteness');

    console.log('   🔗 Checking cross-references and links...');
    const crossRefValidation = await mcpManager.callMCPTool('validateCrossReferences');

    console.log('   📚 Identifying documentation gaps...');
    const docGaps = await mcpManager.callMCPTool('checkDocumentationGaps');

    console.log('   🔍 Finding orphaned references...');
    const orphanedRefs = await mcpManager.callMCPTool('findOrphanedReferences');

    console.log('   🎯 Identifying remaining critical tasks...');
    const remainingTasks = await mcpManager.callMCPTool('identifyNextCriticalTasks');

    // Calculate overall verification score
    const verificationScore = calculateVerificationScore({
      healthReport,
      docValidation,
      crossRefValidation,
      docGaps,
      orphanedRefs,
      remainingTasks
    });

    // Generate comprehensive verification report
    const verificationReport = generateProjectVerificationReport({
      healthReport,
      docValidation,
      crossRefValidation,
      docGaps,
      orphanedRefs,
      remainingTasks,
      verificationScore
    });

    const isPassing = verificationScore >= 80; // 80% threshold for passing

    return {
      success: isPassing,
      message: verificationReport,
      data: {
        command: 'initrepo-verify',
        healthReport,
        docValidation,
        crossRefValidation,
        docGaps,
        orphanedRefs,
        remainingTasks,
        verificationScore,
        isPassing,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ Project verification failed: ${error.message}`,
      error: error.message
    };
  }
}

function calculateVerificationScore(data) {
  const { healthReport, docValidation, crossRefValidation, docGaps, orphanedRefs, remainingTasks } = data;

  let score = 100;

  // Health report score (40% weight)
  const healthScore = healthReport?.healthScore || 0;
  score = score * 0.6 + healthScore * 0.4;

  // Documentation completeness (20% weight)
  if (!docValidation?.isComplete) {
    score -= 20;
  }

  // Cross-reference issues (15% weight)
  const crossRefIssues = crossRefValidation?.issues?.length || 0;
  score -= Math.min(crossRefIssues * 3, 15);

  // Documentation gaps (15% weight)
  const gapCount = docGaps?.gaps?.length || 0;
  score -= Math.min(gapCount * 5, 15);

  // Orphaned references (10% weight)
  const orphanedCount = orphanedRefs?.orphanedReferences?.length || 0;
  score -= Math.min(orphanedCount * 2, 10);

  return Math.max(0, Math.round(score));
}

function generateTaskVerificationReport(taskId, data) {
  const { taskContext, contextValidation, crossRefCheck } = data;

  let report = `## ✅ Task Verification Report: ${taskId}\n\n`;

  // Task context summary
  report += `### 📋 Task Information\n`;
  report += `- **ID**: ${taskId}\n`;
  report += `- **Source**: ${taskContext.source?.filePath || 'Unknown'}\n`;
  report += `- **Content**: ${taskContext.content?.split('\n')[0] || 'No description'}\n\n`;

  // Context validation
  report += `### 🔍 Context Validation\n`;
  if (contextValidation?.isValid) {
    report += `✅ **Status**: Valid - Context is complete and understandable\n`;
    if (contextValidation.confidence) {
      report += `📊 **Confidence**: ${contextValidation.confidence}%\n`;
    }
  } else {
    report += `❌ **Status**: Invalid - Context has issues\n`;
    if (contextValidation?.issues?.length > 0) {
      report += `**Issues**:\n`;
      contextValidation.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
    }
  }
  report += '\n';

  // Cross-reference validation
  if (crossRefCheck?.issues?.length > 0) {
    report += `### 🔗 Cross-Reference Issues\n`;
    crossRefCheck.issues.forEach(issue => {
      if (issue.includes(taskId)) {
        report += `- ⚠️ ${issue}\n`;
      }
    });
    report += '\n';
  }

  // References
  if (taskContext.references?.length > 0) {
    report += `### 🔗 Referenced Items\n`;
    taskContext.references.forEach(ref => {
      report += `- ${ref}\n`;
    });
    report += '\n';
  }

  // Dependencies
  if (taskContext.dependencies?.length > 0) {
    report += `### 📦 Dependencies\n`;
    taskContext.dependencies.forEach(dep => {
      report += `- ${dep}\n`;
    });
    report += '\n';
  }

  // Overall assessment
  const isValid = contextValidation?.isValid &&
                 (!crossRefCheck?.issues || !crossRefCheck.issues.some(issue => issue.includes(taskId)));

  report += `### 🎯 Overall Assessment\n`;
  if (isValid) {
    report += `✅ **Task ${taskId} is properly documented and validated**\n`;
    report += `Ready for implementation or already completed correctly.\n`;
  } else {
    report += `❌ **Task ${taskId} has validation issues**\n`;
    report += `Requires attention before considering it complete.\n`;
  }

  return report;
}

function generateProjectVerificationReport(data) {
  const { healthReport, docValidation, crossRefValidation, docGaps, orphanedRefs, remainingTasks, verificationScore } = data;

  let report = `## ✅ Project Verification Report\n\n`;

  // Overall score
  const scoreEmoji = verificationScore >= 90 ? '🟢' : verificationScore >= 80 ? '🟡' : '🔴';
  report += `### 📊 Overall Verification Score\n`;
  report += `${scoreEmoji} **${verificationScore}%** - ${verificationScore >= 80 ? 'PASSING' : 'NEEDS ATTENTION'}\n\n`;

  // Health assessment
  const healthScore = healthReport?.healthScore || 0;
  const healthEmoji = healthScore >= 85 ? '✅' : healthScore >= 60 ? '⚠️' : '❌';
  report += `### 🏥 Project Health\n`;
  report += `${healthEmoji} **Health Score**: ${healthScore}%\n`;
  report += `📋 **Documentation Complete**: ${docValidation?.isComplete ? '✅ Yes' : '❌ No'}\n\n`;

  // Issues summary
  const issues = [
    ...(crossRefValidation?.issues || []),
    ...(docGaps?.gaps?.map(gap => `Documentation gap: ${gap.description || gap}`) || []),
    ...(orphanedRefs?.orphanedReferences?.map(ref => `Orphaned reference: ${ref}`) || [])
  ];

  if (issues.length > 0) {
    report += `### ⚠️ Issues Found (${issues.length})\n`;
    issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += '\n';
  } else {
    report += `### ✅ No Issues Found\n`;
    report += `All validations passed successfully.\n\n`;
  }

  // Remaining tasks
  if (remainingTasks?.tasks?.length > 0) {
    const pendingTasks = remainingTasks.tasks.filter(t => (t.status || 'pending') === 'pending');

    if (pendingTasks.length > 0) {
      report += `### 📋 Remaining Tasks (${pendingTasks.length})\n`;
      pendingTasks.forEach(task => {
        report += `- ${task.id}: ${task.title || task.description || 'No description'}\n`;
      });
      report += '\n';
    }
  }

  // Recommendations
  report += `### 🚀 Recommendations\n`;

  if (verificationScore >= 90) {
    report += `🎉 **Excellent!** Project is in great shape and ready for deployment.\n`;
  } else if (verificationScore >= 80) {
    report += `✅ **Good!** Project passes verification with minor issues.\n`;
    if (issues.length > 0) {
      report += `📋 Consider addressing the ${issues.length} identified issues for optimal quality.\n`;
    }
  } else {
    report += `❌ **Attention Required!** Project needs work before deployment.\n`;
    if (remainingTasks?.tasks?.length > 0) {
      report += `🔨 Use /initrepo-agent to continue implementation.\n`;
    }
    if (issues.length > 0) {
      report += `🔧 Address the ${issues.length} validation issues.\n`;
    }
  }

  report += `\n**Verification completed at**: ${new Date().toLocaleString()}`;

  return report;
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const taskId = process.argv[2];
  handleInitRepoVerify(null, taskId).then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  });
}