// Checks a step working (src/features/written-methods/tutor/stepWorking.ts) against the explanation style
// (src/features/EXPLANATIONS.md): short headings, the ⓘ in words, every "a op b → c" line true, and the answer shown
// once, by the last move. Returns the answer the working ends on, so a lesson can compare it with the question's.
const assert = require('node:assert/strict')

const number = text => Number(String(text).replace(/[£,\s]/g, '').replace(/−/g, '-'))
function evaluate(expression) {
  const js = expression.replace(/[£,]/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
  if (!/^[\d.\s+\-*/()]+$/.test(js)) return undefined
  return Function(`return ${js}`)()
}
function columnsAnswer(picture) {
  const places = Math.max(...picture.rows.map(r => (r.split('.')[1] ?? '').length))
  const digits = picture.answer
  return places ? `${digits.slice(0, -places) || '0'}.${digits.slice(-places)}` : digits
}

function checkStepWorking(working, label) {
  assert.equal(working.kind, 'step-worked', label)
  assert.ok(working.steps.length, `${label}: no steps`)
  let lines = 0, answer
  working.steps.forEach((step, i) => {
    const last = i === working.steps.length - 1
    assert.ok(step.title.trim().split(/\s+/).length <= 4, `${label}: short heading (${step.title})`)
    assert.ok(step.why && !/[=→]|\d\s*[×÷+−]\s*\d/.test(step.why), `${label}: the ⓘ is words (${step.why})`)
    for (const line of step.lines ?? []) {
      const sum = line.parts.map(p => p.text).join(' ')
      const value = evaluate(sum)
      if (line.result !== undefined && value !== undefined && /[×÷+−]/.test(sum) && !Number.isNaN(number(line.result))) {
        lines++
        assert.ok(Math.abs(value - number(line.result)) < 1e-9, `${label}: ${sum} → ${line.result}`)
      }
    }
    const shown = [...(step.lines ?? []).filter(l => l.answer).map(l => l.result), ...(step.words ? [step.words] : []),
      ...(step.picture?.done ? [step.picture.kind === 'columns' ? columnsAnswer(step.picture) : step.picture.quotient.trim()] : [])]
    assert.equal(shown.length, last ? 1 : 0, `${label} step ${i + 1}: the answer is shown once, by the last move`)
    if (last) answer = shown[0]
  })
  return { answer, lines }
}

module.exports = { checkStepWorking, number }
