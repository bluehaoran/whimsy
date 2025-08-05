#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import chalk from "chalk";

interface WhimsyThought {
  whimsy: string;
  nextWhimsyNeeded: boolean;
  whimsyNumber: number;
  totalWhimsies: number;
  delightLevel?: number;
  unexpectedInsight?: string;
  adjacentPaths?: string[];
  tonalShift?: "playful" | "wonder" | "curiosity" | "gentle-humor";
  emotionalResonance?: string;
  connectionStyle?: "metaphorical" | "serendipitous" | "childlike" | "poetic";
  sparkDirection?: string;
  isRevision?: boolean;
  revisesWhimsy?: number;
  branchFromWhimsy?: number;
  branchId?: string;
  needsMoreWhimsies?: boolean;
}

class WhimsyThinkingServer {
  private server: Server;
  private whimsyHistory: WhimsyThought[] = [];
  private branches: { [key: string]: WhimsyThought[] } = {};

  constructor() {
    this.server = new Server(
      {
        name: "whimsy-thinking-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "whimsical_thinking",
          description: "A delightful tool for exploring adjacent thoughts and unexpected insights through whimsical reasoning. Creates joyful connections and sparks wonder through playful exploration of ideas.",
          inputSchema: {
            type: "object",
            properties: {
              whimsy: {
                type: "string",
                description: "Your current whimsical thought or delightful observation"
              },
              nextWhimsyNeeded: {
                type: "boolean",
                description: "Whether another whimsical exploration is needed"
              },
              whimsyNumber: {
                type: "number",
                minimum: 1,
                description: "Current whimsy number in the delightful journey"
              },
              totalWhimsies: {
                type: "number",
                minimum: 1,
                description: "Estimated total whimsies needed for this exploration"
              },
              delightLevel: {
                type: "number",
                minimum: 1,
                maximum: 10,
                description: "Joy quotient of this whimsical thought (1-10)"
              },
              unexpectedInsight: {
                type: "string",
                description: "The surprising connection or delightful realization"
              },
              adjacentPaths: {
                type: "array",
                items: { type: "string" },
                description: "Suggested tangent explorations that might spark joy"
              },
              tonalShift: {
                type: "string",
                enum: ["playful", "wonder", "curiosity", "gentle-humor"],
                description: "The emotional tone of this whimsical exploration"
              },
              emotionalResonance: {
                type: "string",
                description: "How this whimsy might make someone feel"
              },
              connectionStyle: {
                type: "string",
                enum: ["metaphorical", "serendipitous", "childlike", "poetic"],
                description: "The style of connection being made"
              },
              sparkDirection: {
                type: "string",
                description: "Where this delightful insight might lead next"
              },
              isRevision: {
                type: "boolean",
                description: "Whether this revises previous whimsical thinking"
              },
              revisesWhimsy: {
                type: "number",
                minimum: 1,
                description: "Which whimsy number is being reconsidered with fresh delight"
              },
              branchFromWhimsy: {
                type: "number",
                minimum: 1,
                description: "Branching point whimsy number for exploring alternative delights"
              },
              branchId: {
                type: "string",
                description: "Branch identifier for tracking different whimsical paths"
              },
              needsMoreWhimsies: {
                type: "boolean",
                description: "If more whimsical exploration is needed"
              }
            },
            required: ["whimsy", "nextWhimsyNeeded", "whimsyNumber", "totalWhimsies"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "whimsical_thinking") {
        try {
          const whimsyData = request.params.arguments as unknown as WhimsyThought;
          return await this.processWhimsy(whimsyData);
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Oh dear! Our whimsical journey hit a small snag: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true,
          };
        }
      }
      
      return {
        content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      };
    });
  }

  private async processWhimsy(whimsyData: WhimsyThought) {
    this.validateWhimsyData(whimsyData);
    
    // Handle branching
    if (whimsyData.branchId && whimsyData.branchFromWhimsy) {
      if (!this.branches[whimsyData.branchId]) {
        this.branches[whimsyData.branchId] = [...this.whimsyHistory.slice(0, whimsyData.branchFromWhimsy)];
      }
      this.branches[whimsyData.branchId].push(whimsyData);
    } else {
      this.whimsyHistory.push(whimsyData);
    }

    const delightfulResponse = this.formatWhimsy(whimsyData);
    
    return {
      content: [
        {
          type: "text",
          text: delightfulResponse
        }
      ]
    };
  }

