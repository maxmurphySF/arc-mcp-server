/**
 * Context model for the ARC MCP Server
 */

export class McpContext {
  private state: Map<string, any> = new Map();
  
  constructor(public id: string) {}
  
  get(key: string): any {
    return this.state.get(key);
  }
  
  set(key: string, value: any): void {
    this.state.set(key, value);
  }
  
  getAll(): Record<string, any> {
    return Object.fromEntries(this.state.entries());
  }
}