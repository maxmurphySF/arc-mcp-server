/**
 * Tool definitions for ARC deployment assistance
 */

import { ToolDefinition } from '../models/tool';
import { DeploymentService } from '../integrations/deployment-service';

export function createDeploymentTools(): ToolDefinition[] {
  const deploymentService = new DeploymentService();
  
  return [
    {
      id: 'arc.deployment.infrastructure',
      name: 'ARC Infrastructure Generator',
      description: 'Generate infrastructure as code for deploying ARC applications to various cloud platforms',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the ARC project'
          },
          platform: {
            type: 'string',
            enum: ['aws', 'azure', 'gcp', 'kubernetes', 'docker'],
            description: 'Target deployment platform'
          },
          options: {
            type: 'object',
            properties: {
              region: {
                type: 'string',
                description: 'Cloud region for deployment'
              },
              resources: {
                type: 'object',
                properties: {
                  cpu: { type: 'string' },
                  memory: { type: 'string' },
                  storage: { type: 'string' }
                },
                description: 'Resource requirements'
              },
              database: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  version: { type: 'string' }
                },
                description: 'Database configuration'
              },
              scaling: {
                type: 'object',
                properties: {
                  minInstances: { type: 'number' },
                  maxInstances: { type: 'number' },
                  targetCpuUtilization: { type: 'number' }
                },
                description: 'Auto-scaling configuration'
              }
            },
            description: 'Additional deployment options'
          }
        },
        required: ['projectPath', 'platform']
      },
      execute: async (input) => {
        return await deploymentService.generateInfrastructure(
          input.projectPath,
          input.platform,
          input.options || {}
        );
      }
    },
    {
      id: 'arc.deployment.deploy',
      name: 'ARC Application Deployer',
      description: 'Deploy an ARC application to a specified environment',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the ARC project'
          },
          environment: {
            type: 'string',
            enum: ['development', 'staging', 'production', 'custom'],
            description: 'Target deployment environment'
          },
          options: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['aws', 'azure', 'gcp', 'kubernetes', 'docker'],
                description: 'Target deployment platform'
              },
              region: {
                type: 'string',
                description: 'Cloud region for deployment'
              },
              appName: {
                type: 'string',
                description: 'Application name for deployment'
              }
            },
            required: ['platform'],
            description: 'Additional deployment options'
          }
        },
        required: ['projectPath', 'environment', 'options']
      },
      execute: async (input) => {
        return await deploymentService.deployApplication(
          input.projectPath,
          input.environment,
          input.options
        );
      }
    },
    {
      id: 'arc.deployment.cicd',
      name: 'ARC CI/CD Configurator',
      description: 'Configure CI/CD pipelines for ARC applications',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the ARC project'
          },
          platform: {
            type: 'string',
            enum: ['github', 'gitlab', 'azure-devops', 'jenkins', 'other'],
            description: 'CI/CD platform'
          },
          options: {
            type: 'object',
            properties: {
              environments: {
                type: 'array',
                items: { type: 'string' },
                description: 'Deployment environments (e.g., dev, staging, prod)'
              },
              testStages: {
                type: 'array',
                items: { type: 'string' },
                description: 'Test stages to include (e.g., unit, integration, e2e)'
              },
              deployOnMerge: {
                type: 'boolean',
                description: 'Whether to deploy automatically on merge to main branch'
              },
              autoRollback: {
                type: 'boolean',
                description: 'Whether to roll back automatically on deployment failure'
              },
              notifications: {
                type: 'object',
                properties: {
                  email: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  slack: { type: 'string' }
                },
                description: 'Notification settings'
              }
            },
            required: ['environments'],
            description: 'CI/CD configuration options'
          }
        },
        required: ['projectPath', 'platform', 'options']
      },
      execute: async (input) => {
        return await deploymentService.configureCiCd(
          input.projectPath,
          input.platform,
          input.options
        );
      }
    }
  ];
}