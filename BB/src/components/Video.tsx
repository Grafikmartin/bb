import { useState, useEffect } from 'react'
import './Video.css'
import videoSrc from '../assets/18420-292228405_small.mp4'

function Video() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const updateScale = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Berechne Scroll-Progress (0 = oben, 1 = nach 100vh gescrollt)
      // Scale von 0.7 (70%) auf 1.0 (100%) während des Scrollens
      const scrollProgress = Math.min(scrollY / viewportHeight, 1)
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
      className="video-section"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: isScrolling ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
    </section>
  )
}

export default Video
