# Installation Guide

This guide will walk you through the process of installing the ARC Model Context Server (MCP) on your system.

## Prerequisites

Before installing the ARC MCP, ensure you have the following prerequisites installed on your system:

- **Node.js** (v14 or later)
- **npm** (v6 or later) or **yarn** (v1.22 or later)
- **Git** (for cloning the repository)

## Installation Methods

There are two primary methods to install the ARC MCP:

1. Using the pre-built package
2. Building from source

### Method 1: Using the Pre-built Package

```bash
# Install the ARC MCP globally
npm install -g arc-mcp-server

# Verify installation
arc-mcp-server --version
```

### Method 2: Building from Source

```bash
# Clone the repository
git clone https://github.com/your-organization/arc-mcp-server.git
cd arc-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Optionally, link the package globally
npm link
```

## Directory Structure

After installation, the ARC MCP will have the following directory structure:

```
arc-mcp-server/
├── dist/            # Compiled JavaScript files
├── src/             # Source TypeScript files
│   ├── config/      # Configuration files
│   ├── definitions/ # Tool definitions
│   ├── integrations/# ARC service integrations
│   ├── models/      # Data models
│   ├── security/    # Security components
│   ├── server/      # Server implementation
│   └── index.ts     # Main entry point
├── docs/            # Documentation
├── tests/           # Test files
├── package.json     # Package configuration
└── tsconfig.json    # TypeScript configuration
```

## Verifying Installation

To verify that the ARC MCP has been installed correctly, run the following command:

```bash
# If installed globally
arc-mcp-server --version

# If built from source
node dist/index.js --version
```

You should see the version number of the ARC MCP displayed in your terminal.

## Next Steps

Now that you have installed the ARC MCP, you can proceed to:

1. [Configure the server](./configuration.md) for your environment
2. Follow the [Quick Start Guide](./quick-start.md) to get up and running quickly
3. Learn about the [Architecture](../core-concepts/architecture.md) of the ARC MCP

## Troubleshooting

If you encounter any issues during installation, please refer to the [Common Issues](../troubleshooting/common-issues.md) section or check the [GitHub repository](https://github.com/your-organization/arc-mcp-server/issues) for known issues.

### Common Installation Issues

#### Node.js Version Compatibility

If you receive errors related to Node.js compatibility, ensure you're using Node.js v14 or later:

```bash
node --version
```

If you need to update Node.js, visit the [official Node.js website](https://nodejs.org/) to download the latest version.

#### Permission Issues

If you encounter permission issues when installing globally, you may need to use `sudo` (on Linux/macOS) or run your command prompt as Administrator (on Windows).

Alternatively, you can configure npm to install global packages in your user directory:

```bash
npm config set prefix ~/.npm-global
```

Then add `~/.npm-global/bin` to your PATH.