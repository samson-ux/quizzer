import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { content, questionCount = 5 } = await request.json();

    if (!content || content.trim().length < 50) {
      return Response.json(
        { error: "Please provide more study content (at least 50 characters)" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a helpful tutor creating a quiz based on study material.

Based on the following study content, generate ${questionCount} quiz questions.

STUDY CONTENT:
${content}

Return your response as a JSON array with this exact structure:
[
  {
    "question": "The question text",
    "type": "multiple_choice",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "correctAnswer": "A",
    "explanation": "Explanation of why this answer is correct and what the student should understand"
  }
]

Mix up question difficulty. Make explanations educational, not just "A is correct."
Return ONLY the JSON array, no other text.`,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    const questions = JSON.parse(responseText);

    return Response.json({ questions });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return Response.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
