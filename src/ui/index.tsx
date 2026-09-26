/*
 * Revily shared UI.
 * Small, stateless building blocks for every surface. Styles: ./revily-ui.css, tokens: ./revily-tokens.css.
 */
import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from 'react'

/* ---------- Ladder mark and wordmark ---------- */

const RUNG_COLOURS = ['#BFA4FF', '#FFAA66', '#52D8C4', '#FF86BD'] // B, I, D=M, A=S (light tints read on both grounds)

export function LadderMark({ size = 24, rail = 'currentColor' }: { size?: number; rail?: string }) {
  return <svg width={size * 22 / 24} height={size} viewBox="0 0 22 24" aria-hidden="true" focusable="false">
    <rect x="1" y="0" width="3" height="24" rx="1.5" fill={rail} />
    <rect x="18" y="0" width="3" height="24" rx="1.5" fill={rail} />
    {RUNG_COLOURS.map((fill, i) => <rect key={fill} x="4" y={3 + i * 5.5} width="14" height="3.5" rx="1" fill={fill} />)}
  </svg>
}

export function RevilyLogo({ href = '/', onNight = false, wordmark = true, size = 26 }: { href?: string | null; onNight?: boolean; wordmark?: boolean; size?: number }) {
  const inner = <>
    <LadderMark size={size} />
    {wordmark ? <span className="rv-logo__word" style={{ fontSize: size * 1.05 }}>revily</span> : <span className="sr-only">Revily</span>}
  </>
  const className = `rv-logo${onNight ? ' rv-logo--on-night' : ''}`
  return href ? <a className={className} href={href} aria-label={wordmark ? 'Revily home' : undefined}>{inner}</a> : <span className={className}>{inner}</span>
}

/* ---------- Step chips (BIDMAS letters, or a plain step number) ---------- */

export type LadderLetter = 'B' | 'I' | 'D' | 'M' | 'A' | 'S'
export type StepTone = 'b' | 'i' | 'dm' | 'as' | 'biro' | 'ink'

export function toneForLetter(letter: LadderLetter): StepTone {
  return ({ B: 'b', I: 'i', D: 'dm', M: 'dm', A: 'as', S: 'as' } as const)[letter]
}

export function StepChip({ children, tone = 'ink', label }: { children: ReactNode; tone?: StepTone; label?: string }) {
  return <span className={`rv-chip rv-step rv-step--${tone}`} aria-label={label}>{children}</span>
}

/* ---------- "= ?" answer box ---------- */

export function AnswerBox({ value, solved = false, label = 'Answer', sign = '=' }: { value?: ReactNode; solved?: boolean; label?: string; sign?: '=' | '≈' }) {
  return <span className={`rv-answer${solved ? ' rv-answer--solved' : ''}`}>
    <span className="rv-answer__eq" aria-hidden="true">{sign}</span>
    <span className="rv-answer__box" aria-label={solved ? `${label}: ` : `${label} not worked out yet`}>{solved ? value : '?'}</span>
  </span>
}

export function FinalAnswer({ children }: { children: ReactNode }) {
  return <span className="rv-final">{children}</span>
}

/* ---------- Working lines ---------- */

export function Working({ children, label = 'Working' }: { children: ReactNode; label?: string }) {
  return <ol className="rv-working" aria-label={label}>{children}</ol>
}

export function WorkingLine({ expression, note, chip, tone = 'biro', dim = false }: {
  expression: ReactNode
  note?: ReactNode
  chip?: ReactNode
  tone?: StepTone
  dim?: boolean
}) {
  return <li className={`rv-line rv-step rv-step--${tone}${dim ? ' rv-line--dim' : ''}`}>
    <span className="rv-line__expr">{expression}</span>
    {(note || chip) && <span className="rv-line__note">{chip && <StepChip tone={tone}>{chip}</StepChip>}{note}</span>}
  </li>
}

/** The part of a line being worked on, boxed in its step colour. */
export function Mark({ children, tone = 'biro' }: { children: ReactNode; tone?: StepTone }) {
  return <span className={`rv-mark rv-step rv-step--${tone}`}>{children}</span>
}

/** A number that has just been produced, shown in its step colour on the next line. */
export function NewValue({ children, tone = 'biro' }: { children: ReactNode; tone?: StepTone }) {
  return <span className={`rv-new rv-step rv-step--${tone}`}>{children}</span>
}

/* ---------- Buttons ---------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost' | 'good' | 'bad'
  size?: 'md' | 'lg'
  block?: boolean
  icon?: boolean
}

export function Button({ variant = 'primary', size = 'md', block = false, icon = false, className = '', type = 'button', ...rest }: ButtonProps) {
  const classes = ['rv-btn', `rv-btn--${variant}`, size === 'lg' && 'rv-btn--lg', block && 'rv-btn--block', icon && 'rv-icon-btn', className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}

/* ---------- Check bar ---------- */

export type CheckStatus = 'idle' | 'correct' | 'incorrect'

export function CheckBar({ status = 'idle', title, message, children, style }: {
  status?: CheckStatus
  title?: ReactNode
  message?: ReactNode
  children: ReactNode
  style?: CSSProperties
}) {
  const icon = status === 'correct' ? '✓' : status === 'incorrect' ? '✗' : null
  return <div className={`rv-checkbar rv-checkbar--${status}`} style={style}>
    <div className="rv-checkbar__inner">
      {(title || message) && <div className="rv-checkbar__status" role={status === 'idle' ? undefined : 'status'}>
        {icon && <span className="rv-checkbar__icon" aria-hidden="true">{icon}</span>}
        <div>
          {title && <p className="rv-checkbar__title">{title}</p>}
          {message && <div className="rv-checkbar__message">{message}</div>}
        </div>
      </div>}
      <div className="rv-checkbar__actions">{children}</div>
    </div>
  </div>
}
