#!/bin/bash

# InitRepo Claude Agent - Quick Installation Script
# Usage: curl -fsSL https://raw.githubusercontent.com/initrepo/claude-agent/master/install.sh | bash

set -e

echo "🤖 InitRepo Claude Agent - Quick Installer"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Warning: Node.js 16+ is recommended. Current version: $(node -v)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    echo "Please install npm or use a Node.js distribution that includes npm."
    exit 1
fi

echo "✅ Node.js $(node -v) and npm $(npm -v) found"

# Installation method selection
echo ""
echo "Choose installation method:"
echo "1) Install globally via npm (recommended)"
echo "2) Clone repository for development"
echo "3) Download and run locally"

read -p "Enter choice [1]: " choice
choice=${choice:-1}

case $choice in
    1)
        echo "📦 Installing globally via npm..."
        npm install -g initrepo-claude-agent
        echo "✅ Global installation complete!"
        echo "   Run with: initrepo-claude"
        ;;
    2)
        echo "📂 Cloning repository..."
        if command -v git &> /dev/null; then
            git clone https://github.com/initrepo/claude-agent.git
            cd claude-agent
            npm install
            echo "✅ Repository cloned and dependencies installed!"
            echo "   Run with: node claude-project-builder.js"
            echo "   Or: npm start"
        else
            echo "❌ Git is required for this option but not installed."
            exit 1
        fi
        ;;
    3)
        echo "📥 Downloading for local use..."
        curl -fsSL https://raw.githubusercontent.com/initrepo/claude-agent/master/claude-project-builder.js -o claude-project-builder.js
        curl -fsSL https://raw.githubusercontent.com/initrepo/claude-agent/master/claude-agent-config.json -o claude-agent-config.json
        chmod +x claude-project-builder.js
        echo "✅ Files downloaded!"
        echo "   Run with: ./claude-project-builder.js"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Installation completed!"
echo ""
echo "📋 Next Steps:"
echo "   • Read the documentation: https://github.com/initrepo/claude-agent"
echo "   • Set up MCP server integration (see CLAUDE_AGENT_USAGE_GUIDE.md)"
echo "   • Run the agent to start building projects!"
echo ""
echo "⚠️  Note: This agent requires an InitRepo MCP server to function fully."
echo "   Current version includes demonstration capabilities."