/**
 * Tool definitions for ARC API microservices
 */

import { ToolDefinition } from '../models/tool';
import { AuthenticationService } from '../integrations/authentication-service';
import { NotificationService } from '../integrations/notification-service';

export function createApiTools(): ToolDefinition[] {
  return [
    {
      id: 'arc.api.authentication',
      name: 'Authentication Service',
      description: 'Manage authentication and authorization for ARC applications',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['login', 'logout', 'refreshToken', 'verifyToken'],
            description: 'The authentication action to perform'
          },
          credentials: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' }
            }
          },
          token: { type: 'string' }
        },
        required: ['action']
      },
      execute: async (input) => {
        const authService = new AuthenticationService();
        
        switch (input.action) {
          case 'login':
            return await authService.login(input.credentials);
          case 'logout':
            return await authService.logout(input.token);
          case 'refreshToken':
            return await authService.refreshToken(input.token);
          case 'verifyToken':
            return await authService.verifyToken(input.token);
          default:
            throw new Error(`Unknown action: ${input.action}`);
        }
      }
    },
    {
      id: 'arc.api.notification',
      name: 'Notification Service',
      description: 'Send notifications across multiple channels in ARC applications',
      version: '1.0.0',
      parameters: {
        type: 'object',
        properties: {
          channel: {
            type: 'string',
            enum: ['email', 'sms', 'push', 'in-app'],
            description: 'The notification channel to use'
          },
          recipient: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' },
          data: { type: 'object' }
        },
        required: ['channel', 'recipient']
      },
      execute: async (input) => {
        const notificationService = new NotificationService();
        return await notificationService.sendNotification(
          input.channel,
          input.recipient,
          input.subject,
          input.body,
          input.data
        );
      }
    }
    // Additional ARC API microservices as tools can be added here
  ];
}