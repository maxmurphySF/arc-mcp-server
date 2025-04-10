/**
 * Core MCP Server implementation for ARC
 */

import { EventEmitter } from 'events';
import { ToolDefinition, ToolOutput, ToolInput } from '../models/tool';
import { SecurityManager } from '../security/security-manager';
import { createApiTools } from '../definitions/arc-api-tools';
import { createDocumentationTools } from '../definitions/documentation-tools';
import { createGeneratorTools } from '../definitions/generator-tools';
import { createDeploymentTools } from '../definitions/deployment-tools';

export class ArcMcpServer extends EventEmitter {
  private tools: Map<string, ToolDefinition> = new Map();
  private securityManager: SecurityManager;

  constructor(private config: any) {
    super();
    this.securityManager = new SecurityManager(config.security);
    this.init();
  }

  private init(): void {
    // Register all tools and capabilities
    this.registerArcTools();
  }

  private registerArcTools(): void {
    // Register API microservices tools
    this.registerApiTools();
    // Register infrastructure tools
    this.registerInfrastructureTools();
    // Register UI tools
    this.registerUiTools();
    // Register SaaS tools
    this.registerSaasTools();
  }

  // Methods to register specific tool categories
  private registerApiTools(): void {
    // Register tools for ARC API microservices
    // Example: Authentication, Notification, Scheduler, etc.
    const apiTools = createApiTools();
    apiTools.forEach(tool => {
      this.tools.set(tool.id, tool);
    });
  }

  private registerInfrastructureTools(): void {
    // Register tools for ARC Infrastructure capabilities
    // Register generator tools
    const generatorTools = createGeneratorTools();
    generatorTools.forEach(tool => {
      this.tools.set(tool.id, tool);
    });
    
    // Register deployment tools
    const deploymentTools = createDeploymentTools();
    deploymentTools.forEach(tool => {
      this.tools.set(tool.id, tool);
    });
  }

  private registerUiTools(): void {
    // Register tools for interacting with ARC UI components
    // This will be expanded in future versions with UI component tools
  }

  private registerSaasTools(): void {
    // Register tools for SaaS features (tenant management, etc.)
    // This will be expanded in future versions with SaaS-specific tools
    
    // Register documentation tools under SaaS category for now
    const documentationTools = createDocumentationTools();
    documentationTools.forEach(tool => {
      this.tools.set(tool.id, tool);
    });
  }

  // MCP Protocol methods
  async listTools(): Promise<ToolDefinition[]> {
    return Array.from(this.tools.values());
  }

  async executeTool(toolId: string, input: ToolInput): Promise<ToolOutput> {
    // Check authorization
    await this.securityManager.authorizeToolExecution(toolId, input);
    
    // Get tool implementation
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }
    
    // Execute tool
    return await tool.execute(input);
  }

  // Server lifecycle methods
  async start(): Promise<void> {
    // Start the server
    this.emit('started');
  }

  async stop(): Promise<void> {
    // Stop the server
    this.emit('stopped');
  }
}