# B-CELL-001: Cells — animal, plant and bacterial

**Beta scaffold / not teacher-reviewed.** Version 0.3.0 has 42 screens; duration must be measured with learners. Animal cells, plant cells and bacterial cells are the organising subjects. Comparison and classification are subsequent observations. This covers the supplied “Cells” page scope, not the whole Cell Biology topic or microscopy practical. [Realignment brief](./REALIGNMENT.md) records the earlier scope/design decisions.

Outcome: identify common animal/plant/bacterial structures and their functions, distinguish eukaryotes/prokaryotes, compare cells, convert mm/µm, use simple standard form and ratios, and estimate sub-cellular area. The observation connection introduces limits; magnification calculations and full practical technique come later.

## Screen-by-screen storyboard

The exact prompts, answer options, hints, accepted answers and numbered reasoning are in `lesson.ts` and `expandedContent.ts`. `teachingFrames.ts` is the authoritative teaching text; script fallbacks are generated from those frames. All questions and illustrations are original Revily drafts.

| Screen | Learner action | Science purpose / evidence |
| --- | --- | --- |
| B1-01 | Choose what a cell is | Prior-knowledge signal, not a gate or mastery item |
| B1-02 | Meet a complete animal cell, then explore three parts | Animal membrane, cytoplasm and nucleus; gradual numbered keys |
| B1-03 | Name the boundary indicated by a pointer | Guided model reading, labels hidden |
| B1-04 | Choose the structure controlling entry | Guided function application |
| B1-05 | Explore animal-cell energy/protein structures, then the whole cell | Mitochondria, ribosomes and all-five overview |
| B1-06 | Choose the scientifically correct claim | Explicit misconception contrast, not a diagnosis |
| B1-07 | Read/replay three optional worked reasoning steps | Model a structure → process → useful consequence chain |
| B1-08 | Choose the linked protein-making statement | Guided understanding, not written-explanation evidence |
| B1-09 | Decide what a schematic colour establishes | Representation versus reality |
| B1-10 | Read illustrative microscope observation record | Bridge to practical 1; not a laboratory method |
| B1-11 | Select a justified conclusion from the record | Non-visibility is not absence; practice evidence only |
| B1-24 | Meet a complete plant cell, then explore three parts | Plant membrane, cytoplasm and nucleus taught directly |
| B1-42 | Explore the remaining plant structures and whole-cell overview | Mitochondria, ribosomes, wall, permanent vacuole and chloroplasts |
| B1-25–26 | Two plant-cell checks | Support and exceptions; missing chloroplasts does not mean animal |
| B1-41 | Compare separate animal and plant diagrams | Similarities/differences after both cells are familiar |
| B1-27–28 | Meet a bacterium; explore wall, membrane, cytoplasm/ribosomes, DNA and optional plasmids | No nucleus does not mean no DNA/ribosomes |
| B1-22–23 | Give names to the categories already encountered | Eukaryotic/prokaryotic are supporting terminology, not the starting point |
| B1-29–31 | Explore sizes/units/standard form, replay area estimate, justify approximation | Example sizes only; actual supplied dimensions and square area units |
| B1-12–16 | Five individual function-to-part choices | Independent recall coverage of all five taught parts |
| B1-17 | Distinguish nucleus from membrane functions | Independent understanding |
| B1-18 | Distinguish mitochondria from ribosomes | Independent understanding |
| B1-19 | Apply protein synthesis to a gland-cell scenario | Independent application; necessary context supplied |
| B1-20 | Apply boundary function to a changed cell model | Transfer away from a memorised picture |
| B1-32–40 | Independent plant/bacterial/classification and four numerical checks | Expanded recall and sampled calculation coverage |
| B1-21 | Write two paired animal/bacterial structural differences | Two-mark-style Revily rubric; pending teacher review |
| Summary | Continue to the automatically chosen next action | Show completion and dimension evidence separately |

## Separate cell teaching

Animal teaching starts “Meet an animal cell” before introducing membrane, cytoplasm and nucleus. Its next chunk teaches mitochondria and ribosomes, then revisits the complete five-part cell. Short guided checks sit between these chunks.

Plant teaching starts “Meet a plant cell” with a separate photosynthesising example. All eight structures and functions are explicitly taught in two chunks: membrane/cytoplasm/nucleus, then mitochondria/ribosomes/wall/vacuole/chloroplasts and an overview. It is not introduced as an animal cell with extras. Qualifiers about specialised cells and missing chloroplasts remain.

