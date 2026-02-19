import { useState, useEffect } from 'react'
import './SectionDots.css'

const COLS = 20
const ROWS = 9
const TOTAL_CIRCLES = COLS * ROWS

const CIRCLES_WIDTH_VW = 34
const DIAMETER_VW = CIRCLES_WIDTH_VW / (COLS + 0.1 * (COLS - 1))
const GAP_VW = DIAMETER_VW * 0.1

/** Wie Aufmacher: Farbpalette für die Kreise mit Transparenz */
const getCircleMintColors = (): string[] => [
  'rgba(77, 195, 181, 1)',
  'rgba(125, 211, 196, 0.9)',
  'rgba(160, 223, 209, 0.8)',
  'rgba(197, 235, 226, 0.7)',
  'rgba(216, 242, 235, 0.6)',
  'rgba(235, 248, 244, 0.5)',
]

function isLightColorArea(index: number): boolean {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const relCol = col + 1
  const relRow = row
  if (relRow === 0 && relCol >= 1 && relCol <= 7) return true
  if (relRow === 1 && relCol >= 1 && relCol <= 5) return true
  if (relRow === 2 && relCol >= 1 && relCol <= 5) return true
  if (relRow === 0 && relCol === 20) return true
  if (relCol === 20 && relRow >= 3 && relRow <= 8) return true
  if (relCol === 19 && relRow >= 7 && relRow <= 8) return true
  if (relCol === 18 && relRow >= 7 && relRow <= 8) return true
  if (relCol === 17 && relRow === 8) return true
  if (relCol === 1 && relRow >= 3 && relRow <= 5) return true
  if (relCol === 2 && relRow === 4) return true
  if (relCol === 3 && relRow === 4) return true
  if (relRow === 0 && relCol >= 9 && relCol <= 13) return true
  return false
}

function isOuterRowArea(index: number): boolean {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const relCol = col + 1
  const relRow = row
  if (relRow === 0 || relRow === 1 || relRow === 7 || relRow === 8) return true
  if (relCol === 1 || relCol === 2 || relCol === 19 || relCol === 20) return true
  return false
}

function isOutermostArea(index: number): boolean {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const relCol = col + 1
  const relRow = row
  if (relRow === 0 || relRow === 8) return true
  if (relCol === 1 || relCol === 20) return true
  return false
}

function getInitialColors(): string[] {
  const circleColors = getCircleMintColors()
  const lightestColors = [circleColors[4], circleColors[5]]
  const outerColors = circleColors.slice(1)
  const allColorsWithWhite = [...circleColors, 'transparent']

  return Array.from({ length: TOTAL_CIRCLES }, (_, index) => {
    if (isLightColorArea(index)) {
      return lightestColors[Math.floor(Math.random() * lightestColors.length)]
    }
    if (isOutermostArea(index)) {
      return Math.random() < 0.85 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)]
    }
    if (isOuterRowArea(index)) {
      return Math.random() < 0.6 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)]
    }
    return allColorsWithWhite[Math.floor(Math.random() * allColorsWithWhite.length)]
  })
}

function SectionDots() {
  const [circleColors, setCircleColors] = useState(getInitialColors)

  useEffect(() => {
    const changeColor = (index: number) => {
      setCircleColors(prev => {
        const newColors = [...prev]
        const circleColors = getCircleMintColors()
        const lightestColors = [circleColors[4], circleColors[5]]
        const outerColors = circleColors.slice(1)
        const withWhite = [...circleColors, 'transparent']

        if (isLightColorArea(index)) {
          newColors[index] = Math.random() < 0.2 ? 'transparent' : lightestColors[Math.floor(Math.random() * lightestColors.length)]
          return newColors
        }
        if (isOutermostArea(index)) {
          newColors[index] = Math.random() < 0.85 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)]
          return newColors
        }
        if (isOuterRowArea(index)) {
          newColors[index] = Math.random() < 0.6 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)]
          return newColors
        }
        newColors[index] = Math.random() < 0.3 ? 'transparent' : withWhite[Math.floor(Math.random() * withWhite.length)]
        return newColors
      })
    }

    const timeouts: ReturnType<typeof setTimeout>[] = []
    const intervals: ReturnType<typeof setInterval>[] = []

    for (let index = 0; index < TOTAL_CIRCLES; index++) {
      const baseInterval = 1500 + Math.random() * 2500
      const initialDelay = Math.random() * 2000
      const first = setTimeout(() => {
        changeColor(index)
        intervals.push(setInterval(() => changeColor(index), baseInterval))
      }, initialDelay + index * 30)
      timeouts.push(first)
    }

    return () => {
      timeouts.forEach(t => clearTimeout(t))
      intervals.forEach(i => clearInterval(i))
    }
  }, [])

  return (
    <div
      className="section-dots"
      aria-hidden="true"
      style={{
        width: `${CIRCLES_WIDTH_VW}vw`,
        height: `calc(${ROWS} * ${DIAMETER_VW}vw + ${ROWS - 1} * ${GAP_VW}vw)`,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${DIAMETER_VW}vw)`,
        gridTemplateRows: `repeat(${ROWS}, ${DIAMETER_VW}vw)`,
        gap: `${GAP_VW}vw`,
      }}
    >
      {Array.from({ length: TOTAL_CIRCLES }, (_, index) => (
        <div
          key={index}
          className="section-dot"
          style={{
            width: `${DIAMETER_VW}vw`,
            height: `${DIAMETER_VW}vw`,
            borderRadius: '50%',
            backgroundColor: circleColors[index] || getCircleMintColors()[0],
            transition: 'background-color 1s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}

export default SectionDots
