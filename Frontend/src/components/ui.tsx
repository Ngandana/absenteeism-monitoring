import type { ButtonHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { AlertLevel } from '../lib/types'

/** The 4 escalation levels, in order — used everywhere a level needs to render as filled marks. */
export const LEVELS: AlertLevel[] = ['Early Warning', 'Concern', 'Consultation', 'Red Flag']

export function levelStep(level: AlertLevel): number {
  return LEVELS.indexOf(level) + 1
}

/** The 1–4 filled-mark escalation scale, with a text label alongside it so it never depends on color alone. */
export function MarkScale({ step, size = 14 }: { step: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{ width: size * 0.55, height: size }}
          className={i <= step ? 'bg-neutral-900' : 'border-[1.5px] border-neutral-400'}
        />
      ))}
    </span>
  )
}

export function LevelBadge({ level }: { level: AlertLevel }) {
  if (level === 'Red Flag') {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap bg-accent px-[9px] py-[3px] text-[13px] font-bold text-neutral-100">
        <MarkScale step={4} />
        Red Flag
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold">
      <MarkScale step={levelStep(level)} />
      {level}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="whitespace-nowrap border-[1.5px] border-neutral-700 px-[9px] py-[3px] text-[13px] font-semibold">
      {status}
    </span>
  )
}

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  const base = 'min-h-11 cursor-pointer border-2 px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'
  const variants: Record<string, string> = {
    primary: 'border-accent bg-accent text-neutral-100 hover:bg-accent-600 active:bg-accent-700',
    secondary: 'border-divider bg-transparent text-text hover:bg-neutral-200',
    ghost: 'border-transparent bg-transparent text-accent-700 hover:bg-accent-100',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {hint && <p className="m-0 text-[13px] text-neutral-700">{hint}</p>}
      {children}
    </div>
  )
}

const inputClasses =
  'min-h-11 w-full border-2 border-neutral-400 bg-bg px-3 text-sm text-text focus-visible:border-accent'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${props.className || ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClasses} cursor-pointer ${props.className || ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClasses} resize-y py-2 ${props.className || ''}`} />
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-2 border-divider bg-bg ${className}`}>{children}</div>
}

export function StatTile({ value, label, note }: { value: string | number; label: string; note?: string }) {
  return (
    <div className="border-r-2 border-b-2 border-divider bg-bg p-4">
      <p className="m-0 text-[32px] font-extrabold leading-tight font-heading">{value}</p>
      <p className="mt-1 mb-0 text-sm font-semibold">{label}</p>
      {note && <p className="mt-0.5 mb-0 text-[13px] text-neutral-700">{note}</p>}
    </div>
  )
}

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-0.5 bg-divider ${className}`} />
}
