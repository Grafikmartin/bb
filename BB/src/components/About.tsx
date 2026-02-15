import { useState, useEffect, useRef } from 'react'
import './About.css'
import aboutImage from '../assets/image.png'

function About() {
  const [visibleParagraphs, setVisibleParagraphs] = useState<boolean[]>([false, false, false, false, false])
  const [showMore, setShowMore] = useState(false)
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const aboutSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = paragraphRefs.current.indexOf(entry.target as HTMLParagraphElement)
          if (index !== -1) {
            setVisibleParagraphs(prev => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        }
      })
    }, observerOptions)

    paragraphRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref)
      }
    })

    return () => {
      paragraphRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref)
        }
      })
    }
  }, [showMore])

  useEffect(() => {
    if (showMore) {
      setTimeout(() => {
        setVisibleParagraphs(prev => {
          const newState = [...prev]
          newState[2] = true
          newState[3] = true
          newState[4] = true
          return newState
        })
      }, 100)
    }
  }, [showMore])

  // Scale-Animation beim Scrollen
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight * 4

    const updateScale = () => {
      const scrollY = window.scrollY
      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0)
      } else {
        setIsSticky(false)
        const scrollProgress = Math.min(Math.max((scrollY - viewportHeight * 3) / viewportHeight, 0), 1)
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
    <section ref={aboutSectionRef} className="about-section">
      <div
        className="about-spacer"
        style={{ minHeight: showMore ? '280vh' : '100vh' }}
        aria-hidden="true"
      />
      <div
        className="about-wrapper"
        style={{
          position: isSticky ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: 'var(--color-coral, #7dd3c4)',
          padding: 'var(--spacing-xl, 4rem) 0',
          transform: isSticky ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isSticky ? 'auto' : 'transform',
          zIndex: 350,
        }}
      >
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          paddingBottom: showMore ? 'var(--spacing-xl, 4rem)' : 0,
        }}
      >
      <img 
        src={aboutImage} 
        alt="Benjamin Borth" 
        className="about-image"
      />
      <div className="about-text">
        <h2 className="about-title">über mich</h2>
        <p 
          ref={(el) => { paragraphRefs.current[0] = el }}
          className={visibleParagraphs[0] ? 'visible' : ''}
        >
          Benjamin Borth – seit über sieben Jahren begleite ich als Heilpraktiker für Psychotherapie und Yogatrainer Menschen zu mehr Ruhe, Klarheit und Lebensfreude.
        </p>
        <p 
          ref={(el) => { paragraphRefs.current[1] = el }}
          className={visibleParagraphs[1] ? 'visible' : ''}
        >
          Mit eigener Familie weiß ich, wie anspruchsvoll der Alltag sein kann.
        </p>
        {!showMore && (
          <button 
            className="more-button"
            onClick={() => setShowMore(true)}
          >
            mehr
          </button>
        )}
        {showMore && (
          <>
            <p 
              ref={(el) => { paragraphRefs.current[2] = el }}
              className={visibleParagraphs[2] ? 'visible' : ''}
            >
              Ich verbinde Hypnosetherapie und Gesprächstherapie mit Yoga und Yogatherapie.
            </p>
            <p 
              ref={(el) => { paragraphRefs.current[3] = el }}
              className={visibleParagraphs[3] ? 'visible' : ''}
            >
              Hypnose und Gesprächstherapie lösen Blockaden und eröffnen neue Perspektiven, Yogatherapie vertieft die Prozesse durch körperlich-geistigen Ausgleich.
            </p>
            <p 
              ref={(el) => { paragraphRefs.current[4] = el }}
              className={visibleParagraphs[4] ? 'visible' : ''}
            >
              Mein Ziel: ein geschützter Raum, in dem Veränderung möglich wird und Sie neue Wege entwickeln können.
            </p>
          </>
        )}
      </div>
      </div>
      </div>
    </section>
  )
}

export default About
