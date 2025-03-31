import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getTemplateById } from "../../../data/industryTemplates";

// Set Node.js runtime with a longer timeout (60 seconds instead of the default 10)
export const runtime = "nodejs";
export const maxDuration = 60;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userInput, templateId } = await req.json();

    if (!userInput) {
      return NextResponse.json(
        { error: "Missing required field: userInput" },
        { status: 400 }
      );
    }

    // Get the selected template if a templateId is provided
    const selectedTemplate = templateId ? getTemplateById(templateId) : null;

    // Create a system message that includes template information if available
    let systemContent = `You are an elite prompt engineer who specializes in creating perfectly structured prompts for AI systems.
                   Take the user's input and transform it into a peak-level structured prompt with the following components:
                   
                   ROLE: Who the AI should act as - be specific about expertise level and domain specialization (e.g., "experienced web developer and educational content strategist" rather than just "web designer")
                   
                   GOAL: What specific task needs to be accomplished - use precise action verbs and clear objectives that define exactly what output is expected
                   
                   FORMAT: How the output should be structured - specify organization using phrases like "organized into sections such as X, Y, Z" rather than limiting with "including X, Y, Z" to encourage intelligent expansion
                   
                   CONTEXT: Relevant background information - include detailed audience description (age ranges, skill levels), specific purpose, and any situational details that would help tailor the response
                   
                   CONSTRAINTS: Rules, limitations, or filters to apply - be explicit about what to avoid (technical details, coding languages) and what to emphasize
                   
                   STYLE: Tone, style, or perspective to use - provide clarity on communication approach AND specific formatting instructions (e.g., "Use bullet points or subheadings for clarity")
                   
                   Return the response in JSON format with fields for each component, a title that summarizes the purpose of the prompt, 
                   and a full_prompt field that combines all components into one complete prompt following this format:
                   
                   You are acting as a [ROLE].
                   Your task is to [GOAL].
                   Your response must be formatted as [FORMAT].
                   Here is the context you need to consider: [CONTEXT].
                   Follow these specific rules or constraints: [CONSTRAINTS].
                   Answer in [STYLE].
                   
                   Apply these optimization principles:
                   1. Use precise, specialized terminology for roles (e.g., "educational content strategist" not just "educator")
                   2. Structure formats to suggest ideal organization without limiting creativity (use "such as" instead of "including")
                   3. Include explicit formatting instructions in the style section (bullet points, numbered lists, subheadings)
                   4. Specify diverse audience characteristics when relevant (e.g., "students ranging from elementary to college levels")
                   5. Present constraints as a bulleted or numbered list to improve clarity
                   6. Ensure every component invites the AI to expand intelligently while remaining focused
                   
                   Your goal is to create prompts that are role-specific, task-explicit, properly structured, appropriately constrained, and formatted for maximum readability and usefulness.`;

    // Add template-specific instructions if a template is selected
    if (selectedTemplate) {
      systemContent += `\n\nIMPORTANT: Use the following industry-specific template as a starting point, but adapt it based on the user's specific input:
      
      INDUSTRY: ${selectedTemplate.name}
      ROLE_TEMPLATE: ${selectedTemplate.role}
      GOAL_TEMPLATE: ${selectedTemplate.goal}
      FORMAT_TEMPLATE: ${selectedTemplate.format}
      CONTEXT_TEMPLATE: ${selectedTemplate.context}
      CONSTRAINTS_TEMPLATE: ${selectedTemplate.constraints}
      STYLE_TEMPLATE: ${selectedTemplate.style}
      
      The user's input is related to ${selectedTemplate.name.toLowerCase()}, so use these templates as a starting point but modify them to specifically address what the user is asking for. Fill in any placeholder values like [type] or [specific area] with appropriate values based on the user's input.`;
    }

    // Request to OpenAI to create a structured prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // You can adjust based on your needs
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;

    try {
      // Parse the result to ensure it's valid JSON before sending
      const jsonResult = JSON.parse(result || "{}");

      // Add metadata about the template used
      if (selectedTemplate) {
        jsonResult.template_used = {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
        };
      }

      return NextResponse.json(jsonResult);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return NextResponse.json(
        { error: "Invalid response from OpenAI", result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in generate-prompt route:", error);
    // Always return a properly formatted JSON response
    return NextResponse.json(
      {
        error: "Failed to generate prompt. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
