import assert from 'node:assert/strict';
import { runWarRoomSecuritySimulation } from './WarRoomAdapter';
import { INITIAL_NODES, INITIAL_EDGES, INITIAL_DEFENSES } from './defaults';

const nodes = structuredClone(INITIAL_NODES);
const edges = structuredClone(INITIAL_EDGES);
const defenses = structuredClone(INITIAL_DEFENSES);
const before = JSON.stringify({ nodes, edges, defenses });

const simulation = runWarRoomSecuritySimulation(
  JSON.stringify(INITIAL_NODES[0]?.name ?? 'security test payload'),
  nodes,
  edges,
  defenses,
);

assert.ok(simulation.result);
assert.equal(typeof simulation.result.id, 'string');
assert.equal(typeof simulation.result.finalVerdict, 'string');
assert.equal(typeof simulation.result.attackName, 'string');
assert.ok(Array.isArray(simulation.result.steps));
assert.ok(Array.isArray(simulation.result.nodesInfected));
assert.ok(Array.isArray(simulation.result.nodesProtected));
assert.equal(typeof simulation.result.metrics.attackSuccessRate, 'number');
assert.equal(typeof simulation.result.metrics.driftScore, 'number');
assert.equal(typeof simulation.result.metrics.poisoningScore, 'number');
assert.equal(typeof simulation.result.metrics.provenanceRiskIndex, 'number');
assert.equal(typeof simulation.result.metrics.defenseLatencyMs, 'number');
assert.ok(Array.isArray(simulation.topology.nodes));
assert.ok(Array.isArray(simulation.topology.edges));
assert.ok(Array.isArray(simulation.defenses));
assert.ok(Array.isArray(simulation.timelineView));
assert.ok(Array.isArray(simulation.auditView));
assert.ok(simulation.auditView.every((entry) => typeof entry.id === 'string' && typeof entry.timestamp === 'string' && typeof entry.level === 'string' && typeof entry.message === 'string'));
assert.ok(Array.isArray(simulation.defenseView));
assert.equal(simulation.timelineView.length, simulation.result.steps.length);
assert.equal(simulation.defenses.length, simulation.defenseView.length);
assert.equal(simulation.verdictView.verdict, simulation.result.finalVerdict);
assert.equal(simulation.verdictView.attackName, simulation.result.attackName);
assert.equal(simulation.timelineView, simulation.result.steps);
assert.equal(typeof simulation.verdictView.reason, 'string');
assert.equal(typeof simulation.legacyEvaluation.entropy, 'number');
assert.equal('entropy' in simulation.result, false);
assert.equal(simulation.topology.nodes.length, nodes.length);
assert.equal(simulation.topology.edges.length, edges.length);
assert.equal(simulation.defenseView, simulation.defenses);
assert.ok(simulation.defenses.every((defense) => typeof defense.id === 'string' && typeof defense.type === 'string'));
assert.equal(simulation.verdictView.metrics, simulation.result.metrics);

const selectedVectorSimulation = runWarRoomSecuritySimulation(
  'selected vector verification payload',
  structuredClone(INITIAL_NODES),
  structuredClone(INITIAL_EDGES),
  structuredClone(INITIAL_DEFENSES),
  'rag_corruption',
);
assert.equal(selectedVectorSimulation.attack.category, 'rag_corruption');
assert.equal(selectedVectorSimulation.attack.payload, 'selected vector verification payload');
assert.equal(simulation.auditView.length, simulation.auditView.filter((entry) => entry.message.length > 0).length);

const after = JSON.stringify({ nodes, edges, defenses });
assert.equal(after, before, 'caller-owned state was mutated');

console.log('WarRoom integration verification: PASS');
console.log(`verdict=${simulation.result.finalVerdict} steps=${simulation.result.steps.length} audit=${simulation.auditView.length}`);
