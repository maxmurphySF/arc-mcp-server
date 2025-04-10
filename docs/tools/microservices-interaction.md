# Microservices Interaction

The ARC Model Context Server (MCP) provides powerful capabilities for AI models to interact with existing ARC microservices. This document explains how to use these features to query data, execute operations, trigger workflows, and test API endpoints.

## Overview

The Microservices Interaction tools enable AI models to:

- Execute operations on ARC microservices
- Query data from repositories
- Trigger workflows in business process services
- Test API endpoints
- Monitor service health and status

These tools provide a secure and standardized way for AI models to interact with your ARC ecosystem, extending their capabilities beyond static knowledge.

## Available Microservices

The ARC MCP can interact with the following core ARC microservices:

### Authentication Service

Manages user authentication, authorization, and identity:

- User registration and login
- Role and permission management
- Token validation and refresh
- Multi-factor authentication
- Single sign-on (SSO) integration

### Repository Service

Provides data access and persistence capabilities:

- CRUD operations for entities
- Complex queries with filtering and sorting
- Transaction management
- Data validation
- Event publishing for data changes

### Notification Service

Handles sending notifications across various channels:

- Email notifications
- SMS notifications
- Push notifications
- In-app notifications
- Notification templates and scheduling

### Scheduler Service

Manages scheduled tasks and recurring jobs:

- One-time scheduled tasks
- Recurring jobs with cron expressions
- Job status tracking
- Retry mechanisms
- Distributed scheduling

### Business Process Service

Orchestrates complex business workflows:

- Workflow definition and execution
- State management
- Activity tracking
- Error handling and compensation
- Process monitoring

## How It Works

The Microservices Interaction tools work by:

1. **Authentication**: The MCP authenticates with the target microservice
2. **Request Transformation**: User requests are transformed into microservice API calls
3. **Execution**: The API call is executed on the target microservice
4. **Response Processing**: The response is processed and returned to the AI model

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  User Query │    │  AI Model   │    │  MCP Server │    │ARC Service  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │   Request        │                  │                  │
       │─────────────────►│                  │                  │
       │                  │                  │                  │
       │                  │  Execute Tool    │                  │
       │                  │─────────────────►│                  │
       │                  │                  │                  │
       │                  │                  │   API Call       │
       │                  │                  │─────────────────►│
       │                  │                  │                  │
       │                  │                  │   Response       │
       │                  │                  │◄─────────────────│
       │                  │                  │                  │
       │                  │  Tool Result     │                  │
       │                  │◄─────────────────│                  │
       │                  │                  │                  │
       │   Response       │                  │                  │
       │◄─────────────────│                  │                  │
       │                  │                  │                  │
```

## Features

### Authentication Service Interaction

The MCP can interact with the Authentication Service to manage users and authentication:

```json
{
  "tool": "executeAuthOperation",
  "parameters": {
    "operation": "createUser",
    "data": {
      "username": "john.doe",
      "email": "john.doe@example.com",
      "password": "********",
      "roles": ["user"]
    }
  }
}
```

This returns the result of the operation:

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "roles": ["user"],
    "createdAt": "2023-06-15T10:30:00Z"
  }
}
```

### Repository Service Interaction

The MCP can query data from the Repository Service:

```json
{
  "tool": "queryRepository",
  "parameters": {
    "entity": "Product",
    "query": {
      "filter": {
        "category": "electronics",
        "price": { "$lt": 1000 }
      },
      "sort": { "price": "asc" },
      "limit": 5
    }
  }
}
```

This returns the query results:

```json
{
  "data": [
    {
      "id": "prod-001",
      "name": "Wireless Earbuds",
      "category": "electronics",
      "price": 79.99,
      "stock": 120
    },
    {
      "id": "prod-002",
      "name": "Bluetooth Speaker",
      "category": "electronics",
      "price": 129.99,
      "stock": 45
    },
    ...
  ],
  "total": 24,
  "page": 1,
  "pageSize": 5
}
```

### Notification Service Interaction

The MCP can send notifications using the Notification Service:

```json
{
  "tool": "sendNotification",
  "parameters": {
    "type": "email",
    "recipients": ["john.doe@example.com"],
    "template": "order-confirmation",
    "data": {
      "orderNumber": "ORD-12345",
      "orderDate": "2023-06-15",
      "totalAmount": 129.99
    }
  }
}
```

This returns the notification status:

```json
{
  "success": true,
  "notificationId": "notif-456",
  "status": "queued",
  "estimatedDelivery": "2023-06-15T10:35:00Z"
}
```

### Business Process Interaction

The MCP can trigger workflows in the Business Process Service:

```json
{
  "tool": "startWorkflow",
  "parameters": {
    "processDefinition": "order-fulfillment",
    "businessKey": "ORD-12345",
    "variables": {
      "customer": "cust-789",
      "items": [
        { "productId": "prod-001", "quantity": 2 },
        { "productId": "prod-002", "quantity": 1 }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "12345"
      }
    }
  }
}
```

This returns the workflow instance:

```json
{
  "instanceId": "wf-789",
  "processDefinition": "order-fulfillment",
  "businessKey": "ORD-12345",
  "status": "started",
  "startTime": "2023-06-15T10:40:00Z",
  "currentActivities": [
    "verify-inventory",
    "process-payment"
  ]
}
```

### API Testing

The MCP can test API endpoints directly:

```json
{
  "tool": "testApiEndpoint",
  "parameters": {
    "service": "product-service",
    "method": "GET",
    "path": "/products/prod-001",
    "headers": {
      "Accept": "application/json"
    }
  }
}
```

