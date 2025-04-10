# Deployment Tools

The ARC Model Context Server (MCP) provides comprehensive deployment assistance tools that help users deploy ARC applications to various environments. This document explains how to use these tools to streamline your deployment process.

## Overview

The Deployment Tools enable AI models to:

- Generate infrastructure as code for cloud deployment
- Configure CI/CD pipelines
- Set up monitoring and logging
- Troubleshoot deployment issues
- Manage environment configurations
- Orchestrate multi-service deployments

These tools bridge the gap between development and operations, making it easier to deploy ARC applications reliably and consistently across different environments.

## How It Works

The Deployment Tools work by:

1. **Environment Analysis**: Analyzing the target deployment environment
2. **Configuration Generation**: Generating appropriate configuration files
3. **Deployment Execution**: Executing deployment commands or generating scripts
4. **Validation**: Validating the deployment for correctness
5. **Monitoring**: Setting up monitoring and alerting

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  User Req   │    │  AI Model   │    │ Deploy Tool │    │Target Env   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │   Request        │                  │                  │
       │─────────────────►│                  │                  │
       │                  │                  │                  │
       │                  │  Deploy          │                  │
       │                  │─────────────────►│                  │
       │                  │                  │                  │
       │                  │                  │   Deploy to Env  │
       │                  │                  │─────────────────►│
       │                  │                  │                  │
       │                  │                  │   Status         │
       │                  │                  │◄─────────────────│
       │                  │                  │                  │
       │                  │  Deploy Result   │                  │
       │                  │◄─────────────────│                  │
       │                  │                  │                  │
       │   Response       │                  │                  │
       │◄─────────────────│                  │                  │
       │                  │                  │                  │
