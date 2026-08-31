import type { AttackVector as WarRoomAttackVector } from '../types';
import {
  AgentNode,
  NetworkEdge,
  DefenseModule,
  AttackVector as SecurityAttackVector,
  SimulationResult,
  AuditLogEntry,
} from './types';
import { SecurityEngine } from './SecurityEngine';
import { PRESET_ATTACKS } from './defaults';
import { calculateShannonEntropy } from '../utils/crypto';

export interface WarRoomSecurityRun {
  attack: SecurityAttackVector;
  result: SimulationResult;
  nodes: AgentNode[];
  edges: NetworkEdge[];
  defenses: DefenseModule[];
  auditLogs: AuditLogEntry[];
  evaluation: {
    threat: string;
    countermeasure: string;
    entropy: number;
    payloadStr: string;
    riskLevel: WarRoomAttackVector['riskLevel'];
    status: 'PROBING' | 'TRAPPED' | 'JAMMED' | 'LOOPED' | 'ISOLATED';
  };
}

function payloadString(rawPayload: string | Record<string, unknown>): string {
  return typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload);
}

function classifyPayload(payload: string): SecurityAttackVector['category'] {
  const p = payload.toLowerCase();

  if (p.includes('worm_sig') || p.includes('propagate') || p.includes('copy yourself') || p.includes('repeat this')) {
    return 'worm_propagation';
  }
  if (p.includes('mysqldump') || p.includes('privilege') || p.includes('shell') || p.includes('nc -e') || p.includes('/bin/sh')) {
    return 'privilege_escalation';
  }
  if (p.includes('tool') && (p.includes('schema') || p.includes('permission'))) {
    return 'tool_poisoning';
  }
  if (p.includes('rag') || p.includes('citation') || p.includes('vector') || p.includes('cosine')) {
    return 'rag_corruption';
  }
  if (p.includes('grader') || p.includes('score=') || p.includes('test_passed')) {
    return 'evaluation_cheating';
  }
  if (p.includes('remember') || p.includes('turn 1') || p.includes('turn 2')) {
    return 'context_weaving';
  }
  if (p.includes('iteration') || p.includes('attempt') || p.includes('adaptive')) {
    return 'multi_attempt_hijack';
  }
  return 'context_weaving';
}

function buildAttack(rawPayload: string | Record<string, unknown>): SecurityAttackVector {
  const payload = payloadString(rawPayload);
  const category = classifyPayload(payload);
  const preset = PRESET_ATTACKS.find((attack) => attack.category === category) ?? PRESET_ATTACKS[0];

  return {
    ...preset,
    id: `warroom_${category}_${Date.now()}`,
    name: `WarRoom: ${preset.name}`,
    payload,
  };
}

function statusFor(category: SecurityAttackVector['category'], verdict: SimulationResult['finalVerdict']): WarRoomSecurityRun['evaluation']['status'] {
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
): WarRoomSecurityRun {
  const attack = buildAttack(rawPayload);
  const payload = payloadString(rawPayload);
  const { result, updatedNodes, updatedEdges, updatedDefenses, auditLogs } =
    SecurityEngine.runSimulation(attack, nodes, edges, defenses);

  const entropy = calculateShannonEntropy(payload);
  const riskLevel = attack.severity;
  const status = statusFor(attack.category, result.finalVerdict);

  return {
    attack,
    result,
    nodes: updatedNodes,
    edges: updatedEdges,
    defenses: updatedDefenses,
    auditLogs,
    evaluation: {
      threat: attack.name,
      countermeasure:
        result.finalVerdict === 'BREACHED'
          ? 'BREACH DETECTED — review containment and topology state'
          : result.steps[result.steps.length - 1]?.reason ?? 'SecurityEngine evaluation completed.',
      entropy,
      payloadStr: payload,
      riskLevel,
      status,
    },
  };
}
