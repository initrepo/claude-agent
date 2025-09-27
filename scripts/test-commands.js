#!/usr/bin/env node

/**
 * Test InitRepo Claude Code Commands
 *
 * Verifies that all commands can execute properly and handle errors gracefully.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

class CommandTester {
  constructor() {
    this.workingDirectory = process.cwd();
    this.passed = 0;
    this.failed = 0;
    this.results = [];
  }

  async runTests() {
    console.log('🧪 Testing InitRepo Claude Code Commands');
    console.log('========================================');
    console.log(`📁 Working Directory: ${this.workingDirectory}\n`);

    const tests = [
      {
        name: 'Status Command',
        command: 'node',
        args: ['node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js'],
        expectSuccess: true
      },
      {
        name: 'Check Command',
        command: 'npx',
        args: ['initrepo-claude', '--check'],
        expectSuccess: true
      },
      {
        name: 'Verify Command (no args)',
        command: 'node',
        args: ['node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js'],
        expectSuccess: true
      },
      {
        name: 'Search Command',
        command: 'node',
        args: ['node_modules/initrepo-claude-agent/claude-code-extension/commands/smart-search.js', 'test'],
        expectSuccess: true
      }
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    this.printSummary();
  }

  async runTest(test) {
    console.log(`🔍 Testing: ${test.name}`);

    try {
      const result = await this.executeCommand(test.command, test.args);

      if (result.success === test.expectSuccess) {
        console.log(`   ✅ PASSED - ${test.name}`);
        this.passed++;
        this.results.push({ test: test.name, status: 'PASSED', details: result.output.substring(0, 100) });
      } else {
        console.log(`   ❌ FAILED - ${test.name}`);
        console.log(`   Expected success: ${test.expectSuccess}, Got: ${result.success}`);
        console.log(`   Error: ${result.error}`);
        this.failed++;
        this.results.push({ test: test.name, status: 'FAILED', details: result.error });
      }

    } catch (error) {
      console.log(`   ❌ FAILED - ${test.name}`);
      console.log(`   Exception: ${error.message}`);
      this.failed++;
      this.results.push({ test: test.name, status: 'FAILED', details: error.message });
    }

    console.log();
  }

  executeCommand(command, args) {
    return new Promise((resolve) => {
      const process = spawn(command, args, {
        cwd: this.workingDirectory,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        resolve({
          success: code === 0,
          code,
          output: stdout,
          error: stderr,
          fullOutput: stdout + stderr
        });
      });

      process.on('error', (error) => {
        resolve({
          success: false,
          code: -1,
          output: '',
          error: error.message,
          fullOutput: error.message
        });
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        process.kill();
        resolve({
          success: false,
          code: -1,
          output: stdout,
          error: 'Command timeout',
          fullOutput: stdout + stderr + '\nCommand timeout'
        });
      }, 30000);
    });
  }

  printSummary() {
    console.log('📊 Test Summary');
    console.log('===============');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📊 Total: ${this.passed + this.failed}`);

    if (this.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => r.status === 'FAILED').forEach(result => {
        console.log(`   • ${result.test}: ${result.details}`);
      });
    }

    const successRate = (this.passed / (this.passed + this.failed)) * 100;
    console.log(`\n🎯 Success Rate: ${successRate.toFixed(1)}%`);

    if (successRate >= 75) {
      console.log('🎉 Commands are working well!');
    } else {
      console.log('⚠️  Some commands need attention.');
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new CommandTester();
  tester.runTests().catch(error => {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  });
}

export default CommandTester;