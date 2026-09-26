# Lesson 12 QA

Run:

```bash
npm run verify:lesson12:tutor
npm run verify:maths:navigation
npm run build
```

Checked on 26 September 2026:

- All 17 verifiers pass; production build passes.
- `/preview?lesson=12` opens the lesson. Worked examples step through, and the video button shows on both source worked examples.
- Wrong answers give specific messages: exact answer instead of an estimate, rounding the answer at the end, wrong-size answer, and question-specific traps (e.g. £11.90 → £12, 46p not changed to £0.50, dividing by 0.5).
- A typed £ sign is accepted.
- All 28 screens at 320px wide: no sideways scrolling, including the fish-tank working after a wrong answer.
