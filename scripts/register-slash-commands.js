#!/usr/bin/env node

/**
 * Register Slash Commands with Claude Code
 *
 * Attempts to register InitRepo commands using Claude Code's actual mechanism
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

class SlashCommandRegistrar {
  constructor() {
    this.workingDirectory = process.cwd();
    this.claudeDir = path.join(this.workingDirectory, '.claude');
  }

  async register() {
    console.log('🔧 Registering InitRepo Slash Commands with Claude Code');
    console.log('=====================================================');

    try {
      // Method 1: Claude Code settings.local.json with custom commands
      await this.registerViaSettings();

      // Method 2: Create executable command scripts
      await this.createExecutableCommands();

      // Method 3: Claude Code configuration file
      await this.createClaudeConfig();

      console.log('\n✅ Slash command registration completed!');
      console.log('\n📋 Multiple registration methods attempted:');
      console.log('   1. ✅ settings.local.json custom commands');
      console.log('   2. ✅ Executable command scripts');
      console.log('   3. ✅ Claude Code configuration');
      console.log('\n🧪 Test in Claude Code:');
      console.log('   /initrepo-agent');
      console.log('   /initrepo-status');

    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  }

  async registerViaSettings() {
    console.log('📝 Method 1: Registering via settings.local.json...');

    const settingsPath = path.join(this.claudeDir, 'settings.local.json');
    let settings = {
      "permissions": {
        "allow": [
          "Bash(find:*)",
          "Bash(node:*)",
          "Bash(npm:*)",
          "Bash(npx:*)",
          "Read(./**)",
          "Write(./**)",
          "mcp__initrepo__*"
        ]
      }
    };

    // Read existing settings if they exist
    if (existsSync(settingsPath)) {
      try {
        const existing = JSON.parse(readFileSync(settingsPath, 'utf8'));
        settings = { ...existing, ...settings };
      } catch (error) {
        console.log('   ⚠️  Could not parse existing settings, creating new ones');
      }
    }

    // Add custom commands to settings
    settings.commands = {
      "initrepo-agent": {
        "description": "Start autonomous InitRepo project building",
        "action": "npm run claude:agent"
      },
      "initrepo-status": {
        "description": "Check InitRepo project status",
        "action": "npm run claude:status"
      },
      "initrepo-verify": {
        "description": "Verify InitRepo task completion",
        "action": "npm run claude:verify"
      }
    };

    writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('   ✅ Updated settings.local.json with custom commands');
  }

  async createExecutableCommands() {
    console.log('📝 Method 2: Creating executable command scripts...');

    const scriptsDir = path.join(this.claudeDir, 'scripts');
    if (!existsSync(scriptsDir)) {
      mkdirSync(scriptsDir, { recursive: true });
    }

    const commands = [
      {
        name: 'initrepo-agent',
        description: 'Start autonomous InitRepo building',
        command: 'npm run claude:agent'
      },
      {
        name: 'initrepo-status',
        description: 'Check project status',
        command: 'npm run claude:status'
      },
      {
        name: 'initrepo-verify',
        description: 'Verify task completion',
        command: 'npm run claude:verify'
      }
    ];

    commands.forEach(cmd => {
      const scriptContent = `#!/bin/bash
# ${cmd.description}
echo "🤖 ${cmd.description}..."
${cmd.command}
`;

      const scriptPath = path.join(scriptsDir, `${cmd.name}.sh`);
      writeFileSync(scriptPath, scriptContent);

      // Make executable (if on Unix-like system)
      try {
        import('fs').then(fs => fs.chmodSync(scriptPath, '755'));
      } catch (error) {
        // Ignore chmod errors on Windows
      }

      console.log(`   ✅ Created executable script: ${cmd.name}.sh`);
    });
  }

  async createClaudeConfig() {
    console.log('📝 Method 3: Creating Claude Code configuration...');

    const config = {
      "version": "1.0.0",
      "name": "InitRepo Claude Agent",
      "commands": {
        "initrepo-agent": {
          "description": "🤖 Start autonomous InitRepo project building",
          "type": "script",
          "script": "npm run claude:agent",
          "category": "InitRepo"
        },
        "initrepo-status": {
          "description": "📊 Check InitRepo project status and progress",
          "type": "script",
          "script": "npm run claude:status",
          "category": "InitRepo"
        },
        "initrepo-verify": {
          "description": "✅ Verify InitRepo task completion and quality",
          "type": "script",
          "script": "npm run claude:verify",
          "category": "InitRepo"
        }
      },
      "permissions": [
        "read-project",
        "write-project",
        "execute-commands",
        "mcp-connection"
      ]
    };

    const configPath = path.join(this.claudeDir, 'claude-config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('   ✅ Created claude-config.json');

    // Also create a manifest file
    const manifest = {
      "name": "initrepo-claude-agent",
      "version": "2.0.2",
      "description": "Autonomous AI agent for building InitRepo projects",
      "main": "claude-config.json",
      "commands": Object.keys(config.commands)
    };

    const manifestPath = path.join(this.claudeDir, 'manifest.json');
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('   ✅ Created manifest.json');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const registrar = new SlashCommandRegistrar();
  registrar.register().catch(error => {
    console.error('❌ Registration failed:', error.message);
    process.exit(1);
  });
}

export default SlashCommandRegistrar;