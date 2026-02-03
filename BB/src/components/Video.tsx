import { useState, useEffect } from 'react'
import './Video.css'
import videoSrc from '../assets/18420-292228405_small.mp4'

function Video() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let lastScrollY = 0
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight // Video wird sticky bei 100vh

    // Initiale Prüfung beim Mount - Video ist immer versteckt am Anfang
    setIsVisible(false)

    const updateScale = () => {
      const scrollY = window.scrollY
      
      // Video wird sichtbar, sobald gescrollt wird (erscheint von unten)
      // Aber nur wenn wir noch nicht beim sticky-Punkt sind oder darüber
      if (scrollY > 0 && scrollY < stickyPoint) {
        setIsVisible(true)
      } else if (scrollY >= stickyPoint) {
        setIsVisible(true) // Bleibt sichtbar wenn sticky
      } else {
        setIsVisible(false) // Verschwindet wieder wenn zurück gescrollt wird
      }
      
      // Prüfe ob Komponente sticky werden sollte (bei 100vh)
      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0) // Scale bleibt bei 1.0 wenn sticky
      } else {
        setIsSticky(false)
        // Komponente scrollt noch - Scale-Animation läuft von 70% auf 100%
        const scrollProgress = Math.min(scrollY / stickyPoint, 1)
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
      
      lastScrollY = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: false })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isScrolling, isSticky])

  return (
    <section 
      className="video-section"
      style={{
        transform: isSticky 
          ? 'none' 
          : isVisible 
            ? `scale(${scale}) translateY(0)` 
            : `scale(${scale}) translateY(100vh)`,
        transformOrigin: 'top center',
        transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isSticky ? 'auto' : 'transform',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none',
        zIndex: isSticky ? 100 : 100, // Video bleibt bei z-index 100, Einführungstext (110) schiebt sich darüber
      }}
    >
      <div
        className="video-wrapper"
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="video-element"
        >
          Ihr Browser unterstützt das Video-Element nicht.
        </video>
      </div>
    </section>
  )
}

export default Video
