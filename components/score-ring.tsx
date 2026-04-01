"use client"

interface ScoreRingProps {
  score: number
  size?: number
  label?: string
}

export function ScoreRing({ score, size = 120, label }: ScoreRingProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const color =
    score >= 70 ? "#4ade80" : score >= 40 ? "#fbbf24" : "#f87171"

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>}
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-black" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] font-black text-slate-500">/100</span>
        </div>
      </div>
    </div>
  )
}
