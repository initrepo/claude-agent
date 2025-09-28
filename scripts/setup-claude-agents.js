#!/usr/bin/env node

/**
 * Setup Claude Code Agents and Commands (Proper Method)
 *
 * Creates agents and slash commands using Claude Code's native system
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

class ClaudeAgentSetup {
  constructor() {
    this.workingDirectory = process.cwd();
  }

  async setup() {
    console.log('🤖 Setting up Claude Code Agents and Commands (Proper Method)');
    console.log('==============================================================');
    console.log(`📁 Working Directory: ${this.workingDirectory}\n`);

    try {
      // Generate the setup commands for the user to run
      this.generateSetupInstructions();

      // Create the instruction file
      this.createSetupScript();

      console.log('\n🎉 Agent setup instructions generated!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Run the commands in setup-claude-agents.sh');
      console.log('   2. Follow the interactive prompts');
      console.log('   3. Test with /initrepo-agent, /initrepo-status, /initrepo-verify');

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      throw error;
    }
  }

  generateSetupInstructions() {
    console.log('📝 Generating Claude Code agent setup commands...');

    const commands = [
      {
        title: 'Create InitRepo Autonomous Agent',
        command: 'claude agents create new initrepo-agent --generate-with-claude',
        prompt: '"You are an autonomous InitRepo project building agent. Analyze InitRepo documentation, identify tasks (T-001, F-001, US-001 patterns), create implementation plans, and build features autonomously with minimal human intervention. Work through 4 phases: Discovery → Planning → Implementation → Quality Assurance. Use the InitRepo MCP server for document intelligence."'
      },
      {
        title: 'Create InitRepo Status Agent',
        command: 'claude agents create new initrepo-status --generate-with-claude',
        prompt: '"You are a project status monitoring agent for InitRepo projects. Analyze project health, track task progress, generate status reports, and identify issues. Provide clear, actionable insights about project state and next steps."'
      },
      {
        title: 'Create InitRepo Verification Agent',
        command: 'claude agents create new initrepo-verify --generate-with-claude',
        prompt: '"You are a quality assurance agent for InitRepo projects. Verify task completion, validate code quality, check documentation compliance, and provide go/no-go deployment recommendations. Be thorough but efficient."'
      },
      {
        title: 'Create /initrepo-agent Command',
        command: 'claude commands create new initrepo-agent --generate-with-claude',
        prompt: '"Create a command that delegates autonomous project building to the initrepo-agent. The command should start the 4-phase workflow: discovery, planning, implementation, and quality assurance."'
      },
      {
        title: 'Create /initrepo-status Command',
        command: 'claude commands create new initrepo-status --generate-with-claude',
        prompt: '"Create a command that delegates project status checking to the initrepo-status agent. The command should provide health scores, task progress, and next steps."'
      },
      {
        title: 'Create /initrepo-verify Command',
        command: 'claude commands create new initrepo-verify --generate-with-claude',
        prompt: '"Create a command that delegates quality verification to the initrepo-verify agent. The command should accept optional task IDs and verify completion and quality."'
      }
    ];

    return commands;
  }

  createSetupScript() {
    console.log('🔧 Creating setup script...');

    const commands = this.generateSetupInstructions();

    let scriptContent = `#!/bin/bash

# InitRepo Claude Code Agent Setup Script
# Run these commands one by one to create proper Claude Code agents and slash commands

echo "🤖 Setting up InitRepo Claude Code Agents and Commands"
echo "===================================================="
echo ""

`;

    commands.forEach((cmd, index) => {
      scriptContent += `echo "📋 Step ${index + 1}: ${cmd.title}"\n`;
      scriptContent += `echo "Command: ${cmd.command} ${cmd.prompt}"\n`;
      scriptContent += `echo ""\n`;
      scriptContent += `echo "Press Enter to run this command..."\n`;
      scriptContent += `read\n`;
      scriptContent += `${cmd.command} ${cmd.prompt}\n`;
      scriptContent += `echo ""\n`;
      scriptContent += `echo "✅ Step ${index + 1} completed"\n`;
      scriptContent += `echo ""\n\n`;
    });

    scriptContent += `echo "🎉 All agents and commands created!"
echo ""
echo "📋 Test your new slash commands:"
echo "   /initrepo-agent     - Start autonomous building"
echo "   /initrepo-status    - Check project status"
echo "   /initrepo-verify    - Verify task completion"
echo ""
echo "🤖 Use agents directly:"
echo '   /agent initrepo-agent "Build the email system"'
echo '   /agent initrepo-status "Check project health"'
echo '   /agent initrepo-verify "Validate all tasks"'
`;

    const scriptPath = path.join(this.workingDirectory, 'setup-claude-agents.sh');
    writeFileSync(scriptPath, scriptContent);

    // Also create a Windows batch file
    const batContent = scriptContent
      .replace('#!/bin/bash', '@echo off')
      .replace(/echo "/g, 'echo ')
      .replace(/"/g, '')
      .replace(/read/g, 'pause');

    const batPath = path.join(this.workingDirectory, 'setup-claude-agents.bat');
    writeFileSync(batPath, batContent);

    console.log('   ✅ Created setup-claude-agents.sh (Linux/Mac)');
    console.log('   ✅ Created setup-claude-agents.bat (Windows)');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new ClaudeAgentSetup();
  setup.setup().catch(error => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  });
}

export default ClaudeAgentSetup;