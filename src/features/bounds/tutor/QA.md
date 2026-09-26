# Lesson 13 QA

Run:

```bash
npm run verify:lesson13:tutor
npm run verify:maths:navigation
npm run build
```

Checked on 26 September 2026:

- All 18 verifiers pass; production build passes.
- `/preview?lesson=13` opens the lesson. The number line shows a filled dot at the lower bound (included) and an open dot at the upper bound (not included); test values show in green inside, red outside.
- Wrong answers give specific messages: whole unit instead of half, the other bound, the value itself, rounding instead of truncating (and the reverse), and half a unit used for a truncated value.
- The right option is in a different position on each multiple-choice question.
- All 35 screens at 320px wide, with answers checked and working opened: no sideways scrolling.
