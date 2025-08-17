const axios = require("axios");
import fs from 'fs/promises';
const { HttpsProxyAgent } = require('https-proxy-agent');

/**
 * Gemini API client for text generation and function calling.
 *
 * Usage for function calling:
 *   const response = await gemini.generateText({
 *     contents, // Gemini-formatted chat history
 *     instruction, // Optional system prompt
 *     tools: [{ functionDeclarations: [ ... ] }], // Function calling per Gemini API
 *     model: 'gemini-2.5-flash', // Optional, defaults to 2.5-flash
 *     config: { temperature: 0, ... } // Optional, forwarded as per Gemini API
 *   });
 *   // Inspect response.candidates[0].content.parts[0].functionCall
 *
 * See: https://ai.google.dev/gemini-api/docs/function-calling?example=meeting#rest_1
 */
class GEMINI {
    private apiKey: string;
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateTextFromMessage(message: string) {
        const contents = [{
            role: "user",
            content: message
        }]
        const result = await this.generateText({ contents });
        return result
    }

    async generateText({ contents, instruction = "", tools, model = "gemini-2.5-flash", config }: {
        contents: any[],
        instruction?: string,
        tools?: any,
        model?: string,
        config?: any
    }) {
        const geminiContents = await this._convertToGeminiFormat(contents);
        const geminiInstruction = this._convertToInstructionFormat(instruction);
        const data: any = { contents: geminiContents };
        if (instruction) {
            data.system_instruction = geminiInstruction;
        }
        if (tools) {
            data.tools = tools;
        }
        if (config) {
            Object.assign(data, config); // Forward config options (e.g., temperature)
        }
        return this._generateFromGemini(data, model);
    }

    async _generateFromGemini(data: any, model: string ) {
        const apiKey = this.apiKey;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const proxyAgent = this.getAgent();
        const useProxy = process.env.USE_PROXY;
        console.log("useProxy", useProxy)
        const response = await axios.post(apiUrl, data, {
            httpsAgent: proxyAgent
        });
        // Return the full response data for function calling support
        return response.data;
    }

    async _convertToGeminiFormat(contents: any) {
        // Map each content, and if it has an imageFile, convert it to base64 and build the Gemini format
        const geminiContents = await Promise.all(contents.map(async (content: any) => {
            if (content.imageFile) {
                const base64Image = await this.fileToBase64(content.imageFile);
                return {
                    role: content.role,
                    parts: [{
                        inline_data: {
                            mime_type: content.imageFile.mimetype,
                            data: base64Image
                        }
                    }]
                };
            } else if (content.text) {
                return {
                    role: content.role,
                    parts: [{
                        text: content.text
                    }]
                };
            } else {
                // fallback: just send role with empty parts
                return {
                    role: content.role,
                    parts: []
                };
            }
        }));

        return geminiContents;
    }

    _convertToInstructionFormat(instruction: string) {
        return {
            parts: {
                text: instruction
            }
        };
    }

    geminiFormatResult(data: any) {
        const regex = /\{([\s\S]*?)\}/;
        const match = data.match(regex);
        console.log("match", match[0]);
        const result = match ? JSON.parse("{" + match[1] + "}") : null;
        return result
    }

    getAgent() {
        const proxyHost = process.env.PROXY_HOST;
        const proxyPort = process.env.PROXY_PORT; // Replace with your proxy's port
        const proxyUser = process.env.PROXY_USER; // Optional
        const proxyPass = process.env.PROXY_PASS; // Optional
        // Create a proxy agent
        const proxyUrl = `http://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`;
        const httpAgent = new HttpsProxyAgent(proxyUrl)
        return httpAgent
    }

    async fileToBase64(file: Express.Multer.File): Promise<string> {
        let buffer: Buffer;
        if (file.buffer) {
            buffer = file.buffer;
        } else if (file.path) {
            buffer = await fs.readFile(file.path);
        } else {
            throw new Error('No file buffer or path found');
        }
        return buffer.toString('base64');
    }

    /**
     * Removes triple backticks and all HTML tags from the input string.
     * @param {string} data - The string to clean.
     * @returns {string} - The cleaned string.
     */
    public cleanGeminiResponse(data: string): string {
        // Remove triple backticks and any language identifier (e.g., ```html)
        let cleaned = data.replace(/```[a-zA-Z]*\n?|```/g, "");
        // Remove all HTML tags
        // cleaned = cleaned.replace(/<[^>]*>/g, "");
        // Trim whitespace
        return cleaned.trim();
    }
}
export { GEMINI }