import './SectionDots.css'

const COLS = 20
const ROWS = 9
const TOTAL = COLS * ROWS

function SectionDots() {
  return (
    <div className="section-dots" aria-hidden="true">
      {Array.from({ length: TOTAL }, (_, i) => (
        <div key={i} className="section-dot" />
      ))}
    </div>
  )
}

export default SectionDots
