#!/usr/bin/env node

/**
 * Post-installation script for InitRepo Claude Agent
 * Sets up the agent in the user's environment
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('🤖 InitRepo Claude Agent - Post-Installation Setup');
console.log('====================================================');

try {
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion < 16) {
    console.warn('⚠️  Warning: Node.js 16+ is recommended. Current version:', nodeVersion);
  } else {
    console.log('✅ Node.js version check passed:', nodeVersion);
  }

  // Create Claude Code settings directory if it doesn't exist
  const claudeDir = path.join(process.cwd(), '.claude');
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log('✅ Created .claude directory');
  }

  // Create Claude Code settings for the agent
  const claudeSettings = {
    "bash_command_allowlist": [
      "find:*",
      "node:*",
      "npm:*"
    ],
    "auto_run_commands": false
  };

  const settingsPath = path.join(claudeDir, 'settings.local.json');
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(claudeSettings, null, 2));
    console.log('✅ Created Claude Code settings');
  }

  console.log('\n🎉 Installation completed successfully!');
  console.log('\n📋 Quick Start:');
  console.log('   • Run the agent: initrepo-claude');
  console.log('   • Or use: node claude-project-builder.js');
  console.log('   • Help: initrepo-claude --help');

  console.log('\n📚 Documentation:');
  console.log('   • CLAUDE.md - Claude Code integration guide');
  console.log('   • README.md - Full documentation');
  console.log('   • CLAUDE_AGENT_USAGE_GUIDE.md - Usage instructions');

  console.log('\n⚠️  Important Notes:');
  console.log('   • This agent requires an InitRepo MCP server to function');
  console.log('   • Current implementation includes mock responses for demonstration');
  console.log('   • See documentation for MCP server setup instructions');

} catch (error) {
  console.error('❌ Post-installation failed:', error.message);
  process.exit(1);
}