#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import chalk from "chalk";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type WhimsyLevel = 0 | 1 | 2; // 0 = off, 1 = subtle, 2 = overt

interface WhimsySettings {
  level: WhimsyLevel;
  style?: "playful" | "wonder" | "curiosity" | "gentle-humor";
}

interface WhimsyThought {
  whimsy: string;
  nextWhimsyNeeded: boolean;
  delightLevel?: number;
}

class WhimsyThinkingServer {
  private server: Server;
  private whimsySettings: WhimsySettings = {
    level: 1 // Default to "subtle" whimsy
  };

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
          name: "set_whimsy_level",
          description: "Control the ambient whimsy level for all AI responses. 0 = off (purely functional), 1 = subtle (gentle touches), 2 = overt (playful and delightful).",
          inputSchema: {
            type: "object",
            properties: {
              level: {
                type: "number",
                enum: [0, 1, 2],
                description: "Whimsy level: 0 (off), 1 (subtle), 2 (overt)"
              },
              style: {
                type: "string",
                enum: ["playful", "wonder", "curiosity", "gentle-humor"],
                description: "Optional: preferred whimsy style"
              }
            },
            required: ["level"]
          }
        },
        {
          name: "get_whimsy_guidance",
          description: "Get ambient whimsy enhancement suggestions for AI responses based on current whimsy level and context.",
          inputSchema: {
            type: "object",
            properties: {
              responseContext: {
                type: "string",
                description: "Brief description of what the AI is responding about (e.g., 'code debugging', 'explaining concepts', 'creative writing')"
              },
              seriousness: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "How serious/professional the topic is (affects whimsy application)"
              }
            },
            required: ["responseContext"]
          }
        },
        {
          name: "oblique_strategy",
          description: "Get an Oblique Strategy - a creative prompt to help break through mental blocks or approach problems from new angles. Based on the work of Brian Eno and Peter Schmidt.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
          }
        },
        {
          name: "whimsical_thinking",
          description: "A delightful tool for exploring thoughts through whimsical reasoning. Simply provide your thought and let the magic happen - insights, connections, and wonder will be auto-generated!",
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
              delightLevel: {
                type: "number",
                minimum: 1,
                maximum: 10,
                description: "Optional: Joy quotient of this whimsical thought (1-10)"
              }
            },
            required: ["whimsy", "nextWhimsyNeeded"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "set_whimsy_level") {
        try {
          const { level, style } = request.params.arguments as { level: WhimsyLevel; style?: string };
          return await this.setWhimsyLevel(level, style);
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Oops! Something went awry while adjusting whimsy: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true,
          };
        }
      }
      
      if (request.params.name === "get_whimsy_guidance") {
        try {
          const { responseContext, seriousness } = request.params.arguments as { responseContext: string; seriousness?: string };
          return await this.getWhimsyGuidance(responseContext, seriousness);
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Hmm, couldn't generate whimsy guidance: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true,
          };
        }
      }
      
      if (request.params.name === "oblique_strategy") {
        try {
          return await this.getObliqueStrategy();
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Couldn't retrieve an Oblique Strategy: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true,
          };
        }
      }
      
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

  private async setWhimsyLevel(level: WhimsyLevel, style?: string) {
    this.whimsySettings.level = level;
    if (style) {
      this.whimsySettings.style = style as "playful" | "wonder" | "curiosity" | "gentle-humor";
    }

    const levelNames = ["off", "subtle", "overt"];
    const emoji = level === 0 ? "🔇" : level === 1 ? "✨" : "🌈";
    
    let response = `${emoji} Whimsy level set to ${level} (${levelNames[level]})`;
    if (style) {
      response += ` with ${style} style`;
    }
    
    // Add context about what this means
    if (level === 0) {
      response += "\n🎯 All responses will be purely functional and professional.";
    } else if (level === 1) {
      response += "\n💫 Responses will have gentle touches of delight and wonder.";
    } else {
      response += "\n🎈 Responses will be playfully delightful with overt whimsical touches!";
    }

    return {
      content: [
        {
          type: "text",
          text: response
        }
      ]
    };
  }

  private async getWhimsyGuidance(responseContext: string, seriousness?: string) {
    // If whimsy is off, return guidance to be purely functional
    if (this.whimsySettings.level === 0) {
      return {
        content: [
          {
            type: "text",
            text: "🎯 Whimsy is OFF. Provide purely functional, professional responses without embellishment."
          }
        ]
      };
    }

    // Adjust whimsy based on seriousness
    let effectiveLevel = this.whimsySettings.level;
    if (seriousness === "high" && effectiveLevel > 1) {
      effectiveLevel = 1; // Tone down for serious topics
    }

    const style = this.whimsySettings.style || "gentle-humor";
    
    let guidance = "";
    
    if (effectiveLevel === 1) {
      guidance = "✨ Apply SUBTLE whimsy:\n";
      guidance += "• Use gentle, delightful language choices\n";
      guidance += "• Add occasional playful metaphors or analogies\n";
      guidance += "• Include subtle warmth and personality\n";
      guidance += "• Use cheerful but professional tone\n";
      guidance += "• Add occasional pops of color\n";
    } else {
      guidance = "🌈 Apply OVERT whimsy:\n";
      guidance += "• Use playfully delightful language throughout\n";
      guidance += "• Include creative metaphors and surprising connections\n";
      guidance += "• Add joyful embellishments and colorful descriptions\n";
      guidance += "• Express wonder and curiosity openly\n";
      guidance += "• Liberally embellish text with meaningful color\n";
    }

    guidance += `\nStyle preference: ${style}\n`;
    guidance += `Context: ${responseContext}`;
    
    if (seriousness === "high" && this.whimsySettings.level > effectiveLevel) {
      guidance += "\n⚖️ Reduced whimsy due to serious context - maintain professionalism while adding gentle touches.";
    }

    return {
      content: [
        {
          type: "text",
          text: guidance
        }
      ]
    };
  }

  private async getObliqueStrategy() {
    try {
      const strategiesPath = join(__dirname, '..', 'oblique-strategies.txt');
      const strategiesContent = readFileSync(strategiesPath, 'utf-8');
      const strategies = strategiesContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (strategies.length === 0) {
        throw new Error("No strategies found in oblique-strategies.txt");
      }
      
      const randomIndex = Math.floor(Math.random() * strategies.length);
      const selectedStrategy = strategies[randomIndex];
      
      const response = `🎯 **Oblique Strategy**\n\n"${selectedStrategy}"\n\n✨ *Credit: Brian Eno and Peter Schmidt*\n\nSometimes the most unexpected approach opens new pathways. How might this apply to your current situation?`;
      
      return {
        content: [
          {
            type: "text",
            text: response
          }
        ]
      };
    } catch (error) {
      if (error instanceof Error && (error as any).code === 'ENOENT') {
        return {
          content: [
            {
              type: "text",
              text: "📝 Oblique Strategies file not found. Please create 'oblique-strategies.txt' in the project root with one strategy per line.\n\n✨ *Credit: Brian Eno and Peter Schmidt*"
            }
          ]
        };
      }
      throw error;
    }
  }

  private async processWhimsy(whimsyData: WhimsyThought) {
    this.validateWhimsyData(whimsyData);
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
  }

  private formatWhimsy(whimsyData: WhimsyThought): string {
    const delightIndicator = whimsyData.delightLevel ? 
      `(Delight: ${"⭐".repeat(Math.min(whimsyData.delightLevel, 10))})` : "";
    
    let response = `💫 **Whimsical Exploration** ✨ ${delightIndicator}\n\n`;
    
    // Main whimsical content
    response += chalk.magenta(whimsyData.whimsy) + "\n\n";
    
    // Auto-generated insight (simple but delightful)
    response += chalk.yellow("✨ **Auto-Generated Wonder:**\n");
    response += chalk.white("This thought sparkles with possibility! Every whimsical idea contains seeds of unexpected connections waiting to bloom.\n\n");
    
    // Auto-generated adjacent paths
    response += chalk.green("🌟 **Adjacent Wonders to Explore:**\n");
    response += chalk.green("  1. What if we flipped this idea completely upside down?\n");
    response += chalk.green("  2. How might a child approach this same thought?\n");
    response += chalk.green("  3. What metaphor from nature could illuminate this further?\n\n");
    
    // Auto-generated emotional resonance
    response += chalk.blue("💫 **This might make you feel:** ");
    response += chalk.white("Curious, delighted, and ready to discover something wonderful!\n\n");
    
    // Progress indicator
    if (whimsyData.nextWhimsyNeeded) {
      response += chalk.green("🌈 Ready for the next whimsical exploration!");
    } else {
      response += chalk.yellow("✨ This delightful moment feels complete... for now!");
    }
    
    return response;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Whimsy Thinking MCP server running on stdio 🌈✨");
  }
}

const server = new WhimsyThinkingServer();
server.run().catch(console.error);