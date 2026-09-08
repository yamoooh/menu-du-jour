import type { LucideIcon } from 'lucide-react'

interface StatusCardProps {
  title: string
  subtitle: string
  icon: LucideIcon
  status: 'ready' | 'pending'
  statusLabel: string
  details: string[]
}

export const StatusCard = ({
  title,
  subtitle,
  icon: Icon,
  status,
  statusLabel,
  details,
}: StatusCardProps) => {
  const isReady = status === 'ready'

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isReady
                ? 'bg-orange-50 text-orange-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 leading-snug">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
            isReady
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <ul className="space-y-1.5 text-xs text-slate-600">
        {details.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isReady ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
