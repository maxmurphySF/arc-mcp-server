/**
 * Tool definitions for ARC project and component generation
 */

import { ToolDefinition } from '../models/tool';
import { ProjectGeneratorService } from '../integrations/project-generator-service';

export function createGeneratorTools(): ToolDefinition[] {
  const generatorService = new ProjectGeneratorService();
  
  return [
    {
      id: 'arc.generator.microservice',
      name: 'ARC Microservice Generator',
      description: 'Generate scaffolding for a new ARC microservice including models, controllers, and repositories',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the microservice'
          },
          description: {
            type: 'string',
            description: 'Description of the microservice functionality'
          },
          features: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['authentication', 'authorization', 'database', 'caching', 'messaging', 'notification', 'api', 'healthcheck']
            },
            description: 'List of features to include in the microservice'
          },
          models: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                properties: { type: 'object' },
                relations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      type: { 
                        type: 'string',
                        enum: ['hasOne', 'hasMany', 'belongsTo', 'hasAndBelongsToMany']
                      },
                      model: { type: 'string' }
                    }
                  }
                }
              }
            },
            description: 'Data models to generate'
          },
          outputDir: {
            type: 'string',
            description: 'Directory where the project should be generated',
            default: './generated'
          }
        },
        required: ['name', 'features']
      },
      execute: async (input) => {
        return await generatorService.generateMicroservice(
          input.name,
          input.description || '',
          input.features,
          input.models || [],
          input.outputDir || './generated'
        );
      }
    },
    {
      id: 'arc.generator.model',
      name: 'ARC Model Generator',
      description: 'Generate a new data model for an existing ARC project',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the existing ARC project'
          },
          name: {
            type: 'string',
            description: 'Name of the model'
          },
          properties: {
            type: 'object',
            description: 'Model properties as key-value pairs (name: type)'
          },
          relations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { 
                  type: 'string',
                  enum: ['hasOne', 'hasMany', 'belongsTo', 'hasAndBelongsToMany']
                },
                model: { type: 'string' }
              }
            },
            description: 'Relationships to other models'
          }
        },
        required: ['projectPath', 'name', 'properties']
      },
      execute: async (input) => {
        return await generatorService.generateModel(
          input.projectPath,
          input.name,
          input.properties,
          input.relations || []
        );
      }
    },
    {
      id: 'arc.generator.controller',
      name: 'ARC Controller Generator',
      description: 'Generate a new controller for an existing ARC project',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the existing ARC project'
          },
          name: {
            type: 'string',
            description: 'Name of the controller'
          },
          modelName: {
            type: 'string',
            description: 'Name of the model this controller will manage'
          },
          operations: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['create', 'read', 'update', 'delete', 'count', 'findById']
            },
            description: 'CRUD operations to include in the controller',
            default: ['create', 'read', 'update', 'delete']
          }
        },
        required: ['projectPath', 'name', 'modelName']
      },
      execute: async (input) => {
        return await generatorService.generateController(
          input.projectPath,
          input.name,
          input.modelName,
          input.operations || ['create', 'read', 'update', 'delete']
        );
      }
    }
  ];
}