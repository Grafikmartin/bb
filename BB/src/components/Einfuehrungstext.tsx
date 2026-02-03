import { useState, useEffect, useRef } from 'react'
import './Einfuehrungstext.css'

function Einfuehrungstext() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const updateScale = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Berechne Scroll-Progress (0 = oben, 1 = nach 100vh gescrollt)
      const scrollProgress = Math.min(scrollY / viewportHeight, 1)
      
      // Scale von 0.7 (70%) auf 1.0 (100%) während des Scrollens
      const newScale = 0.7 + (scrollProgress * 0.3)
      setScale(newScale)
    }

    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true)
      }
      
      // Clear existing timeout
      clearTimeout(scrollTimeout)
      
      // Update scale immediately during scroll
      updateScale()
      
      // Set timeout to detect when scrolling stops
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        // Final update after scrolling stops
        updateScale()
      }, 100) // Kurze Verzögerung für sanftes Auslaufen
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isScrolling])

  return (
    <section 
      className="einfuehrungstext-section"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: isScrolling ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
