# @fatduckai/prompt-utils

![duck_banner](https://github.com/user-attachments/assets/33c039c6-bd6a-436f-952e-fbc88ae07c50)

_A lightweight and efficient prompt builder for LLM chat completions._

## Features

- 🚀 Type-safe chat message construction
- 🔍 Dynamic context injection
- ✅ Variable substitution
- 📝 TypeScript support
- 🛡️ Built-in validation

## Installation

```bash
npm install @fatduckai/prompt-utils
# or
yarn add @fatduckai/prompt-utils
# or
bun add @fatduckai/prompt-utils
```

## Quick Start

```typescript
import { PromptBuilder } from "@fatduckai/prompt-utils";
import OpenAI from "openai";

async function main() {
  const builder = new PromptBuilder({
    system: "You are a helpful AI assistant specialized in <language>.",
    user: "Hi, I'm <name> and I need help with coding.",
  }).withContext({
    language: "TypeScript",
    name: "Alice",
  });

  const messages = builder.build();

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  console.log(completion.choices[0].message);
}
```

## Usage

### Basic Chat Messages

```typescript
const builder = new PromptBuilder({
  system: "You are a helpful AI assistant.",
  user: "Help me with TypeScript",
});

const messages = builder.build();
```

### Using Context Variables

```typescript
const builder = new PromptBuilder({
  system:
    "You are specialized in <language>. Your user is a <level> developer.",
  user: "Help me understand the basics.",
}).withContext({
  language: "Python",
  level: "beginner",
});

const messages = builder.build();
```

### Working with Data

```typescript
const metrics = [
  { date: "2024-03-13", metric: "users", value: 1000 },
  { date: "2024-03-14", metric: "users", value: 1200 },
];

const formattedData = metrics
  .map((row) => `${row.date}: ${row.metric} = ${row.value}`)
  .join("\n");

const builder = new PromptBuilder({
  system: "You are a data analyst AI.",
  user: `Analyze this data:\n${formattedData}\n\nWhat are the trends?`,
});

const messages = builder.build();
```

## Configuration Options

```typescript
const builder = new PromptBuilder(
  {
    system: "System prompt here",
    user: "User message here",
  },
  {
    validateOnBuild: true, // Validate before building (default: true)
    throwOnWarnings: false, // Throw error on warnings (default: false)
    allowEmptyContent: false, // Allow empty messages (default: false)
  }
);
```

## Error Handling

The builder performs validation to ensure:

- System prompt is not empty
- Context variables are properly defined
- Content is not empty (when not allowed)
- Variable substitution is valid

```typescript
try {
  const builder = new PromptBuilder({
    system: "Using variable <missing>",
    user: "Test",
  });

  const messages = builder.build();
} catch (error) {
  console.error("Build failed:", error.message);
}
```

## Examples

Check the [examples](./examples) directory for more detailed examples including:

- Basic chat message construction
- Variable substitution
- Database content integration
- Error handling
- OpenAI API integration

## License

MIT

## Author

FatDuckAI

## Support

- Issues: [GitHub Issues](https://github.com/fatduckai/prompt-utils/issues)
