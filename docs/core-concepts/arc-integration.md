# Integration with ARC

This document explains how the Model Context Server (MCP) integrates with the ARC framework, allowing AI models to interact with ARC's microservices, components, and features.

## Overview

The ARC Integration Layer is a critical component of the MCP that connects AI models to the ARC framework. It translates between the Model Context Protocol and the specific APIs and interfaces of ARC's microservices and components.

```
┌─────────────────┐      ┌─────────────────────────────────┐      ┌─────────────────┐
│                 │      │                                 │      │                 │
│    AI Models    │◄────►│    ARC Integration Layer        │◄────►│  ARC Framework  │
│  (Claude, GPT)  │      │                                 │      │                 │
│                 │      │                                 │      │                 │
└─────────────────┘      └─────────────────────────────────┘      └─────────────────┘
```

## Integration Components

The ARC Integration Layer consists of several key components:

### 1. Service Connectors

Service connectors provide standardized interfaces to ARC's microservices. Each connector:

- Handles authentication with the service
- Translates MCP requests into service-specific API calls
- Transforms service responses into MCP-compatible formats
- Manages error handling and retries

The MCP includes connectors for the following ARC services:

#### Authentication Service

Connects to ARC's Authentication Service to:

- Verify user credentials
- Manage user sessions
- Handle authorization and permissions
- Implement single sign-on (SSO) functionality

#### Repository Service

Connects to ARC's Repository Service to:

- Query data from repositories
- Create, update, and delete records
- Execute complex queries
- Handle data validation

#### Notification Service

Connects to ARC's Notification Service to:

- Send notifications to users
- Manage notification preferences
- Schedule notifications
- Track notification delivery and read status

#### Deployment Service

Connects to ARC's Deployment Service to:

- Deploy applications to various environments
- Manage deployment configurations
- Monitor deployment status
- Roll back deployments if necessary

#### Project Generator Service

Connects to ARC's Project Generator Service to:

- Create new ARC projects
- Generate microservices
- Scaffold components
- Configure project settings

#### Documentation Service

Connects to ARC's Documentation Service to:

- Search documentation
- Retrieve documentation content
- Access code examples
- Get contextual help

### 2. Data Transformation Layer

The Data Transformation Layer handles the conversion between MCP data formats and ARC data formats. It includes:

- **Schema Mappers**: Map between MCP schemas and ARC schemas
- **Type Converters**: Convert between different data types
- **Response Formatters**: Format ARC responses for AI model consumption
- **Request Parsers**: Parse AI model requests for ARC services

### 3. Configuration Manager

The Configuration Manager handles the configuration of ARC service connections. It:

- Loads connection settings from configuration files
- Manages connection pools
- Handles service discovery
- Implements circuit breakers for fault tolerance

## Integration Patterns

The ARC Integration Layer uses several integration patterns:

### Direct API Integration

For synchronous operations, the MCP directly calls ARC service APIs:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MCP Server │    │Data Transform│    │ARC Service  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       │   Request        │                  │
       │─────────────────►│                  │
       │                  │                  │
       │                  │  API Call        │
       │                  │─────────────────►│
       │                  │                  │
       │                  │   Response       │
       │                  │◄─────────────────│
       │                  │                  │
       │   Response       │                  │
       │◄─────────────────│                  │
       │                  │                  │
```

### Message Queue Integration

For asynchronous operations, the MCP uses message queues:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MCP Server │    │Message Queue│    │ARC Service  │    │  Callback   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │   Request        │                  │                  │
       │─────────────────►│                  │                  │
       │                  │                  │                  │
       │                  │  Message         │                  │
       │                  │─────────────────►│                  │
       │                  │                  │                  │
       │                  │                  │   Result         │
       │                  │                  │─────────────────►│
       │                  │                  │                  │
       │                  │                  │                  │
       │   Notification   │                  │                  │
       │◄─────────────────────────────────────────────────────────────────│
       │                  │                  │                  │
```

### Event-Driven Integration

For event-based operations, the MCP subscribes to ARC events:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MCP Server │    │Event Bus    │    │ARC Service  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       │   Subscribe      │                  │
       │─────────────────►│                  │
       │                  │                  │
       │                  │                  │
       │                  │                  │
       │                  │                  │   Event
       │                  │◄─────────────────│
       │                  │                  │
       │   Event          │                  │
       │◄─────────────────│                  │
       │                  │                  │
```

## Authentication and Security

The ARC Integration Layer handles authentication and security for ARC service interactions:

### Service-to-Service Authentication

The MCP authenticates with ARC services using:

- **API Keys**: For simple authentication
- **OAuth 2.0**: For delegated authentication
- **JWT Tokens**: For secure token-based authentication
- **mTLS**: For mutual TLS authentication

### User Context Propagation

When a user is interacting with an AI model, the MCP propagates the user's context to ARC services:

- User identity
- Permissions and roles
- Tenant information (for multi-tenant deployments)
- Session information

## Error Handling

The ARC Integration Layer implements robust error handling:

- **Retries**: Automatically retry failed requests with exponential backoff
- **Circuit Breakers**: Prevent cascading failures when services are unavailable
- **Fallbacks**: Provide alternative responses when services are unavailable
- **Error Translation**: Convert ARC-specific errors to MCP-compatible formats

## Configuration

The ARC Integration Layer is configured through the MCP configuration system:

```json
{
  "arc": {
    "servicesBaseUrl": "http://localhost:8080",
    "apiVersion": "v1",
    "services": {
      "authentication": {
        "endpoint": "/auth",
        "timeout": 5000
      },
      "repository": {
        "endpoint": "/repo",
        "timeout": 10000
      },
      "notification": {
        "endpoint": "/notify",
        "timeout": 5000
      },
      "deployment": {
        "endpoint": "/deploy",
        "timeout": 30000
      },
      "projectGenerator": {
        "endpoint": "/generate",
        "timeout": 20000
      },
      "documentation": {
        "endpoint": "/docs",
        "timeout": 5000
      }
    },
    "auth": {
      "type": "apiKey",
      "apiKey": "your-api-key-here"
    }
  }
}
```

## Extending the Integration

The ARC Integration Layer can be extended to support additional ARC services or custom integrations:

1. Create a new service connector class that extends the base connector
2. Implement the required methods for the service
3. Register the connector with the integration layer
4. Add tool definitions that use the new connector

See [Custom Tool Development](../implementation/custom-tool-development.md) for more information.

## Example: Documentation Search

Here's an example of how the ARC Integration Layer handles a documentation search request:

1. The AI model receives a user query: "How does ARC's authentication service work?"
2. The AI model selects the `searchDocumentation` tool and sends a request to the MCP
3. The MCP routes the request to the Documentation Service connector
4. The connector transforms the request into an ARC Documentation Service API call
5. The Documentation Service searches for relevant documentation
6. The service returns the search results to the connector
7. The connector transforms the results into the MCP response format
8. The MCP returns the response to the AI model
9. The AI model uses the documentation to answer the user's question

## Next Steps

Now that you understand how the MCP integrates with ARC, you can:

1. Explore the [tools and features](../tools/documentation-assistant.md) available through the MCP
2. Learn about [AI model integration](../implementation/ai-model-integration.md)
3. Check out the [API Reference](../reference/api-reference.md) for detailed API documentation

## Related Documentation

- [Architecture Overview](./architecture.md)
- [Model Context Protocol](./model-context-protocol.md)
- [Configuration Guide](../getting-started/configuration.md)