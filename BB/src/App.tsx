import './App.css'
import Aufmacher from './components/Aufmacher'
import Logo from './components/Logo'
import About from './components/About'
import Leistungen from './components/Leistungen'
import Kontakt from './components/Kontakt'
import ScrollHint from './components/ScrollHint'
import Footer from './components/Footer'
import CursorFollower from './components/CursorFollower'

function App() {
  return (
    <div className="app">
      <section className="aufmacher-section">
        <div className="welcome-container">
          <Aufmacher />
        </div>
      </section>
      <Logo />
      <About />
      <Leistungen />
      <Kontakt />
      <Footer />
      <ScrollHint />
      <CursorFollower />
    </div>
  )
}

export default App

