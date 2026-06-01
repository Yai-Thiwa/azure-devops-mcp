console.log = () => { };
// Do not override process.stdout.write as it is used by StdioServerTransport for MCP communication.

require("dotenv").config();


const {
    Server
} = require("@modelcontextprotocol/sdk/server/index.js");

const {
    StdioServerTransport
} = require("@modelcontextprotocol/sdk/server/stdio.js");

const {
    ListToolsRequestSchema,
    CallToolRequestSchema
} = require("@modelcontextprotocol/sdk/types.js");

const {
    listWorkItems,
    getWorkItem,
    searchByTag,
    getActiveBugs,
    searchByAssignee,
    workItemSummary
} = require("./tools");

const server = new Server(
    {
        name: "azure-devops-report",
        version: "3.0.0"
    },
    {
        capabilities: {
            tools: {}
        }
    }
);

server.setRequestHandler(
    ListToolsRequestSchema,
    async () => ({
        tools: [
            {
                name: "list_work_items",
                description: "List recent work items",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: {
                            type: "number",
                            description: "Maximum number of work items"
                        },
                        project: {
                            type: "string",
                            description: "Azure DevOps project name (optional, falls back to default project if not specified)"
                        }
                    }
                }
            },
            {
                name: "get_work_item",
                description: "Get work item by ID",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Work item ID"
                        }
                    },
                    required: ["id"]
                }
            },
            {
                name: "search_by_tag",
                description: "Search work items by tag",
                inputSchema: {
                    type: "object",
                    properties: {
                        tag: {
                            type: "string",
                            description: "Tag name"
                        },
                        limit: {
                            type: "number"
                        },
                        project: {
                            type: "string",
                            description: "Azure DevOps project name (optional)"
                        }
                    },
                    required: ["tag"]
                }
            },
            {
                name: "get_active_bugs",
                description: "Get active/open bugs",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: {
                            type: "number",
                            description: "Maximum number of bugs"
                        },
                        project: {
                            type: "string",
                            description: "Azure DevOps project name (optional)"
                        }
                    }
                }
            },
            {
                name: "search_by_assignee",
                description: "Search work items by assignee",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Assignee name"
                        },
                        limit: {
                            type: "number"
                        },
                        project: {
                            type: "string",
                            description: "Azure DevOps project name (optional)"
                        }
                    },
                    required: ["name"]
                }
            },
            {
                name: "work_item_summary",
                description: "Summary of work items grouped by state and type",
                inputSchema: {
                    type: "object",
                    properties: {
                        project: {
                            type: "string",
                            description: "Azure DevOps project name (optional)"
                        }
                    }
                }
            }
        ]
    })
);

function response(data) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data, null, 2)
            }
        ]
    };
}

server.setRequestHandler(
    CallToolRequestSchema,
    async (request) => {

        const args =
            request.params.arguments || {};

        switch (request.params.name) {

            case "list_work_items":

                return response(
                    await listWorkItems(
                        args.limit || 50,
                        args.project
                    )
                );

            case "get_work_item":

                return response(
                    await getWorkItem(
                        args.id
                    )
                );

            case "search_by_tag":

                return response(
                    await searchByTag(
                        args.tag,
                        args.limit || 100,
                        args.project
                    )
                );

            case "get_active_bugs":

                return response(
                    await getActiveBugs(
                        args.limit || 100,
                        args.project
                    )
                );

            case "search_by_assignee":

                return response(
                    await searchByAssignee(
                        args.name,
                        args.limit || 100,
                        args.project
                    )
                );

            case "work_item_summary":

                return response(
                    await workItemSummary(
                        args.project
                    )
                );

            default:

                throw new Error(
                    `Unknown tool: ${request.params.name}`
                );
        }
    }
);

async function main() {

    const transport =
        new StdioServerTransport();

    await server.connect(transport);

    console.error(
        "Azure DevOps MCP Server started"
    );
}

main().catch(console.error);
