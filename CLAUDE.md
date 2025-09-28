# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude AI Agent System** for building InitRepo projects systematically using MCP (Model Context Protocol) tools. The system provides both standalone CLI functionality and integrates with Claude Code's native agent system for autonomous project building.

## 🤖 Claude Code Agent Integration

This project includes specialized Claude Code agents for InitRepo methodology. See `AGENTS.md` for detailed agent definitions.

### Available Agents:
- **initrepo-agent**: Autonomous project building (4-phase workflow)
- **initrepo-status**: Project monitoring and health assessment
- **initrepo-verify**: Quality assurance and task verification

### Available Slash Commands:
- `/initrepo-agent` - Start autonomous building
- `/initrepo-status` - Check project status and health
- `/initrepo-verify [task-id]` - Verify task completion

### Setting Up Agents (First Time):
Run the agent setup script to create proper Claude Code agents and commands:
```bash
./setup-claude-agents.sh   # Linux/Mac
setup-claude-agents.bat    # Windows
```

This will create the agents using Claude Code's native system:
```bash
claude agents create new initrepo-agent --generate-with-claude "..."
claude commands create new initrepo-agent --generate-with-claude "..."
```

## Commands

### Running the Agent
```bash
# Basic execution
node claude-project-builder.js

# Run specific phase
node claude-project-builder.js --phase discovery
node claude-project-builder.js --phase planning
node claude-project-builder.js --phase implementation
node claude-project-builder.js --phase quality

# Simulation mode (dry-run)
node claude-project-builder.js --dry-run
```

### Development Commands
```bash
# Check Node.js version (requires >=16.0.0)
node --version

# File search operations (permitted by Claude Code settings)
find . -name "*.js" -type f
```

## Architecture

### Core Components

**Main Agent** (`claude-project-builder.js`): 391-line implementation with `ClaudeProjectBuilderAgent` class containing:
- `phase1_Discovery()` - Project analysis and health assessment
- `phase2_Planning()` - Task dependency analysis and strategic planning
- `phase3_Implementation()` - Iterative feature development
- `phase4_QualityAssurance()` - Validation and completion verification

**Configuration** (`claude-agent-config.json`): Defines agent behavior, MCP integration settings, and 39 specialized tools organized by workflow phase.

### MCP Integration

The agent connects to an external MCP server at `dist/packages/mcp-server/src/index.js` from the `initrepo-mcp` project. Communication uses JSON-RPC 2.0 over stdio. The server must be running and accessible for the agent to function.

**Tool Categories**:
- **Discovery**: `listProjects`, `getProjectStatus`, `validateDocumentationCompleteness`
- **Planning**: `analyzeTaskDependencies`, `identifyNextCriticalTasks`, `generateTaskSchedule`
- **Implementation**: `getContextById`, `generateSmartImplementationBrief`, `validateContextUnderstanding`
- **Quality**: `validateCrossReferences`, `checkDocumentationGaps`, `findOrphanedReferences`

### Task Management System

The agent uses priority-based task queues (critical, high, medium, low) with dependency resolution. Tasks progress through states with health scoring and completion tracking. Implementation follows iterative cycles with validation loops.

## Project State

This is a **demonstration implementation** with mock MCP responses (lines 75-129 in main file). The project is designed to become an NPM package (`initrepo-claude-agent`) with global CLI installation, but currently exists as a standalone Node.js script.

**Missing Components**:
- No `package.json` (planned structure documented in `INITREPO_CLAUDE_AGENT_PACKAGE_GUIDE.md`)
- No testing framework
- No build process (direct Node.js execution)
- No CI/CD pipeline

## File Structure

```
/
├── claude-project-builder.js           # Main agent implementation
├── claude-agent-config.json           # Agent configuration and MCP tools
├── CLAUDE_PROJECT_BUILDER_AGENT.md    # Architecture documentation
├── CLAUDE_AGENT_USAGE_GUIDE.md        # Usage instructions
├── INITREPO_CLAUDE_AGENT_PACKAGE_GUIDE.md # Package creation guide
└── .claude/settings.local.json        # Claude Code permissions
```

## Development Notes

- Uses ES6 modules (`import`/`export`)
- Requires external `initrepo-mcp` project with built MCP server
- Entry point has shebang for CLI usage: `#!/usr/bin/env node`
- Claude Code permissions allow `find:*` bash commands only
- Current implementation includes comprehensive logging and progress tracking