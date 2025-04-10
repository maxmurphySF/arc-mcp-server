# Project Generation & Scaffolding

The ARC Model Context Server (MCP) provides powerful project generation and scaffolding capabilities that allow AI models to help users create new ARC projects and components through natural language instructions.

## Overview

The Project Generation tools enable AI models to:

- Scaffold new microservices with appropriate configurations
- Generate models based on user descriptions
- Create controllers and repositories with predefined business logic
- Set up infrastructure templates for deployment
- Generate UI components and forms

These tools streamline the development process by automating the creation of boilerplate code and ensuring adherence to ARC best practices and patterns.

## How It Works

The Project Generation tools work by:

1. **Understanding Requirements**: The AI model interprets the user's natural language requirements
2. **Template Selection**: The appropriate templates are selected based on the requirements
3. **Customization**: Templates are customized with user-specific details
4. **Code Generation**: The customized templates are used to generate code
5. **Project Assembly**: The generated code is assembled into a complete project structure

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  User Req   │    │  AI Model   │    │ Generator   │    │  Templates  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │   Request        │                  │                  │
       │─────────────────►│                  │                  │
       │                  │                  │                  │
       │                  │  Generate        │                  │
       │                  │─────────────────►│                  │
       │                  │                  │                  │
       │                  │                  │   Get Templates  │
       │                  │                  │─────────────────►│
       │                  │                  │                  │
       │                  │                  │   Templates      │
       │                  │                  │◄─────────────────│
       │                  │                  │                  │
       │                  │  Generated Code  │                  │
       │                  │◄─────────────────│                  │
       │                  │                  │                  │
       │   Response       │                  │                  │
       │◄─────────────────│                  │                  │
       │                  │                  │                  │
