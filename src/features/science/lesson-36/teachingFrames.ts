import type { TeachingFrame } from '../teachingFrame'

// Start from how a pregnancy can begin (sperm reaches an egg), then meet each group of methods by what it stops:
// hormones and IUDs, barriers, then other ways. End by weighing up pros and cons with the same five questions.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const contraceptionFrames: Record<string, TeachingFrame[]> = {
  'B36-02': [
    f('Fertility', 'A pregnancy can start if a sperm reaches an egg.', 'sperm + egg → pregnancy', 'After sexual intercourse, sperm swim up through the uterus and into the oviducts. If a sperm reaches and fertilises an egg, a pregnancy can start. How easily a woman can get pregnant is called her fertility.', 'hormone-method-fertility'),
    f('The pill', 'The pill stops FSH being released, so no eggs mature.', 'pill → no FSH → no egg matures', 'Ways of preventing pregnancy are called contraception. Some contraceptives contain hormones. The pill is taken by mouth every day. It stops FSH being released, so no eggs mature. It is over 99% effective, but it can cause side effects such as headaches and feeling sick.', 'hormone-method-pill'),
    f('The implant', 'An implant slowly releases progesterone.', 'implant → progesterone → no egg', 'Some hormonal methods slowly release progesterone. This stops eggs maturing or being released. An implant is a small, flexible rod placed under the skin of the arm. It can last for three years.', 'hormone-method-implant'),
    f('Patch and injection', 'A patch and an injection also release hormones.', 'patch: 1 week; injection: 2–3 months', 'A contraceptive patch is stuck on the skin. It contains oestrogen and progesterone, and each patch lasts one week. A contraceptive injection of progesterone lasts 2 to 3 months.', 'hormone-method-patch-injection'),
    f('IUDs', 'An IUD in the uterus stops a fertilised egg implanting.', 'IUD → no implanting', 'An intrauterine device, or IUD, is a small T-shaped device placed inside the uterus. It stops a fertilised egg implanting in the uterus wall. Copper IUDs contain no hormones and also stop sperm surviving. Intrauterine systems (IUS) release progesterone.', 'hormone-method-iud'),
  ],
  'B36-05': [
    f('Barrier methods', 'Barrier methods stop sperm reaching an egg.', 'barrier = sperm cannot get through', 'Non-hormonal methods do not use hormones. Many of them stop sperm reaching an egg, and these are called barrier methods. A condom is worn over the penis during sexual intercourse. A female condom is worn inside the vagina.', 'hormone-barrier-condom'),
    f('Protection from infections', 'Condoms also protect against sexually transmitted infections.', 'condoms → also stop STIs', 'Some infections can be passed on during sexual intercourse. These are called sexually transmitted infections, or STIs. Condoms are the only contraceptive that also protects against STIs.', 'hormone-barrier-sti'),
    f('Diaphragm', 'A diaphragm covers the entrance to the uterus.', 'diaphragm = cup over the entrance', 'A diaphragm is a shallow plastic cup. It fits over the entrance to the uterus, so sperm cannot get in. It has to be used together with spermicide.', 'hormone-barrier-diaphragm'),
    f('Spermicide', 'Spermicide kills or disables sperm.', 'spermicide = kills or disables sperm', 'A chemical that kills or disables sperm is called spermicide. It is used with a diaphragm. Used on its own, spermicide is only about 70 to 80% effective.', 'hormone-barrier-spermicide'),
  ],
  'B36-08': [
    f('Female sterilisation', 'The oviducts are cut or tied.', 'sterilisation = permanent', 'An operation can cut or tie the oviducts, which are also called the fallopian tubes. Then eggs and sperm cannot meet. This is called sterilisation, and it is permanent.', 'hormone-sterile-female'),
    f('Male sterilisation', 'The sperm ducts are cut or tied.', 'sperm ducts cut → no sperm out', 'In males, sterilisation cuts or ties the sperm ducts. These are the tubes that carry sperm from the testes towards the penis. It is also permanent.', 'hormone-sterile-male'),
    f('Natural methods', 'Avoiding intercourse when pregnancy is most likely.', 'natural = timing, not very reliable', 'Some people avoid sexual intercourse around ovulation, when an egg may be in the oviduct. These are called natural methods. Some people choose them because they feel other methods are unnatural. But cycles vary, so natural methods are not very effective.', 'hormone-cycle-natural'),
    f('Abstinence', 'Not having intercourse is the only certain way.', 'abstinence = certain', 'Not having sexual intercourse at all is called abstinence. With no intercourse, sperm cannot reach an egg. It is the only way to be sure of avoiding pregnancy.', 'hormone-organs-abstinence'),
  ],
  'B36-11': [
    f('Questions to ask', 'Compare methods using the same questions.', 'how well, how often, side effects, STIs, reversible', 'Every method has pros and cons. To compare them, ask: how well does it work, and how often must you think about it? Can it cause side effects? Does it protect against STIs, and can it be stopped or reversed?', 'hormone-weigh-criteria'),
    f('Hormonal methods', 'Very effective, but no protection against STIs.', 'the pill compared with the implant', 'The pill is over 99% effective, but it must be taken every day and can cause side effects. An implant lasts three years, so there is nothing to remember each day. Neither protects against STIs.', 'hormone-weigh-hormonal'),
    f('Non-hormonal methods', 'Condoms protect against STIs; sterilisation is permanent.', 'condoms compared with sterilisation', 'Condoms protect against STIs and contain no hormones, but they must be used every time. After sterilisation there is nothing to remember, but it is permanent. The best choice depends on the person and their situation.', 'hormone-weigh-barrier'),
  ],
}
