# Physics Lesson 40 storyboard — Resultant forces and work done

Chapter P5, Forces. Folder `physics/lesson-40`, id `P-FOR-040-P`, skill `P-RESULTANT`, spec 6.5.1.4 and 6.5.2. It owns the resultant of forces in a straight line, work done W = Fs, 1 J = 1 Nm, the cm to m conversion, and friction heating (energy to the thermal store).

Big idea: several forces can be replaced by one resultant force; when a force moves something, work is done and energy is transferred, and work against friction heats things.

Flow note: resultant forces first (only adding and subtracting), then work done with one worked example, then the extra layers (cm to m, friction). Calculation flow: worked example (40 N, 3 m) → guided practice (25 N, 4 m) → conversion worked example (30 N, 50 cm) → guided (20 N, 40 cm) → independent (60 N, 250 cm).

Sections:
1. Start here (P40-01): two friends pushing a box.
2. What is a resultant force? (P40-02–04): one force instead of many → add → subtract → trolley. Checks: opposite forces; equal and opposite.
3. What is work done? (P40-05–07): force and distance → equation → worked example → joule. Checks: 25 N over 4 m; what is a joule.
4. What about centimetres and friction? (P40-08–10): convert → example → friction → heat. Checks: 20 N over 40 cm; which store.
5. On your own (P40-11–15): 60 N over 250 cm; three forces; comparing pushes; rubbing hands; written energy story.

Out of scope: forces at angles, free-body diagrams with vertical forces, Newton's laws (later), power.

Source boundary: supplied revision-guide page 206 (scope only); AQA 8464 Physics 6.5.1.4 and 6.5.2. All wording, numbers and examples are original (the book's trolley and 20 N over 20 cm example are not reused). Draft pending teacher review.

Judgement calls: unit conversion is an explicit worked step; the energy-store language matches the earlier energy lessons (kinetic and thermal stores).

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, gentle tints, hand-drawn feeling, text >= 12px, readable at 360px. Use `physicsPalette` and PhysicsKit helpers (graph axes, energy-store badges, transfer arrows). Walkthrough frames in one section reuse one drawing and change the highlight. Force arrows one colour per force; the resultant is drawn in a stronger outline colour, offset to one side.

Section 2:
- `resultant-idea`: a box with three arrows on it, an equals sign, and the same box with one thick arrow; labels "several forces" and "one resultant force".
- `resultant-add`: two people pushing a car to the right, arrows 200 N and 300 N pointing the same way, and the resultant arrow "500 N" below.
- `resultant-subtract`: a box with equal 15 N arrows in opposite directions and a resultant label "0 N"; a second small box with 20 N right and 6 N left showing subtract.
- `resultant-trolley`: a trolley with 12 N to the right and 8 N to the left, and the resultant arrow "4 N right" below; working "12 N − 8 N = 4 N" in a card.

Section 3:
- `resultant-work`: a hand pushing a box along the floor, distance marked with a double arrow labelled "distance moved"; label "energy transferred = work done".
- `resultant-eq`: a card "work done = force × distance" and "W = Fs", with unit tags J, N, m in matching colours.
- `resultant-example`: the box pushed 3 m with a 40 N arrow, "W = 40 × 3 = 120 J" beside it.
- `resultant-joule`: a 1 N arrow moving a small box 1 m with the card "1 J = 1 Nm".

Section 4:
- `resultant-convert`: a ruler-style bar marked "50 cm" and "0.5 m" beside it with "÷ 100".
- `resultant-convert-eg`: the box with a 30 N arrow moving 50 cm; steps "50 cm = 0.5 m" then "W = 30 × 0.5 = 15 J".
- `resultant-friction`: a box being pushed along a rough carpet (zig-zag surface) with a friction arrow opposing; labels "friction", "kinetic store" (energy-store badge, moving).
- `resultant-heat`: the same scene with small warm waves at the contact and a "thermal store" energy badge; label "temperature rises".

Question visual (assessment view):
- `resultant-q-cart` (P40-03): a cart with a 20 N arrow to the right and a 6 N arrow to the left; no resultant shown. Neutral description: "A cart with two forces in opposite directions."
