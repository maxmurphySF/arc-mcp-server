/**
 * HTTP Server implementation for the ARC MCP Server
 */

import express from 'express';
import bodyParser from 'body-parser';
import { ArcMcpServer } from './mcp-server';

export class HttpServer {
  private app: express.Application;
  private server: any;

  constructor(private mcpServer: ArcMcpServer, private port: number) {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(bodyParser.json());
    // Add security middleware, CORS, etc.
  }

  private configureRoutes(): void {
    // MCP protocol routes
    this.app.get('/mcp/info', (req, res) => {
      res.json({
        name: 'ARC Model Context Server',
        version: '1.0.0',
        description: 'Model Context Server for ARC framework',
        protocol: {
          version: '1.0.0',
          format: 'json'
        }
      });
    });

    this.app.get('/mcp/tools', async (req, res) => {
      const tools = await this.mcpServer.listTools();
      res.json({ tools });
    });

    this.app.post('/mcp/execute/:toolId', async (req, res) => {
      try {
        const result = await this.mcpServer.executeTool(req.params.toolId, req.body);
        res.json(result);
      } catch (error) {
        res.status(400).json({
          error: error.message
        });
      }
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`ARC MCP Server listening on port ${this.port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}