```

## Features

### Microservice Generation

The Project Generation tools can scaffold new microservices:

```json
{
  "tool": "generateMicroservice",
  "parameters": {
    "name": "product-service",
    "description": "Service for managing product catalog and inventory",
    "features": ["crud", "search", "pagination", "versioning"],
    "entities": [
      {
        "name": "Product",
        "fields": [
          { "name": "name", "type": "string", "required": true },
          { "name": "description", "type": "string" },
          { "name": "price", "type": "number", "required": true },
          { "name": "category", "type": "string", "required": true },
          { "name": "tags", "type": "array", "items": { "type": "string" } },
          { "name": "inStock", "type": "boolean", "default": true }
        ]
      },
      {
        "name": "Category",
        "fields": [
          { "name": "name", "type": "string", "required": true },
          { "name": "description", "type": "string" },
          { "name": "parentCategory", "type": "reference", "entity": "Category" }
        ]
      }
    ]
  }
}
```

This returns information about the generated microservice:

```json
{
  "success": true,
  "serviceName": "product-service",
  "generatedFiles": [
    "product-service/package.json",
    "product-service/tsconfig.json",
    "product-service/src/index.ts",
    "product-service/src/config/index.ts",
    "product-service/src/models/Product.ts",
    "product-service/src/models/Category.ts",
    "product-service/src/controllers/ProductController.ts",
    "product-service/src/controllers/CategoryController.ts",
    "product-service/src/repositories/ProductRepository.ts",
    "product-service/src/repositories/CategoryRepository.ts",
    "product-service/src/routes/index.ts",
    "product-service/src/routes/product.routes.ts",
    "product-service/src/routes/category.routes.ts",
    "product-service/src/services/ProductService.ts",
    "product-service/src/services/CategoryService.ts",
    "product-service/Dockerfile",
    "product-service/README.md"
  ],
  "nextSteps": [
    "Navigate to the product-service directory",
    "Install dependencies with 'npm install'",
    "Start the service with 'npm start'",
    "Access the API at http://localhost:3000/api/products"
  ]
}
```

### Model Generation

The Project Generation tools can generate models based on descriptions:

```json
{
  "tool": "generateModel",
  "parameters": {
    "name": "Customer",
    "description": "Represents a customer in the e-commerce system",
    "fields": [
      { "name": "firstName", "type": "string", "required": true },
      { "name": "lastName", "type": "string", "required": true },
      { "name": "email", "type": "string", "required": true, "unique": true },
      { "name": "phone", "type": "string" },
      { "name": "addresses", "type": "array", "items": { "type": "reference", "entity": "Address" } },
      { "name": "orders", "type": "array", "items": { "type": "reference", "entity": "Order" } },
      { "name": "createdAt", "type": "date", "default": "now()" },
      { "name": "updatedAt", "type": "date", "default": "now()" }
    ],
    "validations": [
      { "field": "email", "type": "email" },
      { "field": "phone", "type": "pattern", "pattern": "^\\+?[0-9]{10,15}$" }
    ],
    "indexes": [
      { "fields": ["email"], "unique": true },
      { "fields": ["lastName", "firstName"] }
    ]
  }
}
```

This returns the generated model:

```json
{
  "success": true,
  "modelName": "Customer",
  "generatedFiles": [
    "src/models/Customer.ts",
    "src/repositories/CustomerRepository.ts",
    "src/validators/CustomerValidator.ts"
  ],
  "modelCode": "import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';\nimport { Address } from './Address';\nimport { Order } from './Order';\n\n@Entity()\n@Index(['lastName', 'firstName'])\nexport class Customer {\n  @PrimaryGeneratedColumn('uuid')\n  id: string;\n\n  @Column()\n  firstName: string;\n\n  @Column()\n  lastName: string;\n\n  @Column({ unique: true })\n  @Index()\n  email: string;\n\n  @Column({ nullable: true })\n  phone: string;\n\n  @OneToMany(() => Address, address => address.customer)\n  addresses: Address[];\n\n  @OneToMany(() => Order, order => order.customer)\n  orders: Order[];\n\n  @CreateDateColumn()\n  createdAt: Date;\n\n  @UpdateDateColumn()\n  updatedAt: Date;\n}\n"
}
```

### Controller Generation

The Project Generation tools can create controllers with predefined business logic:

```json
{
  "tool": "generateController",
  "parameters": {
    "name": "OrderController",
    "entity": "Order",
    "operations": ["create", "findAll", "findById", "update", "delete"],
    "customOperations": [
      {
        "name": "findByCustomer",
        "method": "GET",
        "path": "/customer/:customerId",
        "description": "Find all orders for a specific customer",
        "parameters": [
          { "name": "customerId", "type": "string", "required": true, "in": "path" },
          { "name": "status", "type": "string", "required": false, "in": "query" },
          { "name": "page", "type": "number", "required": false, "in": "query", "default": 1 },
          { "name": "limit", "type": "number", "required": false, "in": "query", "default": 10 }
        ]
      },
      {
        "name": "updateStatus",
        "method": "PATCH",
        "path": "/:id/status",
        "description": "Update the status of an order",
        "parameters": [
          { "name": "id", "type": "string", "required": true, "in": "path" },
          { "name": "status", "type": "string", "required": true, "in": "body" }
        ]
      }
    ]
  }
}
```

This returns the generated controller:

```json
{
  "success": true,
  "controllerName": "OrderController",
  "generatedFiles": [
    "src/controllers/OrderController.ts",
    "src/routes/order.routes.ts"
  ],
  "controllerCode": "import { Request, Response } from 'express';\nimport { OrderService } from '../services/OrderService';\n\nexport class OrderController {\n  private orderService: OrderService;\n\n  constructor() {\n    this.orderService = new OrderService();\n  }\n\n  async create(req: Request, res: Response): Promise<Response> {\n    try {\n      const order = await this.orderService.create(req.body);\n      return res.status(201).json(order);\n    } catch (error) {\n      return res.status(400).json({ message: error.message });\n    }\n  }\n\n  async findAll(req: Request, res: Response): Promise<Response> {\n    const page = parseInt(req.query.page as string) || 1;\n    const limit = parseInt(req.query.limit as string) || 10;\n    const orders = await this.orderService.findAll(page, limit);\n    return res.json(orders);\n  }\n\n  async findById(req: Request, res: Response): Promise<Response> {\n    try {\n      const order = await this.orderService.findById(req.params.id);\n      if (!order) {\n        return res.status(404).json({ message: 'Order not found' });\n      }\n      return res.json(order);\n    } catch (error) {\n      return res.status(400).json({ message: error.message });\n    }\n  }\n\n  async update(req: Request, res: Response): Promise<Response> {\n    try {\n      const order = await this.orderService.update(req.params.id, req.body);\n      return res.json(order);\n    } catch (error) {\n      return res.status(400).json({ message: error.message });\n    }\n  }\n\n  async delete(req: Request, res: Response): Promise<Response> {\n    try {\n      await this.orderService.delete(req.params.id);\n      return res.status(204).send();\n    } catch (error) {\n      return res.status(400).json({ message: error.message });\n    }\n  }\n\n  async findByCustomer(req: Request, res: Response): Promise<Response> {\n    try {\n      const customerId = req.params.customerId;\n      const status = req.query.status as string;\n      const page = parseInt(req.query.page as string) || 1;\n      const limit = parseInt(req.query.limit as string) || 10;\n      \n      const orders = await this.orderService.findByCustomer(customerId, status, page, limit);\n      return res.json(orders);\n    } catch (error) {\n      return res.status(400).json({ message: error.message });\n    }\n  }\n\n  async updateStatus(req: Request, res: Response): Promise<Response> {\n    try {\n      const id = req.params.id;\n      const { status } = req.body;\n      \n      if (!status) {\n        return res.status(400).json({ message: 'Status is required' });\n      }\n      \n      const order = await this.orderService.updateStatus(id, status);\n      return res.json(order);\n    } catch (error) {\n      return res.status(400).json({ message: error.message });\n    }\n  }\n}\n"
}
```

### Infrastructure Template Generation

The Project Generation tools can set up infrastructure templates for deployment:

```json
{
  "tool": "generateInfrastructure",
  "parameters": {
    "serviceName": "product-service",
    "platform": "kubernetes",
    "components": ["deployment", "service", "configmap", "secret"],
    "resources": {
      "cpu": "100m",
      "memory": "256Mi",
      "replicas": 2
    },
    "environment": "production",
    "database": {
      "type": "postgresql",
      "name": "product-db"
    }
  }
}
```

This returns the generated infrastructure templates:

```json
{
  "success": true,
  "generatedFiles": [
    "infrastructure/kubernetes/product-service-deployment.yaml",
    "infrastructure/kubernetes/product-service-service.yaml",
    "infrastructure/kubernetes/product-service-configmap.yaml",
    "infrastructure/kubernetes/product-service-secret.yaml",
    "infrastructure/kubernetes/kustomization.yaml"
  ],
  "deploymentYaml": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: product-service\n  labels:\n    app: product-service\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: product-service\n  template:\n    metadata:\n      labels:\n        app: product-service\n    spec:\n      containers:\n      - name: product-service\n        image: ${DOCKER_REGISTRY}/product-service:${VERSION}\n        ports:\n        - containerPort: 3000\n        resources:\n          requests:\n            cpu: 100m\n            memory: 256Mi\n          limits:\n            cpu: 200m\n            memory: 512Mi\n        envFrom:\n        - configMapRef:\n            name: product-service-config\n        - secretRef:\n            name: product-service-secret\n        readinessProbe:\n          httpGet:\n            path: /health\n            port: 3000\n          initialDelaySeconds: 5\n          periodSeconds: 10\n        livenessProbe:\n          httpGet:\n            path: /health\n            port: 3000\n          initialDelaySeconds: 15\n          periodSeconds: 20\n"
}
```

## Use Cases

### Creating a New Microservice

Users can ask the AI model to create a new microservice:

```
User: "Generate a new microservice for handling user notifications"
AI: "I've generated a new microservice for handling user notifications. The service includes the following features:

