import { useState, useRef, useEffect } from 'react'
import './HamburgerMenu.css'

const MENU_ITEMS = [
  { label: 'Die Praxis', id: 'praxis' },
  { label: 'Leistungen', id: 'leistungen' },
  { label: 'Über mich', id: 'ueber-mich' },
  { label: 'Kontakt', id: 'kontakt' },
  { label: 'Impressum', action: 'impressum' as const },
]

type HamburgerMenuProps = {
  onImpressumClick?: () => void
}

function HamburgerMenu({ onImpressumClick }: HamburgerMenuProps) {
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

  // Wenn Menü offen: scrollender Inhalt über Aufmacher, damit Video/Inhalt durch transparenten Menühintergrund sichtbar ist
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('hamburger-menu-open')
    } else {
      document.body.classList.remove('hamburger-menu-open')
    }
    return () => document.body.classList.remove('hamburger-menu-open')
  }, [isOpen])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <div className="hamburger-menu">
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
            {MENU_ITEMS.map((item, index) => (
              <button
                key={'id' in item ? item.id : `impressum-${index}`}
                className="hamburger-nav-item"
                onClick={() => {
                  if ('action' in item && item.action === 'impressum') {
                    onImpressumClick?.()
                    closeMenu()
                  } else if ('id' in item) {
                    scrollTo(item.id)
                  }
                }}
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
