import { useState, useEffect, useRef } from 'react'
import './Logo.css'
import bbLogo from '../assets/bb.png'

function Logo() {
  const [visibleParagraphs, setVisibleParagraphs] = useState<boolean[]>([false, false, false])
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Startet Animation wenn 20% des Viewports erreicht
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
  }, [])

  return (
    <div className="logo-container">
      <img 
        src={bbLogo} 
        alt="BB Logo" 
        className="logo-image"
      />
      <div className="logo-text">
        <p 
          ref={(el) => { paragraphRefs.current[0] = el }}
          className={visibleParagraphs[0] ? 'visible' : ''}
        >
          In meiner Praxis begleite ich dich mit Hypnose und Gesprächstherapie zu mehr Ruhe, Klarheit und Lebensfreude.
        </p>
        <p 
          ref={(el) => { paragraphRefs.current[1] = el }}
          className={visibleParagraphs[1] ? 'visible' : ''}
        >
          In einem geschützten Raum bist du willkommen, so wie du bist.
        </p>
        <p 
          ref={(el) => { paragraphRefs.current[2] = el }}
          className={visibleParagraphs[2] ? 'visible' : ''}
        >
          Yoga und Meditation können die therapeutische Arbeit auf Wunsch ergänzen.
        </p>
      </div>
    </div>
  )
}

export default Logo
