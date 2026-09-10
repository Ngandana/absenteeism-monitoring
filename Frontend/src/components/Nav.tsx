export type ScreenKey = 'overview' | 'cases' | 'reference' | 'quality'

const TABS: { key: ScreenKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'cases', label: 'Alert cases' },
  { key: 'reference', label: 'Reference data' },
  { key: 'quality', label: 'Data quality' },
]

export function Nav({
  screen,
  onNavigate,
  openCaseCount,
  qualityBadge,
}: {
  screen: ScreenKey
  onNavigate: (s: ScreenKey) => void
  openCaseCount: number
  qualityBadge: number
}) {
  const badgeFor = (key: ScreenKey): string | null => {
    if (key === 'cases') return String(openCaseCount)
    if (key === 'quality') return qualityBadge > 0 ? String(qualityBadge) : null
    return null
  }

  return (
    <nav aria-label="Primary" className="mx-auto flex w-full max-w-[1440px] gap-0 overflow-x-auto border-t border-neutral-300 px-4 sm:px-8">
      {TABS.map((t) => {
        const current = screen === t.key
        const badge = badgeFor(t.key)
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onNavigate(t.key)}
            aria-current={current ? 'page' : undefined}
            aria-label={`Go to ${t.label}`}
            className="flex min-h-12 cursor-pointer items-center gap-2 whitespace-nowrap border-0 border-b-[3px] bg-transparent px-[18px] text-sm font-semibold transition-colors hover:bg-neutral-200"
            style={{ borderBottomColor: current ? 'var(--color-accent)' : 'transparent' }}
          >
            <span aria-hidden="true" className="h-2 w-2" style={{ background: current ? 'var(--color-accent)' : 'transparent' }} />
            {t.label}
            {badge && <span className="bg-neutral-900 px-[7px] py-[1px] text-xs font-bold text-neutral-100">{badge}</span>}
          </button>
        )
      })}
    </nav>
  )
}
