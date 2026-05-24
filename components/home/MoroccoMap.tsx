'use client'

import { motion } from 'framer-motion'

interface MoroccoMapProps {
  currentCity: string
  unlockedCities: string[]
}

const cities = [
  { name: 'Nador',       x: 78, y: 25, emoji: '⚓', xpRequired: 0 },
  { name: 'Al Hoceima',  x: 62, y: 20, emoji: '🏖️', xpRequired: 200 },
  { name: 'Tangier',     x: 20, y: 15, emoji: '🌊', xpRequired: 600 },
  { name: 'Fez',         x: 50, y: 35, emoji: '🕌', xpRequired: 1200 },
  { name: 'Casablanca',  x: 22, y: 48, emoji: '🏙️', xpRequired: 2000 },
  { name: 'Marrakech',   x: 35, y: 68, emoji: '🌴', xpRequired: 3000 },
]

const pathPoints = cities.map(c => `${c.x},${c.y}`).join(' ')

export default function MoroccoMap({ currentCity, unlockedCities }: MoroccoMapProps) {
  const allUnlocked = new Set([...unlockedCities, cities[0].name])

  return (
    <div className="bg-white rounded-3xl border border-brand-100 shadow-card overflow-hidden">
      <div className="bg-gradient-to-r from-brand-500 to-terracotta-500 px-4 py-3">
        <h3 className="text-white font-black text-base">🗺️ Marokko Avontuur</h3>
        <p className="text-brand-100 text-xs font-semibold">Ontgrendel nieuwe steden!</p>
      </div>

      <div className="relative bg-gradient-to-b from-sky-50 to-amber-50 p-2" style={{ height: 200 }}>
        {/* Morocco silhouette (simplified SVG) */}
        <svg viewBox="0 0 100 90" className="absolute inset-0 w-full h-full opacity-20">
          <path
            d="M15,10 Q18,8 22,8 L28,7 Q35,6 45,7 L58,8 Q68,9 75,12 L80,18 Q82,22 80,28 L78,35 Q76,42 74,48 L72,55 Q68,62 65,68 L60,74 Q52,80 45,82 L38,82 Q30,80 25,76 L20,70 Q15,62 13,55 L12,48 Q10,40 10,32 L10,22 Q11,15 15,10Z"
            fill="#C2410C"
          />
        </svg>

        {/* Path between cities */}
        <svg viewBox="0 0 100 90" className="absolute inset-0 w-full h-full">
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#FCD34D"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.6"
          />
        </svg>

        {/* Cities */}
        {cities.map((city, i) => {
          const isUnlocked = allUnlocked.has(city.name)
          const isCurrent = city.name === currentCity
          const isNext = !isUnlocked && cities[i - 1] && allUnlocked.has(cities[i - 1].name)

          return (
            <motion.div
              key={city.name}
              className="absolute flex flex-col items-center"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.15 }}
            >
              <motion.div
                animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-lg
                  border-2 shadow-md transition-all
                  ${isCurrent ? 'bg-brand-500 border-brand-700 shadow-brand-300' : ''}
                  ${isUnlocked && !isCurrent ? 'bg-emerald-400 border-emerald-600' : ''}
                  ${isNext ? 'bg-stone-200 border-stone-300 opacity-70' : ''}
                  ${!isUnlocked && !isNext ? 'bg-stone-100 border-stone-200 opacity-40' : ''}
                `}
              >
                {isUnlocked || isNext ? city.emoji : '🔒'}
              </motion.div>
              <span className={`text-xs font-bold mt-0.5 ${isUnlocked ? 'text-stone-700' : 'text-stone-400'}`}>
                {city.name}
              </span>
              {isCurrent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-xs bg-brand-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-black"
                >
                  ★
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="px-4 py-2 bg-brand-50 border-t border-brand-100">
        <p className="text-center text-xs font-bold text-brand-700">
          📍 Je bent nu in <span className="font-black">{currentCity}</span>
        </p>
      </div>
    </div>
  )
}
