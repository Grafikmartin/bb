import { useState, useEffect } from 'react'
import './Einfuehrungstext.css'

function Einfuehrungstext() {
  const [scale, setScale] = useState(0.7)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Berechne Scroll-Progress (0 = oben, 1 = nach 100vh gescrollt)
      const scrollProgress = Math.min(scrollY / viewportHeight, 1)
      
      // Scale von 0.7 (70%) auf 1.0 (100%) während des Scrollens
      const newScale = 0.7 + (scrollProgress * 0.3)
      setScale(newScale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section 
      className="einfuehrungstext-section"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="einfuehrungstext-text">
        <p>
          In meiner Praxis begleite ich dich mit Hypnose und Gesprächstherapie zu mehr Ruhe, Klarheit und Lebensfreude.
        </p>
        <p>
          In einem geschützten Raum bist du willkommen, so wie du bist.
        </p>
        <p>
          Yoga und Meditation können die therapeutische Arbeit auf Wunsch ergänzen.
        </p>
      </div>
    </section>
  )
}

export default Einfuehrungstext
