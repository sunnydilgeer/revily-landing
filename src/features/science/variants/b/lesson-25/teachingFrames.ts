import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow one possible new drug, drug M, from the lab bench to a published report: cells, animals, healthy volunteers
// on a very low dose, patients (including Mia's aunt from Lesson 24), then the fair-test ideas and peer review.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const drugTestingFrames: Record<string, TeachingFrame[]> = {
  'B25-02': [
    f('A possible new drug', 'Chemists find a chemical that might ease migraines.', 'test before use', 'Chemists find a plant chemical that might ease migraines, which are very bad headaches. They call it drug M. Before anyone can use it, it must be tested.', 'trial-lab-new'),
    f('Cells and tissues', 'Preclinical testing starts with human cells in the lab.', 'preclinical = before people', 'Preclinical testing is testing done before any people take the drug. First, drug M is tested on human cells and tissues in the lab.', 'trial-lab-cells'),
    f('Live animals', 'Next, drug M is tested on live animals.', 'a whole living body', 'Next, drug M is tested on live animals. This shows how the drug acts in a whole living body, not just in some cells.', 'trial-lab-animals'),
    f('Efficacy', 'Efficacy is whether the drug works.', 'efficacy = does it work?', 'The tests check three things. The first is efficacy. Efficacy means whether the drug works and has the effect you want.', 'trial-check-efficacy'),
    f('Toxicity', 'Toxicity is how harmful the drug is.', 'toxicity = how harmful?', 'The second is toxicity. Toxicity means how harmful the drug is, including any side effects. A side effect is an unwanted effect of a drug.', 'trial-check-toxicity'),
    f('Dosage', 'Dosage is how much to give, and how often.', 'dosage = how much, how often', 'The third is dosage. Dosage means the amount of the drug that works best, and how often it should be taken.', 'trial-check-dosage'),
  ],
  'B25-05': [
    f('A clinical trial', 'A clinical trial tests the drug on people.', 'clinical trial = testing on people', 'If drug M passes the tests on animals, it is tested on human volunteers. This is called a clinical trial. The volunteers choose to take part.', 'trial-people-trial'),
    f('Healthy volunteers first', 'First, healthy people take drug M.', 'healthy first: any harm?', 'First, drug M is given to healthy volunteers. This checks for harmful side effects while the body is working normally.', 'trial-people-healthy'),
    f('A very low dose', 'The dose starts very low and rises slowly.', 'start low, go slowly', 'At the start of the trial, the volunteers get a very low dose. The dose is increased little by little.', 'trial-people-dose'),
    f('Then patients', 'Next, patients with migraines take drug M.', 'patient = has the illness', 'If these results are good, drug M is tested on patients. Patients are people who have the illness. Mia’s aunt, who gets migraines, takes part.', 'trial-people-patients'),
    f('The optimum dose', 'The optimum dose works best with few side effects.', 'optimum = best balance', 'The trials find the optimum dose. This is the dose that is most effective and has few side effects.', 'trial-people-optimum'),
  ],
  'B25-08': [
    f('Two groups', 'Patients are split into two groups.', 'compare two groups', 'To test how well drug M works, the patients are put into two groups. Group 1 is given drug M.', 'trial-fair-groups'),
    f('Placebo', 'A placebo looks like the drug but does nothing.', 'placebo = a dummy pill', 'Group 2 is given a placebo. A placebo looks like the drug but does not do anything. Doctors compare the groups to see if drug M makes a real difference.', 'trial-fair-placebo'),
    f('Blind', 'In a blind trial, the patients do not know.', 'blind = patient does not know', 'The trial is blind. The patients, including Mia’s aunt, do not know whether they are getting drug M or the placebo.', 'trial-fair-blind'),
    f('Double-blind', 'In a double-blind trial, the doctors do not know either.', 'double-blind = nobody knows', 'Often the trial is double-blind. Neither the patients nor the doctors know who got which until all the results are gathered. So nobody’s expectations can affect the results.', 'trial-fair-double'),
    f('Peer review', 'Other scientists check the results before they are published.', 'peer review = checked by other experts', 'The results are not published until they have been through peer review. This means other scientists check the work. It helps to prevent false claims.', 'trial-fair-review'),
  ],
}
