# Custom Tool Development

This document explains how to develop custom tools for the ARC Model Context Server (MCP), allowing you to extend its capabilities to meet your specific requirements.

## Overview

The ARC MCP provides a flexible framework for developing custom tools that can be used by AI models. Custom tools allow you to:

- Integrate with your organization's specific systems and services
- Implement domain-specific functionality
- Extend the capabilities of the MCP beyond the built-in tools
- Create specialized tools for your unique use cases

This guide will walk you through the process of developing, testing, and deploying custom tools for the ARC MCP.

## Tool Structure

Each tool in the ARC MCP consists of the following components:

### 1. Tool Definition

The tool definition describes the tool's metadata, parameters, and return type. It follows a schema similar to JSON Schema:

```typescript
export interface ToolDefinition {
  name: string;                // Unique identifier for the tool
  description: string;         // Human-readable description
  category: string;            // Category for organization
  parameters: ParameterSchema; // JSON Schema for parameters
  returnType: ReturnSchema;    // JSON Schema for return value
  handler: string;             // Reference to the handler function
  enabled: boolean;            // Whether the tool is enabled
}
```

### 2. Tool Handler

The tool handler is a function that implements the tool's functionality. It receives the parameters and context, and returns the result:

```typescript
export type ToolHandler = (
  parameters: any,
  context: ToolContext
) => Promise<any>;
```

### 3. Tool Context

The tool context provides information about the current conversation and user:

```typescript
export interface ToolContext {
  conversationId: string;      // Unique identifier for the conversation
  userId?: string;             // Optional user identifier
  history: Message[];          // Conversation history
  state: Record<string, any>;  // Conversation state
  services: ServiceRegistry;   // Access to ARC services
}
```

## Creating a Custom Tool

Follow these steps to create a custom tool for the ARC MCP:

### Step 1: Define the Tool

Create a new file in the `src/definitions` directory for your tool definition:

```typescript
// src/definitions/custom-tools.ts
import { ToolDefinition } from '../models/tool';

export const customTools: ToolDefinition[] = [
  {
    name: 'getWeatherForecast',
    description: 'Gets the weather forecast for a specific location',
    category: 'external-services',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The location to get the weather forecast for (city name or coordinates)'
        },
        days: {
          type: 'integer',
          description: 'Number of days to forecast',
          default: 3,
          minimum: 1,
          maximum: 7
        },
        units: {
          type: 'string',
          description: 'Units for temperature (celsius or fahrenheit)',
          enum: ['celsius', 'fahrenheit'],
          default: 'celsius'
        }
      },
      required: ['location']
    },
    returnType: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The location of the forecast'
        },
        current: {
          type: 'object',
          properties: {
            temperature: { type: 'number' },
            conditions: { type: 'string' },
            humidity: { type: 'number' },
            windSpeed: { type: 'number' }
          }
        },
        forecast: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string' },
              high: { type: 'number' },
              low: { type: 'number' },
              conditions: { type: 'string' }
            }
          }
        }
      }
    },
    handler: 'weatherService.getWeatherForecast',
    enabled: true
  }
];
```

### Step 2: Implement the Tool Handler

Create a service to implement the tool's functionality:

```typescript
// src/services/weather-service.ts
import axios from 'axios';
import { ToolContext } from '../models/tool';

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: { apiKey: string; baseUrl: string }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async getWeatherForecast(parameters: {
    location: string;
    days: number;
    units: 'celsius' | 'fahrenheit';
  }, context: ToolContext): Promise<any> {
    try {
      // Convert units for API call
      const units = parameters.units === 'celsius' ? 'metric' : 'imperial';
      
      // Call weather API
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: parameters.location,
          appid: this.apiKey,
          units,
          cnt: parameters.days
        }
      });
      
      // Transform API response to match return type
      const data = response.data;
      
      return {
        location: data.city.name,
        current: {
          temperature: data.list[0].main.temp,
          conditions: data.list[0].weather[0].description,
          humidity: data.list[0].main.humidity,
          windSpeed: data.list[0].wind.speed
        },
        forecast: data.list.map((item: any) => ({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          high: item.main.temp_max,
          low: item.main.temp_min,
          conditions: item.weather[0].description
        }))
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error(`Failed to get weather forecast: ${error.message}`);
    }
  }
}
```

### Step 3: Register the Tool

Register your custom tool and service in the application:

```typescript
// src/index.ts
import { customTools } from './definitions/custom-tools';
import { WeatherService } from './services/weather-service';
import { McpServer } from './server/mcp-server';
import config from './config';

// Create services
const weatherService = new WeatherService({
  apiKey: config.weatherApi.apiKey,
  baseUrl: config.weatherApi.baseUrl
});

// Create MCP server
const server = new McpServer({
  port: config.server.port,
  host: config.server.host,
  tools: [
    ...builtInTools,
    ...customTools
  ],
  services: {
    weatherService
  }
});

// Start server
server.start();
```

### Step 4: Configure the Tool

Add configuration for your custom tool in the configuration file:

