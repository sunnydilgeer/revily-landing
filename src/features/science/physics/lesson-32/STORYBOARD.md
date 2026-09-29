# Physics Lesson 32 storyboard — The structure of the atom

Chapter P4, Atomic structure. Folder `physics/lesson-32`, id `P-ATM-032-P`, skill `P-ATOMSTRUCT`, spec 6.4.1.1 and 6.4.1.2. It owns the modern nuclear model, the particle charges table, no overall charge, sizes (1 × 10⁻¹⁰ m; nucleus over 10 000 times smaller; standard form in one clause), electrons moving between energy levels by absorbing or releasing EM radiation, and ions formed by losing electrons. Chemistry teaches the atom already, so this lesson goes to the physics uses: energy levels and radiation.

Big idea: an atom is a tiny, heavy, positive nucleus with electrons in energy levels. Electrons move between levels by absorbing or releasing EM radiation.

Flow note: parts and charges first (everything else needs them), then no overall charge (needs charges), then size (needs the picture), then energy levels and ions last (need electrons and charge). Ions come at the end because losing an electron only makes sense once "no overall charge" is secure.

Sections:
1. Start here (P32-01): the centre of an atom.
2. What is inside an atom? (P32-02–04): nucleus and electrons, charges table, no overall charge. Checks: particles in the nucleus; electron count from protons.
3. How big is an atom? (P32-05–07): atom radius, nucleus size, small but heavy. Checks: typical radius; nucleus compared with atom.
4. What do electrons do? (P32-08–10): energy levels, moving up, moving down, becoming an ion. Checks: moving up; losing an electron.
5. On your own (P32-11–14): overall charge of a new atom, an energy-level diagram, a statement to pick, a written description.

Out of scope: electronic structure filling rules, calculations with standard form, which EM waves are involved (later lesson).

Source boundary: supplied revision-guide page 198, left (scope only); AQA 8464 Physics 6.4.1.1, 6.4.1.2. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The standard form number is stated with its decimal in one clause; no manipulation is asked.
- The stadium and pea comparison is an original analogy and is roughly to scale for 10 000 times.
- Electrons leaving the atom is taught as "absorbs enough EM radiation", as on the page.

## Diagram specs
Same particle colours as the previous lesson (protons coral with "+", neutrons grey, electrons blue with "−"). Soft shapes, `physicsPalette`, text at least 12px, readable at 360px.

- `nucatom-model`: a nucleus of touching protons and neutrons in the centre, dotted circular orbits with a few electrons. Labels: "nucleus (protons and neutrons)", "electrons", "energy levels".
- `nucatom-charges`: a small table drawn as three rows with particle icons: proton "positive, +1", neutron "neutral, 0", electron "negative, −1". Beside it a mini atom.
- `nucatom-neutral`: an atom with 3 protons and 3 electrons, each marked + or −, with a balance or pairing lines joining each + to a −, and the caption "3 + and 3 − cancel: no overall charge".
- `nucatom-size`: a ruler-like scale, an atom drawn with a radius arrow labelled "radius about 1 × 10⁻¹⁰ m", and a small note "0.0000000001 m". Not to scale.
- `nucatom-nucleus-size`: an atom outline with a dot for the nucleus, an arrow "over 10 000 times smaller" from atom radius to nucleus radius, and a small "pea in a stadium" inset.
- `nucatom-mass`: the atom with a big shaded "most of the mass" callout on the nucleus dot and a "mostly empty space" callout on the gap between nucleus and electrons.
- `nucatom-levels`: atom with three energy levels labelled "1", "2", "3" and an arrow pointing outwards labelled "further out, more energy".
- `nucatom-up`: atom with one electron jumping from level 1 to level 2, and a wavy arrow labelled "EM radiation absorbed" arriving into the electron.
- `nucatom-down`: the reverse: an electron from level 2 to level 1, and a wavy arrow labelled "EM radiation released" leaving.
- `nucatom-ion`: three small stages left to right: neutral atom (3 protons, 3 electrons), the outer electron leaving with an absorbed wavy arrow, then a "positive ion" with a "+" charge in square brackets (3 protons, 2 electrons).
Question visual:
- `nucatom-q-levels` (assessment view): an atom with two energy levels; one electron shown moving inward from the outer to the inner level with an arrow, and a wavy arrow leaving. No wording such as "released" or "lower". Neutral accessible description: "An atom with an electron moving between energy levels and a wavy arrow leaving."
