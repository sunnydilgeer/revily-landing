import type { TeachingFrame } from '../teachingFrame'

// Two ways people change organisms. First choosing the parents (one grower breeding bigger strawberries), then the
// downside of inbreeding, then moving a gene between organisms (insulin, crops, gene therapy), then a balanced weigh-up.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const breedingFrames: Record<string, TeachingFrame[]> = {
  'B44-02': [
    f('Choosing the parents', 'People choose which plants or animals breed.', 'people choose the parents', 'People can choose which plants or animals are allowed to breed. They pick the ones with useful or attractive features. This is called selective breeding.', 'evolve-breed-intro'),
    f('Features people want', 'Breeders choose features that are useful or attractive.', 'more food, less disease, gentle, pretty', 'Farmers breed animals that give more meat or milk, and crops that are not killed by disease. Dog breeders choose dogs with a gentle nature. Gardeners breed plants with big or unusual flowers.', 'evolve-breed-uses'),
    f('Choose and breed', 'Pick the parents with the feature, and breed them.', 'best two → breed', 'A grower wants bigger strawberries. She chooses the two plants with the biggest fruit and breeds them together. Their offspring vary: some have bigger fruit than others.', 'evolve-breed-choose'),
    f('Again and again', 'Pick the best offspring, breed them, and repeat.', 'repeat for several generations', 'She chooses the offspring with the biggest fruit and breeds them together. She repeats this over several generations. In the end, all the offspring have big fruit.', 'evolve-breed-repeat'),
    f('Artificial selection', 'Selective breeding is also called artificial selection.', 'people choose, not nature', 'People, not nature, choose which individuals breed. So selective breeding is also called artificial selection. People have done it for thousands of years, turning wild plants into crops and wild animals into farm animals and pets.', 'evolve-breed-artificial'),
  ],
  'B44-05': [
    f('Close relatives', 'Selectively bred organisms are closely related.', 'same few parents → close relatives', 'Breeders keep using the same few best individuals. So the plants or animals end up closely related. Breeding closely related individuals is called inbreeding.', 'evolve-inbred-relatives'),
    f('Fewer alleles', 'Inbreeding reduces the number of different alleles.', 'fewer different alleles', 'Inbreeding reduces the number of different alleles in a population. You met alleles, the different forms of a gene, when you learned about genetic diagrams.', 'evolve-inbred-alleles'),
    f('Health problems', 'Harmful alleles are more likely to be inherited.', 'harmful allele from both parents', 'With fewer different alleles, there is more chance of health problems caused by genes. Offspring are more likely to inherit a harmful genetic defect from both parents.', 'evolve-inbred-health'),
    f('A new disease', 'A new disease could affect them all.', 'no resistant alleles → all affected', 'If a new disease appears, it is less likely that any individual has alleles that help it resist the disease. So if one individual is affected, the rest are likely to be affected too.', 'evolve-inbred-disease'),
  ],
  'B44-07': [
    f('Moving a gene', 'A gene is cut from one organism and put into another.', 'cut out → put in', 'Scientists can cut a useful gene out of one organism. They put it into the cells of another organism. Changing an organism’s genes like this is called genetic engineering.', 'evolve-ge-cut'),
    f('GM organisms', 'An organism with a new gene inserted is genetically modified.', 'new gene → GM organism', 'The organism now has a new, useful characteristic. An organism with a new gene inserted is called a genetically modified, or GM, organism.', 'evolve-ge-gm'),
    f('Insulin from bacteria', 'GM bacteria make human insulin.', 'human gene → bacteria → insulin', 'The human gene for insulin can be put into bacteria. The bacteria multiply, and they all make human insulin. It is used to treat diabetes, which you met when you learned about blood glucose.', 'evolve-ge-insulin'),
    f('Resisting weedkillers', 'Some GM crops are resistant to herbicides.', 'spray the weeds, not the crop', 'Herbicides are chemicals that kill plants, such as weeds. Some GM crops are resistant to herbicides. So farmers can spray their fields to kill the weeds without harming the crop.', 'evolve-ge-herbicide'),
    f('More food', 'GM crops can increase crop yield.', 'crop yield = food produced', 'Other GM crops are resistant to insects or disease, or grow bigger and better fruit. These changes can increase the crop yield, which is the amount of food produced.', 'evolve-ge-yield'),
    f('Gene therapy', 'Working genes may treat inherited disorders.', 'faulty gene → add a working gene', 'Some inherited disorders are caused by a faulty gene. Scientists are developing ways to treat them by inserting working genes into the person’s cells. This is called gene therapy.', 'evolve-ge-therapy'),
  ],
  'B44-10': [
    f('The benefits', 'Genetic engineering can bring real benefits.', 'food and medicine', 'Genetic engineering can give bigger crop yields, and medicines such as human insulin. It may help to treat inherited disorders. But people also have concerns about it.', 'evolve-gm-benefits'),
    f('Concerns about GM animals', 'Effects on animals can be hard to predict.', 'hard to predict', 'It can be hard to predict how changing an animal’s DNA will affect it. Some GM animals develop health problems later in life. Many GM embryos do not survive.', 'evolve-gm-animals'),
    f('Concerns about GM crops', 'Some people worry about wildlife and health.', 'wild flowers, insects, health', 'Some people say growing GM crops could reduce the number of wild flowers, and so the number of insects. Some people worry that we do not yet fully understand the effects of GM crops on human health.', 'evolve-gm-crops'),
    f('Weighing it up', 'Benefits are weighed against possible risks.', 'benefits vs concerns', 'Each use of genetic engineering has benefits and possible risks. We do not yet know all the effects, so scientists keep collecting evidence. People weigh up each use case by case.', 'evolve-gm-weigh'),
  ],
}
