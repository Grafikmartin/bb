import { useState, useEffect } from 'react'
import './Einfuehrungstext.css'

function Einfuehrungstext() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const updateScale = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Berechne Scroll-Progress ab Video (ab 100vh)
      // Stoppt bei 200vh, damit die Komponente sticky bleibt
      const scrollProgress = Math.min(Math.max((scrollY - viewportHeight) / viewportHeight, 0), 1)
      const newScale = 0.7 + (scrollProgress * 0.3)
      // Sobald scale = 1.0 erreicht ist, bleibt es bei 1.0
      setScale(Math.min(newScale, 1.0))
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
    <section className="einfuehrungstext-section">
      <div
        className="einfuehrungstext-text"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: isScrolling ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
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

export default Einfuehrungstext
