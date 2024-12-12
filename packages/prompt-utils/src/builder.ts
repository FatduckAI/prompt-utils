import { ChatMessage } from "./types";

interface PromptBuilderInput {
  system: string;
  user?: string;
}

interface PromptBuilderOptions {
  validateOnBuild?: boolean;
  throwOnWarnings?: boolean;
  allowEmptyContent?: boolean;
}

export class PromptBuilder {
  private prompts: PromptBuilderInput;
  private context: Record<string, any> = {};
  private readonly options: Required<PromptBuilderOptions>;

  constructor(prompts: PromptBuilderInput, options: PromptBuilderOptions = {}) {
    this.prompts = prompts;

    this.options = {
      validateOnBuild: true,
      throwOnWarnings: false,
      allowEmptyContent: false,
      ...options,
    };
  }

  withContext(context: Record<string, any>): this {
    if (!this.options.allowEmptyContent) {
      Object.entries(context).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value.toString().trim() === ""
        ) {
          throw new Error(
            `Empty content not allowed for "${key}". Set allowEmptyContent to true to allow empty, null, or undefined values.`
          );
        }
      });
    }

    this.context = { ...this.context, ...context };
    return this;
  }

  build(): ChatMessage[] {
    try {
      if (!this.prompts.system?.trim()) {
        throw new Error("System prompt is required");
      }

      const messages: ChatMessage[] = [];
      let systemContent = this.prompts.system;

      // Check if system prompt contains any variables
      const hasVariables = /<[^>]+>/g.test(systemContent);

      if (hasVariables) {
        // Replace variables in system prompt
        Object.entries(this.context).forEach(([key, value]) => {
          const regex = new RegExp(`<${key}>`, "g");
          const replacement =
            value === undefined || value === null ? "" : String(value);
          systemContent = systemContent.replace(regex, replacement);
        });
      } else if (Object.keys(this.context).length > 0) {
        // If no variables but context exists, prepend context
        const contextString = Object.entries(this.context)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        systemContent = `${contextString}\n\n${systemContent}`;
      }

      if (!systemContent.trim() && !this.options.allowEmptyContent) {
        throw new Error("Empty content in system prompt after processing");
      }

      messages.push({
        role: "system",
        content: systemContent.trim(),
      });

      if (this.prompts.user?.trim()) {
        messages.push({
          role: "user",
          content: this.prompts.user.trim(),
        });
      }

      return messages;
    } catch (error) {
      throw new Error(
        `Failed to build prompt: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
