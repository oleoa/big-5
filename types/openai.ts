export interface AssistantTool {
  type: 'code_interpreter' | 'file_search' | 'function';
}

export interface ToolResources {
  code_interpreter?: { file_ids: string[] };
  file_search?: { vector_store_ids: string[] };
}

export interface Assistant {
  id: string;
  object: string;
  name: string | null;
  description: string | null;
  model: string;
  instructions: string | null;
  tools: AssistantTool[];
  tool_resources: ToolResources | null;
  temperature: number | null;
  top_p: number | null;
  metadata: Record<string, string>;
  created_at: number;
}

export interface CreateAssistantPayload {
  name: string;
  model: string;
  instructions?: string;
  description?: string;
  tools?: { type: string }[];
  tool_resources?: ToolResources;
  temperature?: number;
  top_p?: number;
}

export type UpdateAssistantPayload = Partial<CreateAssistantPayload>;

export interface VectorStore {
  id: string;
  object: string;
  name: string;
  file_counts: {
    in_progress: number;
    completed: number;
    failed: number;
    cancelled: number;
    total: number;
  };
  created_at: number;
}

export interface VectorStoreFile {
  id: string;
  object: string;
  vector_store_id: string;
  status: 'in_progress' | 'completed' | 'cancelled' | 'failed';
  created_at: number;
}

export interface OpenAIFile {
  id: string;
  object: string;
  filename: string;
  bytes: number;
  purpose: string;
  created_at: number;
}