- Email notification sending
- SMS notification sending
- Push notification sending
- Notification templates management
- Notification scheduling
- Delivery status tracking

The microservice includes the following components:

1. Models:
   - Notification
   - NotificationTemplate
   - NotificationChannel
   - NotificationSchedule

2. Controllers:
   - NotificationController
   - TemplateController
   - ChannelController

3. Services:
   - EmailService
   - SmsService
   - PushNotificationService
   - TemplateService

The code has been generated in the 'notification-service' directory. To get started:

1. Navigate to the notification-service directory
2. Run 'npm install' to install dependencies
3. Configure your notification providers in the .env file
4. Start the service with 'npm start'

Would you like me to explain any specific part of the implementation?"
```

### Generating a Data Model

Users can ask the AI model to generate a data model:

```
User: "Create a data model for a blog post with title, content, author, tags, and comments"
AI: "I've generated a data model for a blog post with the requested fields. Here's what I've created:

**BlogPost Model:**
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Tag } from './Tag';
import { Comment } from './Comment';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.posts)
  author: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

I've also generated the related models:

1. **Tag Model** - For categorizing posts
2. **Comment Model** - For user comments on posts

And the corresponding repository classes:

1. **BlogPostRepository** - For database operations
2. **TagRepository** - For managing tags
3. **CommentRepository** - For managing comments

The models use TypeORM for ORM functionality and include proper relationships between entities. Would you like me to explain the relationships or generate any additional components like controllers or services?"
```

### Scaffolding a Full Project

Users can ask the AI model to scaffold a complete project:

```
User: "Create a new ARC project for an e-commerce application"
AI: "I've scaffolded a new ARC project for an e-commerce application. The project includes the following microservices:

1. **User Service** - Handles user authentication and profile management
2. **Product Service** - Manages the product catalog and inventory
3. **Order Service** - Processes orders and payments
4. **Cart Service** - Manages shopping carts
5. **Review Service** - Handles product reviews and ratings