```

## Features

### Infrastructure as Code Generation

The Deployment Tools can generate infrastructure as code for various cloud providers:

```json
{
  "tool": "generateInfrastructureCode",
  "parameters": {
    "application": "e-commerce-app",
    "provider": "aws",
    "services": [
      {
        "name": "user-service",
        "type": "container",
        "resources": {
          "cpu": "0.5",
          "memory": "1Gi",
          "replicas": 2
        },
        "ports": [{ "port": 8080, "protocol": "HTTP" }],
        "environment": "production"
      },
      {
        "name": "product-service",
        "type": "container",
        "resources": {
          "cpu": "1.0",
          "memory": "2Gi",
          "replicas": 3
        },
        "ports": [{ "port": 8081, "protocol": "HTTP" }],
        "environment": "production"
      },
      {
        "name": "product-db",
        "type": "database",
        "engine": "postgresql",
        "version": "13",
        "storage": "20Gi",
        "backup": true
      }
    ],
    "networking": {
      "domain": "example.com",
      "ssl": true,
      "privateSubnet": true
    }
  }
}
```

This returns the generated infrastructure code:

```json
{
  "success": true,
  "provider": "aws",
  "generatedFiles": [
    "infrastructure/aws/terraform/main.tf",
    "infrastructure/aws/terraform/variables.tf",
    "infrastructure/aws/terraform/outputs.tf",
    "infrastructure/aws/terraform/modules/ecs/main.tf",
    "infrastructure/aws/terraform/modules/rds/main.tf",
    "infrastructure/aws/terraform/modules/networking/main.tf",
    "infrastructure/aws/terraform/environments/production.tfvars"
  ],
  "mainTerraform": "provider \"aws\" {\n  region = var.aws_region\n}\n\nmodule \"networking\" {\n  source = \"./modules/networking\"\n  \n  app_name = \"e-commerce-app\"\n  environment = \"production\"\n  vpc_cidr = var.vpc_cidr\n  domain_name = \"example.com\"\n  enable_ssl = true\n  create_private_subnets = true\n}\n\nmodule \"user_service\" {\n  source = \"./modules/ecs\"\n  \n  app_name = \"e-commerce-app\"\n  service_name = \"user-service\"\n  environment = \"production\"\n  vpc_id = module.networking.vpc_id\n  subnets = module.networking.private_subnets\n  cpu = 512\n  memory = 1024\n  container_port = 8080\n  replicas = 2\n  health_check_path = \"/health\"\n  depends_on = [module.networking]\n}\n\nmodule \"product_service\" {\n  source = \"./modules/ecs\"\n  \n  app_name = \"e-commerce-app\"\n  service_name = \"product-service\"\n  environment = \"production\"\n  vpc_id = module.networking.vpc_id\n  subnets = module.networking.private_subnets\n  cpu = 1024\n  memory = 2048\n  container_port = 8081\n  replicas = 3\n  health_check_path = \"/health\"\n  depends_on = [module.networking]\n}\n\nmodule \"product_db\" {\n  source = \"./modules/rds\"\n  \n  app_name = \"e-commerce-app\"\n  db_name = \"product-db\"\n  environment = \"production\"\n  vpc_id = module.networking.vpc_id\n  subnets = module.networking.database_subnets\n  engine = \"postgresql\"\n  engine_version = \"13\"\n  allocated_storage = 20\n  backup_retention_period = 7\n  depends_on = [module.networking]\n}\n",
  "deploymentInstructions": [
    "1. Install Terraform (v1.0.0 or later)",
    "2. Navigate to the infrastructure/aws/terraform directory",
    "3. Run 'terraform init' to initialize the Terraform configuration",
    "4. Run 'terraform plan -var-file=environments/production.tfvars' to preview the changes",
    "5. Run 'terraform apply -var-file=environments/production.tfvars' to apply the changes",
    "6. After deployment, check the outputs for service endpoints and connection information"
  ]
}
```

### CI/CD Pipeline Configuration

The Deployment Tools can configure CI/CD pipelines for various platforms:

```json
{
  "tool": "generateCiCdPipeline",
  "parameters": {
    "application": "e-commerce-app",
    "platform": "github-actions",
    "services": [
      {
        "name": "user-service",
        "path": "./services/user-service",
        "buildSteps": ["npm install", "npm test", "npm run build"],
        "artifactType": "docker"
      },
      {
        "name": "product-service",
        "path": "./services/product-service",
        "buildSteps": ["npm install", "npm test", "npm run build"],
        "artifactType": "docker"
      }
    ],
    "environments": [
      {
        "name": "development",
        "triggers": ["push:develop"],
        "approvalRequired": false
      },
      {
        "name": "staging",
        "triggers": ["pull_request:main"],
        "approvalRequired": true
      },
      {
        "name": "production",
        "triggers": ["push:main"],
        "approvalRequired": true
      }
    ],
    "registry": {
      "type": "ecr",
      "url": "123456789012.dkr.ecr.us-east-1.amazonaws.com"
    }
  }
}
```

This returns the generated CI/CD pipeline configuration:

```json
{
  "success": true,
  "platform": "github-actions",
  "generatedFiles": [
    ".github/workflows/user-service-ci-cd.yml",
    ".github/workflows/product-service-ci-cd.yml",
    ".github/workflows/e-commerce-app-deployment.yml"
  ],
  "userServiceWorkflow": "name: User Service CI/CD\n\non:\n  push:\n    branches: [main, develop]\n    paths:\n      - 'services/user-service/**'\n  pull_request:\n    branches: [main]\n    paths:\n      - 'services/user-service/**'\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Set up Node.js\n        uses: actions/setup-node@v2\n        with:\n          node-version: '14'\n      - name: Install dependencies\n        run: cd services/user-service && npm install\n      - name: Run tests\n        run: cd services/user-service && npm test\n      - name: Build application\n        run: cd services/user-service && npm run build\n\n  build-and-push-image:\n    needs: build-and-test\n    runs-on: ubuntu-latest\n    if: github.event_name == 'push'\n    steps:\n      - uses: actions/checkout@v2\n      - name: Configure AWS credentials\n        uses: aws-actions/configure-aws-credentials@v1\n        with:\n          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n      - name: Login to Amazon ECR\n        id: login-ecr\n        uses: aws-actions/amazon-ecr-login@v1\n      - name: Build, tag, and push image to Amazon ECR\n        env:\n          ECR_REGISTRY: 123456789012.dkr.ecr.us-east-1.amazonaws.com\n          ECR_REPOSITORY: user-service\n          IMAGE_TAG: ${{ github.sha }}\n        run: |\n          cd services/user-service\n          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .\n          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG\n          echo \"::set-output name=image::$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG\"\n\n  deploy-development:\n    needs: build-and-push-image\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/develop'\n    steps:\n      - uses: actions/checkout@v2\n      - name: Configure AWS credentials\n        uses: aws-actions/configure-aws-credentials@v1\n        with:\n          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n      - name: Update ECS service\n        run: |\n          aws ecs update-service --cluster e-commerce-app-dev --service user-service --force-new-deployment\n\n  deploy-staging:\n    needs: build-and-push-image\n    runs-on: ubuntu-latest\n    if: github.event_name == 'pull_request' && github.base_ref == 'main'\n    environment:\n      name: staging\n      url: https://staging.example.com\n    steps:\n      - uses: actions/checkout@v2\n      - name: Configure AWS credentials\n        uses: aws-actions/configure-aws-credentials@v1\n        with:\n          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n      - name: Update ECS service\n        run: |\n          aws ecs update-service --cluster e-commerce-app-staging --service user-service --force-new-deployment\n\n  deploy-production:\n    needs: build-and-push-image\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    environment:\n      name: production\n      url: https://example.com\n    steps:\n      - uses: actions/checkout@v2\n      - name: Configure AWS credentials\n        uses: aws-actions/configure-aws-credentials@v1\n        with:\n          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n      - name: Update ECS service\n        run: |\n          aws ecs update-service --cluster e-commerce-app-prod --service user-service --force-new-deployment\n",
  "setupInstructions": [
    "1. Add the generated workflow files to your GitHub repository",
    "2. Configure the following secrets in your GitHub repository settings:",
    "   - AWS_ACCESS_KEY_ID: Your AWS access key with permissions for ECR and ECS",
    "   - AWS_SECRET_ACCESS_KEY: Your AWS secret key",
    "3. Ensure your AWS infrastructure is set up according to the workflow expectations",
    "4. Push to the develop branch to trigger the development deployment pipeline",
    "5. Create a pull request to main to trigger the staging deployment pipeline",
    "6. Merge to main to trigger the production deployment pipeline"
  ]
}
```

### Monitoring and Logging Setup

The Deployment Tools can set up monitoring and logging for your applications:

```json
{
  "tool": "setupMonitoring",
  "parameters": {
    "application": "e-commerce-app",
    "platform": "aws",
    "services": [
      "user-service",
      "product-service",
      "order-service"
    ],
    "monitoringStack": {
      "metrics": "cloudwatch",
      "logs": "cloudwatch-logs",
      "tracing": "x-ray",
      "dashboards": true,
      "alerts": true
    },
    "alertThresholds": {
      "cpu": 80,
      "memory": 80,
      "errorRate": 5,
      "responseTime": 500
    },
    "alertRecipients": [
      "ops@example.com",
      "dev@example.com"
    ]
  }
}
```

This returns the monitoring and logging configuration:

```json
{
  "success": true,
  "platform": "aws",
  "generatedFiles": [
    "infrastructure/aws/monitoring/cloudwatch-dashboards.tf",
    "infrastructure/aws/monitoring/cloudwatch-alarms.tf",
    "infrastructure/aws/monitoring/cloudwatch-logs.tf",
    "infrastructure/aws/monitoring/x-ray.tf",
    "infrastructure/aws/monitoring/variables.tf",
    "infrastructure/aws/monitoring/outputs.tf"
  ],
  "cloudwatchDashboards": "resource \"aws_cloudwatch_dashboard\" \"e_commerce_app_dashboard\" {\n  dashboard_name = \"e-commerce-app-dashboard\"\n  dashboard_body = jsonencode({\n    widgets = [\n      {\n        type = \"metric\"\n        x = 0\n        y = 0\n        width = 12\n        height = 6\n        properties = {\n          metrics = [\n            [\"AWS/ECS\", \"CPUUtilization\", \"ServiceName\", \"user-service\", \"ClusterName\", \"e-commerce-app\"],\n            [\"AWS/ECS\", \"CPUUtilization\", \"ServiceName\", \"product-service\", \"ClusterName\", \"e-commerce-app\"],\n            [\"AWS/ECS\", \"CPUUtilization\", \"ServiceName\", \"order-service\", \"ClusterName\", \"e-commerce-app\"]\n          ]\n          view = \"timeSeries\"\n          stacked = false\n          region = var.aws_region\n          title = \"CPU Utilization\"\n          period = 300\n        }\n      },\n      {\n        type = \"metric\"\n        x = 12\n        y = 0\n        width = 12\n        height = 6\n        properties = {\n          metrics = [\n            [\"AWS/ECS\", \"MemoryUtilization\", \"ServiceName\", \"user-service\", \"ClusterName\", \"e-commerce-app\"],\n            [\"AWS/ECS\", \"MemoryUtilization\", \"ServiceName\", \"product-service\", \"ClusterName\", \"e-commerce-app\"],\n            [\"AWS/ECS\", \"MemoryUtilization\", \"ServiceName\", \"order-service\", \"ClusterName\", \"e-commerce-app\"]\n          ]\n          view = \"timeSeries\"\n          stacked = false\n          region = var.aws_region\n          title = \"Memory Utilization\"\n          period = 300\n        }\n      },\n      {\n        type = \"metric\"\n        x = 0\n        y = 6\n        width = 12\n        height = 6\n        properties = {\n          metrics = [\n            [\"AWS/ApplicationELB\", \"HTTPCode_Target_5XX_Count\", \"TargetGroup\", \"user-service-tg\"],\n            [\"AWS/ApplicationELB\", \"HTTPCode_Target_5XX_Count\", \"TargetGroup\", \"product-service-tg\"],\n            [\"AWS/ApplicationELB\", \"HTTPCode_Target_5XX_Count\", \"TargetGroup\", \"order-service-tg\"]\n          ]\n          view = \"timeSeries\"\n          stacked = false\n          region = var.aws_region\n          title = \"5XX Errors\"\n          period = 300\n        }\n      },\n      {\n        type = \"metric\"\n        x = 12\n        y = 6\n        width = 12\n        height = 6\n        properties = {\n          metrics = [\n            [\"AWS/ApplicationELB\", \"TargetResponseTime\", \"TargetGroup\", \"user-service-tg\"],\n            [\"AWS/ApplicationELB\", \"TargetResponseTime\", \"TargetGroup\", \"product-service-tg\"],\n            [\"AWS/ApplicationELB\", \"TargetResponseTime\", \"TargetGroup\", \"order-service-tg\"]\n          ]\n          view = \"timeSeries\"\n          stacked = false\n          region = var.aws_region\n          title = \"Response Times\"\n          period = 300\n        }\n      }\n    ]\n  })\n}\n",
  "setupInstructions": [
    "1. Navigate to the infrastructure/aws/monitoring directory",
    "2. Run 'terraform init' to initialize the Terraform configuration",
    "3. Run 'terraform apply' to create the monitoring resources",
    "4. Access the CloudWatch dashboard at https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=e-commerce-app-dashboard",
    "5. Configure your services to send logs to CloudWatch Logs",
    "6. Add the X-Ray SDK to your services for distributed tracing"
  ]
}
```

### Deployment Troubleshooting

The Deployment Tools can help troubleshoot deployment issues:

```json
{
  "tool": "troubleshootDeployment",
  "parameters": {
    "application": "e-commerce-app",
    "service": "user-service",
    "environment": "production",
    "platform": "aws",
    "symptoms": ["service unavailable", "health check failing"],
    "logs": "Last 30 minutes of logs show connection timeouts to the database"
  }
}
```

This returns troubleshooting guidance:

```json
{
  "success": true,
  "diagnosis": {
    "possibleIssues": [
      {
        "issue": "Database connection issues",
        "likelihood": "high",
        "evidence": "Logs show connection timeouts to the database",
        "potentialCauses": [
          "Database instance is overloaded",
          "Security group rules blocking connections",
          "Network connectivity issues between service and database",
          "Database credentials are incorrect or expired"
        ]
      },
      {
        "issue": "Resource constraints",
        "likelihood": "medium",
        "evidence": "Health check failing could indicate the service is unable to start properly",
        "potentialCauses": [
          "Insufficient CPU or memory allocated",
          "Container is crashing due to resource limits",
          "Too many connections being established"
        ]
      },
      {
        "issue": "Misconfiguration",
        "likelihood": "medium",
        "evidence": "Service unavailable could indicate routing or configuration issues",
        "potentialCauses": [
          "Health check path is incorrect",
          "Service is listening on the wrong port",
          "Environment variables are missing or incorrect"
        ]
      }
    ]
  },
  "recommendedActions": [
    {
      "action": "Check database connectivity",
      "commands": [
        "aws rds describe-db-instances --db-instance-identifier user-service-db",
        "aws ec2 describe-security-groups --group-ids sg-12345",
        "aws ecs execute-command --cluster e-commerce-app-prod --task task-id --container user-service --command 'nc -zv user-service-db.xxxx.rds.amazonaws.com 5432'"
      ]
    },
    {
      "action": "Check service logs",
      "commands": [
        "aws logs get-log-events --log-group-name /ecs/e-commerce-app/user-service --log-stream-name stream-id --limit 100"
      ]
    },
    {
      "action": "Check service configuration",
      "commands": [
        "aws ecs describe-services --cluster e-commerce-app-prod --services user-service",
        "aws ecs describe-task-definition --task-definition user-service:latest"
      ]
    },
    {
      "action": "Check resource utilization",
      "commands": [
        "aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization --dimensions Name=ServiceName,Value=user-service Name=ClusterName,Value=e-commerce-app-prod --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 60 --statistics Average",
        "aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name MemoryUtilization --dimensions Name=ServiceName,Value=user-service Name=ClusterName,Value=e-commerce-app-prod --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 60 --statistics Average"
      ]
    }
  ],
  "potentialFixes": [
    {
      "issue": "Database connection issues",
      "fixes": [
        "Update security group rules to allow traffic from the service to the database",
        "Check and update database credentials in the service's environment variables or secrets",
        "Increase database instance size if it's overloaded",
        "Implement connection pooling to manage database connections efficiently"
      ]
    },
    {
      "issue": "Resource constraints",
      "fixes": [
        "Increase CPU and memory allocation for the service",
        "Optimize the application to use fewer resources",
        "Implement auto-scaling to handle varying loads",
        "Add connection timeout and retry logic to handle temporary issues"
      ]
    },
    {
      "issue": "Misconfiguration",
      "fixes": [
        "Verify the health check path and update if necessary",
        "Ensure the service is listening on the expected port",
        "Check environment variables and update as needed",
        "Verify network configuration and routing rules"
      ]
    }
  ]
}
```

## Use Cases

### Cloud Deployment

Users can ask the AI model to help deploy an application to the cloud:

```
User: "Help me deploy my ARC application to AWS"
AI: "I'll help you deploy your ARC application to AWS. Let's break this down into steps:

