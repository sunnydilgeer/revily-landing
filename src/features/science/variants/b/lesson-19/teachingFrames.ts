import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow one cold from sneeze to sneeze, then widen out to the other pathogens and routes.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const pathogenFrames: Record<string, TeachingFrame[]> = {
  'B19-02': [
    f('A cold goes round the class', 'Something passes from person to person.', 'tiny and alive', 'A cold can spread through a whole class in a week. Something too small to see is passing from person to person. Tiny living things like this are called microorganisms.', 'pathogen-class-overview'),
    f('Meet the pathogen', 'A pathogen is a microorganism that causes disease.', 'pathogen = causes disease', 'A cold is caused by a pathogen called a virus. Diseases caused by pathogens are communicable. They can pass from one living thing to another. You met this in Lesson 15.', 'pathogen-class-virus'),
    f('Out in droplets', 'A sneeze sprays tiny drops into the air.', 'sneeze → droplets', 'When someone with a cold sneezes, they spray tiny drops of liquid called droplets. The droplets carry viruses through the air.', 'pathogen-class-droplets'),
    f('Into a new person', 'Someone nearby breathes the droplets in.', 'breathed in → infected', 'A classmate breathes in the droplets. The viruses land inside their nose and throat.', 'pathogen-class-breathe'),
    f('Zoom in: inside a cell', 'The virus copies itself inside a cell.', 'copies → cell bursts', 'A virus is not a cell. It gets inside one of your cells and makes lots of copies of itself. The cell bursts and releases them. This cell damage makes you feel ill.', 'pathogen-class-cells'),
  ],
  'B19-05': [
    f('Catch it, bin it, wash', 'Keeping clean stops viruses reaching others.', 'clean hands → fewer viruses passed on', 'Hygiene means keeping clean to stop pathogens spreading. Sneezing into a tissue, binning it and washing your hands stops viruses reaching other people.', 'pathogen-class-hygiene'),
    f('Stay apart', 'Keeping an ill person away from others stops them passing it on.', 'apart → can’t pass it on', 'Keeping an infected person away from other people is called isolation. Staying at home with a bad illness is a simple version of this.', 'pathogen-class-isolation'),
    f('Vaccination', 'A vaccine makes people less likely to catch a disease.', 'vaccinated → less likely to catch it or pass it on', 'Vaccination makes people less likely to catch a disease. So they are also less likely to pass it on. You will see how it works in Lesson 23.', 'pathogen-class-vaccine'),
  ],
  'B19-07': [
    f('Four kinds of pathogen', 'Viruses are one of four kinds of pathogen.', 'viruses, bacteria, fungi, protists', 'There are four main kinds of pathogen. You have met viruses. Viruses are much smaller than the others, and they are not cells.', 'pathogen-types-virus'),
    f('Bacteria', 'Bacteria are very small living cells.', 'cells that multiply fast', 'Bacteria are very small living cells. You met bacterial cells in Lesson 1. Inside the body, bacteria can reproduce very quickly.', 'pathogen-types-bacteria'),
    f('Toxins', 'Many bacteria make poisons called toxins.', 'toxins, not bursting cells', 'Many bacteria make toxins. A toxin is a poison made by a pathogen. Toxins damage your cells and tissues, and this makes you feel ill.', 'pathogen-types-toxin'),
    f('Fungi', 'Some fungi cause disease, especially in plants.', 'moulds and mushrooms', 'Fungi include moulds and mushrooms. One of them is called a fungus. Some fungi cause disease, especially in plants.', 'pathogen-types-fungus'),
    f('Protists', 'A protist is a living thing made of one cell.', 'one bigger cell', 'A protist is a living thing made of one cell. It is larger and more complex than a bacterium. One protist causes malaria.', 'pathogen-types-protist'),
  ],
  'B19-10': [
    f('By touch', 'Some pathogens spread by touching.', 'touch → picked up', 'Some pathogens spread by direct contact. You pick them up by touching an infected person, or a surface they have touched.', 'pathogen-routes-contact'),
    f('In dirty water', 'Some pathogens live in dirty water.', 'drink or wash → infected', 'Some pathogens live in dirty water. People catch them by drinking it or bathing in it. Clean water stops this route.', 'pathogen-routes-water'),
    f('Carried by an animal', 'A vector carries a pathogen from one living thing to another.', 'vector = carrier', 'A vector is a living thing that carries a pathogen to another living thing. Mosquitoes are vectors. Killing vectors, or destroying the places where they breed, stops the spread.', 'pathogen-routes-vector'),
    f('Match the stop to the route', 'Each route has its own way to stop it.', 'route → stop', 'Air: tissues, isolation and vaccination. Touch: hand washing. Water: clean drinking water. Vectors: insecticides and destroying breeding places.', 'pathogen-routes-summary'),
  ],
}
