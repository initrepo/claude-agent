# Claude Agent for InitRepo

**Intelligent project builder agent that integrates with Claude AI to systematically build InitRepo projects using MCP tools.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![License](https://img.shields.io/badge/license-Proprietary-red)

## 🚀 Overview

This repository contains a sophisticated AI agent system designed to automate the complete lifecycle of InitRepo project development. The agent follows a structured 4-phase approach to systematically analyze, plan, implement, and validate software projects using Claude AI and Model Context Protocol (MCP) tools.

## 🎯 Key Features

- **4-Phase Structured Workflow**: Discovery → Planning → Implementation → Quality Assurance
- **MCP Integration**: Communicates with InitRepo MCP server using 39 specialized tools
- **Intelligent Task Management**: Priority-based queues with dependency resolution
- **Real-time Progress Tracking**: Health scoring and completion metrics
- **CLI Interface**: Command-line execution with phase-specific controls

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

## 📋 Usage

### Basic Execution
```bash
node claude-project-builder.js
```

### Phase-Specific Execution
```bash
# Run specific phases
node claude-project-builder.js --phase discovery
node claude-project-builder.js --phase planning
node claude-project-builder.js --phase implementation
node claude-project-builder.js --phase quality
```

### Simulation Mode
```bash
# Dry-run without making changes
node claude-project-builder.js --dry-run
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