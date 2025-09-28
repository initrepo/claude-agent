# Claude Code Setup Guide

## 🎯 **Correct Approach: Native Claude Code Agents**

We discovered that the proper way to create Claude Code slash commands is through Claude Code's native agent system, not by creating `.md` files.

## 🚀 **Quick Setup (2 minutes)**

### **Step 1: Install Package**
```bash
npm install -g initrepo-claude-agent@latest
```

### **Step 2: Generate Agent Setup Script**
```bash
cd your-project
npm run setup-agents
# OR: node node_modules/initrepo-claude-agent/scripts/setup-claude-agents.js
```

### **Step 3: Run Setup Commands**
```bash
# Linux/Mac
./setup-claude-agents.sh

# Windows
setup-claude-agents.bat
```

This will run the proper Claude Code commands:
```bash
# Create agents
claude agents create new initrepo-agent --generate-with-claude "..."
claude agents create new initrepo-status --generate-with-claude "..."
claude agents create new initrepo-verify --generate-with-claude "..."

# Create slash commands
claude commands create new initrepo-agent --generate-with-claude "..."
claude commands create new initrepo-status --generate-with-claude "..."
claude commands create new initrepo-verify --generate-with-claude "..."
```

### **Step 4: Test Your Setup**
In Claude Code CLI:
```
/initrepo-agent     # Start autonomous building
/initrepo-status    # Check project status
/initrepo-verify    # Verify task completion
```

Or use agents directly:
```
/agent initrepo-agent "Build the email warming system"
/agent initrepo-status "Check current project health"
/agent initrepo-verify "Validate task T-025"
```

## 📋 **What Gets Created**

### **Agents**:
- **initrepo-agent**: Autonomous project builder (4-phase workflow)
- **initrepo-status**: Project monitoring and health assessment
- **initrepo-verify**: Quality assurance and task verification

### **Slash Commands**:
- `/initrepo-agent` - Delegates to initrepo-agent for autonomous building
- `/initrepo-status` - Delegates to initrepo-status for project monitoring
- `/initrepo-verify` - Delegates to initrepo-verify for quality validation

### **Files Created**:
- `AGENTS.md` - Agent definitions and documentation
- `setup-claude-agents.sh` - Setup script for Linux/Mac
- `setup-claude-agents.bat` - Setup script for Windows

## ❌ **Previous Approach (Deprecated)**

The previous approach of creating `.claude/commands/*.md` files was incorrect. Claude Code slash commands should be created using:
- `claude agents create` for agents
- `claude commands create` for slash commands

## 🎯 **Benefits of Proper Approach**

✅ **Native Integration**: Uses Claude Code's built-in agent system
✅ **Proper Command Registration**: Commands actually work as slash commands
✅ **Agent Delegation**: Commands properly delegate to specialized agents
✅ **Context & Memory**: Agents maintain context across interactions
✅ **Tool Access**: Agents have proper tool permissions and access

## 🔧 **Troubleshooting**

If slash commands don't work:
1. Ensure you ran the setup commands in Claude Code CLI
2. Check that agents were created: `claude agents list`
3. Check that commands were created: `claude commands list`
4. Restart Claude Code CLI if needed

## 📚 **Documentation**

- `AGENTS.md` - Detailed agent definitions and prompts
- `CLAUDE.md` - General Claude Code integration guidance
- `README.md` - Package overview and usage instructions