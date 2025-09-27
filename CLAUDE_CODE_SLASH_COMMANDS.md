# 🚀 Claude Code Slash Commands for InitRepo Agent

## Overview

Use the InitRepo Claude Agent directly within Claude Code using slash commands! This provides seamless integration for systematic project building using AI-powered InitRepo methodology.

## 🎯 Available Slash Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/initrepo-build` | Run full 4-phase systematic build | `/initrepo-build` |
| `/initrepo-check` | Validate setup and environment | `/initrepo-check` |
| `/initrepo-phase` | Run specific workflow phase | `/initrepo-phase discovery` |

## 📦 Installation Methods

### Method 1: Quick Setup (Recommended)

**1. Install the InitRepo Claude Agent:**
```bash
npm install -g initrepo-claude-agent@latest
```

**2. Setup Claude Code integration:**
```bash
cd your-project
initrepo-claude --setup-claude-code
```

**3. Install the Claude Code extension:**
```bash
# Copy extension files to Claude Code extensions directory
cp -r claude-code-extension ~/.claude-code/extensions/initrepo-agent
```

### Method 2: Manual Extension Installation

**1. Create extension directory:**
```bash
mkdir -p ~/.claude-code/extensions/initrepo-agent
```

**2. Copy extension files:**
```bash
cp claude-code-extension/* ~/.claude-code/extensions/initrepo-agent/
```

**3. Install dependencies:**
```bash
cd ~/.claude-code/extensions/initrepo-agent
npm install
```

### Method 3: Development Setup

**1. Clone the repository:**
```bash
git clone https://github.com/initrepo/claude-agent.git
cd claude-agent/claude-code-extension
```

**2. Link for development:**
```bash
claude-code extension link .
```

## 🔧 Configuration

### Claude Code Settings

Add to your Claude Code configuration:

```json
{
  "extensions": {
    "initrepo-claude-agent": {
      "enabled": true,
      "agentPath": "npx initrepo-claude-agent",
      "autoSetupClaudeCode": true,
      "showDetailedOutput": true
    }
  },
  "permissions": {
    "allow": [
      "Bash(find:*)",
      "Bash(node:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Read(./**)",
      "Write(./**)",
      "Edit(./**)",
      "Glob(./**)",
      "Grep(./**)",
      "mcp__initrepo__*"
    ]
  }
}
```

### Project Setup

Your project should have:
- ✅ `docs/` folder with InitRepo documentation
- ✅ InitRepo MCP server accessible
- ✅ Proper project structure

## 🚀 Usage Examples

### 1. Quick Project Assessment
```
/initrepo-check
```
**Output:**
```
🔍 InitRepo Check Command
=========================
📁 Working Directory: /path/to/your/project
✅ MCP server found at: /path/to/mcp-server
✅ Current project: your-project
✅ Documentation folder found: /path/to/docs
✅ Setup check completed successfully!
```

### 2. Full Project Build
```
/initrepo-build
```
**What happens:**
1. **Discovery Phase** - Analyzes project and documentation
2. **Planning Phase** - Creates strategic task plan
3. **Implementation Phase** - Systematically implements features
4. **Quality Assurance** - Validates and completes project

### 3. Phase-by-Phase Development
```
/initrepo-phase discovery
```
**Runs specific workflow phase:**
- `discovery` - Project analysis and health assessment
- `planning` - Task dependency analysis and scheduling
- `implementation` - Iterative feature development
- `quality` - Validation and completion checks

## 🎯 Integration Benefits

### Within Claude Code CLI

✅ **Seamless Integration**: Commands run directly in Claude Code interface
✅ **Current Project Context**: Automatically works on current project
✅ **Progress Tracking**: Real-time output and progress updates
✅ **Error Handling**: Clear error messages and troubleshooting guidance
✅ **Permissions Managed**: Proper Claude Code permission integration

### Workflow Enhancement

```
User: "I need to implement the email warming system"

Claude: Let me check your project setup first.
> /initrepo-check

[Validation output]

Now I'll run the systematic build process:
> /initrepo-build

[4-phase workflow execution with real-time progress]

The InitRepo agent has successfully implemented your email warming system
following systematic methodology!
```

## 🔍 Troubleshooting

### Command Not Found
```bash
# Verify agent installation
npm list -g initrepo-claude-agent

# Reinstall if needed
npm install -g initrepo-claude-agent@latest
```

### Extension Not Loading
```bash
# Check Claude Code extensions directory
ls ~/.claude-code/extensions/

# Verify extension files
cat ~/.claude-code/extensions/initrepo-agent/claude-code.json
```

### Permission Issues
```bash
# Run setup command
initrepo-claude --setup-claude-code

# Verify Claude Code settings
cat .claude/settings.local.json
```

### MCP Server Issues
```bash
# Check agent environment
initrepo-claude --check

# Verify MCP server path
which initrepo-mcp
```

## 📋 Command Reference

### `/initrepo-build`
- **Purpose**: Complete systematic project build
- **Phases**: Discovery → Planning → Implementation → Quality
- **Duration**: 30 seconds - 5 minutes (depending on project complexity)
- **Output**: Detailed progress log and completion summary

### `/initrepo-check`
- **Purpose**: Environment and setup validation
- **Checks**: Agent installation, MCP server, project structure, documentation
- **Duration**: 5-10 seconds
- **Output**: Validation results and setup guidance

### `/initrepo-phase <phase>`
- **Purpose**: Execute specific workflow phase
- **Arguments**: `discovery|planning|implementation|quality`
- **Duration**: Varies by phase (10 seconds - 2 minutes)
- **Output**: Phase-specific progress and results

## 🎉 Getting Started

1. **Install the agent**: `npm install -g initrepo-claude-agent@latest`
2. **Setup your project**: Ensure you have `docs/` folder with InitRepo documentation
3. **Install extension**: Copy extension files to Claude Code extensions directory
4. **Test setup**: Run `/initrepo-check` in Claude Code
5. **Build systematically**: Use `/initrepo-build` to implement your project

**Ready to enhance your Claude Code workflow with systematic AI-powered project building!** 🚀