1. First, I've generated AWS infrastructure as code using Terraform. The code includes:
   - ECS cluster for container orchestration
   - ECR repositories for your Docker images
   - RDS database for persistent storage
   - VPC with public and private subnets
   - Load balancer and target groups
   - CloudWatch for monitoring and logging

2. I've also created a CI/CD pipeline using GitHub Actions that will:
   - Build and test your application
   - Create Docker images
   - Push images to ECR
   - Deploy to ECS
   - Run post-deployment tests

3. For monitoring, I've set up:
   - CloudWatch dashboards for service metrics
   - Alarms for critical thresholds
   - Log groups for centralized logging
   - X-Ray for distributed tracing

The generated files are in the following locations:
- Infrastructure code: infrastructure/aws/terraform/
- CI/CD pipeline: .github/workflows/
- Monitoring configuration: infrastructure/aws/monitoring/

To deploy your application:
1. Navigate to the infrastructure/aws/terraform directory
2. Run 'terraform init' to initialize Terraform
3. Run 'terraform apply' to create the AWS resources
4. Push your code to GitHub to trigger the CI/CD pipeline

Would you like me to explain any specific part of the deployment in more detail?"
```

### CI/CD Pipeline Setup

Users can ask the AI model to set up a CI/CD pipeline:

```
User: "Set up a CI/CD pipeline for my ARC microservices"
AI: "I've set up a CI/CD pipeline for your ARC microservices using GitHub Actions. The pipeline includes the following stages:

1. **Build and Test**:
   - Runs on every push and pull request
   - Installs dependencies
   - Runs unit and integration tests
   - Builds the application

2. **Security Scan**:
   - Scans dependencies for vulnerabilities
   - Performs static code analysis
   - Checks for secrets in code

3. **Build and Push Docker Images**:
   - Builds Docker images for each microservice
   - Tags images with the commit SHA
   - Pushes images to your container registry

4. **Deploy to Development**:
   - Automatically deploys to the development environment on pushes to the develop branch
   - Runs smoke tests after deployment

5. **Deploy to Staging**:
   - Requires manual approval
   - Deploys to the staging environment
   - Runs end-to-end tests

6.