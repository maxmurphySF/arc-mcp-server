/**
 * Tool definitions for ARC documentation search and retrieval
 */

import { ToolDefinition } from '../models/tool';
import { DocumentationService } from '../integrations/documentation-service';

export function createDocumentationTools(): ToolDefinition[] {
  const docService = new DocumentationService();
  
  return [{
    id: 'arc.docs.search',
    name: 'ARC Documentation Search',
    description: 'Search the ARC documentation for specific topics, concepts, or components',
    version: '1.0.0',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for ARC documentation'
        },
        category: {
          type: 'string',
          enum: ['api', 'infrastructure', 'ui', 'saas', 'all'],
          description: 'Specific category of documentation to search within',
          default: 'all'
        },
        maxResults: {
          type: 'integer',
          description: 'Maximum number of results to return',
          default: 5
        }
      },
      required: ['query']
    },
    execute: async (input) => {
      const results = await docService.search(input.query, input.category, input.maxResults);
      return {
        results,
        totalCount: results.length,
        query: input.query
      };
    }
  }];
}