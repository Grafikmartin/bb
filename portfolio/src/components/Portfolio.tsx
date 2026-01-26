import { useRef, useEffect } from 'react'
import './Portfolio.css'
import minigamesImage from '../assets/Minigames.webp'
import zasterZenImage from '../assets/ZasterZen-uebersicht-karte.png'

function Portfolio() {
  const cards = Array.from({ length: 10 }, (_, i) => i + 1)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef(false)
  const isUserScrollingRef = useRef(false)
  const mouseOverContainerRef = useRef(false)
  
  // Wetter-Bild für Card 3
  const wetterImage = '/design/wetter/wetter.webp.png'
  
  // Mini Games Bild für Card 4
  const minigamesImageSrc = minigamesImage
  
  // ZasterZen Bild für Card 5
  const zasterZenImageSrc = zasterZenImage

  // Card-Daten mit Titel und Beschreibung
  const cardData = [
    { title: 'Card 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { title: 'Card 2', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { title: 'Wetter', description: 'Eine Wetter-App mit aktuellen Wetterdaten und Vorhersagen für verschiedene Standorte.' },
    { title: 'Mini Games', description: 'Eine Sammlung von Mini-Spielen wie Snake und Vier gewinnt für kurzweilige Unterhaltung.' },
    { title: 'Card 5', description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
    { title: 'Card 6', description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { title: 'Card 7', description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' },
    { title: 'Card 8', description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.' },
    { title: 'Card 9', description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.' },
    { title: 'Card 10', description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.' },
  ]

  // Echte Endlosschleife: Cards einfach mehrfach wiederholen
  // Links: Card 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 (rückwärts) - mehrmals
  // Mitte: Card 1-10 (normal) - mehrmals  
  // Rechts: Card 1-10 (vorwärts) - mehrmals
  const reversedCards = [...cards].reverse() // 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
  const repetitions = 5 // Anzahl Wiederholungen für endloses Scrollen
  const infiniteCards = [
    ...Array(repetitions).fill(reversedCards).flat(),  // Links: rückwärts mehrmals
    ...Array(repetitions).fill(cards).flat(),         // Mitte: normal mehrmals
    ...Array(repetitions).fill(cards).flat()          // Rechts: vorwärts mehrmals
  ]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number | null = null

    const getCardDimensions = () => {
      const firstCard = container?.querySelector('.card') as HTMLElement
      const secondCard = container?.querySelectorAll('.card')[1] as HTMLElement
      
      if (!firstCard) return { width: 200, gap: 32 }
      
      const cardRect = firstCard.getBoundingClientRect()
      const cardWidth = cardRect.width
      
      // Berechne Gap aus dem Abstand zwischen zwei Cards
      let gap = 32 // Fallback
      if (secondCard) {
        const secondCardRect = secondCard.getBoundingClientRect()
        gap = secondCardRect.left - (cardRect.left + cardWidth)
      } else {
        // Fallback: Versuche CSS-Variable zu lesen
        const spacingMd = getComputedStyle(document.documentElement).getPropertyValue('--spacing-md')
        if (spacingMd) {
          gap = parseFloat(spacingMd) * 16 // rem zu px (wenn rem verwendet wird)
        }
      }
      
      return { width: cardWidth, gap: Math.max(0, gap) }
    }

    // Initialisiere Scroll-Position auf den ersten Card 1 in der Mitte
    const initializeScroll = () => {
      const { width, gap } = getCardDimensions()
      const singleCardWidth = width + gap
      const leftCopiesWidth = singleCardWidth * 10 * repetitions // Alle rückwärts Cards
      const middleSetStart = leftCopiesWidth // Start der normalen Card 1-10
      
      if (container) {
        container.scrollLeft = middleSetStart
      }
    }

    // Setze initiale Position auf den ersten Card 1 in der Mitte
    setTimeout(initializeScroll, 100)

    const handleScroll = () => {
      if (!container || isScrollingRef.current) return

      // Markiere, dass der Benutzer gerade scrollt (Touch/Trackpad)
      isUserScrollingRef.current = true
      clearTimeout(scrollIntervalRef.current as NodeJS.Timeout)
      scrollIntervalRef.current = setTimeout(() => {
        isUserScrollingRef.current = false
      }, 150)

      const { width, gap } = getCardDimensions()
      const singleCardWidth = width + gap
      const sequenceWidth = singleCardWidth * 10 // Breite einer Sequenz (10 Cards)
      const leftCopiesWidth = sequenceWidth * repetitions // Alle rückwärts Cards
      const middleSetStart = leftCopiesWidth // Start der normalen Card 1-10
      const middleSetWidth = sequenceWidth * repetitions // Alle normalen Cards
      const middleSetEnd = middleSetStart + middleSetWidth
      const rightCopiesStart = middleSetEnd // Start der vorwärts Cards
      const rightCopiesEnd = rightCopiesStart + (sequenceWidth * repetitions)
      const scrollLeft = container.scrollLeft
      const threshold = singleCardWidth * 0.1 // Kleiner Schwellenwert

      // Nahtloser Übergang nach rechts: Wenn wir am Ende der letzten Wiederholung sind,
      // springe zum Anfang der ersten Wiederholung (visuell identisch)
      if (scrollLeft >= rightCopiesEnd - threshold) {
        isScrollingRef.current = true
        const offset = (scrollLeft - rightCopiesEnd) % sequenceWidth
        container.scrollLeft = rightCopiesStart + offset
        setTimeout(() => {
          isScrollingRef.current = false
        }, 10)
      }
      // Nahtloser Übergang nach links: Wenn wir am Anfang vor den rückwärts Cards sind,
      // springe zum Ende der letzten rückwärts Wiederholung (visuell identisch)
      else if (scrollLeft <= threshold) {
        isScrollingRef.current = true
        const offset = scrollLeft % sequenceWidth
        container.scrollLeft = leftCopiesWidth - sequenceWidth + offset
        setTimeout(() => {
          isScrollingRef.current = false
        }, 10)
      }
    }

    const handleMouseEnter = () => {
      mouseOverContainerRef.current = true
    }

    const handleMouseLeave = () => {
      mouseOverContainerRef.current = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Nur Hover-Scrolling, wenn Maus über Container ist und Benutzer nicht manuell scrollt
      if (!container || isScrollingRef.current || !mouseOverContainerRef.current || isUserScrollingRef.current) return
      
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const containerWidth = rect.width
      const scrollWidth = container.scrollWidth
      const maxScroll = Math.max(0, scrollWidth - containerWidth)
      
      if (maxScroll === 0) return
      
      // Berechne Scroll-Position basierend auf Mausposition
      const scrollRatio = Math.max(0, Math.min(1, mouseX / containerWidth))
      const targetScroll = scrollRatio * maxScroll
      
      // Berechne dynamische Geschwindigkeit basierend auf Mausposition - sanfter und geschmeidiger
      const normalizedX = mouseX / containerWidth
      const distanceFromCenter = Math.abs(normalizedX - 0.5) * 2
      // Reduzierte Geschwindigkeit: langsamer am Rand, sanfter Übergang
      const speed = 0.3 + (distanceFromCenter * 0.3) // 0.3 (Mitte) bis 0.6 (Rand) - viel sanfter
      
      // Sanftes Scrollen mit requestAnimationFrame - geschmeidiger und sanfter
      const animate = () => {
        if (!container || isScrollingRef.current || !mouseOverContainerRef.current || isUserScrollingRef.current) return
        const currentScroll = container.scrollLeft
        const diff = targetScroll - currentScroll
        
        if (Math.abs(diff) < 0.1) {
          container.scrollLeft = targetScroll
          return
        }
        
        // Sanftere Interpolation mit easing
        const easing = 0.1 + (speed * 0.05) // 0.1-0.15 für sanftere Bewegung
        container.scrollLeft += diff * easing
        animationFrameId = requestAnimationFrame(animate)
      }
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    // Touch-Events für Handy-Wischen
    const handleTouchStart = () => {
      isUserScrollingRef.current = true
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        isUserScrollingRef.current = false
      }, 150)
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (scrollIntervalRef.current) {
        clearTimeout(scrollIntervalRef.current)
      }
    }
  }, [])

  const getCardContent = (cardIndex: number, position: 'left' | 'middle' | 'right') => {
    let originalIndex: number
    
    if (position === 'left') {
      // Links: Card 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 (rückwärts)
      originalIndex = 9 - cardIndex // 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
    } else if (position === 'middle') {
      // Mitte: Card 1-10 (normal, Index 0-9)
      originalIndex = cardIndex
    } else {
      // Rechts: Card 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (vorwärts)
      originalIndex = cardIndex // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    }
    
    const isCard3 = originalIndex === 2
    const isCard4 = originalIndex === 3
    const isCard5 = originalIndex === 4
    const cardInfo = cardData[originalIndex]
    
    return {
      isCard3,
      isCard4,
      isCard5,
      cardInfo
    }
  }

  return (
    <section className="portfolio-section">
      <div ref={containerRef} className="portfolio-container">
        <div className="portfolio-grid">
          {infiniteCards.map((cardNumber, index) => {
            // Bestimme Position basierend auf Index
            let position: 'left' | 'middle' | 'right'
            let cardIndex: number
            
            const leftCardsCount = 10 * repetitions
            const middleCardsCount = 10 * repetitions
            
            if (index < leftCardsCount) {
              // Links: Card 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 (rückwärts) - mehrmals
              position = 'left'
              cardIndex = index % 10 // Modulo für Wiederholung
            } else if (index < leftCardsCount + middleCardsCount) {
              // Mitte: Card 1-10 (normal) - mehrmals
              position = 'middle'
              cardIndex = (index - leftCardsCount) % 10
            } else {
              // Rechts: Card 1-10 (vorwärts) - mehrmals
              position = 'right'
              cardIndex = (index - leftCardsCount - middleCardsCount) % 10
            }
            
            const { isCard3, isCard4, isCard5, cardInfo } = getCardContent(cardIndex, position)
            
            return (
              <div 
                key={`${cardNumber}-${index}`} 
                className="card"
              >
                {isCard3 ? (
                  <img 
                    src={wetterImage} 
                    alt="Wetter"
                    className="card-icon card-icon-full"
                  />
                ) : isCard4 ? (
                  <img 
                    src={minigamesImageSrc} 
                    alt="Mini Games"
                    className="card-icon card-icon-full"
                  />
                ) : isCard5 ? (
                  <img 
                    src={zasterZenImageSrc} 
                    alt="ZasterZen"
                    className="card-icon card-icon-full"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                  </svg>
                )}
                <div className="card__content">
                  <p className="card__title">{cardInfo.title}</p>
                  <p className="card__description">{cardInfo.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
