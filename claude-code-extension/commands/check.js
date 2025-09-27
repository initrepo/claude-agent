#!/usr/bin/env node

/**
 * /initrepo-check slash command handler
 *
 * Validates the InitRepo project setup and agent environment.
 */

import ClaudeCodeExtension from '../index.js';

export default async function handleInitRepoCheck(context) {
  const extension = new ClaudeCodeExtension();

  try {
    console.log('🔍 InitRepo Check Command');
    console.log('=========================');
    console.log(`📁 Working Directory: ${process.cwd()}`);
    console.log('🔧 Validating project setup and agent environment...\n');

    await extension.handleCheckCommand();

    return {
      success: true,
      message: '✅ InitRepo setup check completed successfully! Your project environment is properly configured for the Claude Agent.',
      data: {
        command: 'initrepo-check',
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ InitRepo setup check failed: ${error.message}. Please ensure the InitRepo Claude Agent is installed and your project has proper documentation structure.`,
      error: error.message,
      data: {
        command: 'initrepo-check',
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString(),
        suggestions: [
          'Install the agent: npm install -g initrepo-claude-agent',
          'Ensure your project has a docs/ folder',
          'Run initrepo-claude --setup-claude-code for Claude Code integration'
        ]
      }
    };
  }
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  handleInitRepoCheck().then(result => {
    console.log(result.message);
    if (!result.success && result.data.suggestions) {
      console.log('\n💡 Suggestions:');
      result.data.suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
    }
    process.exit(result.success ? 0 : 1);
  });
}