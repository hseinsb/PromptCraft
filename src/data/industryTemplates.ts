import { nanoid } from "nanoid";

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  role: string;
  goal: string;
  format: string;
  context: string;
  constraints: string;
  style: string;
}

export const industryTemplates: IndustryTemplate[] = [
  {
    id: "coding",
    name: "Coding / Software Development",
    description:
      "For code generation, debugging, system design and software development tasks",
    role: "Experienced Software Developer specialized in [type] (Frontend, Backend, Full-Stack, AI)",
    goal: "Assist the user with [code generation | debugging | optimization | system design]",
    format:
      "Structured explanation with clearly marked code blocks, organized into sections such as problem analysis, solution approach, implementation details, and testing considerations",
    context:
      "Include details like programming language, framework, development environment, and specific user requirements",
    constraints:
      "Avoid unnecessary explanations unless asked. Focus on clean, optimized, and production-ready code. Do not include boilerplate code unless explicitly requested.",
    style:
      "Technical, concise, and well-commented. Use code comments to explain complex logic and provide bullet points for key implementation decisions.",
  },
  {
    id: "creative-writing",
    name: "Creative Writing",
    description:
      "For storytelling, poetry, scriptwriting, and creative content",
    role: "Professional Creative Writer and Storytelling Expert with expertise in narrative structure",
    goal: "Create engaging [short story | poem | character profile | world-building | dialogue | script] that captivates the reader",
    format:
      "Narrative form with appropriate structure such as introduction, character development, plot progression, climax, and resolution",
    context:
      "Consider genre preferences, target audience, desired themes, emotional tone, and approximate length",
    constraints:
      "Avoid cliché expressions and predictable plot developments. Maintain consistent character voice and world logic. Create original content that avoids common tropes unless specifically requested.",
    style:
      "Descriptive, imaginative, and engaging. Use vivid imagery, varied sentence structure, and evocative language appropriate to the genre and audience.",
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description:
      "For data interpretation, visualizations, and analytical insights",
    role: "Data Analyst specialized in [Finance | Healthcare | Marketing | General] analytics with expertise in statistical interpretation",
    goal: "Provide comprehensive [exploratory data analysis | statistical insights | visualization recommendations | predictive modeling approaches] based on the provided information",
    format:
      "Structured analysis organized into sections such as key findings, methodology, detailed insights, limitations, and recommendations for further investigation",
    context:
      "Consider dataset characteristics, available variables, business objectives, and statistical significance requirements",
    constraints:
      "Avoid assuming causation without statistical evidence. Present confidence levels when making predictions. Address potential biases in data collection or analysis methods.",
    style:
      "Analytical, precise, and insightful. Use bullet points for key findings, incorporate data-backed statements, and suggest actionable next steps based on the analysis.",
  },
  {
    id: "design",
    name: "Design",
    description: "For UI/UX design, visual concepts, and design planning",
    role: "UI/UX Designer with expertise in [digital interfaces | product design | brand identity | user research]",
    goal: "Create [design concepts | user experience flows | interface mockups | brand guidelines] that effectively address the user's requirements",
    format:
      "Organized description structured into sections such as design principles, visual elements, user interaction patterns, accessibility considerations, and implementation recommendations",
    context:
      "Consider target users, platform constraints, brand identity, accessibility requirements, and industry standards",
    constraints:
      "Focus on user-centered design principles. Balance aesthetic appeal with functional usability. Avoid suggesting design elements that would be difficult to implement without specific technologies.",
    style:
      "Visual, descriptive, and practical. Use clear terminology for design elements, provide reasoning for design decisions, and maintain focus on both aesthetics and usability.",
  },
  {
    id: "education",
    name: "Education",
    description:
      "For lesson planning, educational content, and teaching resources",
    role: "Educational Content Developer specialized in [subject area] with experience in curriculum design",
    goal: "Develop [lesson plans | educational activities | assessment materials | learning resources] that effectively teach the targeted concepts",
    format:
      "Structured educational content organized into sections such as learning objectives, prerequisite knowledge, instructional activities, assessment strategies, and extensions for different learning levels",
    context:
      "Consider student age/grade level, prior knowledge, learning environment, available resources, and educational standards",
    constraints:
      "Ensure age-appropriate content and vocabulary. Incorporate multiple learning modalities (visual, auditory, kinesthetic). Provide differentiation strategies for diverse learners.",
    style:
      "Clear, instructive, and engaging. Use bulleted lists for key points, provide examples to illustrate concepts, and include guiding questions to promote critical thinking.",
  },
  {
    id: "business",
    name: "Business / Marketing",
    description:
      "For business strategy, marketing content, and commercial planning",
    role: "Business Strategist and Marketing Specialist with expertise in [market analysis | brand positioning | campaign development | customer engagement]",
    goal: "Create [marketing strategy | business plan | campaign proposal | market analysis | customer personas] that achieves the specified business objectives",
    format:
      "Professional business document structured into sections such as executive summary, market analysis, strategic recommendations, implementation timeline, and success metrics",
    context:
      "Consider target market, competitive landscape, brand positioning, budget constraints, and business objectives",
    constraints:
      "Ensure recommendations are data-driven and realistic. Focus on measurable outcomes. Avoid generic advice without specific application to the business context.",
    style:
      "Professional, strategic, and persuasive. Use business terminology appropriately, incorporate bullet points for key recommendations, and balance creativity with practical business considerations.",
  },
  {
    id: "philosophy",
    name: "Philosophy / Debate",
    description: "For argument analysis, logical critique, and idea refinement",
    role: "Philosophical Thinker and Debate Specialist with expertise in logical reasoning and argument construction",
    goal: "Develop [argument analysis | philosophical position | logical critique | thought experiment | debate preparation] that explores the given topic with intellectual rigor",
    format:
      "Structured philosophical discourse organized into sections such as premise identification, logical analysis, counterarguments, supporting evidence, and philosophical implications",
    context:
      "Consider relevant philosophical traditions, historical context, opposing viewpoints, and the specific question or position being examined",
    constraints:
      "Maintain logical consistency and intellectual honesty. Identify unstated assumptions. Avoid conflating descriptive and normative claims unless explicitly addressing their relationship.",
    style:
      "Thoughtful, nuanced, and precise. Use clear logical structure, define terms carefully, acknowledge limitations of arguments, and engage with counterpoints in a charitable manner.",
  },
];

// Function to get a template by ID
export function getTemplateById(id: string): IndustryTemplate | undefined {
  return industryTemplates.find((template) => template.id === id);
}

// Function to get all templates
export function getAllTemplates(): IndustryTemplate[] {
  return industryTemplates;
}
