import { useState } from 'react'
import './Menue.css'
import Portfolio from './Portfolio'

interface MenueProps {
  onPortfolioClick?: () => void
}

function Menue({ onPortfolioClick }: MenueProps) {
  const [showPortfolio, setShowPortfolio] = useState(false)
  const menuItems = ['about', 'portfolio', 'kontakt'];

  const handleClick = (item: string) => {
    if (item === 'portfolio') {
      setShowPortfolio(!showPortfolio)
      if (onPortfolioClick) {
        onPortfolioClick()
      }
    }
  }

  return (
    <nav className="menu">
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <span 
              className="menu-link"
              onClick={() => handleClick(item)}
            >
              {item}
            </span>
            {item === 'portfolio' && showPortfolio && (
              <Portfolio />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menue
