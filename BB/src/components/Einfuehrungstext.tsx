import { useState, useEffect } from 'react'
import './Einfuehrungstext.css'
import praxisImage1 from '../assets/image copy 2.png'
import praxisImage2 from '../assets/image copy 3.png'
import praxisImage3 from '../assets/image copy 4.png'
import praxisImage4 from '../assets/image copy.png'

const PRAXIS_IMAGES = [praxisImage1, praxisImage2, praxisImage3, praxisImage4]

function Einfuehrungstext({ id }: { id?: string }) {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % PRAXIS_IMAGES.length)
        setIsTransitioning(false)
      }, 1200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight * 2

    const updateScale = () => {
      const scrollY = window.scrollY
      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0)
      } else {
        setIsSticky(false)
        const scrollProgress = Math.min(Math.max((scrollY - viewportHeight) / viewportHeight, 0), 1)
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
    <section id={id} className="einfuehrungstext-section">
      <div
        className="einfuehrungstext-wrapper"
        style={{
          position: isSticky ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: 'var(--color-coral, #7dd3c4)',
          padding: 'var(--spacing-xl, 4rem) 0',
          transform: isSticky ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isSticky ? 'auto' : 'transform',
          zIndex: 110,
        }}
      >
      <div className="einfuehrungstext-text">
        <h2 className="einfuehrungstext-title">Praxis</h2>
        <div className="einfuehrungstext-images">
          {PRAXIS_IMAGES.map((src, i) => {
            const nextIndex = (imageIndex + 1) % PRAXIS_IMAGES.length
            const isActive = i === imageIndex && !isTransitioning
            const isEntering = isTransitioning && i === nextIndex
            const isExiting = isTransitioning && i === imageIndex
            const show = isActive || isEntering || isExiting
            return (
              <img
                key={i}
                src={src}
                alt="Praxis"
                className={`einfuehrungstext-image ${show ? 'visible' : ''} ${isEntering ? 'entering' : ''} ${isExiting ? 'exiting' : ''}`}
              />
            )
          })}
        </div>
        <p>In meiner Praxis begleite ich dich mit Hypnose und Gesprächstherapie zu mehr Ruhe, Klarheit und Lebensfreude.</p>
        <p>In einem geschützten Raum bist du willkommen, so wie du bist.</p>
        <p>Yoga und Meditation können die therapeutische Arbeit auf Wunsch ergänzen.</p>
      </div>
      </div>
    </section>
  )
}

export default Einfuehrungstext
