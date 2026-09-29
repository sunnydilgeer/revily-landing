# Physics Lesson 24 storyboard: Power of electrical appliances

Chapter P2, Electricity. Folder `physics/lesson-24`, id `P-ELE-024-P`, skill `P-APPLIANCE-POWER`, specs 6.2.4.1 and 6.2.4.2. It owns how appliances transfer energy electrically, E = P × t with the minutes-to-seconds step, and power ratings. Power in watts and P = E ÷ t come from the earlier Power lesson; E = QV and P = VI are the next lesson.

Big idea: when a current flows, charge does work and energy is transferred electrically to components. The energy transferred depends on the power and the time, E = P × t, and a power rating is the maximum safe power of an appliance.

Flow note: the energy-store story first (kettle, fan), then the equation with one worked example that includes the time conversion, then power ratings and the cost-versus-speed idea. Calculation flow: worked example (800 W, 2 minutes) → near-identical guided item (1500 W, 3 minutes) → independent items on your own (60 W, 5 minutes; 250 W, 4 minutes).

Sections:
1. Start here (P24-01): two kettles, 2000 W and 3000 W.
2. How do appliances transfer energy? (P24-02–04): work by charge → transferred electrically → kettle → fan. Checks: what happens as charge moves; the fan's energy transfer.
3. How much energy is transferred? (P24-05–07): power and time → E = P × t → worked time conversion → worked substitution. Checks: 1500 W for 3 minutes; doubling the time.
4. What is a power rating? (P24-08–10): maximum safe power → higher rating costs more → but it works faster. Checks: what 2000 W means; comparing two microwaves.
5. On your own (P24-11–15): two independent calculations; reading rating labels; the phone charger's energy transfer; a written method for a 1200 W heater.

Out of scope: P = VI, E = QV and P = I²R (next lesson); kilowatt-hours and electricity bills; rearranging E = P × t; efficiency (its own lesson). The exam questions on the page were not reused.

Source boundary: supplied revision-guide page 189 (scope only); AQA 8464 Physics 6.2.4.1 and 6.2.4.2. All wording, numbers, examples and diagrams are original (toaster, hairdryer, lamp, radio and heater replace the page's microwave and TV). Draft pending teacher review.

Judgement calls for the teacher:
- Energy-store wording follows the course rule "transferred from the X store to the Y store electrically": kettle to the thermal store of the element, fan from the chemical store of the battery to the kinetic store of the motor.
- All times are converted to seconds as an explicit step; answers are given in joules, not kilojoules.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling, generous white space. Import symbols and colours from `components/PhysicsKit.tsx` (`physicsPalette`, circuit symbols, energy-store badges). Circuit diagrams use the AQA symbols, straight wires and closed loops, ammeters in series and voltmeters across a component. Text in the SVG at least 12px; it must read on a 360px phone. Energy-store badges and the electrical transfer arrow come from PhysicsKit (same store names and colours as the Energy lessons). Appliances are soft, simple silhouettes.

- `appower-work`: a simple circuit (cell, lamp) with small charge dots moving around it and a label "work is done against resistance". A badge line "work done = energy transferred".
- `appower-electrically`: the same circuit with an "electrical" transfer arrow from the cell to the lamp. Label "energy transferred electrically".
- `appower-kettle`: kettle silhouette. A transfer arrow labelled "electrically" from a "mains supply" badge to a "thermal store" badge on the heating element; a small "heating" arrow to the water.
- `appower-fan`: handheld fan silhouette. A transfer arrow labelled "electrically" from the "chemical store" badge (battery) to the "kinetic store" badge (motor).
- `appower-depends`: an appliance with a clock icon and a power label; two boxes "how powerful (W)" and "how long (s)" joined by "×" to "energy transferred (J)".
- `appower-equation`: the equation card "energy transferred (J) = power (W) × time (s)" and "E = P × t", with unit tags coloured to match the three quantities.
- `appower-worked-time`: toaster silhouette labelled "800 W", a timer showing 2:00 and a conversion card "2 × 60 = 120 s" highlighted. Step chip "Step 1".
- `appower-worked-sub`: the equation card filled in: "E = 800 × 120 = 96 000 J" with the toaster faded to the side. Step chip "Step 2".
- `appower-rating`: a small rating plate on an appliance reading "2000 W" with the label "maximum safe power".
- `appower-cost`: two microwaves labelled "600 W" and "850 W" with equal 5-minute timers; the 850 W one has a longer energy bar. Label "same time: more power, more energy".
- `appower-faster`: the same two appliances, the higher-power one with a shorter timer bar for the same job. Label "higher power: faster, so less time".
- `appower-q-labels` (question, assessment view): three appliances numbered 1, 2 and 3, each with a rating plate: 1 "400 W", 2 "2200 W", 3 "1100 W". No names of appliances and no hints. Neutral accessible description: "Three numbered appliances with power ratings."
