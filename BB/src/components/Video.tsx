import { useState, useEffect } from 'react'
import './Video.css'
import videoSrc from '../assets/18420-292228405_small.mp4'

function Video() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight // Video wird sticky bei 100vh

    const updateScale = () => {
      const scrollY = window.scrollY
      
      // Prüfe ob Komponente sticky werden sollte (bei 100vh)
      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0) // Scale bleibt bei 1.0 wenn sticky
        
        // Verhindere weiteres Scrollen nach oben - halte Position fest
        if (window.scrollY > stickyPoint) {
          window.scrollTo({
            top: stickyPoint,
            behavior: 'auto'
          })
        }
      } else {
        setIsSticky(false)
        // Komponente scrollt noch - Scale-Animation läuft
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
      
      // Wenn sticky, verhindere weiteres Scrollen nach oben
      if (isSticky && window.scrollY > stickyPoint) {
        window.scrollTo({
          top: stickyPoint,
          behavior: 'auto'
        })
      }
      
      updateScale()
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        updateScale()
      }, 100)
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
        transform: isSticky ? 'none' : `scale(${scale})`,
        transformOrigin: 'top center',
        transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isSticky ? 'auto' : 'transform',
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
