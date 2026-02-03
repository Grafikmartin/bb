import { useState, useEffect } from 'react'
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
  const [circleOpacities, setCircleOpacities] = useState<number[]>(() => {
    return Array.from({ length: totalCircles }, () => 0); // Starten mit opacity 0
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
  
  useEffect(() => {
    const calculateTextPosition = () => {
      if (typeof window === 'undefined') return;
      const viewportWidth = window.innerWidth;
      const containerWidth = cols * dimensions.diameter + (cols - 1) * dimensions.gap;
      const containerLeft = (viewportWidth - containerWidth) / 2;
      const viewport49vw = viewportWidth * 0.49;
      const offset7vw = viewportWidth * 0.07; // 7vw nach links (10vw - 3vw)
      setTextLeft(viewport49vw - containerLeft - offset7vw);
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
    const centerIndices = getCenterCircleIndices();
    
    // Sammle alle Indizes, die verschwinden sollen
    const fadeIndices: number[] = [];
    for (let i = 0; i < totalCircles; i++) {
      if (!centerIndices.has(i)) {
        fadeIndices.push(i);
      }
    }
    
    // Jeder Kreis bekommt eine zufällige Verzögerung (0 bis 1,5 Sekunden)
    // und wechselt dann in 1 Sekunde zu weiß mit weichem Übergang
    const maxDelay = 1500; // Maximal 1,5 Sekunden Verzögerung
    const fadeDuration = 1000; // 1 Sekunde zum Weiß wechseln (weicher)
    
    fadeIndices.forEach((index) => {
      const delay = Math.random() * maxDelay;
      
      setTimeout(() => {
        // Starte den Fade zu weiß für diesen Kreis
        const startTime = Date.now();
        const fadeSteps = 40; // Mehr Schritte für weicheren Übergang
        const stepDuration = fadeDuration / fadeSteps;
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
          setCircleColors(prevColors => {
            const newColors = [...prevColors];
            const color = prevColors[index];
            
            // Berechne Fade-Progress (0 = original, 1 = weiß)
            let progress = currentStep / fadeSteps;
            
            // Easing-Funktion für weicheren Übergang (ease-in-out)
            progress = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            // Konvertiere Hex zu RGB
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            // Interpoliere zu weiß (255, 255, 255)
            const newR = Math.round(r + (255 - r) * progress);
            const newG = Math.round(g + (255 - g) * progress);
            const newB = Math.round(b + (255 - b) * progress);
            
            // Konvertiere zurück zu Hex
            const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
            
            newColors[index] = newColor;
            return newColors;
          });
          
          currentStep++;
          
          if (currentStep > fadeSteps) {
            clearInterval(fadeInterval);
          }
        }, stepDuration);
      }, delay);
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
    }, maxDelay + fadeDuration);
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
            // Nur hellste Farben für spezielle Bereiche
            const lightestColors = ['#d8f2eb', '#ebf8f4']; // --color-mint-5 und --color-mint-6
            const currentColor = prevColors[index];
            const availableWithoutCurrent = lightestColors.filter(c => c !== currentColor);
            if (availableWithoutCurrent.length > 0) {
              const randomIndex = Math.floor(Math.random() * availableWithoutCurrent.length);
              newColors[index] = availableWithoutCurrent[randomIndex];
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
          
          // Für innere Kreise (nach dem Klick): Füge weiß mit 1:4 Wahrscheinlichkeit hinzu
          const centerIndices = getCenterCircleIndices();
          if (centerIndices.has(index) && !isLightColorArea(index) && !isOuterRowArea(index)) {
            // 1:4 Verhältnis = 25% Chance für weiß
            if (Math.random() < 0.25) {
              // Füge weiß zu den verfügbaren Farben hinzu
              availableColors = [...availableColors, '#ffffff'];
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

  return (
    <div 
      className="aufmacher-wrapper"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      style={{ cursor: isFading || isAnimating ? 'default' : 'pointer', position: 'relative' }}
    >
      {showClickHint && !isFading && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            pointerEvents: 'none',
            textAlign: 'center',
            color: 'var(--text-primary, #000000)',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            fontWeight: 300,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          Klicken
        </div>
      )}
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
        }}
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
                opacity: isAnimating ? (circleOpacities[index] || 0) : (isVisible ? 1 : 0),
                transform: `translate(${position.x}px, ${position.y}px)`,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            />
          );
        })}
      </div>
      <div 
        className="aufmacher-name"
        style={{
          position: 'absolute',
          left: `${textLeft}px`, // Genau 49vw vom linken Rand des Viewports
          top: '50%',
          transform: 'translateY(-50%)',
          width: '30vw', // 30vw Breite
          color: '#000000',
          pointerEvents: 'none',
          zIndex: 10000, // Sehr hoher z-index
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          opacity: 1,
          visibility: 'visible',
          backgroundColor: 'transparent',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
            fontWeight: 400,
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            color: '#000000',
            textShadow: 'none',
            textAlign: 'left',
            whiteSpace: 'nowrap',
          }}
        >
          Benjamin Borth
        </div>
        <div
          style={{
            fontSize: 'clamp(0.99rem, 2.2vw, 1.32rem)',
            fontWeight: 200,
            letterSpacing: '0.02em',
            marginTop: '0.25rem',
            lineHeight: 1.4,
            color: '#000000',
            textShadow: 'none',
            textAlign: 'left',
            whiteSpace: 'nowrap',
          }}
        >
          Heilpraktiker für Psychotherapie
        </div>
        <div
          style={{
            fontSize: 'clamp(0.99rem, 2.2vw, 1.32rem)',
            fontWeight: 200,
            letterSpacing: '0.02em',
            lineHeight: 1.4,
            color: '#000000',
            textShadow: 'none',
            textAlign: 'left',
          }}
        >
          und Hypnosetherapeut
        </div>
      </div>
    </div>
  );
}

export default Aufmacher
