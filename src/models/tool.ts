/**
 * Tool definition interfaces for the ARC MCP Server
 */

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (input: ToolInput) => Promise<ToolOutput>;
}

export interface ToolInput {
  [key: string]: any;
}

export interface ToolOutput {
  [key: string]: any;
}