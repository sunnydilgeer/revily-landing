import type { TeachingFrame } from '../../teachingFrame'

// One picture per idea, changed frame by frame: a flask on a balance for the general idea, magnesium burning in an open
// crucible for a gas reactant, then copper carbonate heated in an open tube for a gas product.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const gasMassFrames: Record<string, TeachingFrame[]> = {
  'C20-02': [
    f('No atoms are lost', 'In a sealed container, the balance reading stays the same.', 'atoms in → same atoms out → same mass', 'You met conservation of mass when you learned about balanced equations. No atoms are lost or made in a reaction, so the total mass stays the same. A balance only weighs what is inside the container on it.', 'gasmass-rule'),
    f('Open to the air', 'An unsealed container lets gases drift in and out.', 'no lid → gas can move in or out', 'An unsealed container has no lid, so it is open to the air. Gas particles spread out to fill any space they can reach. So a gas can drift into an unsealed container, or out of it. The balance cannot weigh gas that is outside.', 'gasmass-open'),
    f('Two ways the reading can change', 'Gas coming in raises the reading; gas escaping lowers it.', 'gas in → up; gas out → down', 'If a gas from the air joins the reaction, the mass in the container goes up. If a gas made in the reaction escapes, the mass goes down. Either way, no atoms have been lost. The mass has only moved in or out.', 'gasmass-two'),
  ],
  'C20-04': [
    f('Before: the gas is outside', 'Gas in the air is not on the balance.', 'oxygen in the air → not weighed', 'A piece of magnesium ribbon sits in an open crucible on a balance. Oxygen is in the air around it, but it is floating free. The balance cannot weigh that oxygen. It reads only the crucible and the magnesium.', 'gasmass-mg-before'),
    f('Burning: the gas joins in', 'Oxygen atoms from the air join the magnesium.', 'oxygen + magnesium → a solid', 'When the ribbon burns, oxygen atoms from the air join the magnesium atoms. Together they make magnesium oxide. This is a solid, so it stays in the crucible.', 'gasmass-mg-during'),
    f('After: the mass has gone up', 'The oxygen is now part of the solid, so it is weighed.', 'oxygen in the solid → weighed → reading up', 'The oxygen that was in the air is now part of the solid in the crucible. So the balance can weigh it, and the reading goes up. The extra mass is exactly the mass of the oxygen that joined in. No mass was created.', 'gasmass-mg-after'),
    f('Put it together', 'A gas reactant and only solid products: the mass goes up.', 'state symbol (g) among the reactants → mass up', 'Look at the state symbols in the equation. A gas is shown as (g). Here the gas, oxygen, is a reactant, and the product is a solid. So the mass of the open container goes up.', 'gasmass-mg-rule'),
  ],
  'C20-08': [
    f('Before: everything is in the tube', 'All the reactants are solids, held in the tube.', 'solid reactant → stays on the balance', 'Copper carbonate, a green solid, is in an open test tube on a balance. The only reactant is a solid, so everything is held in the tube. The balance reads the copper carbonate.', 'gasmass-cu-before'),
    f('Heating: a gas forms', 'Heat breaks the compound down and makes a gas.', 'heat → breaks down → gas made', 'Heating breaks copper carbonate down into black copper oxide and carbon dioxide gas. Breaking down a compound with heat is called thermal decomposition. The gas is not trapped, so it spreads out into the air.', 'gasmass-cu-during'),
    f('After: the mass has gone down', 'The gas escaped, so only the solid is weighed.', 'gas escapes → not weighed → reading down', 'The carbon dioxide has escaped from the tube, so the balance cannot weigh it. Only copper oxide is left in the tube. The reading goes down. The missing mass is exactly the mass of the carbon dioxide.', 'gasmass-cu-after'),
    f('Put it together', 'A gas product that escapes: the mass goes down.', 'state symbol (g) among the products → mass down', 'Look at the state symbols again. Here the gas, carbon dioxide, is a product, and the reactant is a solid. In an open tube, the mass goes down. Trap the gas, and the total mass would be the same as before.', 'gasmass-cu-rule'),
  ],
}