Each service includes:
- Models and database schemas
- Controllers and routes
- Service layer business logic
- Repository layer for data access
- Unit and integration tests
- Dockerfile and Kubernetes manifests

The project also includes:
- API Gateway for routing requests
- Shared libraries for common functionality
- Documentation for each service
- Development environment setup with Docker Compose

To get started with the project:

1. Navigate to the e-commerce-app directory
2. Run 'docker-compose up' to start the development environment
3. Access the API documentation at http://localhost:8080/api-docs

Would you like me to explain the architecture in more detail or focus on a specific part of the implementation?"
```

## Configuration

The Project Generation tools can be configured in the MCP configuration:

```json
{
  "tools": {
    "projectGeneration": {
      "enabled": true,
      "templatesPath": "./templates",
      "outputPath": "./generated",
      "defaultLanguage": "typescript",
      "frameworks": {
        "backend": "express",
        "frontend": "react",
        "orm": "typeorm"
      },
      "naming": {
        "modelCase": "PascalCase",
        "controllerCase": "PascalCase",
        "serviceCase": "PascalCase",
        "fileCase": "kebab-case"
      },
      "templates": {
        "microservice": "./templates/microservice",
        "model": "./templates/model",
        "controller": "./templates/controller",
        "service": "./templates/service",
        "repository": "./templates/repository",
        "infrastructure": "./templates/infrastructure"
      }
    }
  }
}
```

Configuration options include:

- **enabled**: Enable or disable project generation
- **templatesPath**: Path to the templates directory
- **outputPath**: Path where generated code will be output
- **defaultLanguage**: Default programming language for generated code
- **frameworks**: Default frameworks for different parts of the application
- **naming**: Naming conventions for different components
- **templates**: Paths to specific templates for different components

## Template Customization

The Project Generation tools use templates that can be customized to match your organization's coding standards and best practices. Templates use a combination of:

- **Handlebars**: For simple template substitution
- **EJS**: For more complex template logic
- **Custom Processors**: For advanced transformations

Template files are organized by component type and include placeholders for dynamic content:

```typescript
// Template for a TypeORM entity
import { Entity, Column, PrimaryGeneratedColumn<% if (hasCreateDate) { %>, CreateDateColumn<% } %><% if (hasUpdateDate) { %>, UpdateDateColumn<% } %> } from 'typeorm';
<% for (const relation of relations) { %>import { <%= relation.entity %> } from './<%= relation.entity %>';
<% } %>

@Entity()<% if (indexes && indexes.length > 0) { %>
<% for (const index of indexes) { %>@Index([<%= index.fields.map(f => `'${f}'`).join(', ') %>]<% if (index.unique) { %>, { unique: true }<% } %>)
<% } %><% } %>
export class <%= name %> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

<% for (const field of fields) { %>
  <% if (field.type === 'reference') { %>
  @<%= field.relation.type %>(() => <%= field.relation.entity %><% if (field.relation.inverseSide) { %>, <%= field.relation.entity.toLowerCase() %> => <%= field.relation.entity.toLowerCase() %>.<%= field.relation.inverseSide %><% } %>)
  <%= field.name %>: <%= field.relation.entity %><% if (field.relation.isArray) { %>[]<% } %>;
  <% } else { %>
  @Column(<% if (field.columnOptions) { %><%- JSON.stringify(field.columnOptions) %><% } %>)
  <%= field.name %>: <%= field.tsType %>;
  <% } %>
<% } %>

<% if (hasCreateDate) { %>
  @CreateDateColumn()
  createdAt: Date;
<% } %>

<% if (hasUpdateDate) { %>
  @UpdateDateColumn()
  updatedAt: Date;
<% } %>
}
```

## Best Practices

### Effective Code Generation

To get the most out of the Project Generation tools:

1. Provide detailed requirements for generated components
2. Customize templates to match your coding standards
3. Review and refine generated code
4. Use consistent naming conventions
5. Generate components in logical groups

### Template Management

For managing templates:

1. Version control your templates
2. Document template variables and usage
3. Create templates for common patterns
4. Test templates with various inputs
5. Update templates as your standards evolve

## Next Steps

Now that you understand the Project Generation tools, you can:

1. Learn about [Deployment Tools](./deployment-tools.md)
2. Explore the [Documentation Assistant](./documentation-assistant.md)
3. Check out [Microservices Interaction](./microservices-interaction.md)

## Related Documentation

- [Architecture Overview](../core-concepts/architecture.md)
- [ARC Integration](../core-concepts/arc-integration.md)
- [API Reference](../reference/api-reference.md)