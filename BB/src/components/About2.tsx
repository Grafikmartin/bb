import { useState, useEffect, useRef } from 'react'
import './About2.css'
import aboutImage from '../assets/image.png'

function About2() {
  const [visibleParagraphs, setVisibleParagraphs] = useState<boolean[]>([false, false, false, false, false, false])
  const [showMore, setShowMore] = useState(false)
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

  return (
    <section 
      ref={aboutSectionRef}
      className="about2-section"
    >
      <img 
        src={aboutImage} 
        alt="Benjamin Borth" 
        className="about2-image"
      />
      <div className="about2-text">
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

export default About2
