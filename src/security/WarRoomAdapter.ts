import type { AttackVector as LegacyAttackVector, ConsoleLogMessage } from '../types';
import type {
  AgentNode,
  NetworkEdge,
  DefenseModule,
  AttackVector,
  SimulationResult,
  SimulationStep,
  AuditLogEntry,
} from './types';
import { SecurityEngine } from './SecurityEngine';
import { PRESET_ATTACKS } from './defaults';
import { calculateShannonEntropy } from '../utils/crypto';

export interface WarRoomAdapterOutput {
  result: SimulationResult;
  attack: AttackVector;
  topology: {
    nodes: AgentNode[];
    edges: NetworkEdge[];
  };
  defenses: DefenseModule[];
  verdictView: {
    verdict: SimulationResult['finalVerdict'];
    attackName: string;
    reason: string;
    metrics: SimulationResult['metrics'];
  };
  timelineView: SimulationStep[];
  auditView: ConsoleLogMessage[];
  defenseView: DefenseModule[];
  /** Compatibility data for the existing WarRoom forensic presentation. */
  legacyEvaluation: {
    threat: string;
    countermeasure: string;
    entropy: number;
    payloadStr: string;
    riskLevel: LegacyAttackVector['riskLevel'];
    status: 'PROBING' | 'TRAPPED' | 'JAMMED' | 'LOOPED' | 'ISOLATED';
  };
}

function mapAuditLevel(type: AuditLogEntry['type']): ConsoleLogMessage['level'] {
  switch (type) {
    case 'ATTACK': return 'DANGER';
    case 'DEFENSE': return 'COUNTERMEASURE';
    case 'QUARANTINE': return 'WARN';
    case 'HASH_VERIFY': return 'WORM';
    case 'DRIFT': return 'WARN';
  }
}

function mapAuditView(entries: AuditLogEntry[]): ConsoleLogMessage[] {
  return entries.map((entry) => ({
    id: entry.id,
    timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    level: mapAuditLevel(entry.type),
    message: entry.message,
    details: [entry.source, entry.target].filter(Boolean).join(' → ') || undefined,
  }));
}

function payloadString(rawPayload: string | Record<string, unknown>): string {
  return typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload);
}

function classifyPayload(payload: string): AttackVector['category'] {
  const p = payload.toLowerCase();
  if (p.includes('worm_sig') || p.includes('propagate') || p.includes('copy yourself') || p.includes('repeat this')) return 'worm_propagation';
  if (p.includes('mysqldump') || p.includes('privilege') || p.includes('shell') || p.includes('nc -e') || p.includes('/bin/sh')) return 'privilege_escalation';
  if (p.includes('tool') && (p.includes('schema') || p.includes('permission'))) return 'tool_poisoning';
  if (p.includes('rag') || p.includes('citation') || p.includes('vector') || p.includes('cosine')) return 'rag_corruption';
  if (p.includes('grader') || p.includes('score=') || p.includes('test_passed')) return 'evaluation_cheating';
  if (p.includes('remember') || p.includes('turn 1') || p.includes('turn 2')) return 'context_weaving';
  if (p.includes('iteration') || p.includes('attempt') || p.includes('adaptive')) return 'multi_attempt_hijack';
  return 'context_weaving';
}

function buildAttack(rawPayload: string | Record<string, unknown>, categoryOverride?: AttackVector['category']): AttackVector {
  const payload = payloadString(rawPayload);
  const requestedCategory = categoryOverride ?? classifyPayload(payload);
  const preset = PRESET_ATTACKS.find((candidate) => candidate.category === requestedCategory) ?? PRESET_ATTACKS[0];

  return {
    ...preset,
    id: 'warroom_' + preset.category + '_' + Date.now(),
    name: 'WarRoom: ' + preset.name,
    payload,
  };
}

function statusFor(
  category: AttackVector['category'],
  verdict: SimulationResult['finalVerdict'],
): WarRoomAdapterOutput['legacyEvaluation']['status'] {
  if (verdict === 'BREACHED') return 'PROBING';
  if (category === 'worm_propagation' || category === 'context_weaving') return 'LOOPED';
  if (category === 'privilege_escalation' || category === 'tool_poisoning') return 'ISOLATED';
  if (category === 'rag_corruption' || category === 'evaluation_cheating') return 'JAMMED';
  return verdict === 'CONTAINED' ? 'TRAPPED' : 'JAMMED';
}

export function runWarRoomSecuritySimulation(
  rawPayload: string | Record<string, unknown>,
  nodes: AgentNode[],
  edges: NetworkEdge[],
  defenses: DefenseModule[],
  categoryOverride?: AttackVector['category'],
): WarRoomAdapterOutput {
  const attack = buildAttack(rawPayload, categoryOverride);
  const { result, updatedNodes, updatedEdges, updatedDefenses, auditLogs } =
    SecurityEngine.runSimulation(attack, nodes, edges, defenses);

  const lastStep = result.steps[result.steps.length - 1];
  const reason = lastStep?.reason ?? 'SecurityEngine evaluation completed.';
  const payload = payloadString(rawPayload);
  const legacyEntropy = calculateShannonEntropy(payload);

  return {
    attack,
    result,
    topology: { nodes: updatedNodes, edges: updatedEdges },
    defenses: updatedDefenses,
    verdictView: {
      verdict: result.finalVerdict,
      attackName: result.attackName,
      reason,
      metrics: result.metrics,
    },
    timelineView: result.steps,
    auditView: mapAuditView(auditLogs),
    defenseView: updatedDefenses,
    legacyEvaluation: {
      threat: attack.name,
      countermeasure: reason,
      entropy: legacyEntropy,
      payloadStr: payload,
      riskLevel: attack.severity,
      status: statusFor(attack.category, result.finalVerdict),
    },
  };
}
