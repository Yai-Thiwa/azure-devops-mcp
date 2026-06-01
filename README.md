# Azure DevOps MCP Server

An integration server for the **Model Context Protocol (MCP)** that enables AI assistants (such as Claude Desktop) to interact directly with **Azure DevOps** work items, bugs, tags, and summaries.

This server features **Dynamic Multi-Project Support**, allowing you to query different projects within the same organization seamlessly without registering multiple servers.

---

## Features

The server exposes the following tools to your AI assistant:

- **`list_work_items`**: List recent work items (supports optional `limit` and dynamic `project`).
- **`get_work_item`**: Retrieve detailed information for a specific work item by its global ID.
- **`search_by_tag`**: Search for work items containing a specific tag (supports optional `limit` and dynamic `project`).
- **`get_active_bugs`**: Find open/active bugs in the project (supports optional `limit` and dynamic `project`).
- **`search_by_assignee`**: Find work items assigned to a specific user (supports optional `limit` and dynamic `project`).
- **`work_item_summary`**: Provide a structured summary of work items grouped by State and Work Item Type (supports dynamic `project`).

---

## Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/integra8t/Documents/mcp/azure-devops-mcp
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```

---

## Configuration

To connect this server with **Claude Desktop**, add the configuration below to your `claude_desktop_config.json` file.

### Config File Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Configuration JSON

```json
{
  "mcpServers": {
    "azure-devops-report": {
      "command": "/Users/integra8t/.nvm/versions/node/v20.14.0/bin/node",
      "args": [
        "/Users/integra8t/Documents/mcp/azure-devops-mcp/server.js"
      ],
      "env": {
        "AZURE_DEVOPS_PAT": "YOUR_PERSONAL_ACCESS_TOKEN",
        "AZURE_DEVOPS_ORG": "Integra8t",
        "AZURE_DEVOPS_PROJECT": "YourDefaultProject"
      }
    }
  }
}
```

> [!IMPORTANT]
> - Ensure `"command"` points to the absolute path of your active **Node.js** binary (especially if using NVM).
> - `"AZURE_DEVOPS_ORG"` must contain **only the name of the organization** (e.g., `"Integra8t"`), **not** the full URL.
> - `"AZURE_DEVOPS_PROJECT"` acts as the default fallback project if a tool is called without specifying a project.

---

## Dynamic Multi-Project Usage

All query-based tools accept an optional `project` parameter. Your AI assistant will automatically detect this and fill it in when you ask questions regarding a specific project.

### Conversation Examples:
- **Querying the default project:**
  > *"List the latest work items"*
  > *(The server will fetch work items from the default `AZURE_DEVOPS_PROJECT` defined in your environment variables)*

- **Querying a different project dynamically:**
  > *"Show me a summary of work items in project **MobileApp**"*
  > *(Claude will automatically invoke `work_item_summary` with `project: "MobileApp"`)*

- **Searching bugs in another project:**
  > *"Find all active bugs in project **WebPortal**"*
  > *(Claude will invoke `get_active_bugs` with `project: "WebPortal"`)*
