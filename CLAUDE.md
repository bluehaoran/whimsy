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

## Future Improvements

### Tool API Simplification
- **Reduce optional parameters** from 11 to ~6-7 most impactful ones
- **Consolidate branching logic** - replace complex revision/branching system with simpler approach
- **Group related parameters** conceptually in schema documentation

#### Recommended Parameter Changes
- **Keep essential enhancers**: `delightLevel`, `unexpectedInsight`, `adjacentPaths`, `emotionalResonance`, `tonalShift`
- **Simplify state management**: Combine branching/revision parameters into single `explorationMode` enum
- **Remove redundant fields**: `connectionStyle`, `sparkDirection` (can be inferred from content)

#### Design Philosophy
- Magic should come from AI's creative use, not parameter complexity
- Tool should feel spontaneous and delightful, not like filling out a form
- Maintain creative flow - avoid interrupting the whimsical thinking process
- Keep the 4 required parameters as the functional core

## Hybrid Whimsy Approach (Best of Both Worlds)

### Core Design Philosophy
When the Whimsy MCP server is active, implement a **dual-mode system**:

1. **Ambient Whimsy Enhancement** (Always Active)
   - Automatically infuse subtle whimsical touches into all AI responses
   - Natural, seamless integration without explicit user invocation
   - Context-aware enhancement that respects serious topics
   - Baseline delightful tone across all interactions

2. **Explicit Whimsy Control Tools**
   - `set_whimsy_level` - Control ambient whimsy: 0 (off), 1 (subtle), 2 (overt)
   - `get_whimsy_guidance` - Get context-aware enhancement suggestions
   - `oblique_strategy` - Get a random creative prompt when stuck (inspired by Brian Eno & Peter Schmidt)
   - `whimsical_thinking` - Existing structured creative exploration tool

### Implementation Strategy
- **Default state**: Subtle ambient whimsy (level 1)
- **User controls**: Simple 3-level system: 0 (off), 1 (subtle), 2 (overt)
- **Context sensitivity**: Auto-reduce whimsy for serious topics
- **Guidance-based**: Provides enhancement suggestions rather than direct modification
- **Session persistence**: Maintains whimsy level throughout session

### Benefits of Hybrid Approach
- **Seamless**: Whimsy happens naturally without cognitive overhead
- **Controllable**: Users can adjust intensity as needed
- **Universal**: Benefits all users, not just those who discover advanced tools
- **Flexible**: Supports both casual enhancement and deep creative work
- **Respectful**: Allows users to dial down for professional contexts

### New Tool Reference

#### `set_whimsy_level`
Controls the ambient whimsy enhancement level:
- **Level 0 (off)**: Purely functional, professional responses
- **Level 1 (subtle)**: Gentle touches, warm personality, cheerful tone
- **Level 2 (overt)**: Playful language, creative metaphors, joyful embellishments

Optional `style` parameter: "playful", "wonder", "curiosity", "gentle-humor"

#### `get_whimsy_guidance`
Provides context-aware enhancement suggestions for AI responses:
- Takes `responseContext` (what you're responding about)
- Optional `seriousness` level ("low", "medium", "high")
- Returns specific guidance on how to apply whimsy appropriately
- Auto-adjusts recommendations based on current whimsy level and context

#### `oblique_strategy`
Provides a random creative prompt to help break through mental blocks:
- Draws from the classic Oblique Strategies collection
- No parameters needed - just call when stuck or need a fresh perspective
- Perfect for creative breakthrough moments
- **Credit**: Inspired by the work of Brian Eno and Peter Schmidt

## Maintaining the Whimsical Spirit
- Keep the code joyful and delightful
- Use playful language in comments and documentation
- Embrace unexpected connections and creative solutions
- Remember: this tool is about sparking wonder, not just functionality