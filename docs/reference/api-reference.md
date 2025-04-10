# API Reference

This document provides a comprehensive reference for the ARC Model Context Server (MCP) API.

## API Overview

The ARC MCP API is a RESTful API that allows AI models to interact with the ARC framework. The API provides endpoints for:

1. **Tool Discovery**: Discover available tools
2. **Tool Execution**: Execute tools
3. **Context Management**: Manage conversation context
4. **Authentication**: Authenticate requests
5. **Health Checks**: Check server health

## Base URL

All API endpoints are relative to the base URL of your MCP server:

```
http://localhost:3000/api/v1
```

You can configure the host, port, and base path in your configuration file.

## Authentication

All API requests require authentication using an API key. You can include the API key in the request using one of the following methods:

### Bearer Token (Recommended)

```
Authorization: Bearer YOUR_API_KEY
```

### Query Parameter

```
?api_key=YOUR_API_KEY
```

## API Endpoints

### Tool Discovery

#### GET /tools

Returns a list of available tools.

**Request**:

```http
GET /api/v1/tools HTTP/1.1
Authorization: Bearer YOUR_API_KEY
```

**Response**:

```json
{
  "tools": [
    {
      "name": "searchDocumentation",
      "description": "Search the ARC documentation",
      "parameters": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "The search query"
          },
          "maxResults": {
            "type": "integer",
            "description": "Maximum number of results to return",
            "default": 5
          }
        },
        "required": ["query"]
      }
    },
    // Additional tools...
  ]
}
```

### Tool Execution

#### POST /execute

Executes a tool with the provided parameters.

**Request**:

```http
POST /api/v1/execute HTTP/1.1
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "toolName": "searchDocumentation",
  "parameters": {
    "query": "authentication service",
    "maxResults": 5
  },
  "conversationId": "conv-123"
}
```

**Response**:

```json
{
  "result": {
    "matches": [
      {
        "title": "Authentication Service Integration",
        "path": "docs/implementation/authentication-service.md",
        "snippet": "The authentication service provides secure access to ARC resources..."
      },
      // Additional matches...
    ]
  }
}
```

### Context Management

#### POST /context

Creates or updates the context for a conversation.

**Request**:

```http
POST /api/v1/context HTTP/1.1
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "conversationId": "conv-123",
  "context": {
    "user": {
      "id": "user-456",
      "name": "John Doe"
    },
    "project": {
      "id": "proj-789",
      "name": "My ARC Project"
    },
    // Additional context...
  }
}
```

**Response**:

```json
{
  "success": true
}
```

#### GET /context/{conversationId}

Returns the context for a conversation.

**Request**:

```http
GET /api/v1/context/conv-123 HTTP/1.1
Authorization: Bearer YOUR_API_KEY
```

**Response**:

```json
{
  "context": {
    "user": {
      "id": "user-456",
      "name": "John Doe"
    },
    "project": {
      "id": "proj-789",
      "name": "My ARC Project"
    },
    // Additional context...
  }
}
```

### Health Checks

#### GET /health

Returns the health status of the server.

**Request**:

```http
GET /api/v1/health HTTP/1.1
```

**Response**:

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

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request. In case of an error, the response body will contain additional information about the error.

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid parameters provided",
    "details": {
      "query": "Query is required"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_PARAMETERS` | Invalid parameters provided |
| `TOOL_NOT_FOUND` | Tool not found |
| `TOOL_EXECUTION_FAILED` | Tool execution failed |
| `CONTEXT_NOT_FOUND` | Context not found |
| `UNAUTHORIZED` | Unauthorized request |
| `INTERNAL_SERVER_ERROR` | Internal server error |

## Rate Limiting

The API implements rate limiting to prevent abuse. The rate limits are as follows:

- **Tool Discovery**: 100 requests per minute
- **Tool Execution**: 50 requests per minute
- **Context Management**: 100 requests per minute

If you exceed the rate limit, you will receive a `429 Too Many Requests` response with a `Retry-After` header indicating how long to wait before making another request.

## Pagination

Endpoints that return lists of items support pagination using the `limit` and `offset` query parameters:

```
GET /api/v1/tools?limit=10&offset=0
```

The response will include pagination information:

```json
{
  "tools": [...],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "next": "/api/v1/tools?limit=10&offset=10",
    "previous": null
  }
}
```

## Versioning

The API is versioned using the URL path. The current version is `v1`. When a new version is released, the old version will be maintained for a period of time to allow for a smooth transition.

## Next Steps

Now that you understand the ARC MCP API, you can:

1. [Integrate with AI models](../implementation/ai-model-integration.md)
2. [Develop custom tools](../implementation/custom-tool-development.md)
3. [Implement security best practices](../implementation/security-best-practices.md)

For troubleshooting, refer to:

1. [Common Issues](../troubleshooting/common-issues.md)
2. [Debugging Guide](../troubleshooting/debugging.md)
3. [Logs and Monitoring](../troubleshooting/logs-monitoring.md)