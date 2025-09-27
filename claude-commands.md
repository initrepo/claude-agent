# Custom Claude Code Commands for InitRepo Agent

## Method 1: Direct Command Integration

Since Claude Code may not have a formal extension system yet, we can create custom commands using existing mechanisms:

### Create Custom Commands Directory

```bash
# Create commands directory in your project
mkdir -p .claude/commands

# Or in your home directory for global commands
mkdir -p ~/.claude/commands
```

### Command Files

Create individual command files that Claude Code can recognize:

#### .claude/commands/initrepo-agent.md
```markdown
---
name: initrepo-agent
description: Run autonomous InitRepo project building
---

🤖 Starting InitRepo Autonomous Agent...

This will run the full 4-phase autonomous building process.

```bash
node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js
```
```

#### .claude/commands/initrepo-status.md
```markdown
---
name: initrepo-status
description: Check InitRepo project status and progress
---

📊 Checking InitRepo Project Status...

```bash
node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js
```
```

#### .claude/commands/initrepo-verify.md
```markdown
---
name: initrepo-verify
description: Verify InitRepo task completion and quality
---

✅ Verifying InitRepo Task Completion...

```bash
node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js $1
```
```

#### .claude/commands/initrepo-check.md
```markdown
---
name: initrepo-check
description: Validate InitRepo setup and environment
---

🔍 Checking InitRepo Setup...

```bash
npx initrepo-claude --check
```
```

## Method 2: Shell Script Integration

Create executable scripts that can be called from Claude Code:

```bash
# Create scripts directory
mkdir -p scripts/claude-commands

# Make scripts executable
chmod +x scripts/claude-commands/*.sh
```

### scripts/claude-commands/initrepo-agent.sh
```bash
#!/bin/bash
echo "🤖 InitRepo Autonomous Agent Starting..."
echo "======================================"
node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js
```

### scripts/claude-commands/initrepo-status.sh
```bash
#!/bin/bash
echo "📊 InitRepo Status Check"
echo "======================="
node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js
```

## Method 3: NPM Script Integration

Add to package.json:

```json
{
  "scripts": {
    "claude:agent": "node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js",
    "claude:status": "node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js",
    "claude:verify": "node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js",
    "claude:check": "npx initrepo-claude --check"
  }
}
```

Then in Claude Code:
```bash
npm run claude:agent
npm run claude:status
npm run claude:verify
```

## Method 4: Alias Integration

Create command aliases in your shell:

### .bashrc or .zshrc
```bash
# InitRepo Claude Agent Aliases
alias iragent="node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js"
alias irstatus="node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js"
alias irverify="node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js"
alias ircheck="npx initrepo-claude --check"
```

Then in Claude Code:
```bash
iragent    # Start autonomous building
irstatus   # Check status
irverify   # Verify completion
ircheck    # Validate setup
```

## Recommended Approach

**Use Method 1 (Custom Commands Directory)** as it's most likely to work with Claude Code's existing command system, combined with **Method 3 (NPM Scripts)** for reliability.

### Setup Instructions

1. **Install the agent:**
   ```bash
   npm install -g initrepo-claude-agent@latest
   ```

2. **Create command files:**
   ```bash
   mkdir -p .claude/commands
   # Copy command files from above
   ```

3. **Add npm scripts:**
   ```json
   {
     "scripts": {
       "claude:agent": "node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js",
       "claude:status": "node node_modules/initrepo-claude-agent/claude-code-extension/commands/status.js",
       "claude:verify": "node node_modules/initrepo-claude-agent/claude-code-extension/commands/verify.js"
     }
   }
   ```

4. **Use in Claude Code:**
   ```bash
   # Try custom commands first:
   /initrepo-agent

   # Fallback to npm scripts:
   npm run claude:agent

   # Or direct execution:
   node node_modules/initrepo-claude-agent/claude-code-extension/commands/autonomous-build.js
   ```

This approach provides multiple ways to access the autonomous agent functionality within Claude Code!