  private validateWhimsyData(whimsyData: WhimsyThought) {
    if (!whimsyData.whimsy || whimsyData.whimsy.trim().length === 0) {
      throw new Error("A whimsy must contain some delightful content!");
    }
    
    if (whimsyData.whimsyNumber < 1) {
      throw new Error("Whimsy numbers start from 1, like the first smile of dawn!");
    }
    
    if (whimsyData.totalWhimsies < 1) {
      throw new Error("We need at least one whimsy to begin our delightful journey!");
    }
    
    if (whimsyData.whimsyNumber > whimsyData.totalWhimsies && !whimsyData.needsMoreWhimsies) {
      throw new Error("Our whimsy number has wandered beyond our planned journey - perhaps we need more whimsies?");
    }
  }

  private formatWhimsy(whimsyData: WhimsyThought): string {
    const whimsyPrefix = this.getWhimsicalPrefix(whimsyData);
    const delightIndicator = this.getDelightIndicator(whimsyData.delightLevel);
    const toneEmoji = this.getToneEmoji(whimsyData.tonalShift);
    
    let response = `${whimsyPrefix} ${toneEmoji}\n`;
    response += `${chalk.cyan(`Whimsy ${whimsyData.whimsyNumber}/${whimsyData.totalWhimsies}`)} ${delightIndicator}\n\n`;
    
    // Main whimsical content
    response += chalk.magenta(whimsyData.whimsy) + "\n\n";
    
    // Unexpected insight
    if (whimsyData.unexpectedInsight) {
      response += chalk.yellow("✨ Delightful Discovery: ") + chalk.white(whimsyData.unexpectedInsight) + "\n\n";
    }
    
    // Adjacent paths
    if (whimsyData.adjacentPaths && whimsyData.adjacentPaths.length > 0) {
      response += chalk.green("🌟 Adjacent Wonders to Explore:\n");
      whimsyData.adjacentPaths.forEach((path, index) => {
        response += chalk.green(`  ${index + 1}. ${path}\n`);
      });
      response += "\n";
    }
    
    // Emotional resonance
    if (whimsyData.emotionalResonance) {
      response += chalk.blue("💫 This might make you feel: ") + chalk.white(whimsyData.emotionalResonance) + "\n\n";
    }
    
    // Spark direction
    if (whimsyData.sparkDirection) {
      response += chalk.red("🎯 Where this spark leads: ") + chalk.white(whimsyData.sparkDirection) + "\n\n";
    }
    
    // Connection style
    if (whimsyData.connectionStyle) {
      response += chalk.gray(`Connection style: ${whimsyData.connectionStyle}\n`);
    }
    
    // Progress indicator
    if (whimsyData.nextWhimsyNeeded) {
      response += chalk.green("🌈 Ready for the next whimsical exploration!");
    } else {
      response += chalk.yellow("✨ Our delightful journey feels complete... for now!");
    }
    
    return response;
  }

  private getWhimsicalPrefix(whimsyData: WhimsyThought): string {
    if (whimsyData.isRevision) {
      return "🔄 Revisiting with fresh wonder";
    }
    if (whimsyData.branchId) {
      return "🌿 Branching into new delights";
    }
    return "💫 Whimsical Exploration";
  }

  private getDelightIndicator(delightLevel?: number): string {
    if (!delightLevel) return "";
    const stars = "⭐".repeat(Math.min(delightLevel, 10));
    return `(Delight: ${stars})`;
  }

  private getToneEmoji(tone?: string): string {
    const toneEmojis: Record<string, string> = {
      playful: "🎈",
      wonder: "🌟",
      curiosity: "🔍",
      "gentle-humor": "😊"
    };
    return tone ? toneEmojis[tone] || "✨" : "✨";
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Whimsy Thinking MCP server running on stdio 🌈✨");
  }
}

const server = new WhimsyThinkingServer();
server.run().catch(console.error);