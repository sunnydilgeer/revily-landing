import type { TeachingFrame } from '../../teachingFrame'

// Complete and incomplete combustion (complete combustion is taught in the alkanes lesson: one-clause link),
// then carbon monoxide and particulates, then sulfur dioxide, oxides of nitrogen and acid rain.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const pollutionFrames: Record<string, TeachingFrame[]> = {
  'C48-02': [
    f('Fuels contain hydrocarbons', 'Fossil fuels such as crude oil and coal contain hydrocarbons.', 'fuel, then oxygen', 'Increasing carbon dioxide is not the only problem when fossil fuels burn. Fuels such as crude oil contain hydrocarbons. Hydrocarbons can combust, which means they burn in oxygen.', 'pollute-fuels'),
    f('Two kinds of burning', 'In complete combustion there is plenty of oxygen and all the fuel burns. In incomplete combustion there is not enough oxygen.', 'plenty of oxygen, or not enough', 'There are two types of combustion. In complete combustion there is plenty of oxygen around, so all of the fuel burns. In incomplete combustion there is not enough oxygen, so some of the fuel does not burn.', 'pollute-two-types'),
    f('Products of both', 'Both types release carbon dioxide and water vapour into the atmosphere.', 'always these two', 'Both types of combustion release carbon dioxide and water vapour. You met complete combustion when you studied the alkanes. These two products come out whichever type it is.', 'pollute-both'),
    f('Extra products', 'Incomplete combustion also releases soot particles, unburnt fuel and carbon monoxide gas.', 'the extras appear only when oxygen is short', 'Incomplete combustion releases more. Tiny solid particles of soot, which is carbon, are made. These are called particulates. Unburnt fuel is released too. Carbon monoxide gas is also produced.', 'pollute-incomplete'),
    f('Side by side', 'Complete: carbon dioxide and water vapour. Incomplete: those, plus carbon monoxide, soot particles and unburnt fuel.', 'compare the lists', 'Put them side by side. Complete combustion gives carbon dioxide and water vapour only. Incomplete combustion gives those two and also carbon monoxide, particulates and unburnt fuel. Those extras cause problems.', 'pollute-compare'),
  ],
  'C48-05': [
    f('Carbon monoxide is dangerous', 'Carbon monoxide stops the blood carrying enough oxygen around the body.', 'blood cannot carry oxygen', 'Carbon monoxide, CO, is very dangerous. It stops the blood from carrying enough oxygen around the body. The body then does not get the oxygen it needs.', 'pollute-co-blood'),
    f('What a lack of oxygen does', 'A lack of oxygen in the blood can lead to fainting, a coma or even death.', 'from fainting to death', 'Without enough oxygen in the blood, a person can faint. As the oxygen gets lower, it can lead to a coma, or even to death.', 'pollute-co-effects'),
    f('Hard to detect', 'Carbon monoxide has no colour or smell, so it is very hard to detect.', 'you cannot see or smell it', 'Carbon monoxide has no colour and no smell. That makes it very hard to detect, which makes it even more dangerous. This is why some homes have carbon monoxide alarms.', 'pollute-co-detect'),
    f('Particulates in the lungs', 'Breathed-in particulates can get stuck in the lungs and cause damage and breathing problems.', 'tiny solids in the lungs', 'Particulates are tiny solid particles. If they are breathed in, they can get stuck in the lungs. They can cause damage and lead to breathing problems.', 'pollute-part-lungs'),
    f('Global dimming', 'Particulates reflect sunlight back into space, so less light reaches the Earth. This is global dimming.', 'less light gets through', 'Particulates in the air also affect the environment. They reflect sunlight back into space. That means less light reaches the Earth. This is called global dimming.', 'pollute-dimming'),
  ],
  'C48-08': [
    f('Other pollutants', 'Sulfur dioxide and oxides of nitrogen are also released when fossil fuels burn.', 'two more gases', 'Two other pollutants are released from burning fossil fuels. They are sulfur dioxide and oxides of nitrogen. They are made in different ways.', 'pollute-others'),
    f('Where sulfur dioxide comes from', 'Sulfur dioxide, SO₂, is released when fuels containing sulfur impurities are burned.', 'sulfur in the fuel', 'Some fossil fuels contain sulfur as an impurity. When such a fuel is burned, the sulfur is released as sulfur dioxide, SO₂. The sulfur comes from the fuel itself.', 'pollute-so2'),
    f('Where nitrogen oxides come from', 'Oxides of nitrogen form when nitrogen and oxygen from the air react, because of the heat of burning.', 'the air supplies both, the heat starts it', 'Oxides of nitrogen do not come from the fuel. Nitrogen and oxygen in the air react together. The heat from burning the fuel makes this reaction happen.', 'pollute-nox'),
    f('Acid rain forms', 'Sulfur dioxide and oxides of nitrogen mix with clouds and cause acid rain.', 'gases join the clouds', 'These gases mix with clouds. The result is acid rain. It falls to the ground as rain that is more acidic than normal.', 'pollute-acid-rain'),
    f('Effects of these pollutants', 'Acid rain kills plants and water life and damages buildings, statues and metals. The gases also cause breathing problems.', 'plants, water, buildings and lungs', 'Acid rain kills plants and water life. It also damages buildings, statues and metals. If sulfur dioxide and oxides of nitrogen are breathed in, they cause respiratory problems.', 'pollute-effects'),
  ],
}
