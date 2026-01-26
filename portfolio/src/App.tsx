import { useState, useEffect } from 'react'
import './App.css'
import Aufmacher from './components/Aufmacher'
import Menue from './components/Menue'
import ScrollHint from './components/ScrollHint'
import Footer from './components/Footer'
import CursorFollower from './components/CursorFollower'
import ThemeSwitcher from './components/ThemeSwitcher'

type Theme = 'warm' | 'pigmentfarben' | 'soft' | 'fresh' | 'winterwald'

function App() {
  const [portfolioOpen, setPortfolioOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'warm'
  })

  useEffect(() => {
    // Entferne alle Theme-Klassen
    document.documentElement.classList.remove('theme-warm', 'theme-pigmentfarben', 'theme-soft', 'theme-fresh', 'theme-winterwald')
    // Füge die aktuelle Theme-Klasse hinzu
    document.documentElement.classList.add(`theme-${theme}`)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className={`app ${portfolioOpen ? 'portfolio-open' : ''}`}>
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
      <section className="aufmacher-section">
        <div className="welcome-container">
          <Aufmacher />
        </div>
      </section>
      <section className="menu-section">
        <Menue 
          portfolioOpen={portfolioOpen}
          setPortfolioOpen={setPortfolioOpen}
        />
      </section>
      <Footer />
      <ScrollHint />
      <CursorFollower />
    </div>
  )
}

export default App

