import { AttackVector as WarRoomAttackVector } from '../../types';
import { AgentNode, NetworkEdge, DefenseModule, AttackVector, SimulationResult, AuditLogEntry, SecurityVerdict, NodeType, ActionRiskLevel } from './types';
import { SecurityEngine } from './SecurityEngine';

export interface SecurityRuntimeState {
  nodes: AgentNode[];
  edges: NetworkEdge[];
  defenses: DefenseModule[];
}

export interface WarRoomSimulation {
  result: SimulationResult;
  updatedNodes: AgentNode[];
  updatedEdges: NetworkEdge[];
  updatedDefenses: DefenseModule[];
  auditLogs: AuditLogEntry[];
  attack: AttackVector;
}

const categoryMap: Record<WarRoomAttackVector['category'], AttackVector['category']> = {
  RECON: 'context_weaving',
  SQLI: 'privilege_escalation',
  RCE: 'privilege_escalation',
  XSS: 'context_weaving',
  ZERO_DAY: 'multi_attempt_hijack',
  DOS: 'cognitive_load',
  CUSTOM: 'context_weaving',
};

const riskMap: Record<WarRoomAttackVector['riskLevel'], ActionRiskLevel> = {
  LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', CRITICAL: 'CRITICAL',
};

function targetFor(category: AttackVector['category']): NodeType {
  if (category === 'privilege_escalation') return 'tool';
  if (category === 'context_weaving') return 'memory';
  if (category === 'cognitive_load') return 'agent';
  return 'agent';
}

export function toSecurityAttack(vector: WarRoomAttackVector, payload: string): AttackVector {
  const category = categoryMap[vector.category];
  return {
    id: String(vector.id),
    name: vector.name,
    category,
    description: vector.description,
    severity: riskMap[vector.riskLevel],
    payload,
    targetNodeType: targetFor(category),
    maxAttempts: category === 'multi_attempt_hijack' ? 5 : 1,
    propagationStrategy: {
      spreadsToTools: category === 'privilege_escalation',
      spreadsToMemory: category === 'context_weaving',
      spreadsToRAG: false,
      spreadsToNetwork: category === 'privilege_escalation',
      adaptiveMutation: category === 'multi_attempt_hijack',
    },
  };
}

function verdictStatus(verdict: SecurityVerdict): 'PROBING'|'TRAPPED'|'JAMMED'|'LOOPED'|'ISOLATED' {
  if (verdict === 'DENY') return 'ISOLATED';
  if (verdict === 'QUARANTINE') return 'LOOPED';
  if (verdict === 'CONFIRM') return 'JAMMED';
  return 'PROBING';
}

export function runWarRoomSimulation(
  vector: WarRoomAttackVector,
  payload: string,
  attackerIp: string,
  runtime: SecurityRuntimeState
): WarRoomSimulation {
  const attack = toSecurityAttack(vector, payload);
  const simulation = SecurityEngine.runSimulation(attack, runtime.nodes, runtime.edges, runtime.defenses);
  return { ...simulation, attack };
}

export function simulationToForensic(
  simulation: WarRoomSimulation,
  attackerIp: string,
  blockId: number,
  previousHash: string,
  timestamp: string
) {
  const lastStep = simulation.result.steps[simulation.result.steps.length - 1];
  const verdict = lastStep?.verdict ?? 'DENY';
  const counterMeasure = simulation.auditLogs[simulation.auditLogs.length - 1]?.message ?? 'SecurityEngine decision';
  return {
    id: blockId,
    timestamp,
    attackerIp,
    threatType: simulation.result.attackName,
    threatLevel: vectorRisk(simulation.attack.severity),
    entropy: 0,
    payload: lastStep?.payload ?? '',
    counterMeasure,
    counterMeasureCode: verdictStatus(verdict),
    previousHash,
    currentHash: '',
  };
}

function vectorRisk(risk: ActionRiskLevel): 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW' {
  return risk;
}

export function simulationToRadarBlip(simulation: WarRoomSimulation, attackerIp: string, x: number, y: number) {
  const lastStep = simulation.result.steps[simulation.result.steps.length - 1];
  return {
    id: `engine-${simulation.result.id}`,
    x, y, ip: attackerIp,
    threat: simulation.result.attackName,
    status: verdictStatus(lastStep?.verdict ?? 'DENY'),
    timestamp: Date.now(),
    entropy: simulation.result.metrics.poisoningScore * 8,
  };
}