```typescript
// src/config/index.ts
export default {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  weatherApi: {
    apiKey: process.env.WEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5'
  }
};
```

## Testing Custom Tools

It's important to thoroughly test your custom tools before deploying them. Here are some approaches for testing:

### Unit Testing

Create unit tests for your tool handler to verify its functionality:

```typescript
// tests/services/weather-service.test.ts
import { WeatherService } from '../../src/services/weather-service';
import axios from 'axios';
import { ToolContext } from '../../src/models/tool';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let mockContext: ToolContext;

  beforeEach(() => {
    weatherService = new WeatherService({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com'
    });

    mockContext = {
      conversationId: 'test-conversation',
      history: [],
      state: {},
      services: {}
    };
  });

  describe('getWeatherForecast', () => {
    it('should return weather forecast for a location', async () => {
      // Mock API response
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          city: { name: 'New York' },
          list: [
            {
              dt: 1625097600,
              main: {
                temp: 25,
                temp_min: 22,
                temp_max: 28,
                humidity: 65
              },
              weather: [{ description: 'Sunny' }],
              wind: { speed: 10 }
            }
          ]
        }
      });

      // Call the method
      const result = await weatherService.getWeatherForecast({
        location: 'New York',
        days: 1,
        units: 'celsius'
      }, mockContext);

      // Verify the result
      expect(result).toEqual({
        location: 'New York',
        current: {
          temperature: 25,
          conditions: 'Sunny',
          humidity: 65,
          windSpeed: 10
        },
        forecast: [
          {
            date: expect.any(String),
            high: 28,
            low: 22,
            conditions: 'Sunny'
          }
        ]
      });

      // Verify API call
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.test.com/forecast', {
        params: {
          q: 'New York',
          appid: 'test-api-key',
          units: 'metric',
          cnt: 1
        }
      });
    });

    it('should handle API errors', async () => {
      // Mock API error
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

      // Call the method and expect it to throw
      await expect(weatherService.getWeatherForecast({
        location: 'Invalid Location',
        days: 1,
        units: 'celsius'
      }, mockContext)).rejects.toThrow('Failed to get weather forecast: API error');
    });
  });
});
```

### Integration Testing

Create integration tests to verify that the tool works correctly with the MCP server:

```typescript
// tests/integration/custom-tools.test.ts
import request from 'supertest';
import { McpServer } from '../../src/server/mcp-server';
import { customTools } from '../../src/definitions/custom-tools';
import { WeatherService } from '../../src/services/weather-service';

describe('Custom Tools Integration', () => {
  let server: McpServer;
  let app: any;

  beforeAll(async () => {
    // Create a test weather service with mocked functionality
    const weatherService = new WeatherService({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com'
    });

    // Mock the getWeatherForecast method
    weatherService.getWeatherForecast = jest.fn().mockResolvedValue({
      location: 'Test City',
      current: {
        temperature: 25,
        conditions: 'Sunny',
        humidity: 65,
        windSpeed: 10
      },
      forecast: [
        {
          date: '2023-06-15',
          high: 28,
          low: 22,
          conditions: 'Sunny'
        }
      ]
    });

    // Create a test server
    server = new McpServer({
      port: 3001,
      host: 'localhost',
      tools: customTools,
      services: {
        weatherService
      }
    });

    // Start the server
    await server.start();
    app = server.getApp();
  });

  afterAll(async () => {
    // Stop the server
    await server.stop();
  });

  it('should execute the getWeatherForecast tool', async () => {
    const response = await request(app)
      .post('/execute')
      .send({
        tool: 'getWeatherForecast',
        parameters: {
          location: 'Test City',
          days: 1,
          units: 'celsius'
        },
        context: {
          conversationId: 'test-conversation'
        }
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      result: {
        location: 'Test City',
        current: {
          temperature: 25,
          conditions: 'Sunny',
          humidity: 65,
          windSpeed: 10
        },
        forecast: [
          {
            date: '2023-06-15',
            high: 28,
            low: 22,
            conditions: 'Sunny'
          }
        ]
      },
      context: {
        conversationId: 'test-conversation'
      }
    });
  });
});
```

## Best Practices

### Tool Design

1. **Clear Purpose**: Each tool should have a clear, specific purpose.

2. **Descriptive Names**: Use descriptive names for tools and parameters.

3. **Comprehensive Documentation**: Provide detailed descriptions for tools and parameters.

4. **Parameter Validation**: Define comprehensive parameter schemas with validation rules.

5. **Consistent Return Types**: Use consistent return type structures across similar tools.

### Implementation

1. **Error Handling**: Implement robust error handling in tool handlers.

2. **Logging**: Add appropriate logging for debugging and monitoring.

3. **Performance**: Optimize tool handlers for performance, especially for frequently used tools.

4. **Security**: Validate input and implement proper authentication and authorization.

5. **Statelessness**: Design tools to be stateless when possible, storing state in the context.

### Integration

1. **Service Abstraction**: Abstract external service calls behind service classes.

