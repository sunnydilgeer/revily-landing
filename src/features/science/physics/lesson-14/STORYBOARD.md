# Physics Lesson 14 storyboard: Trends in energy resource use

Topic P1 Energy. Folder `physics/lesson-14`, id `P-RES-014-P`, skill `P-TRENDS`, prefix `etrend-`. It owns why UK electricity use rose and then fell, the pressure for more renewables, and the limits on renewables (evidence, money, politics, people).

Big idea: the energy resources we use change over time. People and governments push for more renewables, but money, politics and people slow the change, and scientists can only advise.

Flow note: the schematic graph comes first, so the trend is seen before it is explained. Next the chain of pressure (public, governments, providers, car companies) explains why the mix is changing. The last section explains why change is slow, one frame per factor. This is a lesson about reasons, so the questions ask for reasons and reading a shape, not for numbers.

Sections:
1. Start here (P14-01): gadgets in the home.
2. How has electricity use changed? (P14-02–04): rise → slow fall (graph) → why → still need non-renewables. Checks: reason for the rise; reason for the fall.
3. Why do people want more renewables? (P14-05–07): damage → pressure on governments → pressure on providers → cars → chain. Checks: why people want them; why providers build.
4. What holds renewables back? (P14-08–10): evidence is not enough → money → politics → people → output on demand. Checks: an example of money; which factor.
5. On your own (P14-11–15): reading the graph; a reason for the change; targets and providers; the three factors; a written two-and-one answer.

Out of scope: real figures and dates for individual resources, energy policy names, carbon tax, ethics beyond the page, Higher-tier content.

Source boundary: supplied revision-guide page 178 (scope only; page 179 is the topic test, quiz ideas only); AQA 8464 Physics 6.1.3. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The graph has no numbers. The page gives the shape and the dates (rise across the 20th century, slow fall since the early 2000s), so the axes are labelled only "year" and "electricity use".
- "Ethical" is glossed as "right or wrong", as the page does.
- The page's link to efficiency (previous lessons) is one clause.

## Diagram specs
Organic, soft and slightly hand-drawn, as in Science Lessons 17 and 18: rounded shapes, gentle tints with a darker stroke of the same hue, generous white space, no more detail than Foundation needs, readable at 360px. Use PhysicsKit (physicsPalette, energy-store badges, transfer arrows) and the course colours: yellow = energy from the Sun, blue = water, green = plants, amber = fuels. Text in the SVG at least 12px. Every SVG has role="img" and a title; assessment views hide the answer-giving words but keep the numbers. A single line graph is reused through the first section. The pressure chain uses simple round icons joined by arrows.

- `etrend-rise`: a schematic graph, x axis "year" with tick labels 1900 and 2000, y axis "electricity use". A smooth line rising a lot across the 20th century, with a shaded band for the 20th century. Small icons under the line: more people, more gadgets. Labels "population grew", "more things use electricity".
- `etrend-graph`: the same graph continued: the line peaks in the early 2000s and bends slowly down. The peak is marked; the falling part is highlighted. Label "since the early 2000s: decreasing slowly".
- `etrend-why-fall`: the falling part of the graph with two callouts: an appliance with an "A" energy label "more efficient appliances: less energy wasted" and a hand at a switch "people more careful with energy".
- `etrend-still`: three round icons: a power plant "electricity", a car "transport", a radiator "heating", each with a small tag "still some non-renewables".
- `etrend-damage`: a smoking chimney beside a wind turbine; a sad Earth by the chimney and a happy Earth by the turbine. Labels "fossil fuels: very damaging", "renewables: better for the environment", small note "better to switch before non-renewables run out".
- `etrend-pressure`: people and flags on the left with arrows pushing to a government building on the right. Labels "the public", "other countries", "government", "targets for renewables".
- `etrend-providers`: a government building with a target arrow pointing to an energy provider (a company building with a plug) which builds a wind farm; a coin with a downward arrow "lose business and money if it does not".
- `etrend-cars`: three cars in a row: petrol car, hybrid (two small fuel icons), electric car with a plug. Labels "petrol", "hybrid: two fuels", "electric".
- `etrend-chain`: a four-step chain of round icons joined by arrows: worried people, government target, providers build renewables, energy resources change. Numbered 1 to 4.
- `etrend-evidence`: a scientist with a report and a speech bubble "advice", and a government building, company and people with a broken arrow from the scientist. Label "scientists can only give advice". Three tags below: "money", "politics", "people".
- `etrend-money`: a coin pile beside a new power plant "building costs money", a test tube "more research needed", an electric car with a price tag above a petrol car "usually more expensive".
- `etrend-politics`: a bill and a tax form with a coin "paid for through bills or taxes"; two speech shapes "don't want to pay" and "can't afford to pay". Small scale icon "ethical?".
- `etrend-people`: a house near a wind farm and a dam, with a person frowning "don't want to live near"; a scale icon "ethical to make people put up with it?".
- `etrend-demand`: a demand bar with an up arrow. Two supply bars: a fossil-fuel power plant bar rising to meet it and a wind turbine bar locked flat. Label "some renewables cannot increase output on demand".
- `etrend-q-graph` (question, assessment view): the same graph, with three points marked A (about 1900), B (the peak, early 2000s) and C (the latest year, after the slow fall). No words other than the axis labels "year" and "electricity use", and the letters. Neutral description: "A graph of electricity use over time with three marked points A, B and C."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
