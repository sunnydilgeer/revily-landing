# Lesson 10 QA

Run:

```bash
npm run verify:lesson10:tutor
npm run verify:maths:navigation
npx tsc --noEmit
npm run build
```

Visual checks:

- `/preview?lesson=10` opens Lesson 10 directly and retains the query after reload.
- All four video/step-by-step tab pairs load and expose text alternatives.
- Explanations open on step 1. Next step, Previous step and Start again work without horizontal overflow.
- Correct and incorrect submissions both expose complete replayable rounding working.
- `3.50`, `7.0`, `0.10` and `6.00` retain their accuracy-significant zeroes.
- The lesson progress strip contains four source sections plus Review.
- Contents and the course overview show Lesson 10 in registry order.
- At a mobile viewport, video, working, choices and numeric inputs remain fully usable.

Layout revision verified on 25 September 2026: all 33 screens at 390px, plus eight representative screens at 1280px and 320px. Browser checks covered a single question heading, no empty starting screen, hints, correct/incorrect answers, all explanation steps, backward navigation, restarting, and overflow. The matching Lesson 11 checks brought the total to 98 screen visits with no browser errors.
