// app/api/generate-questions/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { paperBase64, skillName, difficulty, count, questionType, answerType } = body;

  // Defaults to "mcq" if not provided, so any existing caller that doesn't
  // send answerType keeps behaving exactly as before.
  const resolvedAnswerType: "mcq" | "free_response" =
    answerType === "free_response" ? "free_response" : "mcq";

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

  const prompt = buildPrompt(skillName, difficulty, count, !!paperBase64, questionType, resolvedAnswerType);

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
      model: "claude-sonnet-4-5",
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
  questionType: string,
  answerType: "mcq" | "free_response"
): string {
  const styleInstruction = hasPaper
    ? `Mirror the question phrasing, real-world contexts, and mark-appropriate complexity from the past paper above.`
    : `Use authentic AQA/Edexcel Foundation phrasing conventions.`;

  const typeInstruction = questionType && questionType !== "mixed"
    ? `Generate ALL ${count} questions as type "${questionType}" (see question_type rules below).`
    : `Vary the question_type across the ${count} questions — aim for a natural mix of fluency, worded, and exam_style types. Include mixed_review only if it fits naturally.`;

  // ── Format-specific instructions and example ────────────────────────────
  // The bulk of the prompt (style, question_type rules, phrasing rules,
  // worked solution rules) is identical for both answer types — only the
  // FORMAT RULES, the required-fields list, and the worked example differ.

  const formatRules = answerType === "free_response"
    ? `FORMAT RULES:
- This is a FREE RESPONSE question — the student will type their answer, not select from options.
- Do NOT include option_a, option_b, option_c, option_d, or correct_option.
- Instead include "correct_answer": the expected answer as a short string, e.g. "7.38" or "3:2" or "x = 5".
  Give the canonical/simplest form — a separate grading step already accepts mathematically
  equivalent forms (0.75 = 3/4 = 75%, etc.), so you don't need to list every variant here.
- All maths must be wrapped in $...$ e.g. $\\frac{3}{4}$
- hints: exactly 3 strings, progressive. Hint 1 vague, hint 3 nearly gives it away. Use "you" language.
- misconceptions: 2-3 objects describing the most likely WRONG ANSWERS a student might type
  (not wrong multiple-choice options, since there are none). Each misconception needs a short
  snake_case "wrong_option" label describing the mistake itself, e.g. "rounded_up_instead_of_down"
  or "divided_wrong_way_round" or "forgot_to_simplify". Use "you" language in the description.`
    : `FORMAT RULES:
- 4 options per question, exactly one correct
- correct_option: lowercase "a", "b", "c", or "d"
- All maths must be wrapped in $...$ e.g. $\\frac{3}{4}$
- hints: exactly 3 strings, progressive. Hint 1 vague, hint 3 nearly gives it away. Use "you" language.
- misconceptions: 2-3 objects for likely wrong answers. Use "you" language. wrong_option must be lowercase.`;

  const requiredFields = answerType === "free_response"
    ? `question_text, answer_type, correct_answer, difficulty, question_type, worked_solution, hints, misconceptions`
    : `question_text, answer_type, option_a, option_b, option_c, option_d, correct_option, difficulty, question_type, worked_solution, hints, misconceptions`;

  const exampleQuestion = answerType === "free_response"
    ? `{
  "question_text": "Work out $\\frac{3}{4}$ of 24",
  "answer_type": "free_response",
  "correct_answer": "18",
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
      "wrong_option": "divided_but_forgot_to_multiply",
      "title": "Divided but forgot to multiply",
      "description": "You correctly divided by 4 to get 6, but forgot to then multiply by the numerator 3."
    },
    {
      "wrong_option": "divided_by_2_instead_of_4",
      "title": "Divided by 2 instead of 4",
      "description": "You halved 24 to get 12, but the denominator is 4, not 2, so you need to divide into 4 equal parts."
    }
  ]
}`
    : `{
  "question_text": "Work out $\\frac{3}{4}$ of 24",
  "answer_type": "mcq",
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
}`;

  return `You are an expert GCSE Foundation Maths teacher creating ${answerType === "free_response" ? "free response" : "multiple-choice"} quiz questions.

Generate exactly ${count} questions for the topic: "${skillName}"
Difficulty: ${difficulty}

${styleInstruction}

${typeInstruction}

VARIETY RULE: Use genuinely different numbers, contexts, and structures across all ${count}
questions and across separate generation runs. Do NOT default to the most obvious textbook
example for this topic (e.g. for BIDMAS, avoid "12 + 3 × 4" — that exact expression has been
overused). Pick varied operations, varied number sizes, and varied real-world contexts for worded
questions so that two separate batches of questions on the same skill don't end up near-identical.

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

${formatRules}

WORKED SOLUTION RULES — read carefully:
- Split steps using [STEP] between each step
- Use [TRANSFORM: X -> Y] to show an equation or expression changing, where X is the before state and Y is the after state
- [TRANSFORM] ALWAYS requires BOTH a before and after separated by ->. For example: [TRANSFORM: 3 \\div 2 -> 1 \\text{ remainder } 1]
- NEVER write [TRANSFORM: result] with only one side — this will break rendering
- ONLY use [TRANSFORM] when a real calculation produces a real numeric or algebraic result on the
  "after" side. If a step is just regrouping, rewriting, or restating an expression WITHOUT
  computing anything (e.g. substituting one already-known value back into a longer expression),
  do NOT use [TRANSFORM] for that step — write it as plain text instead. NEVER put placeholder text
  like "next step" on the after side of a [TRANSFORM] — every [TRANSFORM] after-state must be an
  actual computed value or fully simplified expression.
  Example of a REGROUPING step (no real computation) — write as plain text, NOT [TRANSFORM]:
  "[STEP] Rewrite the expression with the bracket result substituted in: $12 \\div 4 + 2 \\times 5$"
  Example of a COMPUTATION step (real result) — THIS is when [TRANSFORM] is correct:
  "[STEP] Work out the division [TRANSFORM: 12 \\div 4 -> 3]"
- Write raw LaTeX inside [TRANSFORM: ] with NO surrounding $...$ dollar signs. Wrong: [TRANSFORM: $\\frac{3}{4}$ -> $\\frac{6}{8}$]. Correct: [TRANSFORM: \\frac{3}{4} -> \\frac{6}{8}]
- Text outside [TRANSFORM] blocks should be plain English with maths in $...$

EVERY question object MUST include ALL of these fields:
${requiredFields}

The "answer_type" field must be exactly "${answerType}" on every question.

Return ONLY a raw JSON array — no markdown, no explanation, no code fences.

Example of ONE correctly formatted question:

${exampleQuestion}

Now generate ${count} questions following this exact structure.`;
}