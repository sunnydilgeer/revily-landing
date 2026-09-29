import type { TeachingFrame } from '../../teachingFrame'

// Dangers of EM waves: harm from UV, X-rays and gamma rays, radiation dose in sieverts, and comparing risk.
// Ionising radiation was met with alpha, beta and gamma radiation earlier in Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const emDangerFrames: Record<string, TeachingFrame[]> = {
  'P62-02': [
    f('Waves that can harm', 'High frequency EM waves can damage living tissue: ultraviolet, X-rays and gamma rays.', 'high frequency, high risk', 'When electromagnetic radiation enters living tissue, such as your body, it can be dangerous. The high frequency waves can cause the most damage. These are ultraviolet radiation, X-rays and gamma rays.', 'emdanger-harm'),
    f('Ultraviolet radiation', 'UV damages surface cells. It can cause sunburn, faster skin ageing, blindness and skin cancer.', 'skin and eyes', 'Ultraviolet radiation damages the cells on the surface of your body. This can cause sunburn and make your skin age faster. More serious effects are blindness and a higher risk of skin cancer.', 'emdanger-uv'),
    f('X-rays and gamma rays', 'They are ionising radiation. They knock electrons off atoms and can damage cells.', 'knocking electrons off', 'X-rays and gamma rays are types of ionising radiation. This means they can knock electrons off atoms. You met ionising radiation when you learned about alpha, beta and gamma radiation. Inside a cell, this can destroy the cell or mutate its genes. That can lead to cancer.', 'emdanger-ionising'),
  ],
  'P62-05': [
    f('Radiation dose', 'Radiation dose measures the risk of harm from being exposed to radiation. It is measured in sieverts.', 'dose = risk of harm', 'Radiation dose is a measure of the risk of harm from your body being exposed to radiation. It is measured in sieverts, which has the symbol Sv. A bigger dose means a bigger risk.', 'emdanger-dose'),
    f('What the risk depends on', 'It depends on the total amount of radiation absorbed and on how harmful that type of radiation is.', 'how much and what type', 'The risk depends on two things. One is the total amount of radiation your body absorbs. The other is how harmful the type of radiation is. Some types do more damage than others.', 'emdanger-depends'),
    f('Millisieverts', 'A sievert is large, so millisieverts are often used. 1000 mSv = 1 Sv.', 'small unit, big number', 'A sievert is quite big, so doses are often given in millisieverts, written mSv. There are 1000 mSv in 1 Sv. To change sieverts into millisieverts, multiply by 1000. To change millisieverts into sieverts, divide by 1000.', 'emdanger-units'),
  ],
  'P62-08': [
    f('Benefits and risks', 'Before EM radiation is used on people, the benefits are weighed against the health risks.', 'weigh it up', 'UV, X-rays and gamma rays are useful as well as harmful. Before they are used, people weigh up the benefits and the health risks. A patient with a suspected broken leg has a very small risk from one X-ray. Not finding and treating the injury is a much bigger risk.', 'emdanger-weigh'),
    f('Different parts of the body', 'A scan gives a different dose to different parts of the body.', 'read the table', 'A CT scan uses X-rays to make a detailed picture of the inside of the body. The dose is not the same for every part of the body. A scan of the pelvis gives a bigger dose than a scan of the knee. The table shows the dose in millisieverts for each part.', 'emdanger-table'),
    f('Comparing doses', 'Divide one dose by the other. Because dose measures risk, the ratio compares the risk.', 'dose ÷ dose', 'To compare two doses, divide the bigger dose by the smaller one. If one scan gives 4 times the dose of another, the risk of harm is 4 times as great. Doses are compared in the same unit, so the units cancel.', 'emdanger-compare'),
  ],
}
