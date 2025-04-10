/**
 * Context manager for the ARC MCP Server
 */

import { McpContext } from '../models/context';

export class ContextManager {
  private contexts: Map<string, McpContext> = new Map();
  
  getContext(id: string): McpContext {
    if (!this.contexts.has(id)) {
      this.contexts.set(id, new McpContext(id));
    }
    return this.contexts.get(id)!;
  }
  
  removeContext(id: string): boolean {
    return this.contexts.delete(id);
  }
}