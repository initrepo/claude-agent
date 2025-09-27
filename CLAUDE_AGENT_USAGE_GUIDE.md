# Claude Project Builder Agent - Usage Guide

## 🎯 Overview

The Claude Project Builder Agent is a sophisticated AI system that can build InitRepo projects from start to finish by systematically using all 39 MCP tools available in the InitRepo MCP server.

## 🏗️ How It Works

### **Agent Architecture**
```
Claude Agent → MCP Tools → Project Implementation
     ↓              ↓              ↓
4-Phase Process → Smart Analysis → High-Quality Code
```

### **The 4-Phase Approach**

1. **🔍 Discovery Phase** - Project analysis and setup
2. **📋 Planning Phase** - Strategic task planning with dependencies
3. **⚡ Implementation Phase** - Systematic code generation
4. **🛡️ Quality Assurance Phase** - Validation and completion

---

## 🚀 Getting Started

### **1. Prerequisites**
```bash
# Ensure your MCP server is built
npm run build

# Verify server works
npm run start:mcp
```

### **2. Agent Setup**
```bash
# Make the agent executable
chmod +x claude-project-builder.js

# Run full project build
node claude-project-builder.js

# Or use specific options
node claude-project-builder.js --phase planning
node claude-project-builder.js --dry-run
```

### **3. Claude Code Integration**

Add to your Claude Code MCP configuration:
```json
{
  "mcpServers": {
    "initrepo-agent": {
      "command": "node",
      "args": ["claude-project-builder.js"],
      "cwd": "/path/to/initrepo-mcp",
      "env": {
        "AGENT_MODE": "project_builder"
      }
    }
  }
}
```

---

## 🎮 Usage Examples

### **Example 1: Full Project Build**
```
You: "I want to build this InitRepo project from start to finish"

Claude Agent:
1. 🔍 Discovers projects using listProjects()
2. 📊 Analyzes health using getProjectStatus()
3. 🗺️ Plans tasks using identifyNextCriticalTasks()
4. ⚡ Implements each task using generateSmartImplementationBrief()
5. 🛡️ Validates quality using generateProjectHealthReport()
```

### **Example 2: Resuming from Specific Phase**
```
You: "Resume building from the implementation phase"

Claude Agent:
1. 📋 Loads current project state
2. ⚡ Identifies remaining tasks
3. 🔨 Continues implementation from where it left off
4. 🛡️ Completes with quality assurance
```

### **Example 3: Task-Specific Implementation**
```
You: "Implement task T-005 with proper context"

Claude Agent:
1. 📖 Gets context using getContextById('T-005')
2. 📋 Generates brief using generateSmartImplementationBrief('T-005')
3. ✅ Validates understanding using validateContextUnderstanding('T-005')
4. 💻 Implements with proper error handling and tests
```

---

## 🛠️ MCP Tool Usage Strategy

### **Discovery Phase Tools**
- `listProjects()` - Find available projects
- `selectProject(id)` - Set active project
- `getProjectStatus()` - Check system health
- `validateDocumentationCompleteness()` - Quality baseline
- `generateProjectHealthReport()` - Initial metrics

### **Planning Phase Tools**
- `analyzeTaskDependencies()` - Full dependency mapping
- `identifyNextCriticalTasks(limit)` - Priority queue
- `generateTaskSchedule()` - Implementation phases
- `extractTechnicalDecisions()` - Architecture analysis
- `assessTechnicalFeasibility()` - Risk assessment

### **Implementation Phase Tools**
- `getContextById(id)` - Task-specific context
- `generateSmartImplementationBrief(id)` - Comprehensive guidance
- `validateContextUnderstanding(id)` - Readiness check
- `chunkLargeContext(id)` - Complexity management
- `getImplementationContext(id)` - Code specifications

### **Quality Assurance Tools**
- `validateCrossReferences()` - Reference integrity
- `checkDocumentationGaps()` - Completeness check
- `findOrphanedReferences()` - Cleanup validation
- `validateIdConsistency()` - Format compliance
- `generateProjectHealthReport()` - Final assessment

---

## 🎯 Agent Decision Logic

### **Smart Tool Selection**
```javascript
// The agent automatically chooses optimal tools based on context

if (taskComplexity === 'high') {
  tools = ['generateSmartImplementationBrief', 'chunkLargeContext'];
} else if (taskType === 'planning') {
  tools = ['analyzeTaskDependencies', 'generateTaskSchedule'];
} else if (phase === 'quality') {
  tools = ['validateDocumentationCompleteness', 'generateProjectHealthReport'];
}
```

### **Priority-Based Execution**
```
Critical Tasks (Priority 100) → High Impact (Priority 75) → Standard (Priority 50) → Nice-to-Have (Priority 25)
```

### **Success Criteria**
- ✅ Health Score > 90%
- ✅ All critical/high tasks completed
- ✅ No blocking dependencies
- ✅ Documentation consistent
- ✅ Code quality standards met

---

## 📊 Expected Output

### **Phase 1: Discovery**
```
📊 PHASE 1: PROJECT DISCOVERY & SETUP
==================================================
🔍 Discovering projects...
   Found 1 project(s)
⚡ Checking project status...
   Status: healthy
   Active Project: initrepo-mcp
🏥 Generating health report...
   Health Score: 75%
   Completion Rate: 30.0%
```

### **Phase 2: Planning**
```
🗺️ PHASE 2: STRATEGIC TASK PLANNING
==================================================
🔗 Analyzing task dependencies...
   Dependency analysis complete
🎯 Identifying critical tasks...
   Critical Tasks Identified:
   1. T-001 - critical (Foundation setup)
   2. T-002 - high (Core functionality)
   3. T-003 - high (Database integration)
```

### **Phase 3: Implementation**
```
⚡ PHASE 3: ITERATIVE IMPLEMENTATION
==================================================
🔨 Implementing Task 1/3: T-001
   📖 Getting task context...
   📋 Generating implementation brief...
   ✅ Validating context understanding...
   🛠️ Getting implementation context...
   💻 Implementing code...
   ✅ Task T-001 completed successfully
```

### **Phase 4: Quality Assurance**
```
🛡️ PHASE 4: QUALITY ASSURANCE & COMPLETION
==================================================
🔗 Validating cross-references...
📋 Checking documentation gaps...
🔍 Finding orphaned references...
📏 Validating ID consistency...
🏥 Generating final health report...

📊 FINAL PROJECT METRICS:
   Health Score: 95%
   Tasks Completed: 3
   Completion Rate: 100.0%
   Total Time: 12s

🎉 PROJECT COMPLETED SUCCESSFULLY
```

---

## 🔧 Advanced Configuration

### **Custom Agent Behavior**
```json
{
  "agentBehavior": {
    "maxRetries": 3,
    "timeoutPerTask": 300000,
    "qualityThreshold": 90,
    "codeStandards": ["typescript", "clean-architecture", "testing"]
  }
}
```

### **Monitoring & Alerts**
```json
{
  "monitoring": {
    "alerts": {
      "healthScoreBelow": 70,
      "blockedTasksAbove": 3,
      "implementationStalled": 300
    }
  }
}
```

---

## 🎓 Key Benefits

### **For Developers**
- 🚀 **Automated Project Building** - From task list to finished code
- 🧠 **Intelligent Task Planning** - Respects dependencies and priorities
- 📊 **Quality Assurance** - Built-in validation and health monitoring
- 🔄 **Iterative Approach** - Can pause/resume at any phase

### **For Teams**
- 📋 **Consistent Implementation** - Follows established patterns
- 🎯 **Priority-Driven Development** - Works on most critical tasks first
- 📈 **Progress Tracking** - Real-time health and completion metrics
- 🛡️ **Quality Standards** - Ensures documentation and code quality

### **For Project Management**
- 📊 **Visibility** - Clear progress reporting and metrics
- 🔍 **Issue Detection** - Early identification of problems
- ⚡ **Efficiency** - Systematic approach reduces development time
- 🎯 **Predictability** - Clear phases and success criteria

---

## 🚀 Quick Start Checklist

- [ ] **Setup**: `npm run build && npm run start:mcp`
- [ ] **Test**: `node claude-project-builder.js --help`
- [ ] **Run**: `node claude-project-builder.js`
- [ ] **Monitor**: Watch the 4-phase execution
- [ ] **Validate**: Check final health score > 90%

The Claude Project Builder Agent represents the next evolution in AI-assisted development, combining the power of 39 specialized MCP tools with sophisticated decision-making logic to deliver complete, high-quality projects systematically and efficiently.