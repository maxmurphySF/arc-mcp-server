# Logs and Monitoring

This document explains how to effectively use logging and monitoring with the ARC Model Context Server (MCP) to ensure optimal performance, detect issues early, and troubleshoot problems.

## Logging Configuration

The ARC MCP provides comprehensive logging capabilities that can be configured to meet your specific needs.

### Log Levels

The MCP supports the following log levels, in order of increasing verbosity:

1. **error**: Only logs errors that prevent the server from functioning correctly
2. **warn**: Logs warnings about potential issues and errors
3. **info**: Logs general information about server operations (default)
4. **debug**: Logs detailed information useful for debugging
5. **trace**: Logs extremely detailed information about internal operations

### Configuring Log Levels

You can configure the log level in your configuration file:

```json
{
  "server": {
    "logLevel": "info"
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

### Log Formats

The MCP supports multiple log formats:

1. **text**: Human-readable text format (default)
2. **json**: Structured JSON format for machine processing
3. **pretty**: Colorized text format for development

Configure the log format in your configuration file:

```json
{
  "logging": {
    "format": "json"
  }
}
```

### Log Destinations

Logs can be sent to multiple destinations:

1. **console**: Logs to standard output (default)
2. **file**: Logs to a file
3. **syslog**: Logs to syslog (Unix-like systems)
4. **http**: Logs to an HTTP endpoint

Configure log destinations in your configuration file:

```json
{
  "logging": {
    "destinations": ["console", "file"],
    "file": {
      "path": "./logs/mcp-server.log",
      "maxSize": "10m",
      "maxFiles": 5
    }
  }
}
```

### Log Rotation

For file logging, you can configure log rotation to manage disk space:

```json
{
  "logging": {
    "file": {
      "path": "./logs/mcp-server.log",
      "rotation": {
        "maxSize": "10m",
        "maxFiles": 5,
        "compress": true
      }
    }
  }
}
```

## Log Content

### Standard Log Fields

Each log entry includes the following standard fields:

- **timestamp**: The time the log was generated
- **level**: The log level (error, warn, info, debug, trace)
- **message**: The log message
- **service**: The service name ("arc-mcp-server")

### Additional Context Fields

Depending on the context, logs may include additional fields:

- **requestId**: A unique identifier for the request
- **conversationId**: The conversation ID for context-related logs
- **toolName**: The name of the tool being executed
- **userId**: The ID of the user (if available)
- **duration**: The duration of an operation in milliseconds
- **error**: Error details for error logs

### Example Log Entries

**Text Format**:
```
2023-06-15T10:30:00.000Z [INFO] Server started on port 3000
2023-06-15T10:31:15.123Z [DEBUG] Executing tool searchDocumentation with parameters {"query":"authentication service","maxResults":5}
2023-06-15T10:31:15.456Z [ERROR] Failed to connect to authentication service: Connection refused
```

**JSON Format**:
```json
{"timestamp":"2023-06-15T10:30:00.000Z","level":"info","message":"Server started on port 3000","service":"arc-mcp-server"}
{"timestamp":"2023-06-15T10:31:15.123Z","level":"debug","message":"Executing tool","service":"arc-mcp-server","requestId":"req-123","conversationId":"conv-456","toolName":"searchDocumentation","parameters":{"query":"authentication service","maxResults":5}}
{"timestamp":"2023-06-15T10:31:15.456Z","level":"error","message":"Failed to connect to authentication service","service":"arc-mcp-server","error":{"name":"ConnectionError","message":"Connection refused","stack":"..."}}  
```

## Log Analysis

### Searching Logs

For text-based logs, you can use standard command-line tools:

```bash
# Search for errors
grep "\[ERROR\]" logs/mcp-server.log

# Search for a specific tool
grep "searchDocumentation" logs/mcp-server.log

# Search for a specific conversation
grep "conv-456" logs/mcp-server.log
```

For JSON logs, use tools like `jq`:

```bash
# Search for errors
cat logs/mcp-server.log | jq 'select(.level == "error")'

# Search for a specific tool
cat logs/mcp-server.log | jq 'select(.toolName == "searchDocumentation")'

# Search for a specific conversation
cat logs/mcp-server.log | jq 'select(.conversationId == "conv-456")'
```

### Analyzing Performance

To analyze performance, look for logs with duration information:

```bash
# Find slow operations (>1000ms)
cat logs/mcp-server.log | jq 'select(.duration > 1000)'

# Calculate average duration by tool
cat logs/mcp-server.log | jq -r 'select(.toolName and .duration) | [.toolName, .duration] | @tsv' | \
  awk '{ sum[$1] += $2; count[$1]++ } END { for (tool in sum) print tool, sum[tool]/count[tool] }'
```

### Tracing Requests

To trace a request through the system, search for its request ID:

```bash
cat logs/mcp-server.log | jq 'select(.requestId == "req-123")' | jq -s 'sort_by(.timestamp)'
```

### Log Visualization

For more advanced log analysis, consider using log visualization tools:

1. **ELK Stack** (Elasticsearch, Logstash, Kibana)
2. **Graylog**
3. **Loki with Grafana**
4. **Splunk**

These tools provide powerful search, filtering, and visualization capabilities for logs.

## Monitoring

### Health Checks

The ARC MCP provides a health check endpoint that can be used to monitor the server's health:

```
GET /health
```

The health check returns a JSON response with the server's status:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 3600,
  "services": {
    "authentication": "ok",
    "repository": "ok",
    "notification": "degraded"
  },
  "memory": {
    "rss": 123456789,
    "heapTotal": 98765432,
    "heapUsed": 87654321
  }
}
```

You can configure the health check in your configuration file:

```json
{
  "health": {
    "enabled": true,
    "path": "/health",
    "includeMemory": true,
    "includeServices": true
  }
}
```

### Metrics

The ARC MCP can expose metrics in Prometheus format for monitoring:

```
GET /metrics
```

The metrics endpoint returns metrics in Prometheus format:

```
# HELP arc_mcp_requests_total Total number of requests
# TYPE arc_mcp_requests_total counter
arc_mcp_requests_total{method="GET",path="/tools"} 123
arc_mcp_requests_total{method="POST",path="/execute"} 456

# HELP arc_mcp_request_duration_seconds Request duration in seconds
# TYPE arc_mcp_request_duration_seconds histogram
arc_mcp_request_duration_seconds_bucket{method="GET",path="/tools",le="0.1"} 100
arc_mcp_request_duration_seconds_bucket{method="GET",path="/tools",le="0.5"} 120
arc_mcp_request_duration_seconds_bucket{method="GET",path="/tools",le="1"} 123
```

You can configure metrics in your configuration file:

```json
{
  "metrics": {
    "enabled": true,
    "path": "/metrics",
    "prefix": "arc_mcp_"
  }
}
```

### Available Metrics

The ARC MCP provides the following metrics:

1. **requests_total**: Total number of requests by method and path
2. **request_duration_seconds**: Request duration histogram by method and path
3. **tool_executions_total**: Total number of tool executions by tool name and status
4. **tool_execution_duration_seconds**: Tool execution duration histogram by tool name
5. **errors_total**: Total number of errors by error type
6. **memory_usage_bytes**: Memory usage (RSS, heap total, heap used)
7. **active_connections**: Number of active connections
8. **context_size_bytes**: Size of context data by conversation ID

### Monitoring Tools

You can use various monitoring tools with the ARC MCP:

1. **Prometheus**: Collect and store metrics
2. **Grafana**: Visualize metrics and create dashboards
3. **Alertmanager**: Configure alerts based on metrics
4. **Node Exporter**: Collect system-level metrics

### Example Prometheus Configuration

```yaml
scrape_configs:
  - job_name: 'arc-mcp-server'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:3000']
```

## Setting Up Alerts

### Alert Conditions

Consider setting up alerts for the following conditions:

1. **Server Unavailable**: Health check fails
2. **High Error Rate**: Error rate exceeds a threshold
3. **High Response Time**: Response time exceeds a threshold
4. **Memory Usage**: Memory usage exceeds a threshold
5. **Service Degradation**: Service health status is degraded

