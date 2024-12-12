import { PromptBuilder } from "./builder";

async function runExamples() {
  try {
    // Example 1: Basic chat with context injection
    console.log("\n=== Example 1: Basic Chat ===");
    const basicBuilder = new PromptBuilder({
      system: "You are a helpful AI assistant.",
      user: "Help me with TypeScript",
    }).withContext({
      name: "Alice",
      expertise: "TypeScript developer",
    });

    console.log("Basic Chat Messages:");
    console.log(JSON.stringify(basicBuilder.build(), null, 2));

    // Example 2: Using variables in system prompt
    console.log("\n=== Example 2: Variables in System Prompt ===");
    const variableBuilder = new PromptBuilder({
      system:
        "You are an AI assistant specialized in <language>. Your user is a <level> developer.",
      user: "Help me understand the basics.",
    }).withContext({
      language: "Python",
      level: "beginner",
    });

    console.log("Variable Replacement Messages:");
    console.log(JSON.stringify(variableBuilder.build(), null, 2));

    // Example 3: Database content integration
    console.log("\n=== Example 3: Database Content ===");
    const dbContent = [
      { date: "2024-03-13", metric: "users", value: 1000 },
      { date: "2024-03-14", metric: "users", value: 1200 },
      { date: "2024-03-15", metric: "users", value: 1150 },
    ];

    const formattedData = dbContent
      .map((row) => `${row.date}: ${row.metric} = ${row.value}`)
      .join("\n");

    const analyticsBuilder = new PromptBuilder({
      system: "You are a data analyst AI.",
      user: `Analyze this metrics data:\n${formattedData}\n\nWhat are the key trends?`,
    });

    console.log("Analytics Messages:");
    console.log(JSON.stringify(analyticsBuilder.build(), null, 2));

    // Example 4: Error handling demonstration
    console.log("\n=== Example 4: Error Handling ===");
    try {
      const invalidBuilder = new PromptBuilder({
        system: "", // Empty system prompt should throw error
        user: "Test",
      });
      console.log(invalidBuilder.build());
    } catch (error) {
      console.error("Caught error:", error);
    }
  } catch (error) {
    console.error("Error in examples:", error);
  }
}

// Run all examples
runExamples()
  .then(() => {
    console.log("\nAll examples completed!");
  })
  .catch((error) => {
    console.error("Failed to run examples:", error);
  });
