import type { TeachingFrame } from '../../teachingFrame'

// What a carbon footprint is and why it is hard to measure, then ways to reduce it, then why reducing is still difficult.
// The greenhouse effect and human causes are taught in the previous lesson; life cycles are only named here in one clause.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const footprintFrames: Record<string, TeachingFrame[]> = {
  'C47-02': [
    f('A footprint of gases', 'A carbon footprint is a measure of the carbon dioxide and other greenhouse gases released over the full life of something.', 'greenhouse gases released, added up', 'Many scientists believe greenhouse gases from human activity are causing climate change. A carbon footprint measures how much carbon dioxide and other greenhouse gases something releases. It counts them across its full life, from making it to getting rid of it.', 'footprint-meaning'),
    f('Almost anything has one', 'A carbon footprint can be worked out for a service, an event or a product.', 'service, event, product', 'A footprint can be found for almost anything. It could be a service, such as the school bus. It could be an event, such as a sports festival. It could be a product, such as a toaster.', 'footprint-things'),
    f('Hard to measure', 'Measuring a total carbon footprint can be really hard, or even impossible.', 'so many steps to count', 'Something like a toaster is made, moved, sold, used and thrown away. Every step releases some greenhouse gases. Adding up all of them can be really hard or even impossible.', 'footprint-tricky'),
    f('A rough answer still helps', 'A rough calculation shows what releases the most greenhouse gases, so people can avoid using it.', 'find the biggest, then avoid it', 'A rough calculation is still useful. It gives a good idea of which things release the most greenhouse gases. For one person making the same journey, a car usually releases more than a bus or a train. People can then avoid the biggest ones.', 'footprint-rough'),
  ],
  'C47-05': [
    f('The aim', 'To reduce a carbon footprint, reduce the greenhouse gases released by a process.', 'release less', 'You reduce a carbon footprint by reducing the amount of greenhouse gases a process gives out. There are several ways to do this. The next frames go through them.', 'footprint-reduce-aim'),
    f('Capture and store', 'Technology can capture carbon dioxide before it reaches the atmosphere and store it deep underground.', 'catch it before it escapes', 'Some technology captures carbon dioxide before it is released into the atmosphere. The gas is then stored deep underground. This keeps it out of the air.', 'footprint-capture'),
    f('Less energy, less waste', 'Using processes that need less energy or produce less waste cuts greenhouse gases.', 'use less, waste less', 'Some processes use less energy, so less fuel is burned. Some produce less waste. That matters because waste that decomposes releases methane, which is a greenhouse gas.', 'footprint-less'),
    f('Rules from governments', 'Governments can tax emissions, or put a cap on them and let companies sell licences up to that cap.', 'tax and cap', 'A government can tax companies or individuals according to the greenhouse gases they release. This encourages less polluting processes. A government can also cap the total emissions allowed. Companies can then sell licences for emissions up to the cap.', 'footprint-rules'),
    f('Cleaner energy', 'Using renewable energy sources or nuclear energy instead of fossil fuels lowers emissions.', 'replace fossil fuels', 'Renewable energy sources, such as wind and solar, will not run out. Nuclear energy is another option. Using either one instead of fossil fuels means less carbon dioxide from burning fuel.', 'footprint-clean'),
  ],
  'C47-08': [
    f('Not simple', 'Reducing greenhouse gas emissions is not simple.', 'many things get in the way', 'Reducing emissions sounds simple, but it is not. Several things make it difficult. Each of the next frames looks at one of them.', 'footprint-hard-intro'),
    f('New technology takes work', 'New technologies that release less carbon dioxide still need a lot of work.', 'not ready overnight', 'Technologies that release less carbon dioxide are still being developed. They still need a lot of work before they can be used widely.', 'footprint-hard-tech'),
    f('Worry about communities', 'Some governments worry that changes could harm the economies of communities and people\'s well-being.', 'money, jobs and well-being', 'Making these changes costs money. Many governments worry about the effect on the economies of communities. This could harm people\'s well-being, especially in developing countries. That makes it hard for countries to agree on cuts.', 'footprint-hard-economy'),
    f('Lifestyle changes', 'People in developed countries also need to change their lifestyles, which is tricky.', 'people must change too', 'Individuals in developed countries also need to change their lifestyles. This is tricky. Some people do not want to. Others do not understand why the changes are important or how to make them.', 'footprint-hard-lifestyle'),
  ],
}
