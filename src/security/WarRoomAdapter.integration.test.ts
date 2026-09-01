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
assert.ok(Array.isArray(simulation.result.steps));
assert.ok(Array.isArray(simulation.topology.nodes));
assert.ok(Array.isArray(simulation.topology.edges));
assert.ok(Array.isArray(simulation.defenses));
assert.ok(Array.isArray(simulation.timelineView));
assert.ok(Array.isArray(simulation.auditView));
assert.ok(Array.isArray(simulation.defenseView));
assert.equal(simulation.timelineView.length, simulation.result.steps.length);
assert.equal(simulation.defenses.length, simulation.defenseView.length);
assert.equal(typeof simulation.verdictView.reason, 'string');
assert.equal(typeof simulation.legacyEvaluation.entropy, 'number');
assert.equal('entropy' in simulation.result, false);

const after = JSON.stringify({ nodes, edges, defenses });
assert.equal(after, before, 'caller-owned state was mutated');

console.log('WarRoom integration verification: PASS');
console.log(`verdict=${simulation.result.finalVerdict} steps=${simulation.result.steps.length} audit=${simulation.auditView.length}`);
