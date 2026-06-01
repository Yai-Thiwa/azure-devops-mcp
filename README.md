# 🌐 Azure DevOps Model Context Protocol (MCP) Server

A premium Model Context Protocol (MCP) server built with Node.js that enables LLMs (like Claude Desktop) to interact directly with **Azure DevOps**. It allows you to list work items, retrieve details, search by tags or assignee, fetch active bugs, and view summaries directly from your chat interface.

---

## 🚀 Features & Tools

This server exposes a set of powerful tools to interact with Azure DevOps Work Items via standard WIQL (Work Item Query Language):

| Tool Name | Description | Arguments |
| :--- | :--- | :--- |
| `list_work_items` | Lists recent work items sorted by change date. | `limit` *(number, optional)* |
| `get_work_item` | Retrieves details of a specific work item by ID. | `id` *(number, required)* |
| `search_by_tag` | Searches work items containing a specific tag. | `tag` *(string, required)*, `limit` *(number, optional)* |
| `get_active_bugs` | Fetches all active/open bugs (excluding Closed/Done). | None |
| `search_by_assignee` | Finds work items assigned to a specific person. | `name` *(string, required)*, `limit` *(number, optional)* |
| `work_item_summary` | Returns a summary of work items grouped by State and Type. | None |

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- An active **Azure DevOps** account
- A **Personal Access Token (PAT)** with Read/Write permissions for Work Items.

---

## 📦 Installation & Setup

1. **Clone or Navigate to the Directory:**
   ```bash
   cd /Users/integra8t/Documents/mcp/azure-devops-mcp
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or update the existing one):
   ```env
   AZURE_DEVOPS_ORG=your-organization-name
   AZURE_DEVOPS_PROJECT=your-project-name
   AZURE_DEVOPS_PAT=your-personal-access-token
   ```

---

## 🔌 Claude Desktop Integration

To register this server with your Claude Desktop app, edit your Claude Desktop configuration file:

📁 **Configuration File Path:**
`~/Library/Application Support/Claude/claude_desktop_config.json`

Add the following configuration inside the `mcpServers` block:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": [
        "/Users/integra8t/Documents/mcp/azure-devops-mcp/server.js"
      ],
      "env": {
        "AZURE_DEVOPS_ORG": "Integra8t",
        "AZURE_DEVOPS_PROJECT": "Integra8t",
        "AZURE_DEVOPS_PAT": "your-personal-access-token-here"
      }
    }
  }
}
```

> 💡 **Tip:** Specifying the environment variables in the `env` block of the Claude Desktop config ensures they are loaded reliably, regardless of Claude's execution directory.

---

## 🧪 Testing Locally

To test your Azure DevOps connection independently of the MCP interface, you can run the local test script:

```bash
node test.js
```

To run the MCP server in standard I/O communication mode:

```bash
node server.js
```

---

## 📂 Project Structure

```
├── tools/
│   ├── index.js               # Exports all tools
│   ├── getActiveBugs.js       # WIQL to query active bugs
│   ├── getWorkItem.js         # Fetch specific work item
│   ├── listWorkItems.js       # Query recent work items
│   ├── searchByAssignee.js    # Find items by assignee
│   ├── searchByTag.js         # Find items by tag
│   └── workItemSummary.js     # Group work items by state/type
├── azure.js                   # Azure DevOps Axios instance & core helpers
├── server.js                  # Stdio MCP Server setup and entry point
├── test.js                    # Local test runner
├── .env                       # Local environment secrets (git-ignored)
└── package.json               # NPM dependencies and scripts
```

---
*Created with ❤️ by Antigravity*
