/**
 * Configuration for the ARC MCP Server
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  
  // Security configuration
  security: {
    // JWT secret for token validation
    jwtSecret: process.env.JWT_SECRET || 'arc-mcp-secret',
    // Token expiration time in seconds
    tokenExpiration: process.env.TOKEN_EXPIRATION ? parseInt(process.env.TOKEN_EXPIRATION) : 3600,
  },
  
  // ARC services configuration
  services: {
    // Authentication service
    authentication: {
      baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    },
    // Notification service
    notification: {
      baseUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002',
    },
  },
  
  // Documentation configuration
  documentation: {
    // ARC documentation URL
    baseUrl: process.env.ARC_DOCS_URL || 'https://sourcefuse.github.io/arc-docs/',
    // Cache documentation for performance
    cacheEnabled: process.env.DOCS_CACHE_ENABLED === 'true',
    // Cache expiration time in seconds
    cacheExpiration: process.env.DOCS_CACHE_EXPIRATION ? parseInt(process.env.DOCS_CACHE_EXPIRATION) : 3600,
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;