import { useState, useEffect } from 'react'
import './App.css'
import Aufmacher from './components/Aufmacher'
import HamburgerMenu from './components/HamburgerMenu'
import Video from './components/Video'
import One from './components/1'
import Two from './components/2'
import Three from './components/3'
import Four from './components/4'
import ScrollHint from './components/ScrollHint'
import Footer from './components/Footer'
import CursorFollower from './components/CursorFollower'
import ImpressumDrawer from './components/ImpressumDrawer'

function App() {
  const [canScroll, setCanScroll] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const [impressumOpen, setImpressumOpen] = useState(false)

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
      <HamburgerMenu onImpressumClick={() => setImpressumOpen(true)} />
      <section className="aufmacher-section">
        <div className="welcome-container">
          <Aufmacher />
        </div>
      </section>
      <Video />
      <One id="praxis" />
      <Two id="leistungen" />
      <Three id="ueber-mich" />
      <Four id="kontakt" />
      <Footer />
      {showScrollHint && <ScrollHint />}
      <CursorFollower />
      <ImpressumDrawer isOpen={impressumOpen} onClose={() => setImpressumOpen(false)} />
    </div>
  )
}

export default App

