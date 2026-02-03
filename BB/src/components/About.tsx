import { useState, useEffect, useRef } from 'react'
import './About.css'
import aboutImage from '../assets/image.png'

function About() {
  const [visibleParagraphs, setVisibleParagraphs] = useState<boolean[]>([false, false, false, false, false, false])
  const [showMore, setShowMore] = useState(false)
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
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
          newState[5] = true
          return newState
        })
      }, 100)
    }
  }, [showMore])

  // Scale-Animation beim Scrollen (wie Einführungstext)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const updateScale = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Berechne Scroll-Progress ab Leistungen (ab 200vh)
      // Scale von 0.7 (70%) auf 1.0 (100%) während des Scrollens
      const scrollProgress = Math.min(Math.max((scrollY - viewportHeight * 2) / viewportHeight, 0), 1)
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
      ref={aboutSectionRef}
      className="about-section"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: isScrolling ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <img 
        src={aboutImage} 
        alt="Benjamin Borth" 
        className="about-image"
      />
      <div className="about-text">
        <p 
          ref={(el) => { paragraphRefs.current[0] = el }}
          className={visibleParagraphs[0] ? 'visible' : ''}
        >
          Mein Name ist Benjamin Borth. Seit über sieben Jahren begleite ich als Heilpraktiker für Psychotherapie und Yogatrainer Menschen dabei, mehr innere Ruhe, Klarheit und Lebensfreude zu finden.
        </p>
        <p 
          ref={(el) => { paragraphRefs.current[1] = el }}
          className={visibleParagraphs[1] ? 'visible' : ''}
        >
          Mit 44 Jahren Lebenserfahrung und eigener Familie weiß ich, wie anspruchsvoll und herausfordernd der Alltag manchmal sein kann.
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
              In meiner Praxis verbinde ich Hypnosetherapie und Gesprächstherapie mit meiner Erfahrung aus dem Yoga und der Yogatherapie
            </p>
            <p 
              ref={(el) => { paragraphRefs.current[3] = el }}
              className={visibleParagraphs[3] ? 'visible' : ''}
            >
              Hypnose und Gesprächstherapie unterstützen dabei, innere Blockaden zu lösen und neue Perspektiven zu entwickeln, während die Yogatherapie einen körperlich-geistigen Ausgleich ermöglicht, der die Prozesse nachhaltig vertieft.
            </p>
            <p 
              ref={(el) => { paragraphRefs.current[4] = el }}
              className={visibleParagraphs[4] ? 'visible' : ''}
            >
              So entsteht ein ganzheitlicher Ansatz, der Körper und Geist gleichermaßen stärkt.
            </p>
            <p 
              ref={(el) => { paragraphRefs.current[5] = el }}
              className={visibleParagraphs[5] ? 'visible' : ''}
            >
              Mein Ziel ist es, Ihnen einen geschützten Raum zu geben, in dem Veränderung möglich wird und Sie Schritt für Schritt neue Wege für sich entwickeln können.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default About
