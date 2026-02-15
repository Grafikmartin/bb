import { useState, useRef, useEffect } from 'react'
import './HamburgerMenu.css'

const MENU_ITEMS = [
  { label: 'Praxis', id: 'praxis' },
  { label: 'Leistungen', id: 'leistungen' },
  { label: 'Über mich', id: 'ueber-mich' },
  { label: 'Kontakt', id: 'kontakt' },
]

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const closeMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      closeTimeoutRef.current = undefined
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <div className="hamburger-menu" style={{ left: '10vw', top: '3vh' }}>
      <button
        className="hamburger-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menü öffnen"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
      {isOpen && (
        <>
          <div
            className="hamburger-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <nav
            className={`hamburger-nav ${isClosing ? 'closing' : ''}`}
            onMouseLeave={closeMenu}
          >
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                className="hamburger-nav-item"
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}

export default HamburgerMenu
