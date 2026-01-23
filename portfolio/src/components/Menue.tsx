import './Menue.css'
import Portfolio from './Portfolio'

interface MenueProps {
  onPortfolioClick?: () => void
  portfolioOpen?: boolean
}

function Menue({ onPortfolioClick, portfolioOpen = false }: MenueProps) {
  const menuItems = ['about', 'portfolio', 'kontakt'];

  const handleClick = (item: string) => {
    if (item === 'portfolio') {
      if (onPortfolioClick) {
        onPortfolioClick()
      }
    }
  }

  return (
    <>
      <nav className={`menu ${portfolioOpen ? 'portfolio-open' : ''}`}>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <span 
                className="menu-link"
                onClick={() => handleClick(item)}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      {portfolioOpen && (
        <div className="portfolio-wrapper">
          <Portfolio />
        </div>
      )}
    </>
  )
}

export default Menue
