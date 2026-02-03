import { useState, useEffect } from 'react'
import './Praxis.css'

function Praxis() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const updateScale = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Prüfe ob Komponente sticky werden sollte (bei 400vh)
      if (scrollY >= viewportHeight * 4) {
        setIsSticky(true)
        setScale(1.0) // Scale bleibt bei 1.0 wenn sticky
      } else {
        setIsSticky(false)
        // Komponente scrollt noch - Scale-Animation läuft
        const scrollProgress = Math.min(Math.max((scrollY - viewportHeight * 3) / viewportHeight, 0), 1)
        const newScale = 0.7 + (scrollProgress * 0.3)
        setScale(newScale)
      }
    }

    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true)
      }
      
      clearTimeout(scrollTimeout)
      updateScale()
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        updateScale()
      }, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isScrolling])

  return (
    <section 
      className="praxis-section"
      style={{
        // Entferne Transform wenn sticky, damit sticky-Positionierung funktioniert
        transform: isSticky ? 'none' : `scale(${scale})`,
        transformOrigin: 'top center',
        transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="praxis-text"
      >
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

export default Praxis
