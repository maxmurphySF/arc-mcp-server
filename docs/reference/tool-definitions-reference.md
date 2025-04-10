# Tool Definitions Reference

This document provides a comprehensive reference for the tools available in the ARC Model Context Server (MCP).

## Tool Overview

The ARC MCP provides a set of tools that AI models can use to interact with the ARC framework. Each tool has a name, description, and a set of parameters that define its behavior.

## Tool Structure

Each tool definition has the following structure:

```json
{
  "name": "toolName",
  "description": "Tool description",
  "parameters": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Parameter description"
      },
      "param2": {
        "type": "integer",
        "description": "Parameter description",
        "default": 5
      }
    },
    "required": ["param1"]
  }
}
```

## Available Tools

### Documentation Tools

#### searchDocumentation

Searches the ARC documentation for the provided query.

**Parameters**:

```json
{
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
```

**Example**:

```json
{
  "toolName": "searchDocumentation",
  "parameters": {
    "query": "authentication service",
    "maxResults": 5
  }
}
```

**Response**:

```json
{
  "matches": [
    {
      "title": "Authentication Service Integration",
      "path": "docs/implementation/authentication-service.md",
      "snippet": "The authentication service provides secure access to ARC resources..."
    },
    // Additional matches...
  ]
}
```

#### getDocumentation

Returns the documentation for the specified path.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "The path to the documentation file"
    }
  },
  "required": ["path"]
}
```

**Example**:

```json
{
  "toolName": "getDocumentation",
  "parameters": {
    "path": "docs/implementation/authentication-service.md"
  }
}
```

**Response**:

```json
{
  "content": "# Authentication Service Integration\n\nThe authentication service provides secure access to ARC resources...\n"
}
```

### Repository Tools

#### listRepositories

Lists the available repositories.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "maxResults": {
      "type": "integer",
      "description": "Maximum number of results to return",
      "default": 10
    },
    "filter": {
      "type": "string",
      "description": "Filter repositories by name"
    }
  }
}
```

**Example**:

```json
{
  "toolName": "listRepositories",
  "parameters": {
    "maxResults": 5,
    "filter": "arc"
  }
}
```

**Response**:

```json
{
  "repositories": [
    {
      "id": "repo-123",
      "name": "arc-core",
      "description": "ARC Core Framework",
      "url": "https://github.com/arc/arc-core"
    },
    // Additional repositories...
  ]
}
```

#### getRepository

Returns information about a repository.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "repositoryId": {
      "type": "string",
      "description": "The repository ID"
    }
  },
  "required": ["repositoryId"]
}
```

**Example**:

```json
{
  "toolName": "getRepository",
  "parameters": {
    "repositoryId": "repo-123"
  }
}
```

**Response**:

```json
{
  "repository": {
    "id": "repo-123",
    "name": "arc-core",
    "description": "ARC Core Framework",
    "url": "https://github.com/arc/arc-core",
    "branches": [
      "main",
      "develop"
    ],
    "tags": [
      "v1.0.0",
      "v1.1.0"
    ]
  }
}
```

#### listFiles

Lists the files in a repository.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "repositoryId": {
      "type": "string",
      "description": "The repository ID"
    },
    "path": {
      "type": "string",
      "description": "The path to list files from",
      "default": "/"
    },
    "recursive": {
      "type": "boolean",
      "description": "Whether to list files recursively",
      "default": false
    }
  },
  "required": ["repositoryId"]
}
```

**Example**:

```json
{
  "toolName": "listFiles",
  "parameters": {
    "repositoryId": "repo-123",
    "path": "/src",
    "recursive": true
  }
}
```

**Response**:

```json
{
  "files": [
    {
      "name": "index.ts",
      "path": "/src/index.ts",
      "type": "file",
      "size": 1024
    },
    {
      "name": "models",
      "path": "/src/models",
      "type": "directory"
    },
    // Additional files...
  ]
}
```

#### getFile

Returns the contents of a file.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "repositoryId": {
      "type": "string",
      "description": "The repository ID"
    },
    "path": {
      "type": "string",
      "description": "The path to the file"
    }
  },
  "required": ["repositoryId", "path"]
}
```

**Example**:

```json
{
  "toolName": "getFile",
  "parameters": {
    "repositoryId": "repo-123",
    "path": "/src/index.ts"
  }
}
```

**Response**:

```json
{
  "content": "import { Server } from './server';\n\nconst server = new Server();\nserver.start();\n"
}
```

### Project Generation Tools

#### generateProject

Generates a new ARC project.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The project name"
    },
    "description": {
      "type": "string",
      "description": "The project description"
    },
    "template": {
      "type": "string",
      "description": "The project template",
      "enum": ["basic", "microservices", "fullstack"],
      "default": "basic"
    },
    "options": {
      "type": "object",
      "description": "Additional options for the project"
    }
  },
  "required": ["name"]
}
```

**Example**:

```json
{
  "toolName": "generateProject",
  "parameters": {
    "name": "my-arc-project",
    "description": "My ARC Project",
    "template": "microservices",
    "options": {
      "services": ["authentication", "repository", "notification"]
    }
  }
}
```

**Response**:

```json
{
  "projectId": "proj-123",
  "name": "my-arc-project",
  "description": "My ARC Project",
  "template": "microservices",
  "repositoryUrl": "https://github.com/arc/my-arc-project"
}
```

#### getProjectStatus

