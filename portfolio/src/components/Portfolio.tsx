import { useRef, useEffect } from 'react'
import './Portfolio.css'
import minigamesImage from '../assets/Minigames.webp'
import zasterZenImage from '../assets/ZasterZen-uebersicht-karte.png'

function Portfolio() {
  const cards = Array.from({ length: 10 }, (_, i) => i + 1)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return
      
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const containerWidth = rect.width
      const scrollWidth = container.scrollWidth
      const maxScroll = Math.max(0, scrollWidth - containerWidth)
      
      if (maxScroll === 0) return
      
      // Berechne Scroll-Position basierend auf Mausposition
      const scrollRatio = Math.max(0, Math.min(1, mouseX / containerWidth))
      const targetScroll = scrollRatio * maxScroll
      
      // Berechne dynamische Geschwindigkeit basierend auf Mausposition
      // Am Rand schneller, in der Mitte langsamer
      const normalizedX = mouseX / containerWidth // 0 bis 1
      const distanceFromCenter = Math.abs(normalizedX - 0.5) * 2 // 0 (Mitte) bis 1 (Rand)
      const speed = 0.5 + (distanceFromCenter * 0.7) // 0.5 (Mitte) bis 1.2 (Rand)
      
      // Sanftes Scrollen mit requestAnimationFrame
      const animate = () => {
        if (!container) return
        const currentScroll = container.scrollLeft
        const diff = targetScroll - currentScroll
        
        if (Math.abs(diff) < 0.5) {
          container.scrollLeft = targetScroll
          return
        }
        
        container.scrollLeft += diff * speed
        animationFrameId = requestAnimationFrame(animate)
      }
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section className="portfolio-section">
      <div ref={containerRef} className="portfolio-container">
        <div className="portfolio-grid">
          {cards.map((cardNumber, index) => {
            const isCard3 = index === 2
            const isCard4 = index === 3
            const isCard5 = index === 4
            const cardInfo = cardData[index]
            
            return (
              <div 
                key={cardNumber} 
                className={`card ${index === 0 ? 'first-card' : ''} ${index === cards.length - 1 ? 'last-card' : ''}`}
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