2. **Configuration**: Make tool behavior configurable through the configuration system.

3. **Dependency Injection**: Use dependency injection for services and configuration.

4. **Versioning**: Consider versioning for tools that may change over time.

5. **Feature Flags**: Use feature flags to enable/disable tools in different environments.

## Advanced Topics

### Asynchronous Tools

For long-running operations, you can implement asynchronous tools:

```typescript
// src/definitions/async-tools.ts
import { ToolDefinition } from '../models/tool';

export const asyncTools: ToolDefinition[] = [
  {
    name: 'generateReport',
    description: 'Generates a comprehensive report (asynchronous operation)',
    category: 'reporting',
    parameters: {
      type: 'object',
      properties: {
        reportType: {
          type: 'string',
          enum: ['sales', 'inventory', 'customer'],
          description: 'Type of report to generate'
        },
        startDate: {
          type: 'string',
          format: 'date',
          description: 'Start date for the report data'
        },
        endDate: {
          type: 'string',
          format: 'date',
          description: 'End date for the report data'
        }
      },
      required: ['reportType', 'startDate', 'endDate']
    },
    returnType: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'ID of the report generation job'
        },
        status: {
          type: 'string',
          enum: ['queued', 'processing', 'completed', 'failed'],
          description: 'Status of the report generation job'
        },
        estimatedCompletion: {
          type: 'string',
          format: 'date-time',
          description: 'Estimated completion time'
        }
      }
    },
    handler: 'reportingService.generateReport',
    enabled: true
  },
  {
    name: 'getReportStatus',
    description: 'Gets the status of a report generation job',
    category: 'reporting',
    parameters: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'ID of the report generation job'
        }
      },
      required: ['jobId']
    },
    returnType: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        status: {
          type: 'string',
          enum: ['queued', 'processing', 'completed', 'failed']
        },
        progress: { type: 'number' },
        result: {
          type: 'object',
          properties: {
            reportUrl: { type: 'string' },
            reportSize: { type: 'number' },
            generatedAt: { type: 'string', format: 'date-time' }
          }
        },
        error: { type: 'string' }
      }
    },
    handler: 'reportingService.getReportStatus',
    enabled: true
  }
];
```

### Tool Composition

You can compose complex tools from simpler ones:

```typescript
// src/services/composite-service.ts
import { ToolContext } from '../models/tool';

export class CompositeService {
  constructor(private services: Record<string, any>) {}

  async analyzeWeatherTrends(parameters: {
    locations: string[];
    days: number;
    units: 'celsius' | 'fahrenheit';
  }, context: ToolContext): Promise<any> {
    // Get weather forecasts for all locations
    const forecasts = await Promise.all(
      parameters.locations.map(location =>
        this.services.weatherService.getWeatherForecast({
          location,
          days: parameters.days,
          units: parameters.units
        }, context)
      )
    );

    // Analyze the forecasts
    const analysis = this.services.analyticsService.analyzeData({
      data: forecasts,
      analysisType: 'weather-comparison'
    }, context);

    // Generate a report
    return {
      locations: parameters.locations,
      period: `${parameters.days} days`,
      analysis: analysis,
      recommendations: this.generateRecommendations(analysis)
    };
  }

  private generateRecommendations(analysis: any): string[] {
    // Generate recommendations based on the analysis
    const recommendations = [];

    if (analysis.temperatureVariance > 10) {
      recommendations.push('Pack for variable weather conditions');
    }

    if (analysis.rainProbability > 0.5) {
      recommendations.push('Bring rain gear');
    }

    if (analysis.averageTemperature > 30) {
      recommendations.push('Stay hydrated and avoid outdoor activities during peak heat');
    }

    return recommendations;
  }
}
```

### Tool Categories

Organize tools into categories for better management:

```typescript
// src/definitions/index.ts
import { ToolDefinition } from '../models/tool';
import { documentationTools } from './documentation-tools';
import { apiTools } from './arc-api-tools';
import { generatorTools } from './generator-tools';
import { deploymentTools } from './deployment-tools';
import { customTools } from './custom-tools';
import { asyncTools } from './async-tools';

// Organize tools by category
export const toolsByCategory: Record<string, ToolDefinition[]> = {
  'documentation': documentationTools,
  'api': apiTools,
  'generator': generatorTools,
  'deployment': deploymentTools,
  'external-services': customTools,
  'reporting': asyncTools
};

// Flatten all tools into a single array
export const allTools: ToolDefinition[] = Object.values(toolsByCategory).flat();
```

## Next Steps

Now that you understand how to develop custom tools for the ARC MCP, you can:

1. Learn about [Security Best Practices](./security-best-practices.md)
2. Explore [AI Model Integration](./ai-model-integration.md)
3. Check out the [API Reference](../reference/api-reference.md)

## Related Documentation

- [Architecture Overview](../core-concepts/architecture.md)
- [Model Context Protocol](../core-concepts/model-context-protocol.md)
- [Configuration Guide](../getting-started/configuration.md)