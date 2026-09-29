import type { TeachingFrame } from '../../teachingFrame'

// Uses of visible light (optical fibres), ultraviolet (fluorescent lamps, security pens, suntans), X-rays (images) and X-rays/gamma rays (radiotherapy, medical tracers).
// Dangers of EM waves come in the next thread: only one clause here (UV suntans, radiation kills living cells).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const emMoreFrames: Record<string, TeachingFrame[]> = {
  'P59-02': [
    f('Optical fibres', 'Optical fibres are thin tubes of glass or plastic that carry data over long distances.', 'thin tube, data, long distance', 'An optical fibre is a very thin tube of glass or plastic. It can carry data over long distances. Fibres are often used to send information for telephones and computers.', 'emmore-fibre'),
    f('Pulses of light', 'Data is sent along the fibre as pulses of visible light.', 'data as light pulses', 'The information travels from one end of the fibre to the other as pulses of visible light. Visible light is the group of EM waves that our eyes can see.', 'emmore-pulses'),
    f('Bouncing along the fibre', 'The light rays are reflected back and forth along the fibre until they reach the other end.', 'reflected, not escaping', 'The light does not escape through the side of the fibre. It is reflected off the inside wall again and again. This carries it all the way to the other end.', 'emmore-reflect'),
  ],
  'P59-05': [
    f('UV makes some things glow', 'Some materials absorb ultraviolet radiation and give off visible light.', 'absorb UV, give off light', 'Ultraviolet, or UV, is a type of EM wave. Some materials absorb UV radiation and then give off visible light. This can be very useful.', 'emmore-uvglow'),
    f('Fluorescent lamps', 'Fluorescent lamps use UV radiation to produce visible light. They are energy-efficient.', 'UV in, light out', 'Inside a fluorescent lamp, UV radiation is produced. A coating on the glass absorbs it and gives off visible light. These lamps are energy-efficient, so they waste little energy.', 'emmore-lamp'),
    f('Security pens', 'Ink from a security pen is invisible until it glows under UV light.', 'invisible, then glows', 'You can mark your name on your property with a security pen. The ink is invisible in normal light. Under UV light it glows. This helps the police to identify stolen property.', 'emmore-pen'),
    f('Suntans', 'The Sun gives out UV radiation, which is what gives you a suntan. Too much can be dangerous.', 'Sun gives UV', 'The Sun produces UV radiation. This is what gives you a suntan. UV lamps can also give a suntan, but this can be dangerous.', 'emmore-tan'),
  ],
  'P59-08': [
    f('X-rays pass through flesh', 'X-rays pass easily through flesh but not through bones or metal.', 'through flesh, stopped by bone', 'X-rays are a type of EM wave. They pass easily through flesh. They do not pass through bones or metal.', 'emmore-xray1'),
    f('An X-ray image', 'Bones block the X-rays, so they show up on the image as pale shapes.', 'bones block, image forms', 'An X-ray image is made from the X-rays that get through the body. Bones block the X-rays, so they show up clearly on the image.', 'emmore-xray2'),
    f('Checking for broken bones', 'Doctors use X-ray images to check for broken bones.', 'image shows the break', 'A doctor can look at the image to check for a broken bone. A break shows up as a crack or a gap in the bone.', 'emmore-xray3'),
  ],
  'P59-11': [
    f('Radiotherapy', 'X-rays and gamma rays can be used to treat people who have cancer. This is called radiotherapy.', 'treat cancer', 'X-rays and gamma rays can both be used to treat people who have cancer. This treatment is called radiotherapy.', 'emmore-radio1'),
    f('Aimed at the cancer cells', 'X-rays and gamma rays can kill living cells, so they are aimed carefully at the cancer cells.', 'kill cells, aim carefully', 'X-rays and gamma rays can kill living cells. So the radiation is aimed carefully at the cancer cells. This avoids killing too many healthy cells.', 'emmore-radio2'),
    f('Medical tracers', 'Gamma rays pass easily through the body, so small amounts are used as medical tracers.', 'small amount, passes out', 'Gamma rays pass easily through the body. So a small amount of a substance that gives out gamma rays can be put into the body. This is called a medical tracer.', 'emmore-tracer1'),
    f('Tracking the tracer', 'A detector tracks how the tracer moves round the body, which shows whether organs are working.', 'track, then check', 'The gamma rays pass out of the body, so a detector outside can follow where the tracer goes. This can tell doctors whether organs are working as they should.', 'emmore-tracer2'),
  ],
}
