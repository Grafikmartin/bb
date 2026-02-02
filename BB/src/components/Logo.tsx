import './Logo.css'
import bbLogo from '../assets/bb.png'

function Logo() {
  return (
    <div className="logo-container">
      <img 
        src={bbLogo} 
        alt="BB Logo" 
        className="logo-image"
      />
    </div>
  )
}

export default Logo
