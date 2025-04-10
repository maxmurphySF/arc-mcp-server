# Common Issues

This document outlines common issues that you might encounter when using the ARC Model Context Server (MCP) and provides solutions to resolve them.

## Installation Issues

### Node.js Version Compatibility

**Issue**: The ARC MCP fails to start with errors related to syntax or unsupported features.

**Cause**: The ARC MCP requires Node.js v14 or later due to its use of modern JavaScript features.

**Solution**:
1. Check your Node.js version:
   ```bash
   node --version
   ```
2. If your version is below v14, update Node.js:
   - Download the latest LTS version from [nodejs.org](https://nodejs.org/)
   - Or use a version manager like nvm:
     ```bash
     nvm install 14
     nvm use 14
     ```

### Permission Issues During Installation

**Issue**: You encounter permission errors when installing the ARC MCP globally.

**Cause**: Global npm installations require elevated permissions.

**Solution**:

**For Linux/macOS**:
1. Use sudo (not recommended for security reasons):
   ```bash
   sudo npm install -g arc-mcp-server
   ```

2. Better approach - configure npm to use a different directory:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix ~/.npm-global
   ```
   Then add to your profile (~/.profile, ~/.bash_profile, ~/.zshrc, etc.):
   ```bash
   export PATH=~/.npm-global/bin:$PATH
   ```
   Source your profile and reinstall:
   ```bash
   source ~/.profile  # or appropriate file
   npm install -g arc-mcp-server
   ```

**For Windows**:
1. Run Command Prompt or PowerShell as Administrator
2. Then run the installation command:
   ```bash
   npm install -g arc-mcp-server
   ```

### Missing Dependencies

**Issue**: Installation fails with errors about missing dependencies.

**Cause**: Some dependencies might require additional system packages or build tools.

**Solution**:
1. Install build essentials:
   - **Linux (Ubuntu/Debian)**:
     ```bash
     sudo apt-get install build-essential python
     ```
   - **macOS**:
     ```bash
     xcode-select --install
     ```
   - **Windows**:
     ```bash
     npm install --global --production windows-build-tools
     ```

2. Clear npm cache and retry:
   ```bash
   npm cache clean --force
   npm install -g arc-mcp-server
   ```

## Configuration Issues

### Configuration File Not Found

**Issue**: The ARC MCP fails to start with an error about missing configuration.

**Cause**: The server cannot locate the configuration file.

**Solution**:
1. Create a config.json file in the project root directory
2. Ensure it contains the minimum required configuration:
   ```json
   {
     "server": {
       "port": 3000,
       "host": "localhost"
     },
     "security": {
       "apiKey": "your-api-key-here",
       "enableAuth": true
     },
     "arc": {
       "servicesBaseUrl": "http://localhost:8080"
     }
   }
   ```
3. Alternatively, set configuration via environment variables:
   ```bash
   export ARC_MCP_SERVER_PORT=3000
   export ARC_MCP_SERVER_HOST=localhost
   export ARC_MCP_SECURITY_API_KEY=your-api-key-here
   export ARC_MCP_SECURITY_ENABLE_AUTH=true
   export ARC_MCP_ARC_SERVICES_BASE_URL=http://localhost:8080
   ```

### Invalid Configuration Format

**Issue**: The ARC MCP fails to start with an error about invalid configuration.

**Cause**: The configuration file contains syntax errors or invalid values.

**Solution**:
1. Validate your JSON syntax using a JSON validator
2. Check for common issues:
   - Missing commas between properties
   - Trailing commas (not allowed in JSON)
   - Unquoted property names
   - Incorrect data types for values
3. Ensure all required fields are present and have valid values

### Environment Variables Not Applied

**Issue**: Configuration changes via environment variables are not taking effect.

**Cause**: Environment variables might be incorrectly formatted or not properly exported.

**Solution**:
1. Ensure environment variables use the correct naming convention:
   - Convert camelCase to UPPER_CASE with underscores
   - Prefix with ARC_MCP_
   - Example: `server.port` becomes `ARC_MCP_SERVER_PORT`

2. Verify the variables are properly exported:
   ```bash
   # Linux/macOS
   echo $ARC_MCP_SERVER_PORT
   
   # Windows
   echo %ARC_MCP_SERVER_PORT%
   ```

3. Restart the MCP server after setting environment variables

## Connection Issues

### AI Model Cannot Connect to MCP Server

**Issue**: The AI model (e.g., Claude) cannot connect to the MCP server.

**Cause**: This could be due to network issues, incorrect configuration, or server not running.

**Solution**:
1. Verify the MCP server is running:
   ```bash
   # Check if the process is running
   ps aux | grep arc-mcp-server  # Linux/macOS
   tasklist | findstr node.exe    # Windows
   ```

2. Check the server logs for errors

3. Verify network connectivity:
   ```bash
   # Test if the server port is open
   curl http://localhost:3000/health
   ```

4. Check Claude Desktop configuration:
   - Ensure the path to the MCP server is correct
   - Verify the command and arguments are properly formatted
   - Check for any typos in the configuration file

5. Restart Claude Desktop after making configuration changes

### MCP Server Cannot Connect to ARC Services

**Issue**: The MCP server cannot connect to ARC services.

**Cause**: ARC services might not be running, or there might be network/authentication issues.

**Solution**:
1. Verify ARC services are running:
   ```bash
   # Test if the services are accessible
   curl http://localhost:8080/health
   ```

2. Check network connectivity between the MCP server and ARC services

3. Verify authentication credentials:
   - Check API keys or other authentication credentials in the configuration
   - Ensure the credentials have not expired

4. Check for firewall or network restrictions

5. Increase the log level to debug for more information:
   ```json
   {
     "server": {
       "logLevel": "debug"
     }
   }
   ```

## Tool Execution Issues

### Tool Not Found

**Issue**: AI model reports that a tool is not found or unavailable.

**Cause**: The tool might not be registered, might be disabled, or there might be a naming mismatch.

**Solution**:
1. Check if the tool is registered and enabled in the MCP configuration:
   ```json
   {
     "tools": {
       "documentation": {
         "enabled": true
       }
     }
   }
   ```

2. Verify the tool name matches exactly (case-sensitive)

3. Check the MCP server logs for any errors related to tool registration

4. Restart the MCP server after making configuration changes

### Tool Execution Fails

**Issue**: Tool execution fails with errors.

**Cause**: This could be due to invalid parameters, service connectivity issues, or internal errors.

**Solution**:
1. Check the parameters being passed to the tool:
   - Ensure all required parameters are provided
   - Verify parameter types match the expected types
   - Check for any formatting issues in parameter values

2. Verify connectivity to dependent services

3. Check the MCP server logs for detailed error information

4. Test the tool directly using the API:
   ```bash
   curl -X POST http://localhost:3000/execute \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-api-key" \
     -d '{
       "tool": "toolName",
       "parameters": {
         "param1": "value1"
       },
       "context": {
         "conversationId": "test-conversation"
       }
     }'
   ```

### Slow Tool Execution

**Issue**: Tool execution is very slow.

**Cause**: This could be due to performance issues in the tool implementation, network latency, or resource constraints.

**Solution**:
1. Check resource utilization on the MCP server:
   - CPU usage
   - Memory usage
   - Network bandwidth

2. Implement caching for frequently accessed data

3. Optimize tool implementations for performance

4. Increase timeouts for external service calls:
   ```json
   {
     "arc": {
       "services": {
         "repository": {
           "timeout": 10000
         }
       }
     }
   }
   ```

5. Consider scaling the MCP server horizontally or vertically

## Context Management Issues

### Context Not Persisting Between Interactions

**Issue**: Conversation context is lost between interactions.

**Cause**: Context persistence might be disabled, or there might be issues with the context storage.

**Solution**:
1. Ensure context persistence is enabled:
   ```json
   {
     "context": {
       "persistenceEnabled": true,
       "persistencePath": "./data/contexts"
     }
   }
   ```

2. Verify the persistence path exists and is writable

3. Check if the conversation ID is being consistently used across interactions

4. Increase the context history size if necessary:
   ```json
   {
     "context": {
       "maxHistorySize": 100
     }
   }
   ```

5. Check the MCP server logs for any errors related to context management

### Context Corruption

**Issue**: Conversation context appears to be corrupted or contains unexpected data.

**Cause**: This could be due to concurrent modifications, serialization issues, or bugs in context management.

**Solution**:
1. Implement proper locking for concurrent context access

2. Validate context data before storing and after retrieving

3. Clear the corrupted context:
   ```bash
   # Remove the context file for a specific conversation
   rm ./data/contexts/conversation-id.json
   ```

4. Restart the MCP server if necessary

## Security Issues

### Authentication Failures

**Issue**: Requests to the MCP server fail with authentication errors.

**Cause**: This could be due to missing or invalid API keys, expired tokens, or misconfigured authentication.

**Solution**:
1. Verify the API key is correctly configured in the MCP server:
   ```json
   {
     "security": {
       "apiKey": "your-api-key-here",
       "enableAuth": true
     }
   }
   ```

2. Ensure the API key is included in requests:
   ```bash
   curl -H "Authorization: Bearer your-api-key" http://localhost:3000/tools
   ```

3. Check if the API key has expired and generate a new one if necessary

4. Verify that authentication is enabled in the MCP configuration

### Authorization Failures

**Issue**: Authenticated requests fail with authorization errors.

**Cause**: The authenticated entity might not have permission to perform the requested operation.

**Solution**:
1. Check the permissions assigned to the API key or user

2. Verify that the requested operation is allowed for the authenticated entity

3. Update the permissions if necessary:
   ```json
   {
     "security": {
       "rbac": {
         "roles": {
           "user": {
             "permissions": ["read:docs", "execute:tools"]
           }
         },
         "apiKeys": {
           "your-api-key-here": {
             "role": "user"
           }
         }
       }
     }
   }
   ```

4. Check the MCP server logs for detailed authorization error information

### Rate Limiting

**Issue**: Requests are being rejected due to rate limiting.

**Cause**: Too many requests are being made in a short period of time.

**Solution**:
1. Implement request throttling in your client

2. Adjust the rate limiting configuration if necessary:
   ```json
   {
     "security": {
       "rateLimit": {
         "enabled": true,
         "maxRequestsPerMinute": 100
       }
     }
   }
   ```

3. Consider scaling the MCP server to handle higher request volumes

## Performance Issues

### High CPU Usage

**Issue**: The MCP server is using excessive CPU resources.

**Cause**: This could be due to inefficient tool implementations, high request volume, or resource-intensive operations.

**Solution**:
1. Identify CPU-intensive operations using profiling tools

2. Optimize tool implementations for performance

3. Implement caching for frequently accessed data

4. Consider using worker threads for CPU-intensive operations

5. Scale the MCP server horizontally or vertically

### Memory Leaks

**Issue**: The MCP server's memory usage grows over time.

**Cause**: This could be due to memory leaks in the code, accumulating context data, or improper resource management.

**Solution**:
1. Use memory profiling tools to identify memory leaks

2. Implement proper cleanup of resources in tool implementations

3. Limit the size of stored context data:
   ```json
   {
     "context": {
       "maxHistorySize": 50,
       "maxContextSizeBytes": 1048576
     }
   }
   ```

4. Implement automatic pruning of old context data

5. Restart the MCP server periodically if necessary

### Slow Response Times

**Issue**: The MCP server has slow response times.

**Cause**: This could be due to inefficient code, network latency, database performance, or resource constraints.

**Solution**:
1. Implement performance monitoring to identify bottlenecks

2. Optimize database queries and implement indexing

3. Use connection pooling for external services

4. Implement caching for frequently accessed data

5. Consider using a CDN for static content

6. Scale the MCP server horizontally or vertically

## Logging and Monitoring Issues

### Missing or Insufficient Logs

**Issue**: Logs are missing or don't contain enough information to diagnose issues.

**Cause**: Logging might be disabled or configured at a level that doesn't capture enough detail.

**Solution**:
1. Enable detailed logging:
   ```json
   {
     "logging": {
       "level": "debug",
       "format": "json",
       "file": "./logs/mcp-server.log"
     }
   }
   ```

2. Implement structured logging for better searchability

3. Add context information to log entries

4. Implement request ID tracking across components

### Log File Growth

**Issue**: Log files grow too large and consume disk space.

**Cause**: Excessive logging without proper rotation or cleanup.

**Solution**:
1. Implement log rotation:
   ```json
   {
     "logging": {
       "rotation": {
         "enabled": true,
         "maxSize": "10m",
         "maxFiles": 5
       }
     }
   }
   ```

2. Archive or compress old log files

3. Implement log level filtering to reduce log volume

4. Consider using a centralized logging system

### Monitoring Gaps

**Issue**: Monitoring doesn't capture important metrics or events.

**Cause**: Incomplete monitoring configuration or missing instrumentation.

**Solution**:
1. Implement comprehensive metrics collection:
   ```json
   {
     "monitoring": {
       "metrics": {
         "enabled": true,
         "interval": 10000,
         "prefix": "arc_mcp_"
       }
     }
   }
   ```

2. Add custom metrics for business-critical operations

3. Implement health check endpoints

4. Set up alerts for critical conditions

5. Consider using a monitoring service like Prometheus and Grafana

## Deployment Issues

### Container Startup Failures

**Issue**: The MCP server fails to start in a containerized environment.

**Cause**: This could be due to missing dependencies, incorrect configuration, or resource constraints.

**Solution**:
1. Check container logs for startup errors

2. Ensure all required dependencies are included in the container

3. Verify the configuration is correctly mounted or provided as environment variables

4. Check resource limits and increase if necessary

5. Ensure the container has network access to required services

### Kubernetes Pod Crashes

**Issue**: Kubernetes pods running the MCP server crash or restart frequently.

**Cause**: This could be due to application errors, resource constraints, or health check failures.

**Solution**:
1. Check pod logs for error messages

2. Verify resource requests and limits are appropriate:
   ```yaml
   resources:
     requests:
       cpu: 100m
       memory: 256Mi
     limits:
       cpu: 500m
       memory: 512Mi
   ```

3. Implement proper health checks:
   ```yaml
   livenessProbe:
     httpGet:
       path: /health
       port: 3000
     initialDelaySeconds: 30
     periodSeconds: 10
   readinessProbe:
     httpGet:
       path: /health
       port: 3000
     initialDelaySeconds: 5
     periodSeconds: 5
   ```

4. Ensure the application handles termination signals properly

### Version Compatibility

**Issue**: New version of the MCP server is incompatible with existing configuration or integrations.

**Cause**: Breaking changes in the new version.

**Solution**:
1. Read the release notes and migration guides before upgrading

2. Test the new version in a staging environment before deploying to production

3. Update configuration and integrations as needed

4. Consider using semantic versioning for your own deployments

5. Implement feature flags for backward compatibility

## Next Steps

If you're still experiencing issues after trying these solutions, consider:

1. Checking the [Debugging Guide](./debugging.md) for more advanced troubleshooting techniques
2. Reviewing the [Logs and Monitoring](./logs-monitoring.md) documentation for better visibility
3. Consulting the [API Reference](../reference/api-reference.md) for correct API usage
4. Reaching out to the community for help

For critical issues in production environments, consider engaging with commercial support options.