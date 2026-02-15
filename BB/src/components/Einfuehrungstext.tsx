import { useState, useEffect } from 'react'
import './Einfuehrungstext.css'

function Einfuehrungstext({ id }: { id?: string }) {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

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
        <p>In meiner Praxis begleite ich dich mit Hypnose und Gesprächstherapie zu mehr Ruhe, Klarheit und Lebensfreude.</p>
        <p>In einem geschützten Raum bist du willkommen, so wie du bist.</p>
        <p>Yoga und Meditation können die therapeutische Arbeit auf Wunsch ergänzen.</p>
      </div>
      </div>
    </section>
  )
}

export default Einfuehrungstext
