/**
 * Tiny synthesised sound effects, so the lab ships no audio files. Every sound starts from a tap,
 * which is what browsers need before they allow audio. Muting is remembered on the device.
 */
const KEY = 'revily.heist.muted'
let context: AudioContext | null = null

export function isMuted() {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

export function setMuted(muted: boolean) {
  try { localStorage.setItem(KEY, muted ? '1' : '0') } catch { /* private mode: stays for this visit only */ }
}

function audio() {
  if (typeof window === 'undefined' || isMuted()) return null
  context ??= new AudioContext()
  if (context.state === 'suspended') void context.resume()
  return context
}

function tone(frequency: number, start: number, length: number, type: OscillatorType = 'sine', volume = .18, slideTo?: number) {
  const ctx = audio()
  if (!ctx) return
  const at = ctx.currentTime + start
  const osc = ctx.createOscillator(), gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, at)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + length)
  gain.gain.setValueAtTime(volume, at)
  gain.gain.exponentialRampToValueAtTime(.001, at + length)
  osc.connect(gain).connect(ctx.destination)
  osc.start(at)
  osc.stop(at + length)
}

export const sfx = {
  /** Right answer: a two-note coin. */
  coin: () => { tone(988, 0, .08, 'square', .08); tone(1319, .07, .25, 'square', .08) },
  /** Wrong answer: a low buzz that sags. */
  buzz: () => tone(160, 0, .35, 'sawtooth', .12, 90),
  /** The vault dial clicking round, then the door. */
  vault: () => { for (let i = 0; i < 6; i++) tone(2200 - i * 120, i * .1, .03, 'square', .05); tone(110, .65, .5, 'triangle', .25, 55) },
  /** The LIAR stamp landing. */
  stamp: () => tone(90, 0, .25, 'square', .22, 40),
  /** Payout and streaks: a rising arpeggio. */
  win: () => [523, 659, 784, 1047].forEach((note, i) => tone(note, i * .09, .22, 'triangle', .14)),
}
