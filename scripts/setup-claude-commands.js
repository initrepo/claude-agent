#!/usr/bin/env node

/**
 * Setup Claude Code Commands for InitRepo Agent
 *
 * Creates custom command files that Claude Code can recognize and execute.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

class ClaudeCommandSetup {
  constructor() {
    this.workingDirectory = process.cwd();
    this.claudeDir = path.join(this.workingDirectory, '.claude');
    this.commandsDir = path.join(this.claudeDir, 'commands');
  }

  async setup() {
    console.log('🔧 Setting up Claude Code Commands for InitRepo Agent');
    console.log('====================================================');
    console.log(`📁 Working Directory: ${this.workingDirectory}\n`);

    try {
      // Create directories
      this.createDirectories();

      // Create command files
      this.createCommands();

      // Update package.json
      this.updatePackageJson();

      // Create shell aliases
      this.createShellAliases();

      console.log('\n🎉 Claude Code commands setup completed!');
      console.log('\n📋 Available Commands:');
      console.log('   /initrepo-agent     - Start autonomous building');
      console.log('   /initrepo-status    - Check project status');
      console.log('   /initrepo-verify    - Verify task completion');
      console.log('   /initrepo-check     - Validate setup');
      console.log('\n📋 Alternative Access Methods:');
      console.log('   npm run claude:agent   - Start autonomous building');
      console.log('   npm run claude:status  - Check project status');
      console.log('   npm run claude:verify  - Verify completion');
      console.log('\n🚀 Ready to use in Claude Code!');

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      throw error;
    }
  }

  createDirectories() {
    console.log('📂 Creating directories...');

    if (!existsSync(this.claudeDir)) {
      mkdirSync(this.claudeDir, { recursive: true });
      console.log('   ✅ Created .claude directory');
    }

    if (!existsSync(this.commandsDir)) {
      mkdirSync(this.commandsDir, { recursive: true });
      console.log('   ✅ Created .claude/commands directory');
    }
  }

  createCommands() {
    console.log('📝 Creating command files...');

    const commands = [
      {
        name: 'initrepo-agent',
        description: 'Run autonomous InitRepo project building',
        script: 'node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js',
        emoji: '🤖'
      },
      {
        name: 'initrepo-status',
        description: 'Check InitRepo project status and progress',
        script: 'node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js',
        emoji: '📊'
      },
      {
        name: 'initrepo-verify',
        description: 'Verify InitRepo task completion and quality',
        script: 'node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js $1',
        emoji: '✅'
      },
      {
        name: 'initrepo-check',
        description: 'Validate InitRepo setup and environment',
        script: 'npx initrepo-claude --check',
        emoji: '🔍'
      }
    ];

    commands.forEach(cmd => {
      const commandContent = this.generateCommandFile(cmd);
      const filePath = path.join(this.commandsDir, `${cmd.name}.md`);
      writeFileSync(filePath, commandContent);
      console.log(`   ✅ Created ${cmd.name}.md`);
    });
  }

  generateCommandFile(cmd) {
    return `---
name: ${cmd.name}
description: ${cmd.description}
---

${cmd.emoji} ${cmd.description}

This command will ${cmd.description.toLowerCase()}.

\`\`\`bash
${cmd.script}
\`\`\`
`;
  }

  updatePackageJson() {
    console.log('📦 Updating package.json...');

    const packageJsonPath = path.join(this.workingDirectory, 'package.json');

    try {
      let packageJson = {};

      if (existsSync(packageJsonPath)) {
        const content = require('fs').readFileSync(packageJsonPath, 'utf8');
        packageJson = JSON.parse(content);
      }

      // Add or update scripts
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      packageJson.scripts = {
        ...packageJson.scripts,
        'claude:agent': 'node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js',
        'claude:status': 'node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js',
        'claude:verify': 'node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js',
        'claude:check': 'npx initrepo-claude --check'
      };

      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('   ✅ Updated package.json with Claude commands');

    } catch (error) {
      console.log('   ⚠️  Could not update package.json:', error.message);
    }
  }

  createShellAliases() {
    console.log('🔧 Creating shell aliases...');

    const aliasContent = `
# InitRepo Claude Agent Aliases
alias iragent="node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js"
alias irstatus="node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js"
alias irverify="node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js"
alias ircheck="npx initrepo-claude --check"
`;

    const aliasFilePath = path.join(this.workingDirectory, '.claude-aliases.sh');
    writeFileSync(aliasFilePath, aliasContent.trim());

    console.log('   ✅ Created .claude-aliases.sh');
    console.log('   💡 To use aliases globally, add to your shell config:');
    console.log('      source .claude-aliases.sh');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new ClaudeCommandSetup();
  setup.setup().catch(error => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  });
}

export default ClaudeCommandSetup;