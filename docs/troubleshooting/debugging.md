# Debugging Guide

This guide provides advanced troubleshooting techniques for diagnosing and resolving complex issues with the ARC Model Context Server (MCP).

## Enabling Debug Mode

The first step in troubleshooting complex issues is to enable debug mode in the ARC MCP. This will provide more detailed logging and information about what's happening inside the server.

### Configuration

To enable debug mode, update your configuration:

```json
{
  "server": {
    "logLevel": "debug"
  },
  "logging": {
    "format": "json",
    "includeTimestamp": true,
    "includeRequestId": true,
    "includeToolParameters": true,
    "includeToolResults": true,
    "file": "./logs/mcp-server-debug.log"
  }
}
```

Alternatively, you can set the log level using environment variables:

```bash
# Linux/macOS
export ARC_MCP_SERVER_LOG_LEVEL=debug

# Windows
set ARC_MCP_SERVER_LOG_LEVEL=debug
```

### Restart the Server

After changing the configuration, restart the MCP server to apply the changes:

```bash
# If running directly
npm restart

# If running as a service
sudo systemctl restart arc-mcp-server

# If running in Docker
docker restart arc-mcp-container
```

## Analyzing Logs

With debug mode enabled, the MCP server will generate detailed logs that can help diagnose issues.

### Log Structure

In JSON format, logs will have a structure similar to:

```json
{
  "timestamp": "2023-06-15T10:30:00.000Z",
  "level": "debug",
  "message": "Executing tool",
  "requestId": "req-123456",
  "conversationId": "conv-789012",
  "tool": "searchDocumentation",
  "parameters": {
    "query": "authentication service",
    "maxResults": 5
  },
  "duration": 120
}
```

### Common Log Patterns

Look for these patterns in the logs:

1. **Error Messages**: Entries with `level: "error"` indicate problems
2. **Warning Messages**: Entries with `level: "warn"` indicate potential issues
3. **Slow Operations**: Look for high `duration` values
4. **Authentication Issues**: Look for messages containing "authentication", "unauthorized", or "forbidden"
5. **Tool Execution**: Follow the flow of tool execution through `requestId`

### Log Analysis Tools

For large log files, use tools to help analyze them:

```bash
# Search for errors
grep '"level":"error"' logs/mcp-server-debug.log

# Find slow operations (taking more than 1000ms)
grep -E '"duration":[0-9]{4,}' logs/mcp-server-debug.log

# Follow a specific request
grep '"requestId":"req-123456"' logs/mcp-server-debug.log
```

## Network Debugging

### Testing Connectivity

Verify network connectivity between components:

```bash
# Test MCP server connectivity
curl -v http://localhost:3000/health

# Test ARC service connectivity
curl -v http://arc-services:8080/health

# Check open ports
netstat -tuln | grep 3000
```

### Analyzing Network Traffic

Use network analysis tools to inspect traffic:

1. **tcpdump**: Capture and analyze network packets
   ```bash
   sudo tcpdump -i any port 3000 -w mcp-traffic.pcap
   ```

2. **Wireshark**: Analyze the captured packets
   - Open the .pcap file in Wireshark
   - Filter for HTTP traffic: `http`
   - Look for request/response patterns and error codes

3. **Proxy Tools**: Use tools like Fiddler or Charles Proxy to intercept and inspect HTTP traffic

## API Testing

### Testing Tools Directly

Test tools directly using the API to bypass the AI model:

```bash
# Get available tools
curl -X GET http://localhost:3000/tools \
  -H "Authorization: Bearer your-api-key"

# Execute a tool
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "tool": "searchDocumentation",
    "parameters": {
      "query": "authentication service",
      "maxResults": 5
    },
    "context": {
      "conversationId": "test-conversation"
    }
  }'
```

### Using Postman or Insomnia

For more complex API testing, use tools like Postman or Insomnia:

1. Create a collection for MCP API endpoints
2. Set up environment variables for the API key and base URL
3. Create requests for different tools and operations
4. Use the collection runner to test multiple endpoints

## Debugging Tool Implementations

### Isolating Tool Issues

To isolate issues with specific tools:

1. Create a simple test script that calls the tool directly:

```javascript
// test-tool.js
const { ToolHandler } = require('./path/to/tool-handler');

async function testTool() {
  const handler = new ToolHandler();
  try {
    const result = await handler.executeTool('toolName', {
      param1: 'value1',
      param2: 'value2'
    }, {
      conversationId: 'test-conversation',
      history: [],
      state: {}
    });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testTool();
```

2. Run the test script with Node.js inspector:

```bash
node --inspect-brk test-tool.js
```

3. Open Chrome and navigate to `chrome://inspect` to connect to the debugger

### Adding Debug Statements

Add temporary debug statements to tool implementations:

```javascript
class DocumentationService {
  async searchDocumentation(parameters, context) {
    console.log('Search parameters:', parameters);
    console.log('Context:', context);
    
    // ... existing code ...
    
    console.log('Search results:', results);
    return results;
  }
}
```

## Debugging Context Management

### Inspecting Context Data

To inspect the context data for a conversation:

1. Locate the context file:
   ```bash
   find ./data/contexts -name "*conversation-id*.json"
   ```

2. Examine the context file:
   ```bash
   cat ./data/contexts/conversation-id.json | jq
   ```

3. Monitor context changes in real-time:
   ```bash
   watch -n 1 "cat ./data/contexts/conversation-id.json | jq"
   ```

### Testing Context Operations

Test context operations directly:

```bash
# Get context
curl -X GET http://localhost:3000/context/conversation-id \
  -H "Authorization: Bearer your-api-key"

# Update context
curl -X PUT http://localhost:3000/context/conversation-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "state": {
      "currentProject": "test-project",
      "selectedService": "authentication"
    }
  }'
```

## Debugging Service Integrations

### Mocking Services

To isolate issues with service integrations, create mock services:

1. Create a mock service implementation:

```javascript
// mock-authentication-service.js
class MockAuthenticationService {
  async login(username, password) {
    console.log(`Mock login attempt: ${username}`);
    return {
      success: true,
      token: 'mock-token-123',
      user: {
        id: 'user-123',
        username: username,
        roles: ['user']
      }
    };
  }
  
  // Other methods...
}

module.exports = { MockAuthenticationService };
```

2. Configure the MCP to use the mock service:

```javascript
// In your server setup code
const { MockAuthenticationService } = require('./mock-authentication-service');

const server = new McpServer({
  // ... other config ...
  services: {
    authenticationService: new MockAuthenticationService()
  }
});
```

### Service Request Tracing

Implement request tracing for service calls:

```javascript
class TracingProxy {
  constructor(service) {
    this.service = service;
    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof target.service[prop] === 'function') {
          return async (...args) => {
            console.log(`Calling ${prop} with args:`, args);
            const startTime = Date.now();
            try {
              const result = await target.service[prop](...args);
              console.log(`${prop} returned after ${Date.now() - startTime}ms:`, result);
              return result;
            } catch (error) {
              console.error(`${prop} failed after ${Date.now() - startTime}ms:`, error);
              throw error;
            }
          };
        }
        return target.service[prop];
      }
    });
  }
}

// Usage
const authService = new TracingProxy(new AuthenticationService(config));
```

## Performance Debugging

### CPU Profiling

To identify CPU-intensive operations:

1. Start the MCP server with profiling enabled:
   ```bash
   node --prof path/to/index.js
   ```

2. Perform the operations that are causing high CPU usage

3. Stop the server and process the profiling data:
   ```bash
   node --prof-process isolate-*.log > cpu-profile.txt
   ```

4. Analyze the profile to identify hot spots

### Memory Profiling

To identify memory leaks:

1. Start the MCP server with the inspector:
   ```bash
   node --inspect path/to/index.js
   ```

2. Open Chrome and navigate to `chrome://inspect`

3. Connect to the Node.js process and go to the Memory tab

4. Take heap snapshots before and after the suspected memory leak

5. Compare the snapshots to identify objects that are accumulating

### Request Timing

Implement request timing middleware to identify slow requests:

```javascript
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationMs = (duration[0] * 1000) + (duration[1] / 1000000);
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${durationMs.toFixed(2)}ms`);
  });
  next();
});
```

## Debugging AI Model Integration

### Claude Desktop Integration

For issues with Claude Desktop integration:

1. Check the Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/claude.log`
   - Windows: `%APPDATA%\Claude\logs\claude.log`

2. Verify the Claude Desktop configuration:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Test the MCP server independently:
   ```bash
   node path/to/arc-mcp-server/dist/index.js
   ```

4. Look for error messages in both the Claude logs and MCP server logs

### Testing with Curl

Simulate AI model requests using curl:

```bash
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "message": "How does the ARC authentication service work?",
    "context": {
      "conversationId": "test-conversation",
      "history": [],
      "state": {}
    }
  }'
```

## Advanced Debugging Techniques

### Core Dumps

For critical issues, enable core dumps to capture the state of the process when it crashes:

```bash
# Enable core dumps
ulimit -c unlimited

# Run with core dump on crash
node --abort-on-uncaught-exception path/to/index.js
```

