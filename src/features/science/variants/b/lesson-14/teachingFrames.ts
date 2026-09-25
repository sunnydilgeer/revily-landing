import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Big idea: when the heart's own blood supply or valves fail, doctors can fix the pipe, slow the problem, or replace the part.
// One new word per frame. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const cardiovascularFrames: Record<string, TeachingFrame[]> = {
  'B14-02': [
    f('Coronary arteries', 'The heart muscle gets oxygen from its own arteries.', 'all muscle needs oxygen', 'The heart is made of muscle. Like all muscle, it needs oxygen for respiration. Arteries on the outside of the heart bring it oxygen. These are the coronary arteries.', 'cardio-heart'),
    f('Fatty build-up', 'Fatty material can narrow a coronary artery.', 'less space → less flow', 'Sometimes layers of fatty material build up inside a coronary artery. The artery gets narrower. Less blood can flow through it.', 'cardio-blockage'),
    f('Coronary heart disease', 'Less blood flow means less oxygen for the heart muscle.', 'less oxygen → less respiration', 'Less blood means less oxygen reaches the heart muscle. The muscle cannot respire properly. This is called coronary heart disease.', 'cardio-blockage-muscle'),
  ],
  'B14-05': [
    f('Three ways to treat it', 'Doctors can fix the pipe, slow the problem, or replace the part.', 'three kinds of treatment', 'Diseases of the heart or blood vessels are called cardiovascular diseases. Doctors can treat them in three ways. They can fix the pipe, slow the problem, or replace the part.', 'cardio-compare'),
    f('A stent', 'A stent holds a narrowed artery open.', 'mesh tube → wider artery', 'A stent is a small mesh tube. A doctor places it inside the narrowed artery. It holds the artery open, so blood flows well again.', 'cardio-stent'),
    f('Benefits and risks', 'A stent works quickly but has some risks.', 'benefit compared with risk', 'A stent works straight away, and recovery is quick. But there are risks. An infection can start, or a blood clot can form near the stent.', 'cardio-stent-balance'),
  ],
  'B14-08': [
    f('Cholesterol', 'Cholesterol in the blood helps fatty material build up.', 'more cholesterol → more build-up', 'Cholesterol is a fatty substance carried in the blood. High levels help fatty material build up in arteries.', 'cardio-cholesterol'),
    f('Statins', 'Statins lower blood cholesterol.', 'drug → less cholesterol', 'Statins are drugs that lower blood cholesterol. This slows down the fatty build-up. It lowers the risk of coronary heart disease.', 'cardio-statin'),
    f('Slow but steady', 'Statins work slowly and must be taken regularly.', 'benefit over years', 'Statins do not clear a narrowed artery. They work slowly, over months and years. They must be taken regularly and can cause side effects.', 'cardio-statin-balance'),
  ],
  'B14-10': [
    f('Faulty valves', 'A valve can be stiff or leaky.', 'open fully, close tightly', 'Valves are flaps that stop blood flowing backwards. (You met them in Lesson 11.) A faulty valve may be stiff, so it does not open fully. Or it may leak, so some blood flows backwards.', 'cardio-valve'),
    f('New valves', 'Biological and mechanical valves each have a drawback.', 'tissue or man-made', 'A faulty valve can be replaced. Biological valves come from animals or humans. Mechanical valves are man-made. They last longer, but the patient needs drugs to stop blood clots.', 'cardio-valve-types'),
  ],
  'B14-13': [
    f('Heart failure', 'A failing heart can be replaced by a donor heart.', 'cannot pump enough', 'Sometimes the heart cannot pump enough blood around the body. This is called heart failure. A heart from a donor can replace it. Sometimes the lungs are replaced too.', 'cardio-transplant'),
    f('Rejection', 'The body may attack a donor heart.', 'not the patient’s own cells', 'The body’s defences may attack the new heart, because its cells are not the patient’s own. This is called immune rejection. Drugs lower this risk, but they have side effects.', 'cardio-transplant'),
    f('Artificial hearts', 'An artificial heart is a machine that pumps blood.', 'machine → less rejection, clot risk', 'An artificial heart is a machine that pumps blood. It can keep a patient alive while they wait for a donor. It is less likely to be rejected, but blood clots can form on it.', 'cardio-artificial'),
  ],
}