Comparison follows the complete animal and plant introductions. Separate diagrams appear side by side on desktop and stack on narrow phones. Shared structures are an observation with shared functions. Plant differences are taught with exceptions, not a shape-only identification rule.

Bacterial teaching starts with a complete bacterium, then covers its wall, membrane, cytoplasm/ribosomes, main DNA loop and optional plasmids. Only afterwards are eukaryotic and prokaryotic introduced as names for the familiar categories.

No respiration equation, ATP terminology or protein-assembly animation. These would broaden the first micro-lesson unnecessarily. The later curriculum teaches respiration in depth.

## Worked reasoning and transfer example

Worked screen: “A cell needs energy for its work. How do mitochondria help?” Reveal three optional steps: structure → aerobic respiration → energy released for work.

Final independent prompt: “Give two structural differences between a typical animal cell and a bacterial cell.”

Draft answer: “A typical animal cell has a nucleus; a bacterial cell does not. A typical animal cell has mitochondria; a bacterial cell does not.” Credit any two distinct valid paired structural comparisons, including bacterial wall present / animal wall absent. Do not count no nucleus and DNA not enclosed in a nucleus as two differences. Do not keyword-mark. Save, reveal the model/rubric and allow Continue with awaiting-review status.

## Visual production briefs

**Animal cell:** original SVG with an organic outline, mint cytoplasm, purple nucleus, folded peach mitochondria and tiny dark ribosomes. One outer membrane, no wall/chloroplasts. Numbered pointers connect structures to readable keys; only the current structure is annotated during focused frames. Keys grow as structures are introduced. Model/scale limitations remain in accessible descriptions, not the removed decorative captions.

**Plant cell:** separate rectangular SVG with a thick cellulose wall, a distinct thin membrane, peripheral cytoplasm/nucleus, matching mitochondria/ribosomes, green chloroplasts and a large pale-blue permanent vacuole. Teach all eight directly. Number conventions for the five common structures match the animal model. Retain the photosynthesising-example qualifier.

**Bacterial cell:** separate capsule SVG with wall, membrane, cytoplasm/ribosomes, a closed DNA loop and optional extra plasmid rings. No nucleus, mitochondria or chloroplasts. The enlarged illustration is not a scale comparison. Pointers end on the intended structures; descriptions and keys provide non-colour identification.

**CellModel B:** different orientation, elongated outline and repositioned structures, same biological conventions. The question explicitly identifies it as an animal-cell model. Do not imply an unfamiliar cell's kingdom can be inferred from its outline. The transfer task asks for a function, not an ungrounded classification.

**ObservationRecord:** a schematic beside a text-only illustrative record. “In this prepared stained animal-cell view, a nucleus and cell outline were visible; tiny internal structures were not distinguished.” Label it as illustrative, not experimental data or a real micrograph. No photo is invented. It establishes an observation/model contrast without prematurely teaching focus controls, stains or resolution theory.

**Assessment accessibility:** switch from teaching description to assessment description when hiding labels. A screen-reader description must not name the answer hidden visually. Give an equivalent target description, such as “pointer ends at the outer boundary”, and preserve the intended function question. Actual blind/low-vision diagram tasks need accessibility review; a generic alt description is not enough.

## Hint and feedback example

B1-19 starts with Hint collapsed. If opened: “Use the given task: making proteins. No prior knowledge of glands is needed.” After either submission: retain the selected answer; show (1) the supplied task is protein synthesis, (2) ribosomes perform it, then explicit answer “Ribosomes”. Continue is enabled after feedback. Hint can still be opened, but opening it never changes the submitted evidence flags retroactively.

Opening a hint before submission records support. Watching a model solution or replaying an already answered assessment records prior exposure for subsequent attempts. Correctness is not enough to earn independent evidence.

## Summary and later retrieval

Show “Lesson complete”, followed by separate recall / understanding / application / calculation evidence and “explanation awaiting review” where appropriate. Practical/data connection says “introduced — practice only”. No full-topic mastery percentage. Next planned lesson is microscopy; it is not built yet.

The six delayed prompts in `lesson.ts` sample animal/plant/bacterial recall, understanding, application and written comparison. They are a future bank, not a live activity. Same-day replay is practice, not retention. Spacing is a beta policy needing validation. Passing these samples does not prove retention of every cell fact; calculation retention is not sampled.
