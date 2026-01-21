import { useRef, useEffect } from 'react'
import './Portfolio.css'

function Portfolio() {
  const cards = Array.from({ length: 10 }, (_, i) => i + 1)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
      
      // Sanftes Scrollen mit requestAnimationFrame
      const animate = () => {
        if (!container) return
        const currentScroll = container.scrollLeft
        const diff = targetScroll - currentScroll
        
        if (Math.abs(diff) < 0.5) {
          container.scrollLeft = targetScroll
          return
        }
        
        container.scrollLeft += diff * 0.15
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
          {cards.map((cardNumber, index) => (
            <div 
              key={cardNumber} 
              className={`card ${index === 0 ? 'first-card' : ''} ${index === cards.length - 1 ? 'last-card' : ''}`}
            >
              HOVER
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
