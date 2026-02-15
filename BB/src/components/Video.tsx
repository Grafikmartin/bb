import { useState, useEffect } from 'react'
import './Video.css'
import videoSrc from '../assets/18420-292228405_small.mp4'

function Video() {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight

    const updateScale = () => {
      const scrollY = window.scrollY
      const visible = scrollY > 0
      setIsVisible(visible)
      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0)
      } else {
        setIsSticky(false)
        const scrollProgress = Math.min(scrollY / stickyPoint, 1)
        setScale(0.7 + scrollProgress * 0.3)
      }
    }

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      updateScale()
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        updateScale()
      }, 150)
    }

    updateScale()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

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
