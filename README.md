# InitRepo Autonomous Agent for Claude Code

**🤖 Autonomous project building with minimal human intervention - Built for Claude Code slash commands**

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Claude Code](https://img.shields.io/badge/Claude_Code-Extension-purple)

## 🚀 Overview

**Set it up once, then let the AI build your entire project autonomously.**

This autonomous AI agent integrates directly with Claude Code to build InitRepo projects with **minimal human intervention**. After a simple setup, just run `/initrepo-agent` and watch as the AI systematically discovers, plans, implements, and validates your entire project following InitRepo methodology.

## 🎯 Autonomous Features

### 🤖 **Primary Feature: Claude Code Slash Commands**
- **`/initrepo-agent`** - Fully autonomous project building (hands-off!)
- **`/initrepo-status`** - Real-time progress monitoring
- **`/initrepo-verify`** - Task completion validation

### ⚡ **Minimal Human Intervention**
- **Setup**: One-time installation and configuration (2 minutes)
- **Usage**: Single command starts autonomous building (`/initrepo-agent`)
- **Monitoring**: Optional progress checks (`/initrepo-status`)
- **Verification**: Optional final validation (`/initrepo-verify`)

### 🧠 **Intelligent Automation**
- **Document Intelligence**: Reads and understands InitRepo documentation automatically
- **Task Discovery**: Finds all tasks (T-001, T-002, etc.) across documents
- **Dependency Resolution**: Determines optimal implementation order automatically
- **Quality Assurance**: Self-validates implementation and documentation integrity

## 🏗️ Architecture

### Core Components

- **Main Agent** (`claude-project-builder.js`): 391-line orchestrator with phase management
- **Configuration** (`claude-agent-config.json`): Behavior definitions and MCP tool mapping
- **Documentation**: Comprehensive guides for usage and package deployment

### Workflow Phases

1. **Discovery Phase**: Project analysis and health assessment
2. **Planning Phase**: Task dependency analysis and strategic scheduling
3. **Implementation Phase**: Iterative feature development with validation
4. **Quality Assurance Phase**: Cross-reference validation and completion verification

## 🛠️ Requirements

- **Node.js**: >=16.0.0
- **External Dependency**: InitRepo MCP Server (`initrepo-mcp` project)
- **Platform**: Cross-platform (Windows WSL2, Linux, macOS)

## 🚀 Quick Start (2 minutes setup)

### **Step 1: Install**
```bash
npm install -g initrepo-claude-agent@latest
```

### **Step 2: Setup Claude Code Extension**
```bash
# Navigate to your project
cd your-project

# Setup Claude Code integration
initrepo-claude --setup-claude-code

# Install extension
mkdir -p ~/.claude-code/extensions/initrepo-agent
cp -r node_modules/initrepo-claude-agent/claude-code-extension/* ~/.claude-code/extensions/initrepo-agent/
```

### **Step 3: Start Building Autonomously**
```bash
# In Claude Code CLI:
/initrepo-agent
```

**That's it! The agent now builds your project autonomously.** 🎉

## 🤖 Autonomous Commands

| Command | Purpose | Human Input Required |
|---------|---------|---------------------|
| `/initrepo-agent` | **Start autonomous building** | 1 command, then hands-off |
| `/initrepo-status` | **Monitor progress** | Optional status checks |
| `/initrepo-verify` | **Validate completion** | Optional final verification |

### **Legacy CLI Interface** (Optional)
The original CLI interface is still available for advanced users:
```bash
node claude-project-builder.js --help
```

## 🔧 Configuration

The agent behavior is controlled through `claude-agent-config.json` which defines:

- **MCP Server Settings**: Connection parameters and environment variables
- **Tool Organization**: 39 tools categorized by workflow phase
- **Success Criteria**: Phase completion requirements and retry logic
- **Behavioral Settings**: Priorities, standards, and error handling

## 📊 MCP Tools Integration

The agent utilizes 39 specialized MCP tools organized by phase:

- **Discovery Tools**: `listProjects`, `getProjectStatus`, `validateDocumentationCompleteness`
- **Planning Tools**: `analyzeTaskDependencies`, `identifyNextCriticalTasks`, `generateTaskSchedule`
- **Implementation Tools**: `getContextById`, `generateSmartImplementationBrief`, `validateContextUnderstanding`
- **Quality Tools**: `validateCrossReferences`, `checkDocumentationGaps`, `findOrphanedReferences`

## 📚 Documentation

- `CLAUDE_PROJECT_BUILDER_AGENT.md` - Detailed architecture and workflow documentation
- `CLAUDE_AGENT_USAGE_GUIDE.md` - Integration and usage instructions
- `INITREPO_CLAUDE_AGENT_PACKAGE_GUIDE.md` - NPM package creation guide
- `CLAUDE.md` - Claude Code integration guidance

## 🚧 Current Status

This is a **demonstration implementation** with mock MCP responses. The project is designed to become a production NPM package (`initrepo-claude-agent`) with global CLI installation.

**Planned Features**:
- NPM package distribution
- Global CLI command (`initrepo-claude`)
- Real MCP server integration
- Comprehensive testing suite
- CI/CD pipeline

## ⚖️ License

**PROPRIETARY SOFTWARE** - See LICENSE file for terms. This software is protected by copyright and proprietary license restrictions.

## 🔗 Related Projects

- [InitRepo MCP Server](https://github.com/initrepo/initrepo-mcp) - Required MCP server dependency
- [InitRepo](https://github.com/initrepo/initrepo) - Main InitRepo project

---

**Repository**: https://github.com/initrepo/claude-agent.git
**Organization**: InitRepo
**Maintained by**: InitRepo Development Team