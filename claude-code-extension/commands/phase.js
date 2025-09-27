#!/usr/bin/env node

/**
 * /initrepo-phase slash command handler
 *
 * Runs a specific phase of the InitRepo building process.
 */

import ClaudeCodeExtension from '../index.js';

const VALID_PHASES = ['discovery', 'planning', 'implementation', 'quality'];

const PHASE_DESCRIPTIONS = {
  discovery: 'Project discovery and health assessment',
  planning: 'Strategic task planning and dependency analysis',
  implementation: 'Iterative feature development and implementation',
  quality: 'Quality assurance and completion validation'
};

export default async function handleInitRepoPhase(context, phase) {
  const extension = new ClaudeCodeExtension();

  // Validate phase argument
  if (!phase || !VALID_PHASES.includes(phase)) {
    return {
      success: false,
      message: `❌ Invalid phase: ${phase}. Valid phases are: ${VALID_PHASES.join(', ')}`,
      data: {
        command: 'initrepo-phase',
        validPhases: VALID_PHASES,
        phaseDescriptions: PHASE_DESCRIPTIONS,
        timestamp: new Date().toISOString()
      }
    };
  }

  try {
    console.log('🎯 InitRepo Phase Command');
    console.log('=========================');
    console.log(`📁 Working Directory: ${process.cwd()}`);
    console.log(`🔄 Running Phase: ${phase} - ${PHASE_DESCRIPTIONS[phase]}\n`);

    await extension.handlePhaseCommand(phase);

    return {
      success: true,
      message: `✅ InitRepo phase "${phase}" completed successfully! ${PHASE_DESCRIPTIONS[phase]} has been executed.`,
      data: {
        command: 'initrepo-phase',
        phase: phase,
        description: PHASE_DESCRIPTIONS[phase],
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ InitRepo phase "${phase}" failed: ${error.message}`,
      error: error.message,
      data: {
        command: 'initrepo-phase',
        phase: phase,
        description: PHASE_DESCRIPTIONS[phase],
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    };
  }
}

// CLI fallback for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const phase = process.argv[2];
  handleInitRepoPhase(null, phase).then(result => {
    console.log(result.message);
    if (!result.success && result.data.validPhases) {
      console.log('\n💡 Valid phases:');
      result.data.validPhases.forEach(p => {
        console.log(`   • ${p} - ${result.data.phaseDescriptions[p]}`);
      });
    }
    process.exit(result.success ? 0 : 1);
  });
}