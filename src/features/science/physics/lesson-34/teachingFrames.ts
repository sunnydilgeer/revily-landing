import type { TeachingFrame } from '../../teachingFrame'

// Radioactive decay and the four emissions, ionising radiation, the property table, choosing radiation for a use.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const nuclearRadiationFrames: Record<string, TeachingFrame[]> = {
  'P34-02': [
    f('Unstable nuclei decay', 'An unstable nucleus gives out radiation to become more stable. This is radioactive decay.', 'unstable, decay, radiation', 'Some isotopes have unstable nuclei. An unstable nucleus gives out radiation to become more stable. This process is called radioactive decay. The radiation it gives out is called nuclear radiation.', 'nrad-decay'),
    f('Alpha and beta particles', 'An alpha particle is 2 protons and 2 neutrons. A beta particle is a fast-moving electron.', 'alpha is heavy, beta is light', 'There are four types of nuclear radiation. An alpha particle, α, is made of 2 protons and 2 neutrons. A beta particle, β, is a fast-moving electron.', 'nrad-alpha-beta'),
    f('Gamma rays and neutrons', 'Gamma rays are electromagnetic radiation from the nucleus. Neutrons can also be released.', 'gamma is a wave, neutron is a particle', 'A gamma ray, γ, is electromagnetic radiation released by the nucleus. It is a wave, not a particle. Neutrons can also be released when some atoms decay.', 'nrad-gamma-neutron'),
  ],
  'P34-05': [
    f('Knocking electrons off atoms', 'Ionising radiation knocks electrons off atoms and turns them into positive ions.', 'electron knocked off, ion left', 'Ionising radiation can knock electrons off atoms. An atom that loses electrons becomes a positive ion. That is why this radiation is called ionising radiation.', 'nrad-ionise'),
    f('Ionising power', 'Ionising power is how easily radiation can knock electrons off atoms.', 'easily or not easily', 'Some radiation knocks electrons off more easily than other radiation. How easily it does this is called its ionising power. Alpha particles, beta particles and gamma rays are all types of ionising radiation.', 'nrad-power'),
    f('Strong, moderate, weak', 'Alpha is strongly ionising, beta is moderate and gamma is weak.', 'alpha strong, gamma weak', 'The three types have different ionising powers. Alpha particles are strongly ionising. Beta particles are moderately ionising. Gamma rays are weakly ionising.', 'nrad-order'),
  ],
  'P34-07': [
    f('Alpha: strong but stopped easily', 'Alpha travels a few centimetres in air and a sheet of paper stops it.', 'short range, stopped by paper', 'Alpha particles are strongly ionising. They only travel a few centimetres through air. A sheet of paper is enough to stop them.', 'nrad-alpha-range'),
    f('Beta: in the middle', 'Beta travels a few metres in air and a sheet of aluminium stops it.', 'medium range, stopped by aluminium', 'Beta particles are moderately ionising. They travel a few metres through air. They pass through paper, but a sheet of aluminium stops them.', 'nrad-beta-range'),
    f('Gamma: weak but goes far', 'Gamma travels a long way in air and needs thick lead or metres of concrete to stop it.', 'long range, hard to stop', 'Gamma rays are weakly ionising. They travel a long way through air. It takes thick sheets of lead or metres of concrete to stop them.', 'nrad-gamma-range'),
    f('Putting it in a table', 'The stronger the ionising power, the shorter the range and the easier the radiation is to stop.', 'strong ionising, short range', 'Put the three types side by side. The more strongly a type ionises, the less far it travels and the easier it is to stop. So alpha is stopped by paper and gamma is stopped only by lead or concrete.', 'nrad-table'),
  ],
  'P34-10': [
    f('A medical tracer', 'A medical tracer is a radioactive isotope injected into a patient, and its radiation is detected outside the body.', 'inject, then detect outside', 'A medical tracer is a radioactive isotope that is injected into a patient. Its radiation must be detected outside the body. So the radiation has to pass through the body.', 'nrad-tracer'),
    f('Why not alpha?', 'Alpha cannot pass through the body and is strongly ionising, so it would do a lot of damage.', 'alpha cannot get out', 'Alpha particles are no use for a tracer. They cannot pass through the body to be detected. They are also strongly ionising, so they could do a lot of damage inside the body.', 'nrad-tracer-alpha'),
    f('Gamma makes a good tracer', 'Gamma passes through the body easily, is weakly ionising and is easy to detect.', 'gamma passes out, does less harm', 'Medical tracers usually give out gamma rays. Gamma rays pass easily through the body, so they are detected outside. They are only weakly ionising, so they do less harm than alpha particles.', 'nrad-tracer-gamma'),
    f('Sterilising equipment', 'Radiation that passes through packaging can sterilise sealed medical equipment.', 'must pass through the packaging', 'Radiation can also sterilise medical equipment. The equipment is sealed in packaging first. The radiation must pass through the packaging to reach the equipment, so gamma rays suit this job.', 'nrad-steril'),
  ],
}
