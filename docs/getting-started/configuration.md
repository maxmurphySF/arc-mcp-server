# Configuration Guide

This guide explains how to configure the ARC Model Context Server (MCP) for your specific environment and requirements.

## Configuration Files

The ARC MCP uses a hierarchical configuration system with the following files (in order of precedence):

1. Command-line arguments
2. Environment variables
3. `.env` file in the project root
4. `config.json` file in the project root
5. Default configuration values

## Basic Configuration

### Using config.json

Create a `config.json` file in the root directory of your ARC MCP installation:

```json
{
  "server": {
    "port": 3000,
    "host": "localhost",
    "logLevel": "info"
  },
  "security": {
    "apiKey": "your-api-key-here",
    "enableAuth": true,
    "corsOrigins": ["http://localhost:3001"]
  },
  "arc": {
    "servicesBaseUrl": "http://localhost:8080",
    "apiVersion": "v1"
  },
  "context": {
    "maxHistorySize": 50,
    "persistenceEnabled": true,
    "persistencePath": "./data/contexts"
  }
}
```

### Using Environment Variables

You can also configure the ARC MCP using environment variables. Environment variables take precedence over the `config.json` file.

Example `.env` file:

```
ARC_MCP_SERVER_PORT=3000
ARC_MCP_SERVER_HOST=localhost
ARC_MCP_SERVER_LOG_LEVEL=info
ARC_MCP_SECURITY_API_KEY=your-api-key-here
ARC_MCP_SECURITY_ENABLE_AUTH=true
ARC_MCP_SECURITY_CORS_ORIGINS=http://localhost:3001
ARC_MCP_ARC_SERVICES_BASE_URL=http://localhost:8080
ARC_MCP_ARC_API_VERSION=v1
ARC_MCP_CONTEXT_MAX_HISTORY_SIZE=50
ARC_MCP_CONTEXT_PERSISTENCE_ENABLED=true
ARC_MCP_CONTEXT_PERSISTENCE_PATH=./data/contexts
```

## Configuration Options

### Server Configuration

| Option | Environment Variable | Default | Description |
|--------|---------------------|---------|-------------|
| `server.port` | `ARC_MCP_SERVER_PORT` | `3000` | The port on which the MCP server will listen |
| `server.host` | `ARC_MCP_SERVER_HOST` | `localhost` | The host address to bind the server to |
| `server.logLevel` | `ARC_MCP_SERVER_LOG_LEVEL` | `info` | Log level (`error`, `warn`, `info`, `debug`, `trace`) |

### Security Configuration

| Option | Environment Variable | Default | Description |
|--------|---------------------|---------|-------------|
| `security.apiKey` | `ARC_MCP_SECURITY_API_KEY` | `null` | API key for authentication |
| `security.enableAuth` | `ARC_MCP_SECURITY_ENABLE_AUTH` | `false` | Enable/disable authentication |
| `security.corsOrigins` | `ARC_MCP_SECURITY_CORS_ORIGINS` | `["*"]` | Allowed CORS origins |

### ARC Integration Configuration

| Option | Environment Variable | Default | Description |
|--------|---------------------|---------|-------------|
| `arc.servicesBaseUrl` | `ARC_MCP_ARC_SERVICES_BASE_URL` | `http://localhost:8080` | Base URL for ARC services |
| `arc.apiVersion` | `ARC_MCP_ARC_API_VERSION` | `v1` | API version for ARC services |

### Context Management Configuration

| Option | Environment Variable | Default | Description |
|--------|---------------------|---------|-------------|
| `context.maxHistorySize` | `ARC_MCP_CONTEXT_MAX_HISTORY_SIZE` | `50` | Maximum number of history items to store per context |
| `context.persistenceEnabled` | `ARC_MCP_CONTEXT_PERSISTENCE_ENABLED` | `true` | Enable/disable context persistence |
| `context.persistencePath` | `ARC_MCP_CONTEXT_PERSISTENCE_PATH` | `./data/contexts` | Path to store persisted contexts |

## Advanced Configuration

### Tool Definitions

You can customize which tools are available to AI models by modifying the tool definition files in the `src/definitions` directory. After modifying these files, you'll need to rebuild the project.

### Custom Integrations

To add custom integrations with your own ARC services, you can extend the integration classes in the `src/integrations` directory.

## Configuration for AI Models

### Claude Desktop

To configure Claude Desktop to use your ARC MCP server:

1. Edit the Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following configuration:

```json
{
  "mcpServers": {
    "arc": {
      "command": "node",
      "args": [
        "path/to/arc-mcp-server/dist/index.js"
      ],
      "options": {
        "cwd": "path/to/arc-mcp-server"
      }
    }
  }
}
```

3. Replace `path/to/arc-mcp-server` with the actual path to your ARC MCP installation.

### Other AI Models

For other AI models that support the Model Context Protocol, refer to their specific documentation for how to configure external MCP servers.

## Next Steps

After configuring your ARC MCP server, you can:

1. Learn about the [architecture](../core-concepts/architecture.md) of the ARC MCP
2. Explore the [tools and features](../tools/documentation-assistant.md) available
3. Check out the [implementation guides](../implementation/ai-model-integration.md) for advanced usage

## Troubleshooting

If you encounter configuration issues, check the [Common Issues](../troubleshooting/common-issues.md) section or the [Debugging Guide](../troubleshooting/debugging.md) for solutions.