# InitRepo Claude Agent - Claude Code Extension

**Slash commands for systematic project building using AI-powered InitRepo methodology.**

## 🚀 Available Slash Commands

### `/initrepo-build`
**Run the full InitRepo systematic project build workflow**

Executes the complete 4-phase workflow:
1. **Discovery** - Project analysis and health assessment
2. **Planning** - Strategic task planning and dependency analysis
3. **Implementation** - Iterative feature development
4. **Quality Assurance** - Validation and completion

```
/initrepo-build
```

### `/initrepo-check`
**Validate project setup and agent environment**

Checks:
- ✅ InitRepo Claude Agent installation
- ✅ MCP server connectivity
- ✅ Project documentation structure
- ✅ Claude Code integration

```
/initrepo-check
```

### `/initrepo-phase <phase>`
**Run specific phase of the building process**

Execute individual workflow phases:

```
/initrepo-phase discovery      # Project discovery and setup
/initrepo-phase planning       # Task planning and scheduling
/initrepo-phase implementation # Feature implementation
/initrepo-phase quality        # Quality assurance and validation
```

## 📋 Prerequisites

1. **InitRepo Claude Agent** must be installed:
   ```bash
   npm install -g initrepo-claude-agent
   ```

2. **InitRepo MCP Server** must be available and running

3. **Project Documentation**: Your project should have:
   - `docs/` folder with InitRepo documentation
   - Proper project structure

## 🔧 Installation

### Option 1: Install as Claude Code Extension
```bash
# Install the extension package
npm install -g initrepo-claude-agent-extension

# Link to Claude Code extensions directory
claude-code extension install initrepo-claude-agent-extension
```

### Option 2: Manual Installation
```bash
# Clone/copy extension files to Claude Code extensions directory
cp -r claude-code-extension ~/.claude-code/extensions/initrepo-agent
```

### Option 3: Development Setup
```bash
# Clone the repository
git clone https://github.com/initrepo/claude-agent.git
cd claude-agent/claude-code-extension

# Install dependencies
npm install

# Link for development
claude-code extension link .
```

## ⚙️ Configuration

The extension can be configured through Claude Code settings:

```json
{
  "extensions": {
    "initrepo-claude-agent": {
      "agentPath": "npx initrepo-claude-agent",
      "autoSetupClaudeCode": true,
      "showDetailedOutput": true
    }
  }
}
```

## 🎯 Usage Examples

### Quick Project Build
```
/initrepo-build
```
Runs the complete systematic build process.

### Environment Validation
```
/initrepo-check
```
Validates your setup before building.

### Phase-by-Phase Development
```
/initrepo-phase discovery
/initrepo-phase planning
/initrepo-phase implementation
/initrepo-phase quality
```

## 🔍 Troubleshooting

### "Agent not found"
- Ensure InitRepo Claude Agent is installed globally
- Check agent path in extension settings

### "MCP server not available"
- Verify InitRepo MCP server is installed and running
- Check MCP server path configuration

### "Project structure invalid"
- Ensure your project has `docs/` folder
- Run `initrepo init` to set up proper structure

### "Permission denied"
- Run `/initrepo-check` to validate Claude Code integration
- Manually run `initrepo-claude --setup-claude-code`

## 📚 Documentation

- [InitRepo Claude Agent Documentation](../README.md)
- [Claude Code Extensions Guide](https://docs.claude.com/claude-code/extensions)
- [InitRepo Methodology](../CLAUDE_AGENT_USAGE_GUIDE.md)

## 🤝 Support

- **Issues**: https://github.com/initrepo/claude-agent/issues
- **Documentation**: https://github.com/initrepo/claude-agent
- **License**: Proprietary

---

**Ready to build projects systematically with AI assistance? Start with `/initrepo-check` then `/initrepo-build`!** 🎉