import { useState, useEffect } from 'react'
import './Footer.css'

const LEGAL_IMPRESSUM = {
  title: 'Impressum',
  content: (
    <>
      <p><strong>Angaben gemäß § 5 TMG</strong></p>
      <p>Musterpraxis Beispiel<br />Musterstraße 123<br />12345 Musterstadt</p>
      <p><strong>Kontakt</strong><br />Telefon: +49 40 123 456 78<br />E-Mail: kontakt@beispiel.de</p>
      <p><strong>Berufsbezeichnung und berufsrechtliche Regelungen</strong><br />Berufsbezeichnung: Heilpraktiker für Psychotherapie (verliehen in der Bundesrepublik Deutschland). Zuständige Kammer: [Name der Kammer]. Verliehen in: Hamburg.</p>
      <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</strong><br />[Name], [Adresse]</p>
      <p>Dies ist ein Platzhaltertext. Bitte ersetzen Sie ihn durch Ihre rechtlich korrekten Angaben.</p>
    </>
  ),
}

const LEGAL_DATENSCHUTZ = {
  title: 'Datenschutz',
  content: (
    <>
      <p><strong>1. Verantwortliche Stelle</strong></p>
      <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist [Name und Anschrift]. Kontaktmöglichkeiten finden Sie im Impressum.</p>
      <p><strong>2. Erhebung und Speicherung personenbezogener Daten</strong></p>
      <p>Beim Besuch dieser Website werden durch den Browser automatisch Informationen an den Server übermittelt. Diese umfassen unter anderem Datum und Uhrzeit des Abrufs, Browsertyp und -version sowie die zuvor aufgerufene Seite. Eine Zuordnung zu einer bestimmten Person ist mit diesen Daten allein nicht möglich.</p>
      <p><strong>3. Ihre Rechte</strong></p>
      <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie ein Recht auf Datenübertragbarkeit. Bei Fragen wenden Sie sich bitte an die im Impressum genannte Kontaktadresse.</p>
      <p>Dies ist ein Platzhaltertext. Bitte ergänzen Sie ihn anhand Ihrer tatsächlichen Datenverarbeitung und ggf. mit Hilfe eines Anwalts.</p>
    </>
  ),
}

const LEGAL_COOKIE = {
  title: 'Cookie-Richtlinie',
  content: (
    <>
      <p>Diese Website setzt selbst keine Cookies.</p>
      <p><strong>Google Maps</strong><br />Im Bereich „Kontakt“ ist eine Karte von Google Maps eingebunden. Beim Aufruf dieser Seite lädt Ihr Browser Inhalte von Google. Dabei kann Google Cookies auf Ihrem Gerät setzen (z. B. für die Kartenfunktion oder Einstellungen). Wir haben keinen Zugriff auf diese Cookies.</p>
      <p>Weitere Informationen zur Datenverarbeitung durch Google finden Sie in der <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Google</a>. Sie können Cookies in Ihren Browsereinstellungen ablehnen oder löschen; die Karte kann dann eingeschränkt oder nicht nutzbar sein.</p>
      <p>Mit der Nutzung dieser Website und dem Aufruf der Kontaktseite mit Karte erklären Sie sich mit der genannten Übermittlung von Daten an Google einverstanden.</p>
    </>
  ),
}

function Footer() {
  const [isSticky, setIsSticky] = useState(false)
  const [legalOpen, setLegalOpen] = useState<null | 'impressum' | 'datenschutz' | 'cookie'>(null)

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight
    const stickyPoint = viewportHeight * 6

    const update = () => {
      setIsSticky(window.scrollY >= stickyPoint)
    }

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      update()
      scrollTimeout = setTimeout(update, 150)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <footer className="footer-section">
      <div
        className="footer"
        style={{
          position: isSticky ? 'fixed' : 'relative',
          bottom: isSticky ? 0 : undefined,
          left: isSticky ? 0 : undefined,
          width: isSticky ? '100%' : undefined,
          zIndex: isSticky ? 380 : 2001,
        }}
      >
        <p className="footer-legal">
          <button type="button" className="footer-legal-link" onClick={() => setLegalOpen('impressum')}>Impressum</button>
          {' | '}
          <button type="button" className="footer-legal-link" onClick={() => setLegalOpen('datenschutz')}>Datenschutz</button>
          {' | '}
          <button type="button" className="footer-legal-link" onClick={() => setLegalOpen('cookie')}>Cookie-Richtlinie</button>
        </p>
        <p className="footer-text">Designed and developed by<br /><strong className="footer-bold">media on borth</strong></p>
      </div>

      {legalOpen && (
        <div
          className="footer-legal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-legal-title"
        >
          <div className="footer-legal-backdrop" onClick={() => setLegalOpen(null)} aria-hidden="true" />
          <div className="footer-legal-panel">
            <h2 id="footer-legal-title" className="footer-legal-panel-title">
              {legalOpen === 'impressum' && LEGAL_IMPRESSUM.title}
              {legalOpen === 'datenschutz' && LEGAL_DATENSCHUTZ.title}
              {legalOpen === 'cookie' && LEGAL_COOKIE.title}
            </h2>
            <div className="footer-legal-panel-body">
              {legalOpen === 'impressum' && LEGAL_IMPRESSUM.content}
              {legalOpen === 'datenschutz' && LEGAL_DATENSCHUTZ.content}
              {legalOpen === 'cookie' && LEGAL_COOKIE.content}
            </div>
            <button type="button" className="footer-legal-close" onClick={() => setLegalOpen(null)}>Schließen</button>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
