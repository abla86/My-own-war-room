export type GroundingSource = {
  id: string;
  title: string;
  uri?: string;
  content: string;
  trust: 'approved' | 'unverified';
};

export type GroundedContext = {
  query: string;
  sources: GroundingSource[];
  generatedAt: string;
};

export type AgentActionRequest = {
  action: string;
  reason: string;
  requiresApproval: true;
};

export function buildGroundedContext(query: string, sources: GroundingSource[]): GroundedContext {
  return {
    query: query.trim(),
    sources: sources.filter((source) => source.trust === 'approved'),
    generatedAt: new Date().toISOString(),
  };
}

export function buildAgentActionRequest(action: string, reason: string): AgentActionRequest {
  return { action: action.trim(), reason: reason.trim(), requiresApproval: true };
}

export function canAgentInfluenceSecurityDecision(request: AgentActionRequest): false {
  void request;
  return false;
}