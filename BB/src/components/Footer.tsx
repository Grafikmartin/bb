import { useState, useEffect } from 'react'
import './Footer.css'

function Footer() {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight * 6

    const update = () => {
      setIsSticky(window.scrollY >= stickyPoint)
    }

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      update()
      scrollTimeout = setTimeout(update, 150)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <footer className="footer-section">
      <div
        className="footer"
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? 0 : undefined,
          left: isSticky ? 0 : undefined,
          width: isSticky ? '100%' : undefined,
          zIndex: isSticky ? 380 : 2001,
        }}
      >
        <p className="footer-text">© Martin Borth</p>
      </div>
    </footer>
  )
}

export default Footer
