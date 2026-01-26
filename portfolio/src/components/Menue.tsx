import './Menue.css'
import Portfolio from './Portfolio'

interface MenueProps {
  portfolioOpen: boolean
  setPortfolioOpen: (open: boolean) => void
}

function Menue({ portfolioOpen, setPortfolioOpen }: MenueProps) {
  const menuItems = ['about', 'portfolio', 'kontakt'];

  const handleClick = (item: string) => {
    if (item === 'portfolio') {
      setPortfolioOpen(!portfolioOpen)
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
