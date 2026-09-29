# Physics Lesson 51 storyboard — Braking distance

Chapter P5, Forces. Folder `physics/lesson-51`, id `P-MOT-051-P`, skill `P-BRAKING`, spec 6.5.4.3.3 and 6.5.4.3.4. It owns the factors that change braking distance (speed, weather or road surface, tyres, brakes), braking as friction doing work and transferring energy from the kinetic store to the thermal stores of the brakes, the qualitative idea ½mv² = Fd (faster means much more work, so a bigger force or a longer distance), and the dangers of very large decelerations.

Big idea: braking gets rid of the car's kinetic energy. Anything that reduces grip or braking force makes the braking distance longer, and the faster the car, the more energy has to go.

Flow note: the four factors first (everyday, easy to picture), then what the brakes do to energy (the physics under every factor), then why speed matters so much using the energy idea. No calculation: the page's exam question needs ½mv² = Fd numerically and the brief keeps it qualitative.

Sections:
1. Start here (P51-01): braking in the rain.
2. What changes braking distance? (P51-02–04): recap → speed → weather and road → tyres → brakes. Checks: bald tyres; worn brakes.
3. What do the brakes do to energy? (P51-05–07): friction → energy moves to the brakes → brakes get hot. Checks: which store; what causes the heating.
4. Why does speed matter so much? (P51-08–10): energy = work done → faster means more energy → more force needed → big decelerations are dangerous. Checks: faster car; danger.
5. On your own (P51-11–15): a bar chart of road surfaces (assessment view), tyres and brakes advice, energy after braking, a factor recall, and a written explanation about an icy road.

Out of scope: any calculation with ½mv² = Fd (the page's exam question is not reused); thinking-distance factors (own lesson); the numbers of typical stopping distances.

Source boundary: supplied revision-guide page 218 (scope only); AQA 8464 Physics 6.5.4.3.3–6.5.4.3.4. All wording, numbers and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- "The speed is squared" is stated once, so students can see why a small rise in speed means a large rise in energy; no numbers are worked.
- The bar chart uses invented values (20, 40 and 100 m at one speed) to show a pattern, not real stopping data.

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, gentle tints, hand-drawn feeling, text >= 12px, readable at 360px. Use `physicsPalette` (kinetic and thermal store colours, friction/heat warm tint). Stylised side-on car, simple road strip.

Section 2 (one road scene reused, one factor highlighted per frame):
- `braking-recap`: a car on a road with the brake lights on; a bracket from the point where braking starts to where it stops, labelled "braking distance".
- `braking-speed`: two cars stopping with the same brake arrow ("same braking force"); the slower one (labelled "slow") stops after a short bracket, the faster ("fast") after a longer bracket.
- `braking-road`: a car tyre on the road with four small patches labelled "water", "ice", "oil", "leaves"; a small "less grip" tag and skid marks behind the car.
- `braking-tyres`: two tyre close-ups side by side: new tyre with deep grooves pushing water aside ("water pushed out"), bald tyre with smooth surface riding on a water layer ("skids on the water").
- `braking-brakes`: a wheel with a brake pad and disc; two panels: "new pads: big force" (thick arrow) and "worn pads: small force" (thin arrow).

Section 3 (one wheel-and-pad drawing, step highlighted):
- `braking-friction`: a wheel with a brake pad squeezed against the disc; arrows "pad pressed on wheel", label "friction".
- `braking-transfer`: `EnergyStoreBadge`s "kinetic energy store (car)" to "thermal energy stores (brakes)" joined by a `TransferArrow` labelled "work done by friction".
- `braking-hot`: the same wheel with the brake glowing warm (heat tint) and small thermometer icon; label "all of the kinetic energy is transferred".

Section 4:
- `braking-energy`: the equation card "½ × m × v² = F × d" with the four parts labelled below: "mass of car", "speed of car", "braking force", "braking distance"; left side coloured with the kinetic store colour, right side "work done by brakes".
- `braking-faster`: two cars, a slow one with a small kinetic-energy badge and a fast one with a much larger badge; note "speed is squared".
- `braking-force`: two identical braking-distance brackets of equal length; slow car with a short force arrow, fast car with a long force arrow; label "same distance, more work, bigger force".
- `braking-danger`: a car with two callouts: "brakes overheat" (hot wheel) and "car skids" (skid marks).

Question visual (assessment view):
- `braking-q-road` (P51-11): bar chart, x axis "Road surface" with bars "Dry", "Wet", "Icy", y axis "Braking distance (m)" ticks 0, 20, 40, 60, 80, 100; bar heights 20, 40 and 100; title note "Same car, same speed". Bars all one neutral colour. Neutral description; no conclusion text.
