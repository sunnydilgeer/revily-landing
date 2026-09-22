# Lesson 9 QA

Run:

```bash
npm run verify:lesson9:tutor
npm run verify:maths:navigation
npx tsc --noEmit
npm run build
```

Visual checks:

- `/preview?lesson=9` opens Lesson 9 directly and retains the query after reload.
- All six video/step-by-step tab pairs load and expose text alternatives.
- Next, Back and Replay work for conversion steps without horizontal overflow.
- Correct and incorrect submissions both expose replayable full working.
- The lesson progress strip contains six conversion sections plus Review.
- Contents lists Lesson 9 last and expands its section list when current.
- The overview shows nine lessons and the full Lesson 9 title.
- At a mobile viewport, the three equivalent-form cards stack and all fraction inputs remain usable.
