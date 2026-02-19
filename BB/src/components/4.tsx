import { useState, useEffect, useRef } from 'react'
import './4.css'
import SectionDots from './SectionDots'
import bbMarkerUrl from '../assets/BBmarker.png?url'

const MAP_CENTER = { lat: 53.5465017, lng: 9.9784616 }
const MAP_ZOOM = 16
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/dir//Sch%C3%B6ne+Aussicht+1,+20459+Hamburg'

function Four({ id }: { id?: string }) {
  const [scale, setScale] = useState(0.7)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const aboutSectionRef = useRef<HTMLElement | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    aboutSectionRef.current = document.getElementById('ueber-mich')
  }, [])

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>
    const viewportHeight = window.innerHeight

    const updateScale = () => {
      const scrollY = window.scrollY
      const aboutSection = aboutSectionRef.current
      const aboutBottom = aboutSection ? aboutSection.offsetTop + aboutSection.offsetHeight : viewportHeight * 5
      const stickyPoint = aboutBottom
      const scaleStart = aboutBottom - viewportHeight

      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        setScale(1.0)
      } else {
        setIsSticky(false)
        const scrollProgress = Math.min(Math.max((scrollY - scaleStart) / viewportHeight, 0), 1)
        setScale(0.7 + scrollProgress * 0.3)
      }
    }

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      updateScale()
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        updateScale()
      }, 150)
    }

    updateScale()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!mapContainerRef.current || !apiKey) return

    const initMap = () => {
      if (!mapContainerRef.current || mapRef.current) return
      const map = new google.maps.Map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      })
      mapRef.current = map

      const iconUrl = typeof window !== 'undefined' ? new URL(bbMarkerUrl, window.location.href).href : bbMarkerUrl
      const marker = new google.maps.Marker({
        map,
        position: MAP_CENTER,
        title: 'Praxis Benjamin Borth',
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40),
        },
      })
      markerRef.current = marker
    }

    if (typeof google !== 'undefined' && google.maps) {
      initMap()
      return () => {
        markerRef.current = null
        mapRef.current = null
      }
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__initGoogleMap`
    script.async = true
    script.defer = true
    ;(window as unknown as { __initGoogleMap: () => void }).__initGoogleMap = () => {
      initMap()
      delete (window as unknown as { __initGoogleMap?: () => void }).__initGoogleMap
    }
    document.head.appendChild(script)
    return () => {
      script.remove()
      markerRef.current = null
      mapRef.current = null
    }
  }, [])

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  return (
    <section id={id} className="kontakt-section">
      <div
        className="kontakt-wrapper"
        style={{
          position: isSticky ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: '#ffffff',
          padding: 'var(--spacing-xl, 4rem) 0',
          transform: isSticky ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          transition: isScrolling || isSticky ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isSticky ? 'auto' : 'transform',
          zIndex: 370,
        }}
      >
      <SectionDots />
        <div className="kontakt-content kontakt-content-scrollable">
          <div className="kontakt-text">
            <h2 className="kontakt-title">Kontakt</h2>
            <p className="kontakt-address">
              Praxis Benjamin Borth<br />
              Tel.: <a href="tel:+4940555023456" className="kontakt-link">040 / 555 023 456</a><br />
              E-Mail: <a href="mailto:kontakt@benjaminborth.de" className="kontakt-link">kontakt@benjaminborth.de</a><br />
              Schöne Aussicht 1<br />20459 Hamburg
            </p>
          </div>
          <div className="kontakt-map-container">
            {apiKey ? (
              <div ref={mapContainerRef} className="kontakt-map" title="Karte Schöne Aussicht 1, Hamburg" />
            ) : (
              <iframe
                title="Karte Schöne Aussicht 1, Hamburg"
                className="kontakt-map"
                src="https://www.google.com/maps?q=Sch%C3%B6ne+Aussicht+1,+20459+Hamburg&z=15&output=embed&t=k"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="kontakt-anfahrt-btn"
          >
            Anfahrt
          </a>
        </div>
      </div>
    </section>
  )
}

export default Four
