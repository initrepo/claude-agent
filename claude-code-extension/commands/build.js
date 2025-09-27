#!/usr/bin/env node

/**
 * /initrepo-build slash command handler
 *
 * Runs the full InitRepo Claude Agent workflow to build the project systematically.
 */

import ClaudeCodeExtension from '../index.js';

export default async function handleInitRepoBuild(context) {
  const extension = new ClaudeCodeExtension();

  try {
    console.log('🚀 InitRepo Build Command');
    console.log('========================');
    console.log(`📁 Working Directory: ${process.cwd()}`);
    console.log('🤖 Starting systematic project build using InitRepo methodology...\n');

    await extension.handleBuildCommand();

    return {
      success: true,
      message: '✅ InitRepo project build completed successfully! The agent has systematically analyzed, planned, implemented, and validated your project using the 4-phase workflow.',
      data: {
        command: 'initrepo-build',
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ InitRepo build failed: ${error.message}`,
      error: error.message,
      data: {
        command: 'initrepo-build',
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    };
  }
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  handleInitRepoBuild().then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  });
}