import './App.css'
import Aufmacher from './components/Aufmacher'
import Einfuehrungstext from './components/Einfuehrungstext'
import About from './components/About'
import About2 from './components/About2'
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
      <Einfuehrungstext />
      <About />
      <About2 />
      <Leistungen />
      <Kontakt />
      <Footer />
      <ScrollHint />
      <CursorFollower />
    </div>
  )
}

export default App