Returns the status of a project generation.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "projectId": {
      "type": "string",
      "description": "The project ID"
    }
  },
  "required": ["projectId"]
}
```

**Example**:

```json
{
  "toolName": "getProjectStatus",
  "parameters": {
    "projectId": "proj-123"
  }
}
```

**Response**:

```json
{
  "status": "completed",
  "progress": 100,
  "message": "Project generation completed",
  "repositoryUrl": "https://github.com/arc/my-arc-project"
}
```

### Deployment Tools

#### deployProject

Deploys a project to the specified environment.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "projectId": {
      "type": "string",
      "description": "The project ID"
    },
    "environment": {
      "type": "string",
      "description": "The deployment environment",
      "enum": ["development", "staging", "production"],
      "default": "development"
    },
    "options": {
      "type": "object",
      "description": "Additional options for the deployment"
    }
  },
  "required": ["projectId"]
}
```

**Example**:

```json
{
  "toolName": "deployProject",
  "parameters": {
    "projectId": "proj-123",
    "environment": "staging",
    "options": {
      "replicas": 3,
      "autoscaling": true
    }
  }
}
```

**Response**:

```json
{
  "deploymentId": "deploy-123",
  "projectId": "proj-123",
  "environment": "staging",
  "status": "in-progress"
}
```

#### getDeploymentStatus

Returns the status of a deployment.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "deploymentId": {
      "type": "string",
      "description": "The deployment ID"
    }
  },
  "required": ["deploymentId"]
}
```

**Example**:

```json
{
  "toolName": "getDeploymentStatus",
  "parameters": {
    "deploymentId": "deploy-123"
  }
}
```

**Response**:

```json
{
  "deploymentId": "deploy-123",
  "projectId": "proj-123",
  "environment": "staging",
  "status": "completed",
  "url": "https://staging.my-arc-project.arc.dev",
  "logs": [
    "Deploying project...",
    "Creating Kubernetes resources...",
    "Deployment completed"
  ]
}
```

### Microservices Interaction Tools

#### listServices

Lists the available microservices.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "projectId": {
      "type": "string",
      "description": "The project ID"
    },
    "environment": {
      "type": "string",
      "description": "The environment",
      "enum": ["development", "staging", "production"],
      "default": "development"
    }
  },
  "required": ["projectId"]
}
```

**Example**:

```json
{
  "toolName": "listServices",
  "parameters": {
    "projectId": "proj-123",
    "environment": "staging"
  }
}
```

**Response**:

```json
{
  "services": [
    {
      "id": "svc-123",
      "name": "authentication",
      "status": "running",
      "url": "https://auth.staging.my-arc-project.arc.dev"
    },
    {
      "id": "svc-456",
      "name": "repository",
      "status": "running",
      "url": "https://repo.staging.my-arc-project.arc.dev"
    },
    {
      "id": "svc-789",
      "name": "notification",
      "status": "running",
      "url": "https://notification.staging.my-arc-project.arc.dev"
    }
  ]
}
```

#### getServiceStatus

Returns the status of a microservice.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "serviceId": {
      "type": "string",
      "description": "The service ID"
    }
  },
  "required": ["serviceId"]
}
```

**Example**:

```json
{
  "toolName": "getServiceStatus",
  "parameters": {
    "serviceId": "svc-123"
  }
}
```

**Response**:

```json
{
  "id": "svc-123",
  "name": "authentication",
  "status": "running",
  "url": "https://auth.staging.my-arc-project.arc.dev",
  "health": {
    "status": "ok",
    "uptime": 3600,
    "memory": {
      "used": 123456789,
      "total": 987654321
    },
    "cpu": {
      "usage": 0.1
    }
  }
}
```

#### callService

Calls a microservice endpoint.

**Parameters**:

```json
{
  "type": "object",
  "properties": {
    "serviceId": {
      "type": "string",
      "description": "The service ID"
    },
    "method": {
      "type": "string",
      "description": "The HTTP method",
      "enum": ["GET", "POST", "PUT", "DELETE"],
      "default": "GET"
    },
    "path": {
      "type": "string",
      "description": "The endpoint path"
    },
    "headers": {
      "type": "object",
      "description": "The request headers"
    },
    "body": {
      "type": "object",
      "description": "The request body"
    }
  },
  "required": ["serviceId", "path"]
}
```

**Example**:

```json
{
  "toolName": "callService",
  "parameters": {
    "serviceId": "svc-123",
    "method": "POST",
    "path": "/api/v1/authenticate",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "username": "john.doe",
      "password": "password123"
    }
  }
}
```

**Response**:

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Tool Execution

To execute a tool, send a POST request to the `/execute` endpoint with the tool name and parameters:

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

## Tool Errors

If a tool execution fails, the response will include an error object:

```json
{
  "error": {
    "code": "TOOL_EXECUTION_FAILED",
    "message": "Failed to execute tool: searchDocumentation",
    "details": {
      "cause": "Invalid parameters: query is required"
    }
  }
}
```

## Next Steps

Now that you understand the available tools in the ARC MCP, you can:

1. [Integrate with AI models](../implementation/ai-model-integration.md)
2. [Develop custom tools](../implementation/custom-tool-development.md)
3. [Implement security best practices](../implementation/security-best-practices.md)

For more information, refer to:

1. [API Reference](./api-reference.md)
2. [Configuration Reference](./configuration-reference.md)
3. [Logs and Monitoring](../troubleshooting/logs-monitoring.md)