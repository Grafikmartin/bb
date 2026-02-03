import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../App.css'
import './Aufmacher.css'

// Mint-Farben aus dem Theme
const getMintColors = (): string[] => {
  if (typeof window === 'undefined') {
    return ['#4dc3b5', '#7dd3c4', '#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4'];
  }
  const root = document.documentElement;
  return [
    getComputedStyle(root).getPropertyValue('--color-signal').trim() || '#4dc3b5',
    getComputedStyle(root).getPropertyValue('--color-coral').trim() || '#7dd3c4',
    getComputedStyle(root).getPropertyValue('--color-sky').trim() || '#a0dfd1',
    getComputedStyle(root).getPropertyValue('--color-gold').trim() || '#c5ebe2',
    '#d8f2eb',
    '#ebf8f4',
  ];
};

function Aufmacher() {
  const baseCols = 20; // 20 Kreise nebeneinander (ursprünglich)
  const baseRows = 9;  // 9 Kreise übereinander (ursprünglich)
  
  // Berechne Kreis-Durchmesser und Abstand basierend auf Viewport
  const getCircleDimensions = () => {
    if (typeof window === 'undefined') {
      return { diameter: 25, gap: 2.5, cols: 48, rows: 38 };
    }
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Berechne wie viele Kreise in die Breite passen (100vw)
    // cols * diameter + (cols-1) * gap = viewportWidth
    // gap = 0.1 * diameter
    // cols * d + (cols-1) * 0.1 * d = viewportWidth
    // d * (cols + 0.1 * (cols-1)) = viewportWidth
    
    // Wir starten mit einem geschätzten Durchmesser und passen dann an
    // Ziel: doppelt so viele Spalten wie vorher (2x baseCols + 8)
    let estimatedDiameter = viewportWidth / ((baseCols * 2) + 8 + 0.1 * ((baseCols * 2) + 7));
    let cols = Math.floor((viewportWidth + 0.1 * estimatedDiameter) / (estimatedDiameter * 1.1));
    cols = Math.max(cols, (baseCols * 2) + 8); // Mindestens doppelt so viele wie baseCols + 4
    
    // Berechne tatsächlichen Durchmesser basierend auf cols
    // Durchmesser ist halb so groß wie vorher, dann nochmal um 20% verkleinert
    let diameter = viewportWidth / (cols + 0.1 * (cols - 1));
    diameter = diameter * 0.8; // Weitere 20% Verkleinerung
    const gap = diameter * 0.1;
    
    // Berechne wie viele Reihen in die Höhe passen (100vh)
    // rows * diameter + (rows-1) * gap = viewportHeight
    // Mehr Reihen durch kleinere Kreise
    let rows = Math.floor((viewportHeight + gap) / (diameter + gap));
    rows = Math.max(rows, Math.floor((baseRows * 2) * 1.25)); // Etwa 25% mehr Reihen durch kleinere Kreise
    
    // Passe auch cols an, da die Kreise jetzt kleiner sind
    cols = Math.floor((viewportWidth + gap) / (diameter + gap));
    cols = Math.max(cols, Math.floor(((baseCols * 2) + 8) * 1.25)); // Etwa 25% mehr Spalten
    
    return { diameter, gap, cols, rows };
  };
  
  const [dimensions, setDimensions] = useState(() => getCircleDimensions());
  const { cols, rows } = dimensions;
  const totalCircles = cols * rows;


  // Initiale Farben: Alle Punkte bekommen zufällige Minttöne + Weiß
  const getInitialColors = (): string[] => {
    const allColors = getMintColors();
    // Alle Minttöne + Weiß für alle Punkte
    const allColorsWithWhite = [...allColors, '#ffffff'];
    
    return Array.from({ length: totalCircles }, () => {
      const randomIndex = Math.floor(Math.random() * allColorsWithWhite.length);
      return allColorsWithWhite[randomIndex];
    });
  };

  const [circleColors, setCircleColors] = useState<string[]>(getInitialColors);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [showClickHint, setShowClickHint] = useState(false);
  const [clickHintColor, setClickHintColor] = useState('#000000');
  const [showLine, setShowLine] = useState(false);
  const [typingText, setTypingText] = useState({ line1: '', line2: '', line3: '' });
  const [circleOpacities, setCircleOpacities] = useState<number[]>(() => {
    return Array.from({ length: totalCircles }, () => 0); // Starten mit opacity 0
  });
  const [fadeOutOpacities, setFadeOutOpacities] = useState<number[]>(() => {
    return Array.from({ length: totalCircles }, () => 1); // Starten mit opacity 1
  });
  const [visibleCircles, setVisibleCircles] = useState<boolean[]>(() => {
    return Array.from({ length: totalCircles }, () => true);
  });
  const [circlePositions, setCirclePositions] = useState<Array<{x: number, y: number}>>(() => {
    return Array.from({ length: totalCircles }, () => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
  });
  
  // Berechne die Text-Position relativ zum Container
  const [textLeft, setTextLeft] = useState(0);
  const [textWidth, setTextWidth] = useState('30vw');
  
  useEffect(() => {
    const calculateTextPosition = () => {
      if (typeof window === 'undefined') return;
      const viewportWidth = window.innerWidth;
      const containerWidth = cols * dimensions.diameter + (cols - 1) * dimensions.gap;
      const containerLeft = (viewportWidth - containerWidth) / 2;
      const viewport49vw = viewportWidth * 0.49;
      const offset7vw = viewportWidth * 0.07; // 7vw nach links (10vw - 3vw)
      let calculatedLeft = viewport49vw - containerLeft - offset7vw;
      
      // Berechne maximale Breite, damit der Text nicht über den Rand hinausgeht
      const maxWidth = viewportWidth - calculatedLeft - 16; // 16px Padding rechts
      const desiredWidth = viewportWidth * 0.3; // 30vw
      const actualWidth = Math.min(desiredWidth, maxWidth);
      
      // Wenn der Text zu breit wäre, passe die Position an
      if (actualWidth < desiredWidth) {
        calculatedLeft = viewportWidth - actualWidth - 16; // 16px Padding rechts
      }
      
      setTextLeft(calculatedLeft);
      setTextWidth(`${actualWidth}px`);
    };
    
    calculateTextPosition();
    window.addEventListener('resize', calculateTextPosition);
    return () => window.removeEventListener('resize', calculateTextPosition);
  }, [cols, dimensions]);

  // Aktualisiere Dimensionen bei Fenstergrößenänderung
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getCircleDimensions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Aktualisiere circlePositions und visibleCircles wenn sich totalCircles ändert
  useEffect(() => {
    // Setze alle Kreise sofort auf ihre richtige Position (0, 0)
    setCirclePositions(Array.from({ length: totalCircles }, () => ({ x: 0, y: 0 })));
    setVisibleCircles(Array.from({ length: totalCircles }, () => true));
    
    // Alle Kreise sanft innerhalb von 2 Sekunden erscheinen lassen (von transparent zu sichtbar)
    setCircleOpacities(Array.from({ length: totalCircles }, () => 0));
    const fadeInDuration = 2000; // 2 Sekunden
    const startTime = Date.now();
    
    const fadeIn = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeInDuration, 1);
      
      setCircleOpacities(Array.from({ length: totalCircles }, () => progress));
      
      if (progress < 1) {
        requestAnimationFrame(fadeIn);
      } else {
        // Nach dem Fade-in: Animation beenden und Klickaufforderung anzeigen
        setIsAnimating(false);
        setTimeout(() => {
          setShowClickHint(true);
          // Starte Farbwechsel für den Klickbutton - nur dunkle Mint-Töne
          const mintColors = getMintColors();
          // Nur die ersten 3 dunklen Mint-Töne verwenden (signal, coral, sky)
          const darkMintColors = mintColors.slice(0, 3);
          const initialColorIndex = Math.floor(Math.random() * darkMintColors.length);
          setClickHintColor(darkMintColors[initialColorIndex]);
          
          const colorInterval = setInterval(() => {
            if (!isFading) {
              setClickHintColor(prevColor => {
                const availableColors = darkMintColors.filter(c => c !== prevColor);
                if (availableColors.length > 0) {
                  const randomIndex = Math.floor(Math.random() * availableColors.length);
                  return availableColors[randomIndex];
                }
                return prevColor;
              });
            } else {
              clearInterval(colorInterval);
            }
          }, 1500); // Wechsle alle 1.5 Sekunden
        }, 500);
      }
    };
    
    requestAnimationFrame(fadeIn);
  }, [totalCircles]);


  // Berechne welche Kreise die mittigen 20x9 sind
  const getCenterCircleIndices = () => {
    const startCol = 5; // 6. Kreis von links (0-indexed)
    const endCol = startCol + 20; // 20 Kreise
    const totalRows = rows;
    const centerRowStart = Math.floor((totalRows - 9) / 2); // Mitte der Reihen
    const centerRowEnd = centerRowStart + 9; // 9 Reihen
    
    const centerIndices = new Set<number>();
    for (let row = centerRowStart; row < centerRowEnd; row++) {
      for (let col = startCol; col < endCol; col++) {
        const index = row * cols + col;
        if (index < totalCircles) {
          centerIndices.add(index);
        }
      }
    }
    return centerIndices;
  };

  // Konvertiere Koordinaten (1a-20i) zu Index
  // row: 'a' bis 'i' (0-8), col: 1-20 (0-19)
  const coordToIndex = (col: number, row: string) => {
    const startCol = 5; // 6. Kreis von links (0-indexed)
    const totalRows = rows;
    const centerRowStart = Math.floor((totalRows - 9) / 2);
    
    const colIndex = startCol + (col - 1); // col ist 1-20, wird zu 0-19
    const rowIndex = centerRowStart + (row.charCodeAt(0) - 'a'.charCodeAt(0)); // 'a'=0, 'i'=8
    
    return rowIndex * cols + colIndex;
  };

  // Prüfe ob ein Index zu den speziellen Bereichen gehört (nur hellste Farben: mint-5 und mint-6)
  const isLightColorArea = (index: number) => {
    const startCol = 5;
    const totalRows = rows;
    const centerRowStart = Math.floor((totalRows - 9) / 2);
    
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Prüfe ob innerhalb der mittigen 20x9 Kreise
    if (col < startCol || col >= startCol + 20) return false;
    if (row < centerRowStart || row >= centerRowStart + 9) return false;
    
    // Berechne relative Position (1-20 für Spalten, a-i für Reihen)
    const relCol = col - startCol + 1; // 1-20
    const relRow = row - centerRowStart; // 0-8 (a-i)
    
    // 1a bis 7a (Reihe a = 0, Spalten 1-7)
    if (relRow === 0 && relCol >= 1 && relCol <= 7) return true;
    
    // 1b bis 5b (Reihe b = 1, Spalten 1-5)
    if (relRow === 1 && relCol >= 1 && relCol <= 5) return true;
    
    // 1c bis 5c (Reihe c = 2, Spalten 1-5)
    if (relRow === 2 && relCol >= 1 && relCol <= 5) return true;
    
    // 20a (Reihe a = 0, Spalte 20)
    if (relRow === 0 && relCol === 20) return true;
    
    // 20d bis 20i (Reihe d-i = 3-8, Spalte 20)
    if (relCol === 20 && relRow >= 3 && relRow <= 8) return true;
    
    // 19i, 19h (Reihe h-i = 7-8, Spalte 19)
    if (relCol === 19 && relRow >= 7 && relRow <= 8) return true;
    
    // 18i, 18h (Reihe h-i = 7-8, Spalte 18)
    if (relCol === 18 && relRow >= 7 && relRow <= 8) return true;
    
    // 17i (Reihe i = 8, Spalte 17)
    if (relCol === 17 && relRow === 8) return true;
    
    // 1d bis 1f (Reihe d-f = 3-5, Spalte 1)
    if (relCol === 1 && relRow >= 3 && relRow <= 5) return true;
    
    // 2e (Reihe e = 4, Spalte 2)
    if (relCol === 2 && relRow === 4) return true;
    
    // 3e (Reihe e = 4, Spalte 3)
    if (relCol === 3 && relRow === 4) return true;
    
    // 9a bis 13a (Reihe a = 0, Spalten 9-13)
    if (relRow === 0 && relCol >= 9 && relCol <= 13) return true;
    
    return false;
  };

  // Prüfe ob ein Index zu den äußeren Reihen gehört (nur Farben 6-10: coral bis mint-6)
  const isOuterRowArea = (index: number) => {
    const startCol = 5;
    const totalRows = rows;
    const centerRowStart = Math.floor((totalRows - 9) / 2);
    
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Prüfe ob innerhalb der mittigen 20x9 Kreise
    if (col < startCol || col >= startCol + 20) return false;
    if (row < centerRowStart || row >= centerRowStart + 9) return false;
    
    // Berechne relative Position (1-20 für Spalten, a-i für Reihen)
    const relCol = col - startCol + 1; // 1-20
    const relRow = row - centerRowStart; // 0-8 (a-i)
    
    // Äußere Reihen: a, b, h, i (0, 1, 7, 8)
    if (relRow === 0 || relRow === 1 || relRow === 7 || relRow === 8) return true;
    
    // Äußere Spalten: 1, 2, 19, 20
    if (relCol === 1 || relCol === 2 || relCol === 19 || relCol === 20) return true;
    
    return false;
  };

  // Prüfe ob ein Index zu den äußersten Punkten gehört (Reihe a, i und Spalten 1, 20)
  const isOutermostArea = (index: number) => {
    const startCol = 5;
    const totalRows = rows;
    const centerRowStart = Math.floor((totalRows - 9) / 2);
    
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Prüfe ob innerhalb der mittigen 20x9 Kreise
    if (col < startCol || col >= startCol + 20) return false;
    if (row < centerRowStart || row >= centerRowStart + 9) return false;
    
    // Berechne relative Position (1-20 für Spalten, a-i für Reihen)
    const relCol = col - startCol + 1; // 1-20
    const relRow = row - centerRowStart; // 0-8 (a-i)
    
    // Äußerste Reihen: a (0) oder i (8)
    if (relRow === 0 || relRow === 8) return true;
    
    // Äußerste Spalten: 1 oder 20
    if (relCol === 1 || relCol === 20) return true;
    
    return false;
  };

  // Click/Touch-Handler: Kreise langsam ausblenden
  const handleInteraction = () => {
    if (isFading || isAnimating) return; // Verhindere mehrfaches Klicken während Animation
    
    setIsFading(true);
    setShowClickHint(false); // Verstecke Klickaufforderung
    
    // Zeige Strich 500ms nach dem Klick
    setTimeout(() => {
      setShowLine(true);
      
      // Starte Text-Animation sofort nach dem Strich
      const line1 = 'Benjamin Borth';
      const line2 = 'Heilpraktiker für Psychotherapie';
      const line3 = 'und Hypnosetherapeut';
      
      // Zeile 1 anzeigen (50% langsamer: jeden zweiten Frame ein Zeichen)
      let currentIndex = 0;
      let frameCount = 0;
      const animateLine1 = () => {
        if (currentIndex < line1.length) {
          // Jeden zweiten Frame ein Zeichen (50% langsamer)
          if (frameCount % 2 === 0) {
            const nextIndex = Math.min(currentIndex + 1, line1.length);
            setTypingText(prev => ({ ...prev, line1: line1.substring(0, nextIndex) }));
            currentIndex = nextIndex;
          }
          frameCount++;
          requestAnimationFrame(animateLine1);
        } else {
          // Zeile 2 anzeigen
          currentIndex = 0;
          frameCount = 0;
          const animateLine2 = () => {
            if (currentIndex < line2.length) {
              // Jeden zweiten Frame ein Zeichen (50% langsamer)
              if (frameCount % 2 === 0) {
                const nextIndex = Math.min(currentIndex + 1, line2.length);
                setTypingText(prev => ({ ...prev, line2: line2.substring(0, nextIndex) }));
                currentIndex = nextIndex;
              }
              frameCount++;
              requestAnimationFrame(animateLine2);
            } else {
              // Zeile 3 anzeigen
              currentIndex = 0;
              frameCount = 0;
              const animateLine3 = () => {
                if (currentIndex < line3.length) {
                  // Jeden zweiten Frame ein Zeichen (50% langsamer)
                  if (frameCount % 2 === 0) {
                    const nextIndex = Math.min(currentIndex + 1, line3.length);
                    setTypingText(prev => ({ ...prev, line3: line3.substring(0, nextIndex) }));
                    currentIndex = nextIndex;
                  }
                  frameCount++;
                  requestAnimationFrame(animateLine3);
                }
              };
              requestAnimationFrame(animateLine3);
            }
          };
          requestAnimationFrame(animateLine2);
        }
      };
      requestAnimationFrame(animateLine1);
    }, 500);
    
    const centerIndices = getCenterCircleIndices();
    
    // Sammle alle Indizes, die verschwinden sollen
    const fadeIndices: number[] = [];
    for (let i = 0; i < totalCircles; i++) {
      if (!centerIndices.has(i)) {
        fadeIndices.push(i);
      }
    }
    
    // Initialisiere fadeOutOpacities für alle Kreise auf 1
    setFadeOutOpacities(Array.from({ length: totalCircles }, () => 1));
    
    // Berechne die Distanz jedes Kreises zu den zentralen Kreisen
    const startCol = 5; // Start der zentralen Spalten
    const endCol = startCol + 20; // Ende der zentralen Spalten
    const centerRowStart = Math.floor((rows - 9) / 2);
    const centerRowEnd = centerRowStart + 9;
    
    // Berechne für jeden zu verschwindenden Kreis die rechteckige Distanz (Chebyshev-Distanz)
    // zu den zentralen Kreisen - verwendet die maximale horizontale oder vertikale Distanz
    const fadeIndicesWithDistance = fadeIndices.map(index => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // Berechne horizontale Distanz zum zentralen Bereich
      // Die zentralen Spalten sind von startCol (inklusive) bis endCol (exklusive)
      // endCol = startCol + 20, also die letzte zentrale Spalte ist endCol - 1
      let distToCenterCol = 0;
      if (col < startCol) {
        // Links vom zentralen Bereich
        distToCenterCol = startCol - col;
      } else if (col >= endCol) {
        // Rechts vom zentralen Bereich
        // Die letzte zentrale Spalte ist endCol - 1, also ist die Distanz col - (endCol - 1)
        distToCenterCol = col - (endCol - 1);
      }
      // Wenn col innerhalb [startCol, endCol), dann distToCenterCol = 0
      
      // Berechne vertikale Distanz zum zentralen Bereich
      // Die zentralen Reihen sind von centerRowStart (inklusive) bis centerRowEnd (exklusive)
      // centerRowEnd = centerRowStart + 9, also die letzte zentrale Reihe ist centerRowEnd - 1
      let distToCenterRow = 0;
      if (row < centerRowStart) {
        // Oberhalb des zentralen Bereichs
        distToCenterRow = centerRowStart - row;
      } else if (row >= centerRowEnd) {
        // Unterhalb des zentralen Bereichs
        // Die letzte zentrale Reihe ist centerRowEnd - 1, also ist die Distanz row - (centerRowEnd - 1)
        distToCenterRow = row - (centerRowEnd - 1);
      }
      // Wenn row innerhalb [centerRowStart, centerRowEnd), dann distToCenterRow = 0
      
      // Chebyshev-Distanz (L∞-Norm): maximale horizontale oder vertikale Distanz
      // Dies erzeugt ein rechteckiges Muster - die äußersten Punkte haben die größte Distanz
      const distance = Math.max(distToCenterCol, distToCenterRow);
      
      return { index, distance };
    });
    
    // Sortiere nach Distanz (größte Distanz zuerst = verschwinden zuerst)
    fadeIndicesWithDistance.sort((a, b) => b.distance - a.distance);
    
    // Finde maximale Distanz für Normalisierung
    const maxDistance = Math.max(...fadeIndicesWithDistance.map(item => item.distance));
    
    // Jeder Kreis bekommt eine Verzögerung basierend auf seiner Distanz
    // Weiter entfernt = früher starten (kleinere Verzögerung)
    const maxDelay = 800; // Maximal 0,8 Sekunden Verzögerung (schneller)
    const fadeDuration = 450; // 0,45 Sekunden zum Weiß wechseln (25% schneller: 600 * 0.75)
    const totalDuration = maxDelay + fadeDuration; // Gesamtdauer
    
    fadeIndicesWithDistance.forEach(({ index, distance }) => {
      // Normalisiere Distanz (0 = am nächsten, 1 = am weitesten)
      const normalizedDistance = maxDistance > 0 ? distance / maxDistance : 0;
      // Umkehren: größere Distanz = kleinere Verzögerung
      // delay = (1 - normalizedDistance) * maxDelay
      // Wenn normalizedDistance = 1 (am weitesten), dann delay = 0 (sofort starten)
      // Wenn normalizedDistance = 0 (am nächsten), dann delay = maxDelay (später starten)
      const delay = (1 - normalizedDistance) * maxDelay;
      const startTime = Date.now() + delay;
      
      // Starte den Fade für diesen Kreis
      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        
        // Gleichmäßiger linearer Übergang (kein Easing für gleichmäßigeres Aussehen)
        const opacity = Math.max(0, 1 - progress);
        
        // Aktualisiere Opacity
        setFadeOutOpacities(prev => {
          const newOpacities = [...prev];
          newOpacities[index] = opacity;
          return newOpacities;
        });
        
        // Aktualisiere Farbe zu Weiß
        setCircleColors(prevColors => {
          const newColors = [...prevColors];
          const color = prevColors[index];
          
          // Konvertiere Hex zu RGB
          const hex = color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          
          // Interpoliere zu weiß (255, 255, 255) - linearer Übergang
          const newR = Math.round(r + (255 - r) * progress);
          const newG = Math.round(g + (255 - g) * progress);
          const newB = Math.round(b + (255 - b) * progress);
          
          // Konvertiere zurück zu Hex
          const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
          
          newColors[index] = newColor;
          return newColors;
        });
        
        if (progress >= 1) {
          clearInterval(fadeInterval);
        }
      }, 16); // ~60fps für flüssige Animation
    });
    
    // Nach allen Animationen: Setze opacity auf 0 und ändere Farben für spezielle Bereiche
    setTimeout(() => {
      setVisibleCircles(prevVisible => {
        return prevVisible.map((_, index) => centerIndices.has(index));
      });
      
      // Setze Farben für spezielle Bereiche auf hellste Mint-Farben
      // Setze Farben für äußere Reihen auf coral bis mint-6
      setCircleColors(prevColors => {
        const newColors = [...prevColors];
        const lightestColors = ['#d8f2eb', '#ebf8f4']; // --color-mint-5 und --color-mint-6
        const outerColors = ['#7dd3c4', '#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4']; // coral bis mint-6 (Zeilen 6-10)
        
        centerIndices.forEach(index => {
          if (isLightColorArea(index)) {
            // Zufällig eine der beiden hellsten Farben wählen
            const randomColor = lightestColors[Math.floor(Math.random() * lightestColors.length)];
            newColors[index] = randomColor;
          } else if (isOuterRowArea(index)) {
            // Zufällig eine der Farben von coral bis mint-6 + weiß wählen
            const outerColorsWithWhite = [...outerColors, '#ffffff'];
            const randomColor = outerColorsWithWhite[Math.floor(Math.random() * outerColorsWithWhite.length)];
            newColors[index] = randomColor;
          }
        });
        
        return newColors;
      });
    }, totalDuration);
  };

  // Farbwechsel-Animation - jeder Kreis hat seinen eigenen Rhythmus
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    // Erstelle für jeden Kreis einen individuellen Timer
    for (let index = 0; index < totalCircles; index++) {
      // Jeder Kreis bekommt einen zufälligen Intervall zwischen 1.5 und 4 Sekunden
      const baseInterval = 1500 + Math.random() * 2500; // 1.5s bis 4s
      // Zusätzlicher zufälliger Offset für den ersten Wechsel (0 bis 2 Sekunden)
      const initialDelay = Math.random() * 2000;

      // Funktion zum Farbwechsel für diesen spezifischen Kreis
      const changeColor = () => {
        setCircleColors(prevColors => {
          const newColors = [...prevColors];
          const row = Math.floor(index / cols);
          const col = index % cols;
          
          // Prüfe ob dieser Kreis zu den speziellen Bereichen gehört (nur nach dem Klick)
          if (isFading && isLightColorArea(index)) {
            // Hellste Farben für spezielle Bereiche + gelegentlich Weiß
            const lightestColors = ['#d8f2eb', '#ebf8f4']; // --color-mint-5 und --color-mint-6
            const currentColor = prevColors[index];
            
            // 20% Chance für Weiß, 80% für hellste Farben
            if (Math.random() < 0.2) {
              newColors[index] = '#ffffff';
            } else {
              const availableWithoutCurrent = lightestColors.filter(c => c !== currentColor);
              if (availableWithoutCurrent.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
                newColors[index] = availableWithoutCurrent[randomIndex];
              }
            }
            return newColors;
          }
          
          // Prüfe ob dieser Kreis zu den äußersten Punkten gehört (nur nach dem Klick)
          if (isFading && isOutermostArea(index)) {
            // Äußerste Punkte: noch häufiger weiß (85% Wahrscheinlichkeit)
            const outerColors = ['#7dd3c4', '#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4'];
            const currentColor = prevColors[index];
            
            // 85% Chance für weiß, 15% für andere Farben
            if (Math.random() < 0.85) {
              // Weiß wählen
              if (currentColor !== '#ffffff') {
                newColors[index] = '#ffffff';
              } else {
                // Wenn bereits weiß, eine andere Farbe wählen
                const availableWithoutCurrent = outerColors.filter(c => c !== currentColor);
                if (availableWithoutCurrent.length > 0) {
                  const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
                  newColors[index] = availableWithoutCurrent[randomIndex];
                }
              }
            } else {
              // Andere Farben wählen
              const availableWithoutCurrent = outerColors.filter(c => c !== currentColor);
              if (availableWithoutCurrent.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
                newColors[index] = availableWithoutCurrent[randomIndex];
              }
            }
            return newColors;
          }
          
          // Prüfe ob dieser Kreis zu den äußeren Reihen gehört (nur nach dem Klick)
          if (isFading && isOuterRowArea(index)) {
            // Farben von coral bis mint-6 + weiß für äußere Reihen
            // Weiß wird öfter gewählt (60% Wahrscheinlichkeit)
            const outerColors = ['#7dd3c4', '#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4'];
            const currentColor = prevColors[index];
            
            // 60% Chance für weiß, 40% für andere Farben
            if (Math.random() < 0.6) {
              // Weiß wählen
              if (currentColor !== '#ffffff') {
                newColors[index] = '#ffffff';
              } else {
                // Wenn bereits weiß, eine andere Farbe wählen
                const availableWithoutCurrent = outerColors.filter(c => c !== currentColor);
                if (availableWithoutCurrent.length > 0) {
                  const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
                  newColors[index] = availableWithoutCurrent[randomIndex];
                }
              }
            } else {
              // Andere Farben wählen
              const availableWithoutCurrent = outerColors.filter(c => c !== currentColor);
              if (availableWithoutCurrent.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
                newColors[index] = availableWithoutCurrent[randomIndex];
              }
            }
            return newColors;
          }
          
          // Vor dem Klick: Alle Punkte verwenden alle Minttöne + Weiß
          if (!isFading) {
            const allColors = getMintColors();
            const allColorsWithWhite = [...allColors, '#ffffff'];
            const currentColor = prevColors[index];
            const availableWithoutCurrent = allColorsWithWhite.filter(c => c !== currentColor);
            if (availableWithoutCurrent.length > 0) {
              const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
              newColors[index] = availableWithoutCurrent[randomIndex];
            }
            return newColors;
          }
          
          // Nach dem Klick: Spezielle Logik für verschiedene Bereiche
          // Bestimme welche Farben für diese Position verwendet werden sollen
          const allColors = getMintColors();
          const lightest2 = ['#d8f2eb', '#ebf8f4'];
          const lightest3 = ['#c5ebe2', '#d8f2eb', '#ebf8f4'];
          const lightest4 = ['#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4'];
          
          let availableColors: string[];
          
          const isTopRow = row < 10;
          const isBottomRow = row >= rows - 10;
          const isLeftCol = col < 4;
          const isRightCol = col >= cols - 4;
          
          if (isTopRow || isBottomRow || isLeftCol || isRightCol) {
            availableColors = lightest2;
          } else if (row === 10 || row === rows - 11 || col === 4 || col === cols - 5) {
            availableColors = lightest3;
          } else if (row === 11 || row === rows - 12 || col === 5 || col === cols - 6) {
            availableColors = lightest4;
          } else {
            availableColors = allColors;
          }
          
          // Für alle sichtbaren Kreise nach dem Klick: Füge weiß immer hinzu
          const centerIndices = getCenterCircleIndices();
          if (centerIndices.has(index)) {
            // Füge weiß zu den verfügbaren Farben hinzu
            availableColors = [...availableColors, '#ffffff'];
            
            // Für innere Kreise: 30% Chance für Weiß
            if (!isLightColorArea(index) && !isOuterRowArea(index)) {
              if (Math.random() < 0.3) {
                const currentColor = prevColors[index];
                if (currentColor !== '#ffffff') {
                  newColors[index] = '#ffffff';
                  return newColors;
                }
              }
            }
          }
          
          const currentColor = prevColors[index];
          const availableWithoutCurrent = availableColors.filter(c => c !== currentColor);
          if (availableWithoutCurrent.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
            newColors[index] = availableWithoutCurrent[randomIndex];
          }
          return newColors;
        });
      };

      // Erster Wechsel nach initialDelay
      const firstTimer = setTimeout(() => {
        changeColor();

        // Danach regelmäßige Intervalle für diesen Kreis
        const intervalTimer = setInterval(changeColor, baseInterval);
        intervals.push(intervalTimer);
      }, initialDelay);

      timeouts.push(firstTimer);
    }

    return () => {
      timeouts.forEach(timer => clearTimeout(timer));
      intervals.forEach(timer => clearInterval(timer));
    };
  }, [totalCircles, isFading]);

  // Aktualisiere Farben, wenn sich das Theme ändert
  useEffect(() => {
    const updateColors = () => {
      const colors = getMintColors();
      setCircleColors(prevColors => {
        return prevColors.map((oldColor) => {
          const oldIndex = colors.indexOf(oldColor);
          if (oldIndex === -1) {
            // Wenn die alte Farbe nicht mehr existiert, wähle eine zufällige neue
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];
          }
          return colors[oldIndex % colors.length];
        });
      });
    };

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const timeout = setTimeout(updateColors, 100);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const { diameter, gap } = dimensions;
  const containerWidth = cols * diameter + (cols - 1) * gap;
  const containerHeight = rows * diameter + (rows - 1) * gap;

  // Render Punkte mit Portal direkt in body, außerhalb aller Container
  const circlesElement = (
    <div 
      className="circles-container"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${diameter}px)`,
        gridTemplateRows: `repeat(${rows}, ${diameter}px)`,
        gap: `${gap}px`,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 300, // Sehr hoch, damit Punkte über Einführungstext (100) bleiben
        pointerEvents: 'auto', // Erlaube Klicks auf die Punkte
      }}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {Array.from({ length: totalCircles }, (_, index) => {
        const position = circlePositions[index] || { x: 0, y: 0 };
        const isVisible = visibleCircles[index] !== false;
        return (
          <div
            key={index}
            className="circle"
            style={{ 
              width: `${diameter}px`,
              height: `${diameter}px`,
              borderRadius: '50%',
              backgroundColor: circleColors[index],
              transition: isAnimating 
                ? 'none' 
                : 'background-color 1s ease-in-out, opacity 0.5s ease-in-out, transform 0.3s ease-out',
              opacity: isAnimating 
                ? (circleOpacities[index] || 0) 
                : isFading 
                  ? (fadeOutOpacities[index] !== undefined ? fadeOutOpacities[index] : (isVisible ? 1 : 0))
                  : (isVisible ? 1 : 0),
              transform: `translate(${position.x}px, ${position.y}px)`,
              pointerEvents: isVisible ? 'auto' : 'none',
              position: 'relative',
              zIndex: 200,
            }}
          />
        );
      })}
    </div>
  );

  return (
    <>
      {/* Render Punkte mit Portal direkt in body */}
      {typeof document !== 'undefined' && createPortal(circlesElement, document.body)}
      <div 
        className="aufmacher-wrapper"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        style={{ cursor: isFading || isAnimating ? 'default' : 'pointer', position: 'relative' }}
      >
      {/* Render Klick-Button mit Portal direkt in body, damit er über den Punkten liegt */}
      {showClickHint && !isFading && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 400, // Höher als Punkte (300), damit Button darüber liegt
            pointerEvents: 'none',
            textAlign: 'center',
            color: clickHintColor,
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            animation: 'pulse 2s ease-in-out infinite',
            transition: 'color 1.5s ease-in-out, border-color 1.5s ease-in-out',
            opacity: 1,
            visibility: 'visible',
            border: `2px solid ${clickHintColor}`,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '0.5em 1em',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Klicken
        </div>,
        document.body
      )}
      {/* Senkrechter schwarzer Strich zwischen Punkten und Schrift */}
      {showLine && (
        <div
          style={{
            position: 'absolute',
            left: `${textLeft - 32}px`, // Etwas links von der Schrift (2rem = 32px)
            top: '50%',
            transform: 'translateY(-50%)',
            width: '2px',
            height: `${2 * (9 * diameter + 8 * gap)}px`, // Doppelt so lang wie die Höhe der 9 sichtbaren Reihen
            backgroundColor: '#000000',
            zIndex: 40, // Niedriger als Einführungstext (60), damit er verdeckt wird
            pointerEvents: 'none',
            opacity: showLine ? 1 : 0,
            transition: 'opacity 0.5s ease-in',
          }}
        />
      )}
      <div 
        className="aufmacher-name"
        style={{
          position: 'absolute',
          left: `${textLeft}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          width: textWidth,
          maxWidth: `calc(100vw - ${textLeft}px - 16px)`, // Sicherstellen, dass Text nicht über Rand hinausgeht
          color: '#000000',
          pointerEvents: 'none',
          zIndex: 40, // Niedriger als Einführungstext (60), damit er verdeckt wird
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          opacity: 1, // Position bleibt fest, Text-Inhalt wird animiert
          visibility: 'visible', // Position bleibt fest
          backgroundColor: 'transparent',
          boxSizing: 'border-box',
          paddingRight: '16px', // Padding rechts für Sicherheit
        }}
      >
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 'clamp(1.92rem, 4.8vw, 3.84rem)',
            fontWeight: 400,
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            color: '#000000',
            textShadow: 'none',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            minHeight: '1.2em', // Feste Höhe, damit Position nicht springt
            height: '1.2em', // Feste Höhe
          }}
        >
          {typingText.line1}
          {typingText.line1 && typingText.line1.length < 'Benjamin Borth'.length && (
            <span style={{ opacity: 0.5 }}>|</span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 'clamp(1.188rem, 2.64vw, 1.584rem)',
            fontWeight: 200,
            letterSpacing: '0.02em',
            marginTop: '0.25rem',
            marginLeft: '0.15em',
            lineHeight: 1.4,
            color: '#000000',
            textShadow: 'none',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            minHeight: '1.4em', // Feste Höhe, damit Position nicht springt
            height: '1.4em', // Feste Höhe
          }}
        >
          {typingText.line2}
          {typingText.line2 && typingText.line2.length < 'Heilpraktiker für Psychotherapie'.length && (
            <span style={{ opacity: 0.5 }}>|</span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 'clamp(1.188rem, 2.64vw, 1.584rem)',
            fontWeight: 200,
            letterSpacing: '0.02em',
            marginLeft: '0.15em',
            lineHeight: 1.4,
            color: '#000000',
            textShadow: 'none',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            minHeight: '1.4em', // Feste Höhe, damit Position nicht springt
            height: '1.4em', // Feste Höhe
          }}
        >
          {typingText.line3}
          {typingText.line3 && typingText.line3.length < 'und Hypnosetherapeut'.length && (
            <span style={{ opacity: 0.5 }}>|</span>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default Aufmacher
