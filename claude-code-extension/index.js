#!/usr/bin/env node

/**
 * Claude Code Extension for InitRepo Claude Agent
 *
 * This extension provides slash commands to integrate the InitRepo Claude Agent
 * directly within Claude Code CLI interface.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

class ClaudeCodeExtension {
  constructor() {
    this.agentPath = this.findAgentPath();
    this.workingDirectory = process.cwd();
  }

  findAgentPath() {
    const possiblePaths = [
      // Try global installation
      'initrepo-claude-agent',
      // Try local node_modules
      path.join(process.cwd(), 'node_modules', '.bin', 'initrepo-claude'),
      // Try direct path to main agent file
      path.join(process.cwd(), 'node_modules', 'initrepo-claude-agent', 'claude-project-builder.js')
    ];

    // For now, return the npm package name which should work if installed globally
    return 'npx initrepo-claude-agent';
  }

  async executeAgent(args = []) {
    return new Promise((resolve, reject) => {
      console.log(`🤖 Running InitRepo Claude Agent in ${this.workingDirectory}`);
      console.log(`📋 Command: ${this.agentPath} ${args.join(' ')}`);

      const [command, ...commandArgs] = this.agentPath.split(' ');
      const allArgs = [...commandArgs, ...args];

      const child = spawn(command, allArgs, {
        stdio: 'inherit',
        cwd: this.workingDirectory
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Agent exited with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async handleBuildCommand() {
    console.log('🚀 Starting InitRepo project build...');
    try {
      await this.executeAgent([]);
      console.log('✅ InitRepo project build completed successfully!');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }
  }

  async handleCheckCommand() {
    console.log('🔍 Running InitRepo setup check...');
    try {
      await this.executeAgent(['--check']);
      console.log('✅ Setup check completed!');
    } catch (error) {
      console.error('❌ Setup check failed:', error.message);
      throw error;
    }
  }

  async handlePhaseCommand(phase) {
    console.log(`🎯 Running InitRepo phase: ${phase}`);
    try {
      await this.executeAgent(['--phase', phase]);
      console.log(`✅ Phase ${phase} completed successfully!`);
    } catch (error) {
      console.error(`❌ Phase ${phase} failed:`, error.message);
      throw error;
    }
  }
}

// Export for use by Claude Code
export default ClaudeCodeExtension;

// CLI interface for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const extension = new ClaudeCodeExtension();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case 'build':
        await extension.handleBuildCommand();
        break;
      case 'check':
        await extension.handleCheckCommand();
        break;
      case 'phase':
        if (!args[0]) {
          console.error('❌ Phase argument required. Use: discovery|planning|implementation|quality');
          process.exit(1);
        }
        await extension.handlePhaseCommand(args[0]);
        break;
      default:
        console.log('Usage: node index.js <command> [args]');
        console.log('Commands: build, check, phase <phase-name>');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}