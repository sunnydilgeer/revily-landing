/*
 * The Number boss, the Treasurer: a crystal guardian drawn in SVG. Its body is six shards around the eye,
 * so it can crack as it takes hits and burst apart when beaten. Motion lives in BossCharacter.css and stops
 * under reduced motion.
 */
import './BossCharacter.css'

const CX = 100, CY = 98
const HEX = [[100, 38], [152, 68], [152, 128], [100, 158], [48, 128], [48, 68]] as const

const shards = HEX.map((point, index) => {
  const next = HEX[(index + 1) % HEX.length]
  const mx = (point[0] + next[0]) / 2, my = (point[1] + next[1]) / 2
  // Each shard flies out along the line from the centre through the middle of its outer edge.
  const dx = (mx - CX) * 1.4, dy = (my - CY) * 1.4
  return { points: `${CX},${CY} ${point[0]},${point[1]} ${next[0]},${next[1]}`, dx, dy, spin: index % 2 ? 28 : -32 }
})

const cracks = [
  'M112 58 L104 74 L114 82 L106 96',
  'M62 112 L78 108 L84 120 L98 124',
  'M140 100 L126 104 L130 118 L118 128',
]

export type BossMood = 'idle' | 'hit' | 'down' | 'taunt'

export default function BossCharacter({ mood, damage, size = 180 }: { mood: BossMood; damage: number; size?: number }) {
  return <svg className={`bc bc--${mood}`} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="The Treasurer, the Number boss">
    <defs>
      <radialGradient id="bc-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ff6b5e" stopOpacity=".55" />
        <stop offset="60%" stopColor="#ff6b5e" stopOpacity=".12" />
        <stop offset="100%" stopColor="#ff6b5e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bc-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a2f7a" />
        <stop offset="100%" stopColor="#161c44" />
      </linearGradient>
      <linearGradient id="bc-shard" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity=".16" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>

    <circle className="bc-aura" cx={CX} cy={CY} r="96" fill="url(#bc-aura)" />

    <g className="bc-orbit">
      {([['£', 0], ['½', 120], ['%', 240]] as const).map(([glyph, angle]) => {
        const x = CX + 84 * Math.sin(angle * Math.PI / 180), y = CY - 84 * Math.cos(angle * Math.PI / 180)
        return <g key={glyph} className="bc-glyph">
          <circle cx={x} cy={y} r="13" fill="#182046" stroke="#ffd35c" strokeWidth="2" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#ffd35c" style={{ fontFamily: 'var(--rv-font-body)' }}>{glyph}</text>
        </g>
      })}
    </g>

    <g className="bc-float">
      <g className="bc-horns">
        <path d="M66 62 L50 22 L84 52 Z" fill="#26306a" stroke="#ff6b5e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M134 62 L150 22 L116 52 Z" fill="#26306a" stroke="#ff6b5e" strokeWidth="3" strokeLinejoin="round" />
      </g>

      <g className="bc-body">
        {shards.map((shard, index) => <g key={index} className="bc-shard" style={{ ['--dx' as string]: `${shard.dx}px`, ['--dy' as string]: `${shard.dy}px`, ['--spin' as string]: `${shard.spin}deg` }}>
          <polygon points={shard.points} fill="url(#bc-body)" stroke="#ff6b5e" strokeWidth="3" strokeLinejoin="round" />
          <polygon points={shard.points} fill="url(#bc-shard)" />
        </g>)}
        <polygon points={HEX.map(p => p.join(',')).join(' ')} fill="none" stroke="#ff6b5e" strokeWidth="3.5" strokeLinejoin="round" className="bc-rim" />
      </g>

      <g className="bc-face">
        <ellipse cx={CX} cy="94" rx="27" ry="19" fill="#fff" />
        <g className="bc-iris">
          <circle cx={CX} cy="96" r="11" fill="#ff6b5e" />
          <circle cx={CX} cy="96" r="5" fill="#0f1530" />
          <circle cx="104" cy="92" r="2.4" fill="#fff" />
        </g>
        <rect className="bc-lid" x="72" y="74" width="56" height="21" rx="4" fill="#2c2466" />
        <path className="bc-brow" d="M70 72 L100 80 L130 72" fill="none" stroke="#ff6b5e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M78 128 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6" fill="none" stroke="#ffd35c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g className="bc-cracks" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {cracks.slice(0, damage).map(d => <path key={d} d={d} className="bc-crack" pathLength={1} />)}
      </g>
    </g>
  </svg>
}
