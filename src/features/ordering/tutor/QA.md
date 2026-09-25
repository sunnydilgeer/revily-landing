# Lesson 11 QA

Run:

```bash
npm run verify:lesson11:tutor
npm run verify:maths:navigation
npx tsc --noEmit
npm run build
```

Visual checks:

- `/preview?lesson=11` opens Lesson 11 directly and retains the query after reload.
- All four video/step-by-step tab pairs load and expose text alternatives.
- Next, Back and Replay work with long sequences and mixed-form notation without horizontal overflow.
- Correct and incorrect submissions both expose complete replayable comparison working.
- Open decimal and whole-number interval answers accept valid alternatives but reject endpoints and invalid forms.
- The lesson progress strip contains four source sections plus Review.
- Contents lists Lesson 11 last, and the course overview shows all eleven lessons.
- At a mobile viewport, long choices wrap cleanly and the worked comparison board stays readable.
