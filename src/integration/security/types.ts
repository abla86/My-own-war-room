export type NodeType = 'agent' | 'tool' | 'memory' | 'rag' | 'network' | 'user' | 'database';
export type NodeStatus = 'clean' | 'infected' | 'quarantined' | 'defended' | 'scanning';
export type ProvenanceSource = 'USER' | 'SYSTEM' | 'WEB_UNTRUSTED' | 'TOOL_OUTPUT' | 'DERIVED' | 'MEMORY';
export type ActionRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecurityVerdict = 'ALLOW' | 'DENY' | 'CONFIRM' | 'QUARANTINE';
export interface AgentNode {
 id:string; name:string; type:NodeType; status:NodeStatus; provenance:ProvenanceSource; riskScore:number; permissions:string[]; description:string; x:number; y:number; memoryData?:Record<string,string>;
 toolSchema?:{parameters:string[];allowedCallers:string[];hasSideEffects:boolean;hash:string}; infectedByWormId?:string;
 infectionHistory:Array<{timestamp:number;source:string;payload:string;verdict:SecurityVerdict}>;
}
export interface NetworkEdge {id:string;source:string;target:string;protocol:string;isInfected:boolean;isBlocked:boolean;label?:string;}
export type AttackCategory='worm_propagation'|'multi_attempt_hijack'|'context_weaving'|'tool_poisoning'|'privilege_escalation'|'memory_poisoning'|'rag_corruption'|'evaluation_cheating'|'cognitive_load';
export interface AttackVector {id:string;name:string;category:AttackCategory;description:string;severity:ActionRiskLevel;nistReference?:string;owaspReference?:string;payload:string;targetNodeType:NodeType;maxAttempts:number;propagationStrategy:{spreadsToTools:boolean;spreadsToMemory:boolean;spreadsToRAG:boolean;spreadsToNetwork:boolean;adaptiveMutation:boolean};}
export type DefenseType='provenance_firewall'|'tool_drift_detector'|'worm_pattern_scanner'|'eval_integrity_guard'|'rag_evidence_verifier'|'request_hash_firewall'|'sandbox_isolation'|'intent_flow_validator';
export interface DefenseModule {id:string;name:string;type:DefenseType;enabled:boolean;sensitivity:'conservative'|'balanced'|'strict';failClosed:boolean;description:string;blockedCount:number;quarantinedCount:number;rules:Array<{id:string;condition:string;action:SecurityVerdict;enabled:boolean}>;}
export interface SimulationStep {stepNumber:number;timestamp:number;sourceNodeId:string;targetNodeId:string;action:string;payload:string;provenance:ProvenanceSource;verdict:SecurityVerdict;reason:string;defensesTriggered:string[];nodeStatesSnapshot:Record<string,NodeStatus>;}
export interface SimulationResult {id:string;timestamp:number;attackVectorId:string;attackName:string;category:AttackCategory;finalVerdict:'STOPPED'|'BREACHED'|'CONTAINED';attemptsCompleted:number;nodesInfected:string[];nodesProtected:string[];steps:SimulationStep[];executionTimeMs:number;metrics:{attackSuccessRate:number;driftScore:number;poisoningScore:number;provenanceRiskIndex:number;attemptsToBreakthrough:number;defenseLatencyMs:number};}
export interface AuditLogEntry {id:string;timestamp:number;type:'ATTACK'|'DEFENSE'|'DRIFT'|'QUARANTINE'|'HASH_VERIFY';source:string;target:string;verdict:SecurityVerdict;message:string;hash:string;provenance:ProvenanceSource;details?:Record<string,any>;}