Analyze core dumps with tools like `gdb` or `lldb`.

### Distributed Tracing

Implement distributed tracing for complex systems:

1. Add OpenTelemetry instrumentation:

```javascript
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const provider = new NodeTracerProvider();
const exporter = new JaegerExporter({
  serviceName: 'arc-mcp-server',
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
```

2. Instrument key operations:

```javascript
const { trace } = require('@opentelemetry/api');

async function executeTool(toolName, parameters, context) {
  const tracer = trace.getTracer('arc-mcp-server');
  return tracer.startActiveSpan(`execute_tool_${toolName}`, async (span) => {
    try {
      span.setAttribute('tool.name', toolName);
      span.setAttribute('tool.parameters', JSON.stringify(parameters));
      span.setAttribute('conversation.id', context.conversationId);
      
      const result = await originalExecuteTool(toolName, parameters, context);
      
      span.setAttribute('tool.result.success', true);
      span.end();
      return result;
    } catch (error) {
      span.setAttribute('tool.result.success', false);
      span.setAttribute('error.message', error.message);
      span.end();
      throw error;
    }
  });
}
```

3. Visualize traces using Jaeger UI or other tracing tools

### Custom Debugging Tools

Create custom debugging tools for specific needs:

1. Tool execution analyzer:

```javascript
// tool-analyzer.js
const fs = require('fs');
const path = require('path');

// Parse logs
const logs = fs.readFileSync('logs/mcp-server-debug.log', 'utf8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => JSON.parse(line));

// Analyze tool executions
const toolExecutions = logs
  .filter(log => log.message === 'Executing tool')
  .map(log => ({
    tool: log.tool,
    duration: log.duration,
    timestamp: new Date(log.timestamp),
    requestId: log.requestId,
    success: !logs.some(l => 
      l.requestId === log.requestId && 
      l.level === 'error'
    )
  }));

// Generate statistics
const stats = {};
toolExecutions.forEach(exec => {
  if (!stats[exec.tool]) {
    stats[exec.tool] = {
      count: 0,
      successCount: 0,
      failureCount: 0,
      totalDuration: 0,
      minDuration: Infinity,
      maxDuration: 0
    };
  }
  
  stats[exec.tool].count++;
  if (exec.success) stats[exec.tool].successCount++;
  else stats[exec.tool].failureCount++;
  
  stats[exec.tool].totalDuration += exec.duration;
  stats[exec.tool].minDuration = Math.min(stats[exec.tool].minDuration, exec.duration);
  stats[exec.tool].maxDuration = Math.max(stats[exec.tool].maxDuration, exec.duration);
});

// Calculate averages
Object.keys(stats).forEach(tool => {
  stats[tool].avgDuration = stats[tool].totalDuration / stats[tool].count;
  stats[tool].successRate = (stats[tool].successCount / stats[tool].count) * 100;
});

console.table(stats);
```

## Debugging Checklist

Use this checklist when debugging complex issues:

1. **Enable Debug Logging**
   - Set log level to debug
   - Configure detailed log format
   - Ensure logs are being written to a file

2. **Check Basic Connectivity**
   - Verify the MCP server is running
   - Test network connectivity between components
   - Check authentication credentials

3. **Isolate the Issue**
   - Determine if it's a client, server, or integration issue
   - Test components individually
   - Use mock services if necessary

4. **Analyze Logs**
   - Look for error messages
   - Trace requests through the system
   - Identify patterns or correlations

5. **Test API Directly**
   - Use curl or Postman to test endpoints
   - Verify request/response formats
   - Check for error responses

6. **Debug Performance**
   - Profile CPU usage
   - Monitor memory consumption
   - Measure request timing

7. **Check Configuration**
   - Verify all configuration settings
   - Check environment variables
   - Ensure file paths are correct

8. **Review Code**
   - Look for logical errors
   - Check error handling
   - Verify asynchronous operations

9. **Test in Isolation**
   - Create minimal test cases
   - Remove dependencies when possible
   - Use debugging tools (Node.js inspector)

10. **Document Findings**
    - Record the debugging process
    - Document the root cause
    - Note the solution for future reference

## Next Steps

If you're still experiencing issues after following this debugging guide:

1. Check the [Common Issues](./common-issues.md) document for known problems and solutions
2. Review the [Logs and Monitoring](./logs-monitoring.md) documentation for better visibility
3. Consult the [API Reference](../reference/api-reference.md) for correct API usage
4. Reach out to the community for help
5. Consider engaging with commercial support options for critical issues