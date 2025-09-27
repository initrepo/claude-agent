# 🚀 Quick Start Guide

## One-Line Installation

```bash
# Option 1: Quick install script
curl -fsSL https://raw.githubusercontent.com/initrepo/claude-agent/master/install.sh | bash

# Option 2: Global npm install
npm install -g initrepo-claude-agent

# Option 3: Clone and run
git clone https://github.com/initrepo/claude-agent.git && cd claude-agent && npm start
```

## Usage

```bash
# Run the agent
initrepo-claude

# Get help
initrepo-claude --help

# Run specific phase
initrepo-claude --phase discovery

# Simulation mode
initrepo-claude --dry-run
```

## For Claude Code Users

1. **Install the agent** using any method above
2. **Navigate to your project directory** where you want to use the agent
3. **Run with Claude Code**:
   ```bash
   initrepo-claude
   ```

The agent automatically creates `.claude/settings.local.json` with appropriate permissions for Claude Code integration.

## Requirements

- **Node.js 16+**
- **npm** (included with Node.js)
- **InitRepo MCP server** (for full functionality)

## What's Included

- ✅ Main agent orchestrator
- ✅ 4-phase workflow system
- ✅ 39 MCP tools integration
- ✅ CLI interface with help
- ✅ Claude Code integration
- ✅ Comprehensive documentation

## Next Steps

- Read the [full documentation](README.md)
- Check [Claude Code integration guide](CLAUDE.md)
- See [usage examples](CLAUDE_AGENT_USAGE_GUIDE.md)

---

**Need help?** Open an issue at https://github.com/initrepo/claude-agent/issues