import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: drawing conclusions. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsConcludeFrames: Record<string, TeachingFrame[]> = {
  'W11-02': [
    f('Say what you see', 'To draw a conclusion, look at the data and say what you see.', 'look, then say', 'At the end of an investigation you draw a conclusion. Start by looking at your data. Then say what it shows. A student drops a ball onto three surfaces. The mean bounce height is 62 cm on wood, 41 cm on carpet and 12 cm on sand. A conclusion is that the ball bounced highest on wood.', 'wsconclude-see'),
    f('No further than the data', 'You can only conclude what the data shows, and no more.', 'stay inside the data', 'Your conclusion must match the data you have. It must not go any further. The ball test used one ball and three surfaces. You cannot conclude that every ball bounces higher on wood than on grass. Other balls and other surfaces might give different results.', 'wsconclude-limit'),
    f('Back it up with numbers', 'Use your results to justify the conclusion.', 'quote the numbers', 'You should also use your results to justify your conclusion. This means backing it up with the data. Here the ball bounced 21 cm higher on average on wood than on carpet, because 62 − 41 = 21. Numbers make a conclusion much more convincing.', 'wsconclude-justify'),
  ],
  'W11-05': [
    f('The hypothesis', 'A conclusion should say whether the data supports the original hypothesis.', 'does it fit?', 'A good conclusion also goes back to the hypothesis. It says whether the data supports it. Suppose the hypothesis was that harder surfaces give a higher bounce. Wood is harder than carpet, and carpet is harder than sand.', 'wsconclude-hypo'),
    f('Supports', 'If the pattern in the data matches the hypothesis, the data supports it.', 'the pattern matches', 'The bounce heights fell from wood to carpet to sand, so the data matches the hypothesis. We say the data supports the hypothesis for these surfaces. The word supports is careful. One investigation does not prove a hypothesis for ever.', 'wsconclude-support'),
    f('Does not support', 'If the pattern does not match, the data does not support the hypothesis.', 'no match, no support', 'Now imagine the ball had bounced highest on sand. The data would not match the hypothesis. You would say the data does not support it. You should still report what you found and suggest a reason.', 'wsconclude-notsupport'),
  ],
  'W11-07': [
    f('What is a correlation?', 'A correlation is a relationship between two variables.', 'they change together', 'A correlation is a relationship between two variables. As one changes, the other tends to change too. You saw this on graphs, where the points make a pattern. But be careful. A correlation does not always mean that one variable causes the change in the other.', 'wsconclude-corr'),
    f('By chance', 'Sometimes a correlation happens by chance. Other scientists would not find it.', 'a fluke', 'There are three possible reasons for a correlation. The first is chance. A small study might find that people born in spring run faster. If other scientists repeat the study and find nothing, the first result was a fluke.', 'wsconclude-chance'),
    f('A third variable', 'Sometimes both variables are linked to a third variable.', 'something else is behind it', 'The second reason is a third variable. Ice cream sales and sunburn cases both rise in the same weeks. Ice cream does not cause sunburn. Both are linked to sunny weather, which makes people buy ice cream and spend time outside.', 'wsconclude-third'),
    f('A real cause', 'You can say one variable causes the change only when other variables are controlled.', 'controlled, so it is the cause', 'The third reason is that one variable really does cause the change. You can only conclude this when you have controlled all the other variables that could affect the result. In a fair test, more voltage across a wire gives more current, and nothing else changed.', 'wsconclude-cause'),
  ],
}
