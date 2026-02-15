import { useState, useEffect } from 'react'
import './App.css'
import Aufmacher from './components/Aufmacher'
import HamburgerMenu from './components/HamburgerMenu'
import Video from './components/Video'
import Einfuehrungstext from './components/Einfuehrungstext'
import About from './components/About'
import Leistungen from './components/Leistungen'
import Kontakt from './components/Kontakt'
import ScrollHint from './components/ScrollHint'
import Footer from './components/Footer'
import CursorFollower from './components/CursorFollower'

function App() {
  const [canScroll, setCanScroll] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)

  // Verhindere Scrollen während der Animation
  useEffect(() => {
    if (!canScroll) {
      // Verhindere Scrollen
      document.body.style.overflow = 'hidden'
    } else {
      // Erlaube Scrollen
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [canScroll])

  // Scroll sofort erlauben (kein Klick mehr nötig)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanScroll(true)
      setShowScrollHint(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <HamburgerMenu />
      <section className="aufmacher-section">
        <div className="welcome-container">
          <Aufmacher />
        </div>
      </section>
      <Video />
      <Einfuehrungstext id="praxis" />
      <Leistungen id="leistungen" />
      <About id="ueber-mich" />
      <Kontakt id="kontakt" />
      <Footer />
      {showScrollHint && <ScrollHint />}
      <CursorFollower />
    </div>
  )
}

export default App