This returns the API response:

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "max-age=3600"
  },
  "body": {
    "id": "prod-001",
    "name": "Wireless Earbuds",
    "category": "electronics",
    "price": 79.99,
    "description": "High-quality wireless earbuds with noise cancellation",
    "specifications": {
      "batteryLife": "6 hours",
      "connectivity": "Bluetooth 5.0",
      "waterResistant": true
    }
  }
}
```

## Use Cases

### Data Exploration

Users can ask the AI model to explore data in their ARC repositories:

```
User: "Show me the top 5 products by sales in the last month"
AI: "Here are the top 5 products by sales for the last month:

1. Wireless Earbuds - 1,245 units - $99,584.55
2. Smart Watch Pro - 876 units - $218,124.24
3. Bluetooth Speaker - 743 units - $96,583.57
4. Laptop Stand - 689 units - $20,670.00
5. USB-C Hub - 612 units - $30,600.00

Would you like to see more details about any of these products or analyze the sales trends over time?"
```

### User Management

Users can manage user accounts through the AI model:

```
User: "Create a new admin user for Jane Smith with email jane.smith@example.com"
AI: "I've created a new admin user for Jane Smith. Here are the details:

Username: jane.smith
Email: jane.smith@example.com
Roles: admin
Created: June 15, 2023 at 10:30 AM

A temporary password has been generated and sent to the provided email address. Jane will be prompted to change this password on first login.

Would you like me to add any additional roles or permissions for this user?"
```

### Process Monitoring

Users can monitor business processes through the AI model:

```
User: "What's the status of order ORD-12345?"
AI: "Order ORD-12345 is currently in progress. Here's the current status:

Order placed: June 15, 2023 at 10:00 AM
Payment processed: June 15, 2023 at 10:05 AM
Current stage: Preparing for shipment
Estimated shipping date: June 16, 2023
Estimated delivery date: June 18-20, 2023

The order contains 3 items:
- 2x Wireless Earbuds
- 1x Bluetooth Speaker

All items are in stock and being prepared for shipment. Would you like me to notify you when the order ships?"
```

### Notification Management

Users can manage notifications through the AI model:

```
User: "Send a reminder to all users who haven't completed their profile"
AI: "I've sent a reminder notification to all users with incomplete profiles. Here's a summary:

Notification type: Email
Template: profile-completion-reminder
Recipients: 37 users
Status: All notifications have been queued

The notification includes a direct link to the profile completion page and mentions that completing their profile will unlock additional features. Would you like to see a list of the users who received this notification?"
```

## Configuration

The Microservices Interaction tools can be configured in the MCP configuration:

```json
{
  "tools": {
    "microservices": {
      "enabled": true,
      "services": {
        "authentication": {
          "enabled": true,
          "baseUrl": "http://auth-service:8080/api",
          "timeout": 5000,
          "allowedOperations": ["getUser", "createUser", "updateUser", "getRoles"]
        },
        "repository": {
          "enabled": true,
          "baseUrl": "http://repo-service:8080/api",
          "timeout": 10000,
          "allowedEntities": ["Product", "Order", "Customer"]
        },
        "notification": {
          "enabled": true,
          "baseUrl": "http://notification-service:8080/api",
          "timeout": 5000,
          "allowedTemplates": ["order-confirmation", "password-reset", "profile-completion-reminder"]
        },
        "businessProcess": {
          "enabled": true,
          "baseUrl": "http://process-service:8080/api",
          "timeout": 15000,
          "allowedProcesses": ["order-fulfillment", "customer-onboarding", "return-processing"]
        }
      },
      "security": {
        "authType": "serviceAccount",
        "serviceAccountId": "mcp-service",
        "serviceAccountKey": "${MCP_SERVICE_ACCOUNT_KEY}"
      }
    }
  }
}
```

Configuration options include:

- **enabled**: Enable or disable microservice interactions
- **services**: Configuration for each microservice
  - **enabled**: Enable or disable a specific service
  - **baseUrl**: Base URL for the service API
  - **timeout**: Request timeout in milliseconds
  - **allowedOperations/Entities/Templates/Processes**: Lists of allowed operations for security
- **security**: Authentication configuration for microservice access

## Security Considerations

When using the Microservices Interaction tools, consider the following security best practices:

1. **Least Privilege**: Configure the MCP with the minimum permissions needed
2. **Operation Whitelisting**: Only allow specific operations that are needed
3. **Data Filtering**: Configure data filters to prevent exposure of sensitive data
4. **Audit Logging**: Enable audit logging for all microservice interactions
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Implementation Details

The Microservices Interaction tools are implemented using:

- **Service Connectors**: Connect to each ARC microservice
- **Request Builders**: Build API requests based on tool parameters
- **Response Parsers**: Parse API responses into tool results
- **Error Handlers**: Handle and translate service errors

Each service connector implements a standard interface but has service-specific logic for interacting with its target microservice.

## Best Practices

### Effective Service Integration

To get the most out of the Microservices Interaction tools:

1. Keep service configurations up-to-date
2. Use meaningful business keys for workflows
3. Implement proper error handling in your services
4. Document your service APIs thoroughly
5. Monitor service performance and availability

### Query Optimization

When querying repositories:

1. Use specific filters to limit result sets
2. Include only the fields you need
3. Use pagination for large result sets
4. Consider caching for frequently accessed data
5. Monitor query performance

## Next Steps

Now that you understand the Microservices Interaction tools, you can:

1. Learn about [Project Generation](./project-generation.md)
2. Explore [Deployment Tools](./deployment-tools.md)
3. Check out the [Documentation Assistant](./documentation-assistant.md)

## Related Documentation

- [Architecture Overview](../core-concepts/architecture.md)
- [ARC Integration](../core-concepts/arc-integration.md)
- [API Reference](../reference/api-reference.md)