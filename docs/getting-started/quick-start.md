# Quick Start Guide

This guide will help you quickly set up and start using the ARC Model Context Server (MCP) with AI models.

## Prerequisites

Before starting, ensure you have:

- Completed the [Installation](./installation.md) process
- Basic familiarity with ARC framework concepts
- An AI model that supports the Model Context Protocol (e.g., Claude, GPT)

## 5-Minute Setup

Follow these steps to get the ARC MCP running in just 5 minutes:

### 1. Start the MCP Server

```bash
# Navigate to your ARC MCP installation directory
cd path/to/arc-mcp-server

# Start the server with default configuration
npm start
```

You should see output indicating that the server is running, typically on port 3000.

### 2. Configure an AI Model to Connect

Depending on which AI model you're using, the configuration will differ. Here's how to set up Claude Desktop:

#### Claude Desktop Configuration

Edit your Claude Desktop configuration file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following configuration:

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

Replace `path/to/arc-mcp-server` with the actual path to your ARC MCP installation.

### 3. Test the Connection

Restart your AI model application (e.g., Claude Desktop) and try a simple interaction:

```
Can you help me understand the basic components of the ARC framework?
```

If the connection is successful, the AI model should be able to access the ARC documentation and provide a detailed response.

## Basic Usage Examples

Here are some examples of what you can ask your AI model to do with the ARC MCP:

### Documentation Assistance

```
Explain how the authentication service works in ARC.
```

### Microservice Interaction

```
Show me how to query user data from the repository service.
```

### Project Generation

```
Generate a new microservice for handling user notifications.
```

### Deployment Assistance

```
Help me deploy my ARC application to AWS.
```

## Next Steps

Now that you have the ARC MCP up and running, you can:

1. Learn more about [configuring the server](./configuration.md) for your specific needs
2. Explore the [architecture](../core-concepts/architecture.md) to understand how it works
3. Dive into the [tools and features](../tools/documentation-assistant.md) available through the MCP
4. Check out the [implementation guides](../implementation/ai-model-integration.md) for advanced usage

## Troubleshooting

If you encounter any issues during setup:

- Verify that the server is running by checking for the process
- Ensure your AI model is correctly configured to connect to the MCP
- Check the server logs for any error messages
- Refer to the [Common Issues](../troubleshooting/common-issues.md) section for solutions

For more detailed troubleshooting, see the [Debugging Guide](../troubleshooting/debugging.md).