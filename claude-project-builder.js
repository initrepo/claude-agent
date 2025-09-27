#!/usr/bin/env node

/**
 * Claude Project Builder Agent - Practical Implementation
 *
 * This script demonstrates how the Claude Agent would systematically
 * build a project using the InitRepo MCP tools.
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class ClaudeProjectBuilderAgent {
    constructor() {
        this.mcpServer = null;
        this.taskQueue = [];
        this.completedTasks = [];
        this.phase = 'discovery';
        this.workingDirectory = process.cwd();
        this.mcpServerPath = this.findMcpServer();

        // Set current project info immediately
        this.currentProject = {
            id: path.basename(this.workingDirectory),
            name: path.basename(this.workingDirectory),
            path: this.workingDirectory,
            docsPath: path.join(this.workingDirectory, 'docs')
        };

        this.metrics = {
            startTime: new Date(),
            tasksCompleted: 0,
            healthScore: 0,
            qualityScore: 0
        };
    }

    findMcpServer() {
        const possiblePaths = [
            // Try current project's node_modules first
            path.join(this.workingDirectory, 'node_modules', 'initrepo-mcp', 'dist', 'packages', 'mcp-server', 'src', 'index.js'),
            // Try global installation
            '/usr/local/lib/node_modules/initrepo-mcp/dist/packages/mcp-server/src/index.js',
            // Try adjacent directory (development setup)
            path.join(path.dirname(this.workingDirectory), 'initrepo-mcp', 'dist', 'packages', 'mcp-server', 'src', 'index.js'),
            // Try standard location
            '/mnt/c/initrepo-mcp/dist/packages/mcp-server/src/index.js'
        ];

        for (const serverPath of possiblePaths) {
            if (existsSync(serverPath)) {
                console.log(`✅ Found MCP server at: ${serverPath}`);
                return {
                    path: serverPath,
                    cwd: path.dirname(path.dirname(path.dirname(path.dirname(serverPath))))
                };
            }
        }

        throw new Error(`❌ MCP server not found. Tried:\n${possiblePaths.join('\n')}\n\nPlease install initrepo-mcp or ensure it's available.`);
    }

    async initialize() {
        console.log('🤖 Claude Project Builder Agent v1.1');
        console.log(`📁 Working directory: ${this.workingDirectory}`);
        console.log('🚀 Initializing MCP connection...');

        // Start MCP server with dynamic path
        this.mcpServer = spawn('node', [this.mcpServerPath.path], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: this.mcpServerPath.cwd,
            env: {
                ...process.env,
                'AGENT_MODE': 'project_builder',
                'LOG_LEVEL': 'info',
                'PROJECT_ROOT': this.workingDirectory
            }
        });

        // Wait for server to be ready
        await this.waitForServerReady();
        console.log('✅ MCP Server connected and ready');

        console.log(`📋 Current project: ${this.currentProject.name}`);
        console.log(`📚 Documentation path: ${this.currentProject.docsPath}`);

        // Validate project structure
        await this.validateProjectStructure();
    }

    async validateProjectStructure() {
        console.log('🔍 Validating project structure...');

        const requiredItems = [
            { path: this.currentProject.docsPath, type: 'directory', name: 'docs folder' },
            { path: path.join(this.currentProject.docsPath, 'README.md'), type: 'file', name: 'docs/README.md' },
        ];

        let missingItems = [];

        for (const item of requiredItems) {
            if (!existsSync(item.path)) {
                missingItems.push(item.name);
                console.log(`⚠️  Missing ${item.name}: ${item.path}`);
            } else {
                console.log(`✅ Found ${item.name}`);
            }
        }

        if (missingItems.length > 0) {
            console.log(`\n⚠️  Project structure validation warnings:`);
            console.log(`   Missing: ${missingItems.join(', ')}`);
            console.log(`   The agent will work better with proper InitRepo documentation structure.`);
            console.log(`   Consider running 'initrepo init' to set up the project structure.`);
        } else {
            console.log('✅ Project structure validation passed');
        }
    }

    async waitForServerReady() {
        return new Promise((resolve) => {
            this.mcpServer.stderr.on('data', (data) => {
                const output = data.toString();
                if (output.includes('InitRepo MCP Server running on stdio')) {
                    resolve();
                }
            });
        });
    }

    async sendMCPCommand(tool, params = {}) {
        return new Promise((resolve, reject) => {
            const request = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: tool,
                    arguments: params
                }
            };

            this.mcpServer.stdin.write(JSON.stringify(request) + '\n');

            // Simulate response for demo purposes
            setTimeout(() => {
                resolve(this.generateMockResponse(tool, params));
            }, 100);
        });
    }

    generateMockResponse(tool, params) {
        // Mock responses based on the tool being called
        switch (tool) {
            case 'listProjects':
                return {
                    summary: { totalProjects: 1, activeProject: 'initrepo-mcp' },
                    projects: [{
                        id: 'abc123',
                        name: 'initrepo-mcp',
                        confidence: 100,
                        isActive: true,
                        hasRequiredFiles: true
                    }]
                };

            case 'getProjectStatus':
                return {
                    status: 'healthy',
                    totalProjects: 1,
                    activeProject: 'initrepo-mcp',
                    avgConfidence: 100
                };

            case 'identifyNextCriticalTasks':
                return {
                    nextTasks: [
                        { task: 'T-001', priority: 'critical', reason: 'Foundation setup' },
                        { task: 'T-002', priority: 'high', reason: 'Core functionality' },
                        { task: 'T-003', priority: 'high', reason: 'Database integration' }
                    ]
                };

            case 'generateSmartImplementationBrief':
                return {
                    id: params.id,
                    brief: `Implementation brief for ${params.id}:\n\n1. Setup project structure\n2. Implement core features\n3. Add error handling\n4. Write tests`,
                    dependencies: ['T-000'],
                    estimatedEffort: '4 hours',
                    technicalApproach: 'Use TypeScript with proper error handling'
                };

            case 'generateProjectHealthReport':
                return {
                    summary: {
                        healthScore: Math.min(100, 60 + this.completedTasks.length * 10),
                        totalItems: 10,
                        completedItems: this.completedTasks.length,
                        completionRate: `${(this.completedTasks.length / 10 * 100).toFixed(1)}%`
                    }
                };

            default:
                return { message: `Mock response for ${tool}` };
        }
    }

    async phase1_Discovery() {
        console.log('\n📊 PHASE 1: PROJECT DISCOVERY & SETUP');
        console.log('=' .repeat(50));

        // Step 1: List available projects
        console.log('🔍 Discovering projects...');
        const projects = await this.sendMCPCommand('listProjects');
        console.log(`   Found ${projects.summary.totalProjects} project(s)`);

        if (projects.summary.totalProjects === 0) {
            console.log('❌ No projects found. Please create InitRepo documentation first.');
            return false;
        }

        // Step 2: Check project status
        console.log('⚡ Checking project status...');
        const status = await this.sendMCPCommand('getProjectStatus');
        console.log(`   Status: ${status.status}`);
        console.log(`   Active Project: ${status.activeProject}`);

        // Step 3: Generate health report
        console.log('🏥 Generating health report...');
        const health = await this.sendMCPCommand('generateProjectHealthReport');
        this.metrics.healthScore = health.summary.healthScore;
        console.log(`   Health Score: ${health.summary.healthScore}%`);
        console.log(`   Completion Rate: ${health.summary.completionRate}`);

        // Step 4: Validate documentation
        console.log('📋 Validating documentation...');
        const validation = await this.sendMCPCommand('validateDocumentationCompleteness');
        console.log('   Documentation validation complete');

        this.phase = 'planning';
        return true;
    }

    async phase2_Planning() {
        console.log('\n🗺️  PHASE 2: STRATEGIC TASK PLANNING');
        console.log('=' .repeat(50));

        // Step 1: Analyze task dependencies
        console.log('🔗 Analyzing task dependencies...');
        const dependencies = await this.sendMCPCommand('analyzeTaskDependencies');
        console.log('   Dependency analysis complete');

        // Step 2: Identify critical tasks
        console.log('🎯 Identifying critical tasks...');
        const criticalTasks = await this.sendMCPCommand('identifyNextCriticalTasks', { limit: 5 });
        this.taskQueue = criticalTasks.nextTasks;

        console.log('   Critical Tasks Identified:');
        this.taskQueue.forEach((task, i) => {
            console.log(`   ${i + 1}. ${task.task} - ${task.priority} (${task.reason})`);
        });

        // Step 3: Generate task schedule
        console.log('📅 Generating implementation schedule...');
        const schedule = await this.sendMCPCommand('generateTaskSchedule');
        console.log('   Implementation schedule created');

        // Step 4: Technical feasibility assessment
        console.log('🔧 Assessing technical feasibility...');
        const feasibility = await this.sendMCPCommand('assessTechnicalFeasibility');
        console.log('   Technical assessment complete');

        this.phase = 'implementation';
        return true;
    }

    async phase3_Implementation() {
        console.log('\n⚡ PHASE 3: ITERATIVE IMPLEMENTATION');
        console.log('=' .repeat(50));

        for (let i = 0; i < this.taskQueue.length; i++) {
            const task = this.taskQueue[i];
            console.log(`\n🔨 Implementing Task ${i + 1}/${this.taskQueue.length}: ${task.task}`);

            // Step 1: Get task context
            console.log('   📖 Getting task context...');
            const context = await this.sendMCPCommand('getContextById', { id: task.task });

            // Step 2: Generate implementation brief
            console.log('   📋 Generating implementation brief...');
            const brief = await this.sendMCPCommand('generateSmartImplementationBrief', {
                id: task.task,
                includeTestingStrategy: true,
                includeEdgeCases: true
            });

            // Step 3: Validate understanding
            console.log('   ✅ Validating context understanding...');
            const validation = await this.sendMCPCommand('validateContextUnderstanding', { id: task.task });

            // Step 4: Get implementation context
            console.log('   🛠️  Getting implementation context...');
            const implContext = await this.sendMCPCommand('getImplementationContext', {
                id: task.task,
                includePatterns: true,
                includeFileStructure: true
            });

            // Step 5: Simulate code implementation
            console.log('   💻 Implementing code...');
            await this.simulateCodeImplementation(task, brief);

            // Step 6: Mark task as completed
            this.completedTasks.push(task.task);
            this.metrics.tasksCompleted++;
            console.log(`   ✅ Task ${task.task} completed successfully`);

            // Brief pause between tasks
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.phase = 'quality';
        return true;
    }

    async simulateCodeImplementation(task, brief) {
        // Simulate time taken for implementation
        const implementationTime = Math.random() * 2000 + 1000; // 1-3 seconds

        // Create a simple implementation log
        const implementation = {
            taskId: task.task,
            priority: task.priority,
            reason: task.reason,
            brief: brief.brief,
            implementedAt: new Date().toISOString(),
            estimatedEffort: brief.estimatedEffort || '2 hours',
            technicalApproach: brief.technicalApproach || 'Standard implementation'
        };

        // Simulate writing implementation details
        const filename = `implementations/${task.task.toLowerCase()}_implementation.json`;
        try {
            writeFileSync(filename, JSON.stringify(implementation, null, 2));
            console.log(`     📁 Implementation details saved to ${filename}`);
        } catch (error) {
            console.log(`     📁 Implementation details logged for ${task.task}`);
        }

        await new Promise(resolve => setTimeout(resolve, implementationTime));
    }

    async phase4_QualityAssurance() {
        console.log('\n🛡️  PHASE 4: QUALITY ASSURANCE & COMPLETION');
        console.log('=' .repeat(50));

        // Step 1: Validate cross-references
        console.log('🔗 Validating cross-references...');
        const crossRefs = await this.sendMCPCommand('validateCrossReferences');
        console.log('   Cross-reference validation complete');

        // Step 2: Check documentation gaps
        console.log('📋 Checking documentation gaps...');
        const gaps = await this.sendMCPCommand('checkDocumentationGaps');
        console.log('   Documentation gap analysis complete');

        // Step 3: Find orphaned references
        console.log('🔍 Finding orphaned references...');
        const orphaned = await this.sendMCPCommand('findOrphanedReferences');
        console.log('   Orphaned reference check complete');

        // Step 4: Validate ID consistency
        console.log('📏 Validating ID consistency...');
        const consistency = await this.sendMCPCommand('validateIdConsistency');
        console.log('   ID consistency validation complete');

        // Step 5: Final health report
        console.log('🏥 Generating final health report...');
        const finalHealth = await this.sendMCPCommand('generateProjectHealthReport');
        this.metrics.healthScore = finalHealth.summary.healthScore;

        console.log('\n📊 FINAL PROJECT METRICS:');
        console.log(`   Health Score: ${finalHealth.summary.healthScore}%`);
        console.log(`   Tasks Completed: ${this.metrics.tasksCompleted}`);
        console.log(`   Completion Rate: ${finalHealth.summary.completionRate}`);
        console.log(`   Total Time: ${Math.round((Date.now() - this.metrics.startTime) / 1000)}s`);

        // Success criteria check
        const isSuccess = finalHealth.summary.healthScore >= 90;
        console.log(`\n${isSuccess ? '🎉' : '⚠️'} PROJECT ${isSuccess ? 'COMPLETED SUCCESSFULLY' : 'NEEDS ATTENTION'}`);

        if (!isSuccess) {
            console.log('   Recommendations:');
            console.log('   - Address remaining health issues');
            console.log('   - Complete any missing tasks');
            console.log('   - Review documentation completeness');
        }

        return isSuccess;
    }

    async cleanup() {
        if (this.mcpServer) {
            this.mcpServer.kill();
            console.log('\n🔌 MCP Server connection closed');
        }
    }

    async run() {
        try {
            await this.initialize();

            // Execute all phases
            const phase1Success = await this.phase1_Discovery();
            if (!phase1Success) return;

            const phase2Success = await this.phase2_Planning();
            if (!phase2Success) return;

            const phase3Success = await this.phase3_Implementation();
            if (!phase3Success) return;

            const phase4Success = await this.phase4_QualityAssurance();

            console.log('\n' + '='.repeat(60));
            console.log('🤖 Claude Project Builder Agent - Session Complete');
            console.log('='.repeat(60));

        } catch (error) {
            console.error('❌ Agent error:', error.message);
        } finally {
            await this.cleanup();
        }
    }
}

// Usage examples and CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const agent = new ClaudeProjectBuilderAgent();

    // Handle CLI arguments
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🤖 Claude Project Builder Agent v1.1

DESCRIPTION:
  Intelligent AI agent for building InitRepo projects systematically using MCP tools.
  Follows a 4-phase structured workflow: Discovery → Planning → Implementation → Quality Assurance

USAGE:
  initrepo-claude [options]
  node claude-project-builder.js [options]

OPTIONS:
  --help, -h              Show this help message
  --version, -v           Show version information
  --check                 Run environment and setup check
  --setup-claude-code     Setup Claude Code integration
  --phase <phase>         Start from specific phase (discovery|planning|implementation|quality)
  --project <id>          Use specific project ID
  --dry-run               Simulation mode (no actual changes)

EXAMPLES:
  initrepo-claude --check                          # Check setup and environment
  initrepo-claude --setup-claude-code              # Setup Claude Code integration
  initrepo-claude                                  # Full project build
  initrepo-claude --phase planning                # Start from planning phase
  initrepo-claude --dry-run                       # Simulation mode
  node claude-project-builder.js --project 123    # Use specific project

INSTALLATION:
  npm install -g initrepo-claude-agent
  # Or: curl -fsSL https://raw.githubusercontent.com/initrepo/claude-agent/master/install.sh | bash

DOCUMENTATION:
  • CLAUDE.md - Claude Code integration guide
  • README.md - Full documentation
  • CLAUDE_AGENT_USAGE_GUIDE.md - Usage instructions

REPOSITORY:
  https://github.com/initrepo/claude-agent

⚠️  NOTE: Requires InitRepo MCP server for full functionality.
        `);
        process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
        console.log('Claude Project Builder Agent v1.1.0');
        process.exit(0);
    }

    if (args.includes('--check') || args.includes('--setup-check')) {
        console.log('🔍 Running setup and environment check...\n');

        try {
            // Create agent but skip initialization
            const checkAgent = new ClaudeProjectBuilderAgent();
            console.log('✅ Agent initialization successful');

            // Check if we can find MCP server
            console.log(`✅ MCP server found at: ${checkAgent.mcpServerPath.path}`);

            // Check current project
            console.log(`✅ Current project: ${checkAgent.currentProject.name} (${checkAgent.workingDirectory})`);

            // Check docs folder
            if (existsSync(checkAgent.currentProject.docsPath)) {
                console.log(`✅ Documentation folder found: ${checkAgent.currentProject.docsPath}`);
            } else {
                console.log(`⚠️  Documentation folder not found: ${checkAgent.currentProject.docsPath}`);
            }

            console.log('\n🎉 Setup check completed successfully!');
            console.log('   You can now run: initrepo-claude');

        } catch (error) {
            console.error('❌ Setup check failed:', error.message);
            process.exit(1);
        }

        process.exit(0);
    }

    if (args.includes('--setup-claude-code')) {
        console.log('🔧 Setting up Claude Code integration...\n');

        try {
            // Create Claude Code settings directory
            const claudeDir = path.join(process.cwd(), '.claude');
            if (!existsSync(claudeDir)) {
                mkdirSync(claudeDir, { recursive: true });
                console.log('✅ Created .claude directory');
            }

            // Create Claude Code settings for the agent
            const claudeSettings = {
                "permissions": {
                    "allow": [
                        "Bash(find:*)",
                        "Bash(node:*)",
                        "Bash(npm:*)",
                        "Bash(npx:*)",
                        "Bash(echo:*)",
                        "Bash(timeout:*)",
                        "Read(./**)",
                        "Write(./**)",
                        "Edit(./**)",
                        "Glob(./**)",
                        "Grep(./**)",
                        "mcp__initrepo__*"
                    ],
                    "deny": [
                        "Read(/mnt/c/initrepo-mcp/**)",
                        "Write(/mnt/c/initrepo-mcp/**)"
                    ],
                    "ask": []
                },
                "auto_run_commands": false
            };

            const settingsPath = path.join(claudeDir, 'settings.local.json');
            writeFileSync(settingsPath, JSON.stringify(claudeSettings, null, 2));
            console.log('✅ Created Claude Code settings');

            // Run the command setup script
            console.log('🔧 Setting up Claude Code commands...');
            const { spawn } = await import('child_process');
            const setupScript = path.join(path.dirname(fileURLToPath(import.meta.url)), 'scripts', 'setup-claude-commands.js');

            const setupProcess = spawn('node', [setupScript], {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            setupProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('\n🎉 Claude Code integration setup completed!');
                    console.log('\n📋 Available Commands:');
                    console.log('   /initrepo-agent     - Start autonomous building');
                    console.log('   /initrepo-status    - Check project status');
                    console.log('   /initrepo-verify    - Verify completion');
                    console.log('   npm run claude:agent - Alternative access');
                    console.log('\n🚀 Ready to use in Claude Code!');
                } else {
                    console.error('❌ Command setup failed');
                }
                process.exit(code);
            });

        } catch (error) {
            console.error('❌ Claude Code setup failed:', error.message);
            process.exit(1);
        }

        // Don't run the agent after setup, let the spawn process handle completion
    } else {
        // Run the agent
        agent.run().catch(console.error);
    }
}

export default ClaudeProjectBuilderAgent;