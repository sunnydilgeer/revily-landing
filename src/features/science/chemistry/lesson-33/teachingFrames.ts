import type { TeachingFrame } from '../../teachingFrame'

// One drawing per section, built up step by step. Gas collected over water first (with the readings table and the
// subtraction worked example), then the mass balance, then the fair test on concentration.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const gasRateFrames: Record<string, TeachingFrame[]> = {
  'C33-02': [
    f('A reaction that makes gas', 'If a reaction gives off a gas, you can measure how fast it goes by measuring the gas.', 'more gas each second = faster', 'Marble chips are calcium carbonate. When they meet dilute hydrochloric acid, they fizz and give off carbon dioxide gas. The faster the gas is made, the faster the reaction. So we measure how much gas we collect as time passes.', 'gasrate-why'),
    f('Catching the gas', 'The gas travels along a delivery tube into a measuring cylinder full of water, turned upside down.', 'gas pushes the water out', 'The acid and marble chips go in a conical flask. A delivery tube leads to an upside-down measuring cylinder filled with water. As gas arrives, it pushes the water out. The reading on the cylinder shows the volume of gas.', 'gasrate-set'),
    f('Starting the timing', 'Attach the delivery tube quickly, and start the stopwatch at the same moment.', 'no gas should escape before the tube is on', 'Add the chips, then attach the delivery tube quickly and start the stopwatch at the same time. Take a reading of the gas volume at regular intervals, such as every ten seconds. Write each reading in a table.', 'gasrate-start'),
    f('Or use a gas syringe', 'A gas syringe also measures the volume of gas, to the nearest cm³.', 'accurate, but careful with fizzy reactions', 'A gas syringe collects the gas and shows its volume directly. It reads to the nearest cm³, so it is quite accurate. But if the reaction is too vigorous, the gas can push the plunger right out of the syringe.', 'gasrate-syringe'),
    f('Volume produced', 'Volume produced = reading − starting reading.', 'subtract the starting reading each time', 'Say the cylinder read 2 cm³ at the start. After 10 s it reads 14 cm³, so 14 − 2 = 12 cm³ was produced. After 20 s it reads 22 cm³, so 20 cm³ has been produced. Subtract the starting reading every time.', 'gasrate-table'),
  ],
  'C33-05': [
    f('The flask gets lighter', 'If the gas escapes, the mass of the flask and contents goes down.', 'gas leaves, so the mass falls', 'You can also stand the flask on a balance. As the gas is made, it escapes into the air. So the mass of the flask and its contents falls. The balance reading goes down as the reaction goes on.', 'gasrate-balance'),
    f('Cotton wool', 'A plug of cotton wool lets the gas out but keeps the acid in.', 'gas out, spray stays in', 'A small plug of cotton wool sits in the neck of the flask. The gas passes through it easily. But it stops drops of acid from spitting out, which would also lower the mass and spoil the results.', 'gasrate-cotton'),
    f('Faster means quicker fall', 'The quicker the balance reading drops, the faster the reaction.', 'steep fall = fast reaction', 'Read the balance at regular intervals and write the readings in a table. A reaction that makes the reading fall quickly is a fast reaction. The balance is a very accurate way to measure the loss of gas. But the gas is released into the room, which is a problem if it is toxic.', 'gasrate-balance-fall'),
    f('Choosing a method', 'Each method measures the gas in a different way, and each has a good point and a drawback.', 'volume collected, or mass lost', 'A syringe or upturned cylinder measures the volume of gas collected. A balance measures the mass lost as gas escapes. The balance is very accurate but lets the gas out. Collecting the gas keeps it in the apparatus.', 'gasrate-methods'),
  ],
  'C33-08': [
    f('Different concentrations', 'To test concentration, repeat the whole experiment with acids of different concentrations.', 'same method, new acid each time', 'To find out how concentration affects the rate, repeat the experiment. Use a different concentration of hydrochloric acid each time, for example three different ones. Everything else about the method stays the same.', 'gasrate-fair'),
    f('A fair test', 'Change only the concentration. Keep every other variable the same.', 'one change, everything else fixed', 'In a fair test you change only one thing, here the concentration of acid. The other variables must stay the same. Keep the volume of acid, the mass of marble chips and the temperature the same each time.', 'gasrate-vars'),
    f('Reading the results', 'The more gas given off in a set time, the faster the reaction.', 'compare gas made in the same time', 'Compare the volume of gas collected in the same time, for example after 30 s. The more gas, the faster the reaction. If a stronger acid gives more gas in 30 s, then a higher concentration gave a faster reaction.', 'gasrate-read'),
  ],
}
