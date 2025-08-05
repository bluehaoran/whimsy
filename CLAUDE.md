# Whimsy Thinking MCP Server - Development Guidelines

## Project Overview
This is an MCP (Model Context Protocol) server that provides delightful, whimsical thinking tools to spark creativity and joy in problem-solving through adjacent connections and unexpected insights.

## Build & Development Commands

### Essential Commands
- `npm run build` - Compile TypeScript and make scripts executable
- `npm run prepare` - Runs build (used by npm install)
- `npm run watch` - Watch mode for development
- `npm run dev` - Build and run the server for testing

### Testing the MCP Server
```bash
# Test the server directly
npm run dev

# Test with an MCP client (e.g., Claude Desktop)
# Add to your Claude Desktop config:
# {
#   "mcpServers": {
#     "whimsy-thinking": {
#       "command": "node",
#       "args": ["/path/to/whimsy/dist/index.js"]
#     }
#   }
# }
```

## Code Style Guidelines

### Whimsical Naming Conventions
- Use delightful, whimsical terms that align with the project's joyful spirit
- Interface names should be descriptive: `WhimsyThought`, not `ThoughtData`
- Method names should be playful but clear: `processWhimsy()`, `formatWhimsy()`

### TypeScript Standards
- Use strict TypeScript settings (already configured)
- Prefer interfaces over types for objects
- Use optional properties with `?` for non-required fields
- Maintain strong typing for the MCP SDK integration

### Colorful Output
- Use chalk for colorful console output - it's part of the charm!
- Maintain the existing color scheme:
  - Cyan for progress indicators
  - Magenta for main whimsical content
  - Yellow for insights
  - Green for paths/options
  - Blue for emotional resonance

### Error Handling
- Keep error messages whimsical but helpful
- Example: "A whimsy must contain some delightful content!" vs "Whimsy cannot be empty"

## MCP Server Development

### Tool Schema Requirements
- All tools must have comprehensive `inputSchema` definitions
- Required fields: `whimsy`, `nextWhimsyNeeded`, `whimsyNumber`, `totalWhimsies`
- Optional delight enhancers should have clear descriptions

### Validation
- Validate all input parameters in `validateWhimsyData()`
- Provide helpful error messages that maintain the whimsical tone
- Handle edge cases gracefully

### Response Formatting
- Use the existing `formatWhimsy()` pattern for consistent output
- Include visual elements (emojis, colors) to enhance delight
- Structure responses with clear sections

## Architecture Notes

### State Management
- `whimsyHistory` tracks the main exploration path
- `branches` object manages alternative explorations
- Each whimsy can branch or revise previous thoughts

### Core Components
- `WhimsyThinkingServer` - Main server class
- `WhimsyThought` - Interface defining the data structure
- Tool handlers for MCP protocol compliance

## Development Workflow

1. Make changes to TypeScript files
2. Run `npm run build` to compile
3. Test with `npm run dev`
4. For continuous development, use `npm run watch`

## Testing Considerations

### Manual Testing
- Test the tool with various parameter combinations
- Verify emoji and color output appears correctly
- Test branching and revision functionality
- Ensure error messages are helpful and whimsical

### Integration Testing
- Test with actual MCP clients (Claude Desktop)
- Verify schema validation works correctly
- Test with edge cases (very long text, special characters)

## Publishing Notes
- This is designed to be published as `@modelcontextprotocol/server-whimsy-thinking`
- The binary is `mcp-server-whimsy-thinking`
- Ensure the shebang line works correctly for npx usage

## Maintaining the Whimsical Spirit
- Keep the code joyful and delightful
- Use playful language in comments and documentation
- Embrace unexpected connections and creative solutions
- Remember: this tool is about sparking wonder, not just functionality