# mcp-mockdata

Mock data generator MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `generate_person` | Generate fictional person record(s) — name, email, phone, address, company, job title, birthdate, uuid — for testing/seeding (keyless, offline). All data is FAKE. |
| `lorem` | Generate lorem-ipsum placeholder text (keyless, offline). `unit` = words \| sentences \| paragraphs (default sentences); `count` = how many. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mockdata": {
      "url": "https://gateway.pipeworx.io/mockdata/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Mockdata data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
