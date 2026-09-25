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
- Next, Back and Replay work without horizontal overflow.
- Correct and incorrect submissions both expose complete replayable rounding working.
- `3.50`, `7.0`, `0.10` and `6.00` retain their accuracy-significant zeroes.
- The lesson progress strip contains four source sections plus Review.
- Contents and the course overview show Lesson 10 in registry order.
- At a mobile viewport, video, working, choices and numeric inputs remain fully usable.
