import { useState, useEffect } from 'react'
import './Leistungen.css'

function Leistungen() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const updateScale = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Berechne Scroll-Progress ab Einführungstext (ab 100vh)
      // Scale von 0.7 (70%) auf 1.0 (100%) während des Scrollens
      const scrollProgress = Math.min(Math.max((scrollY - viewportHeight) / viewportHeight, 0), 1)
      const newScale = 0.7 + (scrollProgress * 0.3)
      setScale(newScale)
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
      className="leistungen-section"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: isScrolling ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="leistungen-text">
        <h2>Hypnosetherapie</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <h2>Gesprächstherapie</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        
        <h2>Yoga und Meditation</h2>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    </section>
  )
}

export default Leistungen
