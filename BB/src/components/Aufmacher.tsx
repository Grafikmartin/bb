import { useState, useEffect } from 'react'
import '../App.css'

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
      return { diameter: 50, gap: 5, cols: 24, rows: 19 };
    }
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Berechne wie viele Kreise in die Breite passen (100vw)
    // cols * diameter + (cols-1) * gap = viewportWidth
    // gap = 0.1 * diameter
    // cols * d + (cols-1) * 0.1 * d = viewportWidth
    // d * (cols + 0.1 * (cols-1)) = viewportWidth
    
    // Wir starten mit einem geschätzten Durchmesser und passen dann an
    // Ziel: möglichst viele Kreise, aber mindestens baseCols + 4
    let estimatedDiameter = viewportWidth / (baseCols + 4 + 0.1 * (baseCols + 3));
    let cols = Math.floor((viewportWidth + 0.1 * estimatedDiameter) / (estimatedDiameter * 1.1));
    cols = Math.max(cols, baseCols + 4); // Mindestens baseCols + 4
    
    // Berechne tatsächlichen Durchmesser basierend auf cols
    const diameter = viewportWidth / (cols + 0.1 * (cols - 1));
    const gap = diameter * 0.1;
    
    // Berechne wie viele Reihen in die Höhe passen (100vh)
    // rows * diameter + (rows-1) * gap = viewportHeight
    let rows = Math.floor((viewportHeight + gap) / (diameter + gap));
    rows = Math.max(rows, baseRows + 10); // Mindestens baseRows + 10
    
    return { diameter, gap, cols, rows };
  };
  
  const [dimensions, setDimensions] = useState(() => getCircleDimensions());
  const { cols, rows } = dimensions;
  const totalCircles = cols * rows;


  // Initiale Farben müssen nach dimensions berechnet werden
  const getInitialColors = (): string[] => {
    const allColors = getMintColors();
    const lightest2 = ['#d8f2eb', '#ebf8f4'];
    const lightest3 = ['#c5ebe2', '#d8f2eb', '#ebf8f4'];
    const lightest4 = ['#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4'];
    
    return Array.from({ length: totalCircles }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      let availableColors: string[];
      
      const isTopRow = row < 5;
      const isBottomRow = row >= rows - 5;
      const isLeftCol = col < 2;
      const isRightCol = col >= cols - 2;
      
      if (isTopRow || isBottomRow || isLeftCol || isRightCol) {
        availableColors = lightest2;
      } else if (row === 5 || row === rows - 6 || col === 2 || col === cols - 3) {
        availableColors = lightest3;
      } else if (row === 6 || row === rows - 7 || col === 3 || col === cols - 4) {
        availableColors = lightest4;
      } else {
        availableColors = allColors;
      }
      
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      return availableColors[randomIndex];
    });
  };

  const [circleColors, setCircleColors] = useState<string[]>(getInitialColors);
  const [isAnimating, setIsAnimating] = useState(true);
  const [circlePositions, setCirclePositions] = useState<Array<{x: number, y: number}>>(() => {
    return Array.from({ length: totalCircles }, () => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
  });

  // Aktualisiere Dimensionen bei Fenstergrößenänderung
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getCircleDimensions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Aktualisiere circlePositions wenn sich totalCircles ändert
  useEffect(() => {
    if (isAnimating) {
      setCirclePositions(Array.from({ length: totalCircles }, () => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      })));
    }
  }, [totalCircles, isAnimating]);

  // Bienen-Animation: Kreise bewegen sich chaotisch für 3 Sekunden, dann zur richtigen Position
  useEffect(() => {
    if (!isAnimating) return;

    const animationDuration = 3000; // 3 Sekunden
    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (progress < 1) {
        // Während der Animation: chaotische Bewegung (wie Bienen im Nest)
        setCirclePositions(prevPositions => {
          return prevPositions.map((pos, index) => {
            // Zufällige Bewegung mit abnehmender Intensität
            // Easing: schneller Start, langsameres Ende
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const intensity = (1 - easeOut) * 80; // Von 80px auf 0px
            
            // Zufällige Bewegung in alle Richtungen
            const randomX = (Math.random() - 0.5) * intensity * 2;
            const randomY = (Math.random() - 0.5) * intensity * 2;
            
            // Leichte Tendenz zur Mitte (wie Bienen die zum Nest zurückkehren)
            const centerPull = easeOut * 0.2;
            return {
              x: (pos.x || 0) * (1 - centerPull) + randomX,
              y: (pos.y || 0) * (1 - centerPull) + randomY,
            };
          });
        });
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Nach 3 Sekunden: alle Kreise an ihre richtige Position (0, 0)
        setCirclePositions(Array.from({ length: totalCircles }, () => ({ x: 0, y: 0 })));
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAnimating, totalCircles]);

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
          
          // Bestimme welche Farben für diese Position verwendet werden sollen
          const allColors = getMintColors();
          const lightest2 = ['#d8f2eb', '#ebf8f4'];
          const lightest3 = ['#c5ebe2', '#d8f2eb', '#ebf8f4'];
          const lightest4 = ['#a0dfd1', '#c5ebe2', '#d8f2eb', '#ebf8f4'];
          
          let availableColors: string[];
          
          const isTopRow = row < 5;
          const isBottomRow = row >= rows - 5;
          const isLeftCol = col < 2;
          const isRightCol = col >= cols - 2;
          
          if (isTopRow || isBottomRow || isLeftCol || isRightCol) {
            availableColors = lightest2;
          } else if (row === 5 || row === rows - 6 || col === 2 || col === cols - 3) {
            availableColors = lightest3;
          } else if (row === 6 || row === rows - 7 || col === 3 || col === cols - 4) {
            availableColors = lightest4;
          } else {
            availableColors = allColors;
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
  }, [totalCircles]);

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
    <div className="aufmacher-wrapper">
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
                opacity: isAnimating ? 0 : 1,
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Aufmacher
