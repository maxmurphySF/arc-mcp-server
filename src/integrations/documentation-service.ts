/**
 * Documentation service for the ARC MCP Server
 * Provides functionality to search and retrieve information from ARC documentation
 */

export class DocumentationService {
  private baseUrl = 'https://sourcefuse.github.io/arc-docs/';
  private docsIndex: Map<string, DocEntry> = new Map();
  
  constructor() {
    this.initializeIndex();
  }
  
  private async initializeIndex() {
    // This would typically load and parse the documentation sitemap
    // For now, we'll just define a basic structure
    const categories = ['api', 'infrastructure', 'ui', 'saas'];
    
    for (const category of categories) {
      await this.indexCategory(category);
    }
  }
  
  private async indexCategory(category: string) {
    try {
      // In a real implementation, this would fetch and parse the documentation
      // For now, we'll simulate with some predefined entries
      const mockEntries = this.getMockEntriesForCategory(category);
      
      for (const entry of mockEntries) {
        this.docsIndex.set(entry.url, entry);
      }
      
      console.log(`Indexed ${mockEntries.length} entries for ${category}`);
    } catch (error) {
      console.error(`Failed to index ${category} documentation:`, error);
    }
  }
  
  private getMockEntriesForCategory(category: string): DocEntry[] {
    // This is a simplified mock implementation
    // In a real implementation, this would be populated from the actual documentation
    const baseUrl = `${this.baseUrl}arc-${category}-docs/`;
    
    switch (category) {
      case 'api':
        return [
          {
            title: 'Authentication Service',
            url: `${baseUrl}authentication.html`,
            category,
            content: 'The Authentication Service provides user authentication and authorization capabilities for ARC applications.'
          },
          {
            title: 'Notification Service',
            url: `${baseUrl}notification.html`,
            category,
            content: 'The Notification Service enables sending notifications across multiple channels in ARC applications.'
          }
        ];
      case 'infrastructure':
        return [
          {
            title: 'Deployment Guide',
            url: `${baseUrl}deployment.html`,
            category,
            content: 'This guide explains how to deploy ARC applications to various cloud environments.'
          }
        ];
      case 'ui':
        return [
          {
            title: 'UI Components',
            url: `${baseUrl}components.html`,
            category,
            content: 'ARC provides a set of reusable UI components for building consistent user interfaces.'
          }
        ];
      case 'saas':
        return [
          {
            title: 'Multi-tenancy',
            url: `${baseUrl}multi-tenancy.html`,
            category,
            content: 'ARC supports multi-tenancy for building SaaS applications with isolated tenant data.'
          }
        ];
      default:
        return [];
    }
  }
  
  private async getPageContent(url: string): Promise<string> {
    const entry = this.docsIndex.get(url);
    return entry?.content || '';
  }
  
  async search(query: string, category: string = 'all', maxResults: number = 5): Promise<DocSearchResult[]> {
    const results: DocSearchResult[] = [];
    const terms = query.toLowerCase().split(' ');
    
    for (const [url, entry] of this.docsIndex.entries()) {
      if (category !== 'all' && entry.category !== category) {
        continue;
      }
      
      // Simple relevance scoring
      let score = 0;
      const titleLower = entry.title.toLowerCase();
      const contentLower = entry.content.toLowerCase();
      
      for (const term of terms) {
        // Title matches are weighted higher
        if (titleLower.includes(term)) {
          score += 5;
        }
        
        // Content matches
        if (contentLower.includes(term)) {
          score += 1;
          
          // Add bonus for full phrase matches
          if (contentLower.includes(query.toLowerCase())) {
            score += 3;
          }
        }
      }
      
      if (score > 0) {
        // Extract relevant snippet
        let snippet = '';
        const queryIndex = contentLower.indexOf(query.toLowerCase());
        
        if (queryIndex >= 0) {
          // Get text around the match
          const start = Math.max(0, queryIndex - 100);
          const end = Math.min(contentLower.length, queryIndex + query.length + 100);
          snippet = entry.content.substring(start, end) + '...';
        } else {
          // Just take the first part of the content
          snippet = entry.content.substring(0, 200) + '...';
        }
        
        results.push({
          title: entry.title,
          url,
          category: entry.category,
          snippet,
          score
        });
      }
    }
    
    // Sort by score (highest first) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }
}

interface DocEntry {
  title: string;
  url: string;
  category: string;
  content: string;
}

export interface DocSearchResult {
  title: string;
  url: string;
  category: string;
  snippet: string;
  score: number;
}