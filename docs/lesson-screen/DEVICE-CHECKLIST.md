# Real-device checklist

All automated testing on 10 October ran in Chromium. These checks need a real **iPhone (Safari)** and a real **Android phone (Chrome)**, because the lesson screen relies on features that behave differently there: `100dvh` and the keyboard, CSS `zoom` for fitting diagrams, `mask-image` for the roll's fades, and `:has()`.

Open `/preview` (with the preview password) on each phone. It takes about 15 minutes per phone. Note anything odd with a screenshot and the lesson number.

## 1. The fixed screen

- [ ] Open any lesson. The page doesn't scroll when you drag it; only the card scrolls, and only when it is long.
- [ ] The top bar (✕, title, progress, Contents) stays at the top; the bottom bar stays at the bottom, clear of the iPhone home bar.
- [ ] Rotate to landscape and back: nothing is cut off, and the bars stay put.
- [ ] Safari only: when the address bar shrinks or grows, the bottom bar doesn't jump or leave a gap.

## 2. Keyboard

- [ ] Fractions (lesson 8), a question with an answer box: tap the box. The keyboard opens and the box and the Check button stay visible above it.
- [ ] Type an answer and tap Check without closing the keyboard first: it works.
- [ ] Close the keyboard: the screen returns to full height, nothing stuck halfway.

## 3. Worked examples and the roll

- [ ] Simultaneous equations (lesson 27): step through the first worked example with the yellow button. Each step's heading and all its lines are visible; earlier lines fade out at the top of the working.
- [ ] Swipe up inside the working: earlier lines come back. The next step brings you back down.
- [ ] Percentages (lesson 32) and Ratio (lesson 30): the picture (hundred square, bars) stays still while the working rolls under it.
- [ ] The fades at the top and bottom of the working look soft, not like a hard grey band (`mask-image`).

## 4. Diagrams and graphs

- [ ] Geometry (Angle facts, Sectors, Transformations): labels are readable, never tiny.
- [ ] A fitted diagram looks sharp, not blurry (CSS `zoom` on Safari).
- [ ] Graphs (Coordinates): drag the dot. It lands exactly where your finger lets go, including after rotating the phone.
- [ ] Geometry angle and measuring boards: dragging is accurate.

## 5. Bottom bar and feedback

- [ ] Answer wrong: the red panel shows "See the working" as a link beside Continue, on one row.
- [ ] Tap "See the working": the working opens and can be stepped through.
- [ ] The round Back button (‹) works and is easy to hit.
- [ ] Small buttons are still easy to hit: ⓘ "Why?", and the worked example's ← and "Again" (these are known to be under 44px).

## 6. Contents and navigation

- [ ] Contents opens, scrolls inside itself, and jumps to a skill.
- [ ] ✕ returns to Chapters; the browser back button returns to the lesson where you were.

## 7. Settings

- [ ] iPhone: Settings → Accessibility → Motion → Reduce Motion on. The roll jumps instead of gliding.
- [ ] Larger text (iPhone: Display & Brightness → Text Size, two steps up): the lesson still fits or scrolls inside the card, and nothing overlaps.