### Example Alertmanager Configuration

```yaml
groups:
- name: arc-mcp-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(arc_mcp_errors_total[5m]) > 0.1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate"
      description: "Error rate is {{ $value }} errors per second for the past 5 minutes"
  
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(arc_mcp_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time"
      description: "95th percentile response time is {{ $value }} seconds for the past 5 minutes"
```

## Centralized Logging

### ELK Stack Setup

To set up centralized logging with the ELK Stack:

1. **Configure Filebeat**:

```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /path/to/logs/mcp-server.log
  json.keys_under_root: true
  json.add_error_key: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

2. **Configure Logstash** (optional):

```
input {
  beats {
    port => 5044
  }
}

filter {
  if [service] == "arc-mcp-server" {
    date {
      match => ["timestamp", "ISO8601"]
      target => "@timestamp"
      remove_field => ["timestamp"]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "arc-mcp-logs-%{+YYYY.MM.dd}"
  }
}
```

3. **Configure Kibana**:
   - Create an index pattern for `arc-mcp-logs-*`
   - Create visualizations and dashboards

### Loki Setup

To set up centralized logging with Loki and Grafana:

1. **Configure Promtail**:

```yaml
scrape_configs:
  - job_name: arc-mcp-logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: arc-mcp-server
          __path__: /path/to/logs/mcp-server.log
    pipeline_stages:
      - json:
          expressions:
            timestamp: timestamp
            level: level
            message: message
            service: service
            requestId: requestId
            conversationId: conversationId
      - timestamp:
          source: timestamp
          format: RFC3339
```

2. **Configure Loki**:
   - Set up Loki to receive logs from Promtail

3. **Configure Grafana**:
   - Add Loki as a data source
   - Create visualizations and dashboards

## Best Practices

### Logging Best Practices

1. **Use Appropriate Log Levels**: Use the appropriate log level for each message
2. **Include Context**: Include relevant context in log messages
3. **Structured Logging**: Use structured logging (JSON) for machine processing
4. **Sensitive Data**: Avoid logging sensitive data
5. **Log Rotation**: Configure log rotation to manage disk space
6. **Correlation IDs**: Use request IDs and conversation IDs for correlation

### Monitoring Best Practices

1. **Health Checks**: Implement comprehensive health checks
2. **Key Metrics**: Monitor key performance metrics
3. **Alerting**: Set up alerts for critical conditions
4. **Dashboards**: Create dashboards for visualizing metrics
5. **Trend Analysis**: Monitor trends over time
6. **Capacity Planning**: Use metrics for capacity planning

## Troubleshooting with Logs

### Common Log Patterns

1. **Authentication Issues**:
   ```
   [ERROR] Authentication failed: Invalid API key
   ```

2. **Service Connection Issues**:
   ```
   [ERROR] Failed to connect to service: Connection refused
   ```

3. **Tool Execution Errors**:
   ```
   [ERROR] Tool execution failed: searchDocumentation - Invalid parameters
   ```

4. **Context Management Issues**:
   ```
   [ERROR] Failed to load context: Context not found
   ```

### Troubleshooting Steps

1. **Identify the Issue**:
   - Look for error messages in the logs
   - Check the health status
   - Monitor metrics for anomalies

2. **Gather Information**:
   - Collect relevant logs
   - Check system resources
   - Verify network connectivity

3. **Analyze the Logs**:
   - Trace the request through the system
   - Look for patterns or correlations
   - Identify the root cause

4. **Resolve the Issue**:
   - Apply the appropriate fix
   - Verify the fix resolves the issue
   - Monitor for recurrence

## Next Steps

Now that you understand how to use logging and monitoring with the ARC MCP, you can:

1. Configure logging for your environment
2. Set up monitoring and alerting
3. Create dashboards for visualizing metrics
4. Implement centralized logging

For more information, refer to:

1. [Common Issues](./common-issues.md)
2. [Debugging Guide](./debugging.md)
3. [API Reference](../reference/api-reference.md)