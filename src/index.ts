/**
 * Main entry point for the ARC MCP Server
 */

import { ArcMcpServer } from './server/mcp-server';
import { HttpServer } from './server/http-server';
import { ContextManager } from './server/context-manager';

// Configuration
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  security: {
    // Security configuration
  }
};

// Create the context manager
const contextManager = new ContextManager();

// Create the MCP server
const mcpServer = new ArcMcpServer(config);

// Create the HTTP server
const httpServer = new HttpServer(mcpServer, config.port);

// Start the server
async function startServer() {
  try {
    await mcpServer.start();
    console.log(`ARC MCP Server started on port ${config.port}`);
  } catch (error) {
    console.error('Failed to start ARC MCP Server:', error);
    process.exit(1);
  }
}

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down ARC MCP Server...');
  await mcpServer.stop();
  process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for testing
export { mcpServer, httpServer, contextManager };