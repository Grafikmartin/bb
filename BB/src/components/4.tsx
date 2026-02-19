import { useState, useEffect, useRef } from 'react'
import './4.css'
import SectionDots from './SectionDots'

function Four({ id }: { id?: string }) {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const aboutSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    aboutSectionRef.current = document.getElementById('ueber-mich')
  }, [])

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight

    const updateScale = () => {
      const scrollY = window.scrollY
      const aboutSection = aboutSectionRef.current
      const aboutBottom = aboutSection ? aboutSection.offsetTop + aboutSection.offsetHeight : viewportHeight * 5
      const stickyPoint = aboutBottom
      const scaleStart = aboutBottom - viewportHeight

      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0)
      } else {
        setIsSticky(false)
        const scrollProgress = Math.min(Math.max((scrollY - scaleStart) / viewportHeight, 0), 1)
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
    <section id={id} className="kontakt-section">
      <SectionDots />
      <div
        className="kontakt-wrapper"
        style={{
          position: isSticky ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: '#ffffff',
          padding: 'var(--spacing-xl, 4rem) 0',
          transform: isSticky ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isSticky ? 'auto' : 'transform',
          zIndex: 370,
        }}
      >
        <div className="kontakt-content kontakt-content-scrollable">
          <div className="kontakt-text">
            <h2 className="kontakt-title">Kontakt</h2>
            <p className="kontakt-address">
              Praxis Benjamin Borth<br />
              Tel.: <a href="tel:+4940555023456" className="kontakt-link">040 / 555 023 456</a><br />
              E-Mail: <a href="mailto:kontakt@benjaminborth.de" className="kontakt-link">kontakt@benjaminborth.de</a><br />
              Schöne Aussicht 1<br />20459 Hamburg
            </p>
          </div>
          <div className="kontakt-map-container">
            <iframe
              title="Karte Schöne Aussicht 1, Hamburg"
              className="kontakt-map"
              src="https://www.google.com/maps?q=Sch%C3%B6ne+Aussicht+1,+20459+Hamburg&z=15&output=embed&t=k"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir//Sch%C3%B6ne+Aussicht+1,+20459+Hamburg"
            target="_blank"
            rel="noopener noreferrer"
            className="kontakt-anfahrt-btn"
          >
            Anfahrt
          </a>
        </div>
      </div>
    </section>
  )
}

export default Four
