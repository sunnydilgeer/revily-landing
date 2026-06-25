// app/api/generate-questions/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { paperBase64, skillName, difficulty, count, questionType } = body;

  const paperContextMessage = paperBase64
    ? {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: paperBase64,
            },
          },
          {
            type: "text",
            text: `This is a real AQA/Edexcel GCSE Foundation Maths past paper. Study the question phrasing, style, real-world contexts, mark allocations, and complexity carefully. You will use this as a style reference when generating new questions.`,
          },
        ],
      }
    : null;

  const prompt = buildPrompt(skillName, difficulty, count, !!paperBase64, questionType);

  const messages = paperContextMessage
    ? [paperContextMessage, { role: "user", content: prompt }]
    : [{ role: "user", content: prompt }];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      messages,
    }),
  });

  const data = await response.json();

  console.log("STATUS:", response.status);
  console.log("CONTENT:", JSON.stringify(data.content?.slice(0, 2)));

  return NextResponse.json(data, { status: response.status });
}

function buildPrompt(
  skillName: string,
  difficulty: string,
  count: string,
  hasPaper: boolean,
  questionType: string
): string {
  const styleInstruction = hasPaper
    ? `Mirror the question phrasing, real-world contexts, and mark-appropriate complexity from the past paper above.`
    : `Use authentic AQA/Edexcel Foundation phrasing conventions.`;

  const typeInstruction = questionType && questionType !== "mixed"
    ? `Generate ALL ${count} questions as type "${questionType}" (see question_type rules below).`
    : `Vary the question_type across the ${count} questions — aim for a natural mix of fluency, worded, and exam_style types. Include mixed_review only if it fits naturally.`;

  return `You are an expert GCSE Foundation Maths teacher creating multiple-choice quiz questions.

Generate exactly ${count} questions for the topic: "${skillName}"
Difficulty: ${difficulty}

${styleInstruction}

${typeInstruction}

QUESTION TYPE RULES — assign one question_type to every question:
- "fluency": bare procedural question, no real-world context. Tests whether the student can execute the method directly.
- "worded": same skill in a real-world scenario. Tests whether the student can recognise which method to use.
- "application": GCSE-style, often multi-step or combining skills. Mirrors actual exam paper style and complexity.
- "mixed_review": does not signal which skill is needed. Tests whether learning has generalised beyond immediate practice.
- "repair": targets a specific known misconception or weakness. Used after an error has been identified.
- "retrieval": brings a previously learned skill back after time has passed. Should feel slightly unfamiliar.
- "diagnostic": designed to reveal whether the student can access the skill at baseline. Clean, unambiguous, single-step.

PHRASING RULES — follow exactly:
- Use "Work out..." for calculation questions
- Use "Write down..." for recall or observation questions
- Never use "Calculate" — AQA/Edexcel do not use this
- When the answer must be simplified: add "Give your answer in its simplest form."
- When the answer format matters: add "Give your answer as a fraction / decimal / percentage." as appropriate
- Use real-world contexts where natural (money, measurements, people, everyday objects)
- 1-mark questions: single step. 2-mark questions: two steps. 3-4 mark questions: multi-step with method.

FORMAT RULES:
- 4 options per question, exactly one correct
- correct_option: lowercase "a", "b", "c", or "d"
- All maths must be wrapped in $...$ e.g. $\\frac{3}{4}$
- hints: exactly 3 strings, progressive. Hint 1 vague, hint 3 nearly gives it away. Use "you" language.
- misconceptions: 2-3 objects for likely wrong answers. Use "you" language. wrong_option must be lowercase.

WORKED SOLUTION RULES — read carefully:
- Split steps using [STEP] between each step
- Use [TRANSFORM: X -> Y] to show an equation or expression changing, where X is the before state and Y is the after state
- [TRANSFORM] ALWAYS requires BOTH a before and after separated by ->. For example: [TRANSFORM: 3 \\div 2 -> 1 \\text{ remainder } 1]
- NEVER write [TRANSFORM: result] with only one side — this will break rendering
- Write raw LaTeX inside [TRANSFORM: ] with NO surrounding $...$ dollar signs. Wrong: [TRANSFORM: $\\frac{3}{4}$ -> $\\frac{6}{8}$]. Correct: [TRANSFORM: \\frac{3}{4} -> \\frac{6}{8}]
- Text outside [TRANSFORM] blocks should be plain English with maths in $...$

EVERY question object MUST include ALL of these fields:
question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, question_type, worked_solution, hints, misconceptions

Return ONLY a raw JSON array — no markdown, no explanation, no code fences.

Example of ONE correctly formatted question:

{
  "question_text": "Work out $\\frac{3}{4}$ of 24",
  "option_a": "6",
  "option_b": "18",
  "option_c": "8",
  "option_d": "12",
  "correct_option": "b",
  "difficulty": "${difficulty}",
  "question_type": "fluency",
  "worked_solution": "[STEP] Divide 24 by the denominator [TRANSFORM: 24 \\div 4 -> 6][STEP] Multiply by the numerator [TRANSFORM: 6 \\times 3 -> 18]",
  "hints": [
    "Think about what the word 'of' means in maths.",
    "You need to split 24 into 4 equal parts first.",
    "Work out $24 \\div 4$ first, then multiply your answer by 3."
  ],
  "misconceptions": [
    {
      "wrong_option": "a",
      "title": "Divided but forgot to multiply",
      "description": "You correctly divided by 4 to get 6, but forgot to then multiply by the numerator 3."
    },
    {
      "wrong_option": "d",
      "title": "Divided by 2 instead of 4",
      "description": "You halved 24 to get 12, but the denominator is 4, not 2, so you need to divide into 4 equal parts."
    }
  ]
}

Now generate ${count} questions following this exact structure.`;
}