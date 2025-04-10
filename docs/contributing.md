# Contributing to ARC MCP Documentation

Thank you for your interest in contributing to the ARC Model Context Server (MCP) documentation! This guide will help you get started with contributing to the documentation.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

1. Git
2. A text editor or IDE (e.g., Visual Studio Code, Sublime Text, etc.)
3. Basic knowledge of Markdown

### Setting Up the Repository

1. Fork the repository on GitHub
2. Clone your fork to your local machine:
   ```bash
   git clone https://github.com/your-username/arc-mcp.git
   cd arc-mcp
   ```
3. Add the upstream repository as a remote:
   ```bash
   git remote add upstream https://github.com/original-owner/arc-mcp.git
   ```
4. Create a new branch for your changes:
   ```bash
   git checkout -b docs/your-feature-name
   ```

## Documentation Structure

The documentation is organized into the following directories:

- `docs/getting-started/`: Getting started guides
- `docs/core-concepts/`: Core concepts and architecture
- `docs/tools/`: Tool documentation
- `docs/implementation/`: Implementation guides
- `docs/reference/`: API and configuration reference
- `docs/troubleshooting/`: Troubleshooting guides
- `docs/faqs/`: Frequently asked questions

## Writing Documentation

### Markdown Guidelines

The documentation is written in Markdown. Here are some guidelines to follow:

1. Use ATX-style headers (with `#` symbols)
2. Use fenced code blocks with language identifiers
3. Use relative links for internal documentation
4. Use descriptive link text
5. Use tables for structured data
6. Use lists for sequential or unordered items
7. Use blockquotes for notes or warnings

### Code Examples

When including code examples, use fenced code blocks with the appropriate language identifier:

````markdown
```javascript
const server = new MCPServer({
  port: 3000,
  logLevel: 'info'
});

server.start();
```
````

### Images

When including images, use the following format:

```markdown
![Alt text](../images/image-name.png "Optional title")
```

Place images in the `docs/images/` directory.

## Making Changes

1. Make your changes to the documentation
2. Commit your changes with a descriptive commit message:
   ```bash
   git add .
   git commit -m "docs: Add section on logging configuration"
   ```
3. Push your changes to your fork:
   ```bash
   git push origin docs/your-feature-name