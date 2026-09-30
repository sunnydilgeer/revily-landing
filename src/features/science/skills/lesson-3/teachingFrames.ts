import type { TeachingFrame } from '../../teachingFrame'

// Hazards and risk: hazard vs risk, estimating risk from data, why people judge risk differently, lab hazards and reducing risk.
// Examples come from Biology, Chemistry and Physics practicals.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsRiskFrames: Record<string, TeachingFrame[]> = {
  'W3-02': [
    f('A hazard', 'A hazard is something that could cause harm.', 'could it hurt someone', 'A hazard is something that could cause harm. A hot Bunsen flame is a hazard. So are a spilt liquid on the floor and a frayed electrical cable. A hazard is only the thing itself.', 'wsrisk-hazard'),
    f('A risk', 'Risk is the chance that the hazard will actually cause harm.', 'how likely is harm', 'Risk is the chance that a hazard will actually cause harm. A hot beaker is a hazard. The risk is low if it sits in the middle of a bench and everyone leaves it to cool. The risk is higher if it is at the edge of a crowded bench.', 'wsrisk-risk'),
    f('Chance and outcome', 'To decide about a risk, think about how likely the harm is and how bad it would be.', 'likely, and how bad', 'To decide whether to do something that involves a hazard, think about two things. First, how likely is it that the hazard causes harm? Second, how bad would the outcome be if it did? A rare event with a very bad outcome still needs care.', 'wsrisk-decide'),
    f('Estimate a risk from data', 'You can estimate the size of a risk from data on how often harm happens.', 'count how often it happens', 'A good way to estimate the size of a risk is to look at data. Suppose 1000 people use a trampoline park in a month and 12 of them are injured. The risk is 12 injuries in every 1000 visitors. A second park with 2 injuries in 1000 visitors has a lower risk.', 'wsrisk-estimate'),
  ],
  'W3-05': [
    f('Familiar activities', 'People tend to think familiar activities are low risk and unfamiliar ones are high risk. This is not always true.', 'familiar or unfamiliar', 'People tend to think familiar activities are low risk. They tend to think unfamiliar ones are high risk. But this is not always true. Crossing a busy road feels ordinary, yet injuries happen. Flying feels unusual to many people, yet each journey is very safe.', 'wsrisk-familiar'),
    f('Choice', 'People accept a risk more easily if they choose it than if it is imposed on them.', 'chosen or imposed', 'People are more willing to accept a risk if they choose it. Someone may happily go rock climbing, which they chose. The same person may strongly object to a chemical store built near their home. They did not choose it, even if the chance of harm is smaller.', 'wsrisk-choice'),
    f('Visibility', 'People may underestimate risks whose effects are long-term or cannot be seen.', 'seen now or later', 'People may underestimate a risk if its effects are long-term or invisible. Too much sun does not feel harmful while you are enjoying it. The damage to skin builds up quietly over years, so the risk can seem smaller than it really is.', 'wsrisk-visible'),
  ],
  'W3-08': [
    f('Microorganisms', 'Some bacteria and other microorganisms can make you ill.', 'living things that can harm', 'A hazard in Biology is microorganisms. Some bacteria can make you ill. When you grow them in a dish, you must not let them escape or touch your skin or mouth.', 'wsrisk-micro'),
    f('Chemicals', 'Some chemicals can burn skin, harm eyes or catch fire easily.', 'burn, irritate, catch fire', 'Chemicals can be hazards in Chemistry. A strong acid can burn your skin and eyes. Some liquids, such as alcohols, catch fire easily. Some chemicals give off gases that are harmful to breathe.', 'wsrisk-chemical'),
    f('Electricity', 'Faulty electrical equipment could give you an electric shock.', 'damaged wires, water', 'Electricity is a hazard in Physics practicals. Faulty electrical equipment could give you an electric shock. A frayed cable, a cracked plug, or water near a power supply all make a shock more likely.', 'wsrisk-electric'),
    f('Fire and heat', 'A Bunsen burner left alight, or hot glassware, can start a fire or burn you.', 'flames and hot things', 'Fire is a hazard whenever a flame is used. An unattended Bunsen burner is a fire hazard. Hot glassware and hot water can burn you, and they look no different from cool ones.', 'wsrisk-fire'),
  ],
  'W3-11': [
    f('Plan for safety', 'Before you start, identify the hazards and think of ways to reduce the risk from each. This is a risk assessment.', 'spot it, then reduce it', 'When you plan an investigation, make sure it is safe. First identify all the hazards you might meet. Then think of ways to reduce the risk from each one. Doing this is called a risk assessment.', 'wsrisk-plan'),
    f('Match the control to the hazard', 'Each hazard needs a control that works against it, such as goggles for splashes.', 'the right control for each hazard', 'A control should match the hazard. Safety goggles protect your eyes from splashes. A heat-proof mat protects the bench from a hot beaker or Bunsen burner. A fume cupboard takes harmful gases away, and washing your hands removes microorganisms.', 'wsrisk-control'),
    f('Keep electricity and fire safe', 'Keep water away from electrical equipment, and never leave a lit flame unattended.', 'dry hands, watch the flame', 'Keep water away from electrical equipment and check cables before use. Tie back long hair and never leave a lit Bunsen burner alone. When you have finished, switch off the power and the gas before you leave the bench.', 'wsrisk-safeuse'),
    f('Risks and benefits together', 'New technology can bring new risks that must be weighed against the benefits.', 'weigh risk against benefit', 'New technology can bring new risks. Scientists are developing ways to capture carbon dioxide and store it underground. If the gas leaked out, it could harm soil or water supplies. These risks must be weighed against the benefits, such as lower greenhouse gas emissions.', 'wsrisk-benefit'),
  ],
}
