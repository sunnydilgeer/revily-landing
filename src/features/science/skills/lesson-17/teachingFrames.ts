import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: setting up electrolysis and a potometer. Examples come from Chemistry and Biology.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsSetupFrames: Record<string, TeachingFrame[]> = {
  'W17-02': [
    f('Set up the electrolysis', 'Two electrodes dip into the electrolyte. A test tube of solution, upside down, sits over each electrode.', 'a tube over each electrode', 'In electrolysis, an electric current passes through a liquid called the electrolyte. Two electrodes dip into it, joined to a power supply. To collect the gases, place a test tube full of the solution upside down over each electrode.', 'wssetup-elec-rig'),
    f('At the cathode', 'The cathode is the negative electrode. You get a coating of a pure metal, or bubbles of hydrogen.', 'negative electrode', 'The cathode is the negative electrode. When you electrolyse a salt solution, you get one of two things there. Either a coating of a pure metal forms on the electrode, or bubbles of hydrogen gas form.', 'wssetup-cathode'),
    f('At the anode', 'The anode is the positive electrode. You get bubbles of oxygen, or bubbles of a halogen such as chlorine.', 'positive electrode', 'The anode is the positive electrode. There you get bubbles of oxygen gas. In some solutions you get bubbles of a halogen instead, such as chlorine.', 'wssetup-anode'),
    f('Collect and identify the gas', 'The gas pushes the solution out of the test tube. Then you can do the test for the gas.', 'gas replaces the solution', 'The gas made at each electrode rises and pushes the solution out of the upside down test tube. When a tube is full, you can do the chemical tests for gases that you met in Chemistry. They tell you which gas you have collected.', 'wssetup-gases'),
  ],
  'W17-05': [
    f('What is a potometer?', 'A potometer is special equipment for estimating how fast a plant takes up water.', 'a tube joined to a plant', 'A potometer is a special piece of equipment. A cut shoot of a plant is fitted into a tube of water. The tube joins to a thin capillary tube with a scale, which dips into a beaker of water.', 'wssetup-potometer'),
    f('Record the start', 'Note the starting position of the air bubble in the capillary tube, then start a stopwatch.', 'starting position, then start', 'An air bubble is in the capillary tube. Record its starting position on the scale. Then start a stopwatch. The tap on the water supply stays shut during the experiment.', 'wssetup-bubble-start'),
    f('The bubble moves', 'As the plant takes up water, the bubble is drawn along the tube.', 'plant pulls the water', 'As the plant takes up water, it pulls the water and the air bubble along the tube. Record how far the bubble moves in a set time.', 'wssetup-bubble-move'),
    f('Estimate the rate', 'Transpiration rate = distance the bubble moved ÷ time taken.', 'distance ÷ time', 'The water the plant takes up is lost from its leaves. You met this as transpiration when you learned about plant transport. To estimate the transpiration rate, divide the distance the bubble moved by the time taken.', 'wssetup-rate'),
  ],
}
