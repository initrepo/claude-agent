#!/bin/bash

# InitRepo Claude Code Agent Setup Script
# Run these commands one by one to create proper Claude Code agents and slash commands

echo "🤖 Setting up InitRepo Claude Code Agents and Commands"
echo "===================================================="
echo ""

echo "📋 Step 1: Create InitRepo Autonomous Agent"
echo "Command: claude agents create new initrepo-agent --generate-with-claude "You are an autonomous InitRepo project building agent. Analyze InitRepo documentation, identify tasks (T-001, F-001, US-001 patterns), create implementation plans, and build features autonomously with minimal human intervention. Work through 4 phases: Discovery → Planning → Implementation → Quality Assurance. Use the InitRepo MCP server for document intelligence.""
echo ""
echo "Press Enter to run this command..."
read
claude agents create new initrepo-agent --generate-with-claude "You are an autonomous InitRepo project building agent. Analyze InitRepo documentation, identify tasks (T-001, F-001, US-001 patterns), create implementation plans, and build features autonomously with minimal human intervention. Work through 4 phases: Discovery → Planning → Implementation → Quality Assurance. Use the InitRepo MCP server for document intelligence."
echo ""
echo "✅ Step 1 completed"
echo ""

echo "📋 Step 2: Create InitRepo Status Agent"
echo "Command: claude agents create new initrepo-status --generate-with-claude "You are a project status monitoring agent for InitRepo projects. Analyze project health, track task progress, generate status reports, and identify issues. Provide clear, actionable insights about project state and next steps.""
echo ""
echo "Press Enter to run this command..."
read
claude agents create new initrepo-status --generate-with-claude "You are a project status monitoring agent for InitRepo projects. Analyze project health, track task progress, generate status reports, and identify issues. Provide clear, actionable insights about project state and next steps."
echo ""
echo "✅ Step 2 completed"
echo ""

echo "📋 Step 3: Create InitRepo Verification Agent"
echo "Command: claude agents create new initrepo-verify --generate-with-claude "You are a quality assurance agent for InitRepo projects. Verify task completion, validate code quality, check documentation compliance, and provide go/no-go deployment recommendations. Be thorough but efficient.""
echo ""
echo "Press Enter to run this command..."
read
claude agents create new initrepo-verify --generate-with-claude "You are a quality assurance agent for InitRepo projects. Verify task completion, validate code quality, check documentation compliance, and provide go/no-go deployment recommendations. Be thorough but efficient."
echo ""
echo "✅ Step 3 completed"
echo ""

echo "📋 Step 4: Create /initrepo-agent Command"
echo "Command: claude commands create new initrepo-agent --generate-with-claude "Create a command that delegates autonomous project building to the initrepo-agent. The command should start the 4-phase workflow: discovery, planning, implementation, and quality assurance.""
echo ""
echo "Press Enter to run this command..."
read
claude commands create new initrepo-agent --generate-with-claude "Create a command that delegates autonomous project building to the initrepo-agent. The command should start the 4-phase workflow: discovery, planning, implementation, and quality assurance."
echo ""
echo "✅ Step 4 completed"
echo ""

echo "📋 Step 5: Create /initrepo-status Command"
echo "Command: claude commands create new initrepo-status --generate-with-claude "Create a command that delegates project status checking to the initrepo-status agent. The command should provide health scores, task progress, and next steps.""
echo ""
echo "Press Enter to run this command..."
read
claude commands create new initrepo-status --generate-with-claude "Create a command that delegates project status checking to the initrepo-status agent. The command should provide health scores, task progress, and next steps."
echo ""
echo "✅ Step 5 completed"
echo ""

echo "📋 Step 6: Create /initrepo-verify Command"
echo "Command: claude commands create new initrepo-verify --generate-with-claude "Create a command that delegates quality verification to the initrepo-verify agent. The command should accept optional task IDs and verify completion and quality.""
echo ""
echo "Press Enter to run this command..."
read
claude commands create new initrepo-verify --generate-with-claude "Create a command that delegates quality verification to the initrepo-verify agent. The command should accept optional task IDs and verify completion and quality."
echo ""
echo "✅ Step 6 completed"
echo ""

echo "🎉 All agents and commands created!"
echo ""
echo "📋 Test your new slash commands:"
echo "   /initrepo-agent     - Start autonomous building"
echo "   /initrepo-status    - Check project status"
echo "   /initrepo-verify    - Verify task completion"
echo ""
echo "🤖 Use agents directly:"
echo '   /agent initrepo-agent "Build the email system"'
echo '   /agent initrepo-status "Check project health"'
echo '   /agent initrepo-verify "Validate all tasks"'
