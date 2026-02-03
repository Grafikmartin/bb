import { useState, useEffect } from 'react'
import './App.css'
import Aufmacher from './components/Aufmacher'
import Video from './components/Video'
import Einfuehrungstext from './components/Einfuehrungstext'
import About from './components/About'
import Praxis from './components/Praxis'
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

  // Prüfe ob Animation beendet ist (nach 2 Sekunden Fade-in + 500ms für Click-Hint)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanScroll(true)
      setShowScrollHint(true)
    }, 2500) // 2 Sekunden Fade-in + 500ms Pause

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <section className="aufmacher-section">
        <div className="welcome-container">
          <Aufmacher />
        </div>
      </section>
      <Video />
      <Einfuehrungstext />
      <Leistungen />
      <About />
      <Praxis />
      <Kontakt />
      <Footer />
      {showScrollHint && <ScrollHint />}
      <CursorFollower />
    </div>
  )
}

export default App

