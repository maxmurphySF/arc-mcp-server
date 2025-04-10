# Configuration Reference

This document provides a comprehensive reference for configuring the ARC Model Context Server (MCP).

## Configuration Overview

The ARC MCP can be configured using a configuration file, environment variables, or a combination of both. The configuration file is a JSON file that contains all the configuration options for the server.

## Configuration File

By default, the MCP looks for a configuration file named `config.json` in the current working directory. You can specify a different configuration file using the `--config` command-line option:

```bash
npm start -- --config /path/to/config.json
```

## Configuration Options

### Server Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `server.port` | number | `3000` | The port on which the server listens |
| `server.host` | string | `"localhost"` | The host on which the server listens |
| `server.basePath` | string | `"/api/v1"` | The base path for all API endpoints |
| `server.logLevel` | string | `"info"` | The log level (error, warn, info, debug, trace) |
| `server.timeout` | number | `30000` | The request timeout in milliseconds |
| `server.maxRequestSize` | string | `"1mb"` | The maximum request size |
| `server.cors.enabled` | boolean | `true` | Whether to enable CORS |
| `server.cors.origin` | string/array | `"*"` | The allowed origins for CORS |
| `server.cors.methods` | string/array | `"GET,POST,PUT,DELETE"` | The allowed methods for CORS |

### Logging Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logging.format` | string | `"text"` | The log format (text, json, pretty) |
| `logging.destinations` | array | `["console"]` | The log destinations (console, file, syslog, http) |
| `logging.includeTimestamp` | boolean | `true` | Whether to include timestamps in logs |
| `logging.includeRequestId` | boolean | `true` | Whether to include request IDs in logs |
| `logging.includeToolParameters` | boolean | `false` | Whether to include tool parameters in logs |
| `logging.includeToolResults` | boolean | `false` | Whether to include tool results in logs |
| `logging.file.path` | string | `"./logs/mcp-server.log"` | The path to the log file (when using file destination) |
| `logging.file.rotation.maxSize` | string | `"10m"` | The maximum size of the log file before rotation |
| `logging.file.rotation.maxFiles` | number | `5` | The maximum number of rotated log files to keep |
| `logging.file.rotation.compress` | boolean | `true` | Whether to compress rotated log files |
| `logging.http.url` | string | - | The URL to send logs to (when using http destination) |
| `logging.http.headers` | object | `{}` | The headers to include in HTTP log requests |

### Authentication Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `auth.enabled` | boolean | `true` | Whether to enable authentication |
| `auth.type` | string | `"apiKey"` | The authentication type (apiKey, jwt, oauth) |
| `auth.apiKey.header` | string | `"Authorization"` | The header name for API key authentication |
| `auth.apiKey.prefix` | string | `"Bearer"` | The prefix for API key authentication |
| `auth.apiKey.keys` | array | - | The list of valid API keys |
| `auth.jwt.secret` | string | - | The secret for JWT authentication |
| `auth.jwt.issuer` | string | - | The issuer for JWT authentication |
| `auth.jwt.audience` | string | - | The audience for JWT authentication |
| `auth.jwt.expiresIn` | string | `"1h"` | The expiration time for JWT authentication |

### Tool Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tools.enabled` | array | `["*"]` | The list of enabled tools ("*" for all) |
| `tools.disabled` | array | `[]` | The list of disabled tools |
| `tools.timeout` | number | `10000` | The default tool execution timeout in milliseconds |
| `tools.maxConcurrent` | number | `10` | The maximum number of concurrent tool executions |
| `tools.maxQueueSize` | number | `100` | The maximum size of the tool execution queue |

### Context Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `context.storage.type` | string | `"memory"` | The context storage type (memory, redis, mongodb) |
| `context.storage.ttl` | number | `3600` | The context time-to-live in seconds |
| `context.storage.redis.host` | string | `"localhost"` | The Redis host (when using redis storage) |
| `context.storage.redis.port` | number | `6379` | The Redis port (when using redis storage) |
| `context.storage.redis.password` | string | - | The Redis password (when using redis storage) |
| `context.storage.mongodb.uri` | string | - | The MongoDB URI (when using mongodb storage) |
| `context.storage.mongodb.collection` | string | `"contexts"` | The MongoDB collection (when using mongodb storage) |

### Health Check Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `health.enabled` | boolean | `true` | Whether to enable health checks |
| `health.path` | string | `"/health"` | The health check endpoint path |
| `health.includeMemory` | boolean | `true` | Whether to include memory usage in health checks |
| `health.includeServices` | boolean | `true` | Whether to include service status in health checks |

### Metrics Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `metrics.enabled` | boolean | `true` | Whether to enable metrics |
| `metrics.path` | string | `"/metrics"` | The metrics endpoint path |
| `metrics.prefix` | string | `"arc_mcp_"` | The prefix for metric names |

### Service Integration Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `services.authentication.url` | string | - | The authentication service URL |
| `services.authentication.timeout` | number | `5000` | The authentication service timeout in milliseconds |
| `services.repository.url` | string | - | The repository service URL |
| `services.repository.timeout` | number | `5000` | The repository service timeout in milliseconds |
| `services.notification.url` | string | - | The notification service URL |
| `services.notification.timeout` | number | `5000` | The notification service timeout in milliseconds |
| `services.documentation.url` | string | - | The documentation service URL |
| `services.documentation.timeout` | number | `5000` | The documentation service timeout in milliseconds |
| `services.projectGenerator.url` | string | - | The project generator service URL |
| `services.projectGenerator.timeout` | number | `10000` | The project generator service timeout in milliseconds |
| `services.deployment.url` | string | - | The deployment service URL |
| `services.deployment.timeout` | number | `10000` | The deployment service timeout in milliseconds |

## Environment Variables

All configuration options can also be set using environment variables. The environment variable names are derived from the configuration option names by converting them to uppercase and replacing dots with underscores, prefixed with `ARC_MCP_`.

For example, the `server.port` configuration option can be set using the `ARC_MCP_SERVER_PORT` environment variable:

```bash
# Linux/macOS
export ARC_MCP_SERVER_PORT=3000

# Windows
set ARC_MCP_SERVER_PORT=3000
```

## Configuration Precedence

Configuration options are applied in the following order of precedence (highest to lowest):

1. Command-line arguments
2. Environment variables
3. Configuration file
4. Default values

## Example Configuration

```json
{
  "server": {
    "port": 3000,
    "host": "localhost",
    "basePath": "/api/v1",
    "logLevel": "info",
    "timeout": 30000,
    "maxRequestSize": "1mb",
    "cors": {
      "enabled": true,
      "origin": "*",
      "methods": "GET,POST,PUT,DELETE"
    }
  },
  "logging": {
    "format": "json",
    "destinations": ["console", "file"],
    "includeTimestamp": true,
    "includeRequestId": true,
    "includeToolParameters": false,
    "includeToolResults": false,
    "file": {
      "path": "./logs/mcp-server.log",
      "rotation": {
        "maxSize": "10m",
        "maxFiles": 5,
        "compress": true
      }
    }
  },
  "auth": {
    "enabled": true,
    "type": "apiKey",
    "apiKey": {
      "header": "Authorization",
      "prefix": "Bearer",
      "keys": ["YOUR_API_KEY"]
    }
  },
  "tools": {
    "enabled": ["*"],
    "disabled": [],
    "timeout": 10000,
    "maxConcurrent": 10,
    "maxQueueSize": 100
  },
  "context": {
    "storage": {
      "type": "memory",
      "ttl": 3600
    }
  },
  "health": {
    "enabled": true,
    "path": "/health",
    "includeMemory": true,
    "includeServices": true
  },
  "metrics": {
    "enabled": true,
    "path": "/metrics",
    "prefix": "arc_mcp_"
  },
  "services": {
    "authentication": {
      "url": "http://auth-service:8080",
      "timeout": 5000
    },
    "repository": {
      "url": "http://repo-service:8080",
      "timeout": 5000
    },
    "notification": {
      "url": "http://notification-service:8080",
      "timeout": 5000
    },
    "documentation": {
      "url": "http://docs-service:8080",
      "timeout": 5000
    },
    "projectGenerator": {
      "url": "http://generator-service:8080",
      "timeout": 10000
    },
    "deployment": {
      "url": "http://deployment-service:8080",
      "timeout": 10000
    }
  }
}
```

## Next Steps

Now that you understand how to configure the ARC MCP, you can:

1. [Set up logging and monitoring](../troubleshooting/logs-monitoring.md)
2. [Implement security best practices](../implementation/security-best-practices.md)
3. [Integrate with AI models](../implementation/ai-model-integration.md)

For more information, refer to:

1. [API Reference](./api-reference.md)
2. [Tool Definitions Reference](./tool-definitions-reference.md)