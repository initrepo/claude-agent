# Creating the InitRepo Claude Agent Package

## 📦 Package Structure & Setup

### **1. Create New Package Directory Structure**
```
initrepo-claude-agent/
├── package.json
├── README.md
├── bin/
│   └── initrepo-claude.js          # CLI entry point
├── lib/
│   ├── agent.js                    # Main agent class
│   ├── config.js                   # Configuration handler
│   └── installer.js                # Installation logic
├── templates/
│   ├── claude-project-builder.js   # Agent implementation
│   ├── claude-agent-config.json    # Default config
│   ├── claude-agent-usage-guide.md # Documentation
│   └── claude-mcp-settings.json    # MCP integration
└── scripts/
    └── postinstall.js              # Post-install setup
```

### **2. Package.json Configuration**
```json
{
  "name": "initrepo-claude-agent",
  "version": "1.0.0",
  "description": "AI agent for building InitRepo projects systematically using MCP tools",
  "main": "lib/agent.js",
  "bin": {
    "initrepo-claude": "./bin/initrepo-claude.js"
  },
  "scripts": {
    "postinstall": "node scripts/postinstall.js",
    "test": "node test/test-agent.js"
  },
  "keywords": [
    "initrepo",
    "claude",
    "agent",
    "ai",
    "mcp",
    "project-builder",
    "automation"
  ],
  "dependencies": {
    "commander": "^11.0.0",
    "chalk": "^5.3.0",
    "inquirer": "^9.2.0",
    "fs-extra": "^11.1.0",
    "path": "^0.12.7"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/initrepo-claude-agent.git"
  },
  "license": "AGPL-3.0"
}
```

## 🛠️ CLI Implementation

### **3. Create CLI Entry Point** (`bin/initrepo-claude.js`)
```javascript
#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { InstallCommand } from '../lib/installer.js';
import { AgentRunner } from '../lib/agent.js';
import { ConfigManager } from '../lib/config.js';

program
  .name('initrepo-claude')
  .description('InitRepo Claude Agent - AI-powered project builder')
  .version('1.0.0');

// Install command
program
  .command('install')
  .description('Install Claude Agent files to .initrepo/agent/claude/')
  .option('-f, --force', 'Force overwrite existing files')
  .option('-c, --config <path>', 'Custom config file path')
  .action(async (options) => {
    console.log(chalk.blue('🤖 Installing InitRepo Claude Agent...'));

    const installer = new InstallCommand();
    await installer.run(options);

    console.log(chalk.green('✅ Claude Agent installed successfully!'));
    console.log(chalk.cyan('💡 Run "initrepo-claude start" to begin building your project'));
  });

// Start command
program
  .command('start')
  .description('Start the Claude Agent project builder')
  .option('-p, --phase <phase>', 'Start from specific phase (discovery|planning|implementation|quality)')
  .option('-d, --dry-run', 'Simulation mode (no actual changes)')
  .option('--project-id <id>', 'Use specific project ID')
  .action(async (options) => {
    console.log(chalk.blue('🚀 Starting Claude Project Builder Agent...'));

    const agent = new AgentRunner();
    await agent.start(options);
  });

// Status command
program
  .command('status')
  .description('Check agent installation and project status')
  .action(async () => {
    const config = new ConfigManager();
    await config.showStatus();
  });

// Config command
program
  .command('config')
  .description('Manage agent configuration')
  .option('-s, --show', 'Show current configuration')
  .option('-e, --edit', 'Edit configuration file')
  .action(async (options) => {
    const config = new ConfigManager();
    await config.manage(options);
  });

program.parse();
```

### **4. Installation Logic** (`lib/installer.js`)
```javascript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class InstallCommand {
  constructor() {
    this.projectRoot = process.cwd();
    this.agentDir = path.join(this.projectRoot, '.initrepo', 'agent', 'claude');
    this.templateDir = path.join(import.meta.dirname, '..', 'templates');
  }

  async run(options = {}) {
    try {
      // 1. Verify we're in an InitRepo project
      await this.verifyInitRepoProject();

      // 2. Create agent directory
      await this.createAgentDirectory(options.force);

      // 3. Copy template files
      await this.copyTemplateFiles();

      // 4. Setup MCP integration
      await this.setupMCPIntegration();

      // 5. Create convenience scripts
      await this.createConvenienceScripts();

      // 6. Update .gitignore if exists
      await this.updateGitignore();

      console.log(chalk.green('\n🎉 Installation complete!'));
      console.log(chalk.cyan('📁 Agent files installed to:'), this.agentDir);

    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  }

  async verifyInitRepoProject() {
    const docsDir = path.join(this.projectRoot, 'docs');
    const initrepoFiles = [
      'business_analysis.md',
      'prd.md',
      'user_stories.md'
    ];

    const hasDocsDir = await fs.pathExists(docsDir);
    if (!hasDocsDir) {
      throw new Error('No docs/ directory found. This doesn\'t appear to be an InitRepo project.');
    }

    const hasInitRepoFiles = await Promise.all(
      initrepoFiles.map(file => fs.pathExists(path.join(docsDir, file)))
    );

    if (!hasInitRepoFiles.some(exists => exists)) {
      const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'No InitRepo documentation files found. Continue anyway?',
        default: false
      }]);

      if (!proceed) {
        throw new Error('Installation cancelled. Please run "npx initrepo-cli" first to generate documentation.');
      }
    }

    console.log(chalk.green('✅ InitRepo project verified'));
  }

  async createAgentDirectory(force = false) {
    if (await fs.pathExists(this.agentDir)) {
      if (!force) {
        const { overwrite } = await inquirer.prompt([{
          type: 'confirm',
          name: 'overwrite',
          message: 'Claude Agent directory already exists. Overwrite?',
          default: false
        }]);

        if (!overwrite) {
          throw new Error('Installation cancelled. Use --force to overwrite existing files.');
        }
      }

      await fs.remove(this.agentDir);
    }

    await fs.ensureDir(this.agentDir);
    console.log(chalk.green('📁 Created agent directory'));
  }

  async copyTemplateFiles() {
    const files = [
      'claude-project-builder.js',
      'claude-agent-config.json',
      'claude-agent-usage-guide.md',
      'claude-mcp-settings.json'
    ];

    for (const file of files) {
      const srcPath = path.join(this.templateDir, file);
      const destPath = path.join(this.agentDir, file);

      await fs.copy(srcPath, destPath);
      console.log(chalk.blue(`📄 Copied ${file}`));
    }
  }

  async setupMCPIntegration() {
    const mcpConfigPath = path.join(this.agentDir, 'claude-mcp-settings.json');
    const configTemplate = await fs.readJson(mcpConfigPath);

    // Update paths to be relative to current project
    configTemplate.mcpServers.initrepo.cwd = this.projectRoot;
    configTemplate.mcpServers.initrepo.args = [
      path.join(this.projectRoot, 'dist/packages/mcp-server/src/index.js')
    ];

    await fs.writeJson(mcpConfigPath, configTemplate, { spaces: 2 });
    console.log(chalk.green('🔧 Configured MCP integration'));
  }

  async createConvenienceScripts() {
    const scriptsDir = path.join(this.agentDir, 'scripts');
    await fs.ensureDir(scriptsDir);

    // Create run-agent.sh script
    const runScript = `#!/bin/bash
cd "${this.projectRoot}"
node "${path.join(this.agentDir, 'claude-project-builder.js')}" "$@"
`;

    await fs.writeFile(path.join(scriptsDir, 'run-agent.sh'), runScript);
    await fs.chmod(path.join(scriptsDir, 'run-agent.sh'), '755');

    // Create run-agent.bat for Windows
    const runBat = `@echo off
cd /d "${this.projectRoot}"
node "${path.join(this.agentDir, 'claude-project-builder.js')}" %*
`;

    await fs.writeFile(path.join(scriptsDir, 'run-agent.bat'), runBat);

    console.log(chalk.green('📜 Created convenience scripts'));
  }

  async updateGitignore() {
    const gitignorePath = path.join(this.projectRoot, '.gitignore');

    if (await fs.pathExists(gitignorePath)) {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');

      if (!gitignoreContent.includes('.initrepo/agent/claude/implementations/')) {
        const agentIgnores = `
# InitRepo Claude Agent
.initrepo/agent/claude/implementations/
.initrepo/agent/claude/logs/
.initrepo/agent/claude/temp/
`;
        await fs.appendFile(gitignorePath, agentIgnores);
        console.log(chalk.green('📝 Updated .gitignore'));
      }
    }
  }
}
```

### **5. Agent Runner** (`lib/agent.js`)
```javascript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { spawn } from 'child_process';

export class AgentRunner {
  constructor() {
    this.projectRoot = process.cwd();
    this.agentDir = path.join(this.projectRoot, '.initrepo', 'agent', 'claude');
    this.agentScript = path.join(this.agentDir, 'claude-project-builder.js');
  }

  async start(options = {}) {
    try {
      // Verify installation
      await this.verifyInstallation();

      // Prepare arguments
      const args = this.buildArguments(options);

      // Start the agent
      console.log(chalk.blue('🤖 Starting Claude Project Builder Agent...'));
      console.log(chalk.gray(`Command: node ${this.agentScript} ${args.join(' ')}`));

      const agent = spawn('node', [this.agentScript, ...args], {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      agent.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('✅ Agent completed successfully'));
        } else {
          console.log(chalk.red(`❌ Agent exited with code ${code}`));
        }
      });

      agent.on('error', (error) => {
        console.error(chalk.red('❌ Failed to start agent:'), error.message);
      });

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  }

  async verifyInstallation() {
    if (!await fs.pathExists(this.agentDir)) {
      throw new Error('Claude Agent not installed. Run "initrepo-claude install" first.');
    }

    if (!await fs.pathExists(this.agentScript)) {
      throw new Error('Agent script not found. Try reinstalling with "initrepo-claude install --force".');
    }
  }

  buildArguments(options) {
    const args = [];

    if (options.phase) {
      args.push('--phase', options.phase);
    }

    if (options.dryRun) {
      args.push('--dry-run');
    }

    if (options.projectId) {
      args.push('--project-id', options.projectId);
    }

    return args;
  }
}
```

### **6. Configuration Manager** (`lib/config.js`)
```javascript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ConfigManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.agentDir = path.join(this.projectRoot, '.initrepo', 'agent', 'claude');
    this.configPath = path.join(this.agentDir, 'claude-agent-config.json');
  }

  async showStatus() {
    console.log(chalk.blue('📊 InitRepo Claude Agent Status'));
    console.log('=' .repeat(40));

    // Check installation
    const isInstalled = await fs.pathExists(this.agentDir);
    console.log(chalk.cyan('Installation:'), isInstalled ? chalk.green('✅ Installed') : chalk.red('❌ Not installed'));

    if (isInstalled) {
      // Check config
      const hasConfig = await fs.pathExists(this.configPath);
      console.log(chalk.cyan('Configuration:'), hasConfig ? chalk.green('✅ Found') : chalk.red('❌ Missing'));

      // Check MCP server
      const mcpServerPath = path.join(this.projectRoot, 'dist/packages/mcp-server/src/index.js');
      const hasMcpServer = await fs.pathExists(mcpServerPath);
      console.log(chalk.cyan('MCP Server:'), hasMcpServer ? chalk.green('✅ Available') : chalk.red('❌ Not built'));

      // Show project info
      console.log(chalk.cyan('Project Root:'), this.projectRoot);
      console.log(chalk.cyan('Agent Directory:'), this.agentDir);
    }
  }

  async manage(options) {
    if (options.show) {
      await this.showConfig();
    } else if (options.edit) {
      await this.editConfig();
    } else {
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Show current configuration', value: 'show' },
          { name: 'Edit configuration', value: 'edit' },
          { name: 'Reset to defaults', value: 'reset' }
        ]
      }]);

      switch (action) {
        case 'show':
          await this.showConfig();
          break;
        case 'edit':
          await this.editConfig();
          break;
        case 'reset':
          await this.resetConfig();
          break;
      }
    }
  }

  async showConfig() {
    if (!await fs.pathExists(this.configPath)) {
      console.log(chalk.red('❌ Configuration file not found'));
      return;
    }

    const config = await fs.readJson(this.configPath);
    console.log(chalk.blue('📋 Current Configuration:'));
    console.log(JSON.stringify(config, null, 2));
  }

  async editConfig() {
    console.log(chalk.yellow('💡 Opening configuration file for editing...'));
    console.log(chalk.cyan('File location:'), this.configPath);

    // Note: In a real implementation, you might open the default editor
    // For now, just show the path
  }

  async resetConfig() {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to reset configuration to defaults?',
      default: false
    }]);

    if (confirm) {
      // Copy default config from templates
      const templatePath = path.join(import.meta.dirname, '..', 'templates', 'claude-agent-config.json');
      await fs.copy(templatePath, this.configPath);
      console.log(chalk.green('✅ Configuration reset to defaults'));
    }
  }
}
```

## 📦 Package Publishing & Distribution

### **7. NPM Package Publishing**
```bash
# In the package directory
npm version 1.0.0
npm publish

# Or publish as scoped package
npm publish --access public
```

### **8. Usage Instructions for End Users**

```bash
# Install the package globally
npm install -g initrepo-claude-agent

# Or use npx for one-time usage
npx initrepo-claude-agent install

# Navigate to your InitRepo project
cd my-initrepo-project

# Install the agent files
initrepo-claude install

# Start building your project
initrepo-claude start

# Or with options
initrepo-claude start --phase planning
initrepo-claude start --dry-run
```

### **9. Integration with InitRepo CLI**

To integrate with the main InitRepo CLI, add to the InitRepo CLI package:

```javascript
// In initrepo-cli commands
program
  .command('claude')
  .description('Install and manage Claude Agent')
  .action(async () => {
    const { spawn } = await import('child_process');

    // Check if agent package is installed
    try {
      spawn('npx', ['initrepo-claude-agent', 'install'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } catch (error) {
      console.log('Installing Claude Agent package...');
      spawn('npm', ['install', '-g', 'initrepo-claude-agent'], {
        stdio: 'inherit'
      });
    }
  });
```

## 🎯 File Structure After Installation

When users run `npx initrepo-claude install`, it creates:

```
my-project/
├── docs/                           # Existing InitRepo docs
├── .initrepo/
│   └── agent/
│       └── claude/
│           ├── claude-project-builder.js    # Main agent
│           ├── claude-agent-config.json     # Configuration
│           ├── claude-agent-usage-guide.md  # Documentation
│           ├── claude-mcp-settings.json     # MCP integration
│           ├── scripts/
│           │   ├── run-agent.sh            # Unix script
│           │   └── run-agent.bat           # Windows script
│           ├── implementations/            # Generated code
│           ├── logs/                       # Agent logs
│           └── temp/                       # Temporary files
└── package.json                    # Project's package.json
```

## 🚀 Usage Examples

### **Simple Installation & Usage**
```bash
# In any InitRepo project
npx initrepo-claude-agent install
npx initrepo-claude-agent start
```

### **Advanced Usage**
```bash
# Install globally for repeated use
npm install -g initrepo-claude-agent

# Use in multiple projects
cd project1 && initrepo-claude install && initrepo-claude start
cd project2 && initrepo-claude install && initrepo-claude start --phase implementation
```

### **Development Workflow**
```bash
# Install agent
initrepo-claude install

# Check status
initrepo-claude status

# Start building from planning phase
initrepo-claude start --phase planning

# Resume with dry run to see what would happen
initrepo-claude start --dry-run

# Full implementation
initrepo-claude start
```

### **CI/CD Integration**
```yaml
# .github/workflows/auto-build.yml
name: Auto Build with Claude Agent

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install InitRepo Claude Agent
        run: npm install -g initrepo-claude-agent

      - name: Install agent files
        run: initrepo-claude install --force

      - name: Run agent in dry-run mode
        run: initrepo-claude start --dry-run

      - name: Check project health
        run: initrepo-claude status
```

## 🔧 Advanced Features

### **Custom Templates**
Users can customize the agent by modifying files in `.initrepo/agent/claude/`:

```bash
# Edit agent configuration
initrepo-claude config --edit

# View current status
initrepo-claude status

# Reset to defaults if needed
initrepo-claude config --reset
```

### **Multiple Project Support**
```bash
# Install in multiple projects
for project in project1 project2 project3; do
  cd $project
  initrepo-claude install
  initrepo-claude start --dry-run
done
```

### **Integration with IDEs**
```json
// VS Code tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Install Claude Agent",
      "type": "shell",
      "command": "initrepo-claude install",
      "group": "build"
    },
    {
      "label": "Start Claude Agent",
      "type": "shell",
      "command": "initrepo-claude start",
      "group": "build"
    }
  ]
}
```

## 📋 Implementation Checklist

### **Package Development**
- [ ] Create package directory structure
- [ ] Implement CLI with commander.js
- [ ] Create installation logic with fs-extra
- [ ] Add configuration management
- [ ] Write comprehensive tests
- [ ] Create README and documentation
- [ ] Setup GitHub repository
- [ ] Configure npm publishing

### **Template Files**
- [ ] Move existing agent files to templates/
- [ ] Update paths to be project-relative
- [ ] Create default configuration
- [ ] Add MCP integration templates
- [ ] Include usage documentation

### **Testing**
- [ ] Test installation process
- [ ] Verify file copying and permissions
- [ ] Test CLI commands and options
- [ ] Validate MCP integration
- [ ] Test on different operating systems
- [ ] Verify with real InitRepo projects

### **Documentation**
- [ ] Write comprehensive README
- [ ] Create usage examples
- [ ] Document CLI options
- [ ] Add troubleshooting guide
- [ ] Include integration examples
- [ ] Write contributor guidelines

### **Distribution**
- [ ] Publish to npm registry
- [ ] Create GitHub releases
- [ ] Add to InitRepo ecosystem
- [ ] Update main InitRepo documentation
- [ ] Announce to community

This approach makes the Claude Agent easily installable and manageable while keeping it cleanly separated from the main InitRepo MCP server, allowing users to add AI-powered project building to any InitRepo project with a simple command!