// Resolves a lesson argument for the Science scripts to its folder under src/features/science.
// Biology (unchanged): the folder suffix, e.g. "53" → lesson-53, "1b" → lesson-1b.
// Chemistry (numbered from 1): "c1", "chemistry/1" or "chemistry/lesson-1" → chemistry/lesson-1.
// Physics (numbered from 1): "p1", "physics/1" or "physics/lesson-1" → physics/lesson-1.
module.exports = function scienceLessonDir(arg) {
  const chemistry = /^(?:c|chemistry\/(?:lesson-)?)(\d+[a-z]?)$/i.exec(arg)
  if (chemistry) return { subject: 'chemistry', dir: `chemistry/lesson-${chemistry[1].toLowerCase()}` }
  const physics = /^(?:p|physics\/(?:lesson-)?)(\d+[a-z]?)$/i.exec(arg)
  if (physics) return { subject: 'physics', dir: `physics/lesson-${physics[1].toLowerCase()}` }
  return { subject: 'biology', dir: `lesson-${arg.replace(/^(?:biology\/)?(?:lesson-)?/, '')}` }
}
