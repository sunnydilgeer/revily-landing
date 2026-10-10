# "See the working" vs worked examples

How the working shown after a student answers should behave, so it feels like part of the lesson rather than a separate thing. **Decision pending (Sunny).** Nothing here is built.

## 1. What happens today

A worked example (teaching screen) and the working after an answer show the same maths with the same renderers, but they behave differently. There are four versions of "after an answer":

| Where | Trigger | What appears | Controls |
|---|---|---|---|
| Most lessons (`TutorMethodLessonView.tsx`) | "See the working" link in the result panel | A white panel (`.rung-working-panel`) inside the card, under the question; the question's own picture hides while it is open | Its own ← / dots / **Next step** inside the panel; the bottom bar still says Continue; the result panel shrinks to one line |
| Order of operations (2), Place value (3) | Automatically, on any answer, when the question has no `working` | A worked explanation (`ExplanationSteps`) inside the card | Its own step controls |
| Number types (1) | n/a | The result message and the answer only | none |
| Practice and Exam boss fights | "See the working" link under the part | The step chain inline, page scrolls | Its own Next step |

Compared with a teaching screen's worked example:

| | Worked example | "See the working" (most lessons) |
|---|---|---|
| Where the next step is pressed | The bottom bar's main button | A small button inside the panel |
| Diagram | Pinned at the top of the card | Redrawn inside the panel; the question's picture hides |
| Working | Rolls in the working window | Rolls in a window inside a white panel inside the card |
| Bottom bar | Next step → Continue | A result panel with Continue throughout |
| Looks | The card itself | A box inside the card |

That is why it "feels separate": two buttons that move things on, a box inside a box, and the picture jumping when the panel opens.

## 2. Options

### A. Replay the question as a worked example (recommended for a wrong answer)

"See the working" turns the card into a teaching screen for this question:

- the question's picture stays as the pinned diagram, with the student's answer marked;
- the working rolls in the working window exactly as in a worked example;
- the bottom bar's main button steps through it ("Next step" … then "Continue");
- the result ("Not quite: the answer is 2/3") shrinks to a small badge at the top of the card.

**For:** one way of learning everywhere, one button, the picture never moves. **Against:** the student's own answer is less prominent while the working plays. **Effort:** medium. It reuses `WorkedChain`, `DriveSteps` and the frame; the result panel needs a compact "badge" state.

### B. Same panel, worked-example controls

Keep the panel inside the question card, but drive it from the bottom bar like a worked example (the bar says "Next step" while the working is open, then "Continue"), and drop the white box so it sits on the card's paper.

**For:** smallest change; the answer stays in view. **Against:** the question, the answer, the result and the working still share one card, which is tight on laptops and phones.

### C. Answer reveal: all at once

Show the whole working at once (no stepping), rolled to the answer, with ← to step back through it if wanted.

**For:** quickest for a student who only wants to check. **Against:** less teaching; a wrong answer is the moment the steps matter most.

### Suggested combination

- **Wrong answer:** A, opened from "See the working", with that link made more prominent.
- **Right answer:** C, as an optional "See the working" link.
- **Order of operations, Place value, Number types:** the same as everything else (move them onto `state.working`), so there is one behaviour.
- **Practice and boss fights:** the same pattern later; they are outside the fixed lesson screen today.

## 3. Questions for Sunny

1. After a wrong answer, should the working open by itself (and the student taps Continue when done), or only when they tap "See the working"?
2. While the working plays, how visible must the student's own answer stay (marked on the diagram, a badge, or the full result panel)?
3. After a right answer, offer the working at all?
4. Should a second wrong attempt exist (try again before seeing the working), or always move on?
5. Should Practice and boss fights follow the same pattern?

## 4. When decided

Write the decision into `src/features/EXPLANATIONS.md` (it already covers "See the working" versions in its checklist) and into LAYOUT-FRAMEWORK.md section 3, then build it as its own PR with `roll.cjs` extended to the working after an answer.
