import './ThemeSwitcher.css'

interface ThemeSwitcherProps {
  isDarkMode: boolean
  onToggle: () => void
}

function ThemeSwitcher({ isDarkMode, onToggle }: ThemeSwitcherProps) {
  return (
    <div className="theme-switcher">
      <div className="theme-switcher-label">
        {isDarkMode ? 'Darkmodus' : 'Hellmodus'}
      </div>
      <div className="container">
        <input
          type="checkbox"
          className="checkbox"
          id="darkmode-toggle"
          checked={isDarkMode}
          onChange={onToggle}
          aria-label={isDarkMode ? 'Zu Hellmodus wechseln' : 'Zu Darkmodus wechseln'}
        />
        <label className="switch" htmlFor="darkmode-toggle">
          <span className="slider"></span>
        </label>
      </div>
    </div>
  )
}

export default ThemeSwitcher
