import type { TeachingFrame } from '../teachingFrame'

// Follow one red blood cell. Big picture (two loops) first, then the parts, then the detailed route.
// One new name per frame. Cues avoid arrows (lessons 10–12 test).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const heartFrames: Record<string, TeachingFrame[]> = {
  'B11-02': [
    f('Follow one red blood cell', 'Red blood cells carry oxygen around the body.', 'one cell, one journey', 'When you learned about the lungs, you saw blood pick up oxygen there. Red blood cells carry that oxygen. In this lesson, follow one red blood cell. The heart is the pump that keeps it moving.', 'heart-double-all'),
    f('Loop 1: to the lungs and back', 'The heart pumps the cell to the lungs and back again.', 'the lungs add oxygen', 'The heart pumps our cell to the lungs. There, it picks up oxygen. Blood carrying lots of oxygen is called oxygenated blood. It flows straight back to the heart.', 'heart-double-lungs'),
    f('Loop 2: to the body and back', 'The heart then pumps the cell around the body and back.', 'body cells take the oxygen', 'Next, the heart pumps our cell out to the body. Body cells take oxygen from it for respiration. Blood that has given up its oxygen is called deoxygenated blood. It returns to the heart.', 'heart-double-body'),
    f('Put it together', 'Two loops meet at the heart, so blood passes through it twice.', 'two loops, one pump', 'One loop goes to the lungs and one loop goes to the body. So in one full trip, our cell passes through the heart twice. This is called a double circulatory system.', 'heart-double-all'),
  ],
  'B11-05': [
    f('Four chambers', 'The heart has a right side and a left side, with two chambers on each.', 'two pumps side by side', 'A wall of muscle splits the heart into a right side and a left side. Each side has two spaces inside, called chambers. The right side pumps blood to the lungs. The left side pumps blood to the body.', 'heart-chambers-all'),
    f('The top chambers', 'Each side has an upper chamber that takes blood in.', 'top chambers receive', 'Blood coming into the heart enters an upper chamber first. Each upper chamber is called an atrium. Two of them are called atria. In diagrams, the heart faces you, so its right side is on your left.', 'heart-chambers-atria'),
    f('The bottom chambers', 'Each side has a lower chamber that pumps blood out.', 'bottom chambers pump out', 'Blood passes down from each atrium into the chamber below. This lower chamber has thick muscle walls. It squeezes to pump blood out of the heart. It is called a ventricle.', 'heart-chambers-ventricles'),
    f('The thickest wall', 'The left ventricle has a thicker wall than the right ventricle.', 'further to pump, more muscle', 'The right ventricle only pumps blood to the lungs, which are close by. The left ventricle pumps blood around the whole body. So it needs a thicker muscle wall to push blood harder. Heart muscle also has its own blood supply, which you will meet when you learn about cardiovascular disease.', 'heart-chambers-ventricles'),
  ],
  'B11-08': [
    f('A beating muscle', 'Each heartbeat is the heart muscle squeezing.', 'squeeze, relax, repeat', 'The walls of the chambers are muscle. Each time they squeeze, blood is pushed on, and our cell moves with it. The number of beats in one minute is called the heart rate. Your heart rate when you sit still is your resting heart rate.', 'heart-chambers-all'),
    f('The natural pacemaker', 'A group of cells in the right atrium controls the resting heart rate.', 'a built-in timer', 'These cells sit in the wall of the right atrium. They send out tiny electrical signals that spread through the heart. Each signal starts a beat. This group of cells is called the natural pacemaker.', 'heart-pacemaker-natural'),
    f('Artificial pacemakers', 'An artificial pacemaker can correct an irregular heart rate.', 'a device that helps the timing', 'Sometimes the heart beats too slowly or unevenly. This is an irregular heart rate. A doctor can fit a small electrical device under the skin. It sends signals to keep the heart beating regularly. It is called an artificial pacemaker.', 'heart-pacemaker-artificial'),
  ],
  'B11-11': [
    f('Squeeze and push', 'When a ventricle squeezes, blood is pushed out.', 'squeeze, then blood moves', 'When a ventricle squeezes, the pressure inside it rises. Blood is pushed out of the heart. But the blood could also be pushed back up into the atrium.', 'heart-chambers-ventricles'),
    f('Flaps that shut', 'Flaps open to let blood through, then shut behind it.', 'open forwards, shut backwards', 'Blood pushing forwards opens a set of flaps. If blood starts to flow back, the flaps are pushed together and close. These one-way flaps are called valves.', 'heart-valves'),
    f('One way only', 'Valves make sure blood flows one way through the heart.', 'forwards only', 'There are valves between each atrium and its ventricle. There are more valves where blood leaves each ventricle. So our cell can only move forwards. The names of the valves are not required for your exam; you only need to know what valves do.', 'heart-chambers-all'),
  ],
  'B11-13': [
    f('Back from the body', 'Deoxygenated blood returns from the body to the right atrium.', 'body to right side', 'Our cell has given up its oxygen in the body. A large blood vessel brings it back to the right atrium. This vessel is called the vena cava. Then the cell passes down into the right ventricle.', 'heart-chambers-atria'),
    f('Off to the lungs', 'The right ventricle pumps blood into the pulmonary artery.', 'right side sends blood to the lungs', 'The right ventricle squeezes. It pumps our cell into the pulmonary artery, which carries it to the lungs. Pulmonary means to do with the lungs. In the lungs, the cell picks up oxygen.', 'heart-chambers-out'),
    f('Back from the lungs', 'Oxygenated blood returns to the left atrium in the pulmonary vein.', 'lungs to left side', 'Now full of oxygen, our cell leaves the lungs. The pulmonary vein carries it back to the heart. It enters the left atrium, then passes down into the left ventricle.', 'heart-chambers-atria'),
    f('Out to the body', 'The left ventricle pumps blood into the aorta.', 'left side sends blood to the body', 'The thick-walled left ventricle squeezes hard. It pumps our cell into the aorta. The aorta carries oxygenated blood away from the heart to the body.', 'heart-chambers-out'),
    f('Artery or vein?', 'Arteries carry blood away from the heart; veins bring it back.', 'direction decides the name', 'A blood vessel carrying blood away from the heart is called an artery. One bringing blood back is called a vein. The pulmonary artery carries deoxygenated blood, but it is still an artery. It carries blood away from the heart.', 'heart-chambers-out'),
    f('Put it together', 'One full trip: body, right side, lungs, left side, body.', 'right side to the lungs, left side to the body', 'Our cell goes: vena cava, right atrium, right ventricle, pulmonary artery, lungs. Then: pulmonary vein, left atrium, left ventricle, aorta, body. Blood leaves the left ventricle in the aorta. Next, you will follow the vessels that carry it around the body.', 'heart-double-all'),
  ],
}
