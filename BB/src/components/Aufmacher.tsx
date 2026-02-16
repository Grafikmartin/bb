import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../App.css'
import './Aufmacher.css'

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

/** Farbpalette für die Kreise (20×9) mit Transparenz: coral 10%, sky 20%, gold 30%, #d8f2eb 40%, #ebf8f4 50% */
const getCircleMintColors = (): string[] => [
  'rgba(77, 195, 181, 1)',       /* signal, deckend */
  'rgba(125, 211, 196, 0.9)',     /* coral, 10% transparent */
  'rgba(160, 223, 209, 0.8)',     /* sky, 20% transparent */
  'rgba(197, 235, 226, 0.7)',     /* gold, 30% transparent */
  'rgba(216, 242, 235, 0.6)',     /* #d8f2eb, 40% transparent */
  'rgba(235, 248, 244, 0.5)',     /* #ebf8f4, 50% transparent */
];

/** Name der Person */
const NAME = 'Benjamin Borth';
/** Titel (Heilpraktiker für …) – in zwei Zeilen */
const TITLE_LINE1 = 'Heilpraktiker für Psychotherapie';
const TITLE_LINE2 = 'und Hypnosetherapeut';

const COLS = 20;
const ROWS = 9;
const TOTAL_CIRCLES = COLS * ROWS;

// Kreise von 10vw bis 44vw → Breite 34vw
const CIRCLES_WIDTH_VW = 34;
const DIAMETER_VW = CIRCLES_WIDTH_VW / (COLS + 0.1 * (COLS - 1));
const GAP_VW = DIAMETER_VW * 0.1;

function isLightColorArea(index: number): boolean {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const relCol = col + 1;
  const relRow = row;
  if (relRow === 0 && relCol >= 1 && relCol <= 7) return true;
  if (relRow === 1 && relCol >= 1 && relCol <= 5) return true;
  if (relRow === 2 && relCol >= 1 && relCol <= 5) return true;
  if (relRow === 0 && relCol === 20) return true;
  if (relCol === 20 && relRow >= 3 && relRow <= 8) return true;
  if (relCol === 19 && relRow >= 7 && relRow <= 8) return true;
  if (relCol === 18 && relRow >= 7 && relRow <= 8) return true;
  if (relCol === 17 && relRow === 8) return true;
  if (relCol === 1 && relRow >= 3 && relRow <= 5) return true;
  if (relCol === 2 && relRow === 4) return true;
  if (relCol === 3 && relRow === 4) return true;
  if (relRow === 0 && relCol >= 9 && relCol <= 13) return true;
  return false;
}

function isOuterRowArea(index: number): boolean {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const relCol = col + 1;
  const relRow = row;
  if (relRow === 0 || relRow === 1 || relRow === 7 || relRow === 8) return true;
  if (relCol === 1 || relCol === 2 || relCol === 19 || relCol === 20) return true;
  return false;
}

function isOutermostArea(index: number): boolean {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const relCol = col + 1;
  const relRow = row;
  if (relRow === 0 || relRow === 8) return true;
  if (relCol === 1 || relCol === 20) return true;
  return false;
}

function getInitialColors(): string[] {
  const circleColors = getCircleMintColors();
  const lightestColors = [circleColors[4], circleColors[5]]; /* 40% und 50% transparent */
  const outerColors = circleColors.slice(1); /* coral … ebf8f4 mit Transparenz */
  const allColorsWithWhite = [...circleColors, 'transparent'];

  return Array.from({ length: TOTAL_CIRCLES }, (_, index) => {
    if (isLightColorArea(index)) {
      return lightestColors[Math.floor(Math.random() * lightestColors.length)];
    }
    if (isOutermostArea(index)) {
      return Math.random() < 0.85 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)];
    }
    if (isOuterRowArea(index)) {
      return Math.random() < 0.6 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)];
    }
    return allColorsWithWhite[Math.floor(Math.random() * allColorsWithWhite.length)];
  });
}

function Aufmacher() {
  const [circleColors, setCircleColors] = useState(getInitialColors);
  const [visibleCount, setVisibleCount] = useState({ name: 0, titleLine1: 0, titleLine2: 0 });

  useEffect(() => {
    const BASE_MS = 120; /* ca. halbe Geschwindigkeit, menschlich lesbar */
    let tid: ReturnType<typeof setTimeout>;
    const typeNext = (line: 'name' | 'titleLine1' | 'titleLine2', idx: number) => {
      const char =
        line === 'name' ? NAME[idx] :
        line === 'titleLine1' ? TITLE_LINE1[idx] :
        TITLE_LINE2[idx];
      const afterSpace = char === ' ';
      const afterPunctuation = /[.,;:!?]/.test(char || '');
      let extra = 0;
      if (afterSpace) extra = 40 + Math.random() * 50;
      else if (afterPunctuation) extra = 80 + Math.random() * 100;
      const vary = (Math.random() - 0.5) * 80;
      const delay = Math.max(50, BASE_MS + vary + extra);
      tid = setTimeout(() => {
        setVisibleCount(prev => ({ ...prev, [line]: idx + 1 }));
        if (line === 'name') {
          if (idx + 1 < NAME.length) typeNext('name', idx + 1);
          else {
            const pause = 150 + Math.random() * 100;
            tid = setTimeout(() => typeNext('titleLine1', 0), pause);
          }
        } else if (line === 'titleLine1') {
          if (idx + 1 < TITLE_LINE1.length) typeNext('titleLine1', idx + 1);
          else {
            const pause = 120 + Math.random() * 80;
            tid = setTimeout(() => typeNext('titleLine2', 0), pause);
          }
        } else if (line === 'titleLine2' && idx + 1 < TITLE_LINE2.length) {
          typeNext('titleLine2', idx + 1);
        }
      }, delay);
    };
    /* Start nach Ende der Strich-Animation (1.2s) */
    const LINE_ANIMATION_MS = 1200;
    tid = setTimeout(() => typeNext('name', 0), LINE_ANIMATION_MS + (Math.random() - 0.5) * 100);
    return () => clearTimeout(tid);
  }, []);

  useEffect(() => {
    const updateColors = () => {
      const colors = getMintColors();
      setCircleColors(prevColors =>
        prevColors.map((oldColor) => {
          const i = colors.indexOf(oldColor);
          return i === -1 ? colors[Math.floor(Math.random() * colors.length)] : colors[i % colors.length];
        })
      );
    };
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const t = setTimeout(updateColors, 100);
    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const changeColor = (index: number) => {
      setCircleColors(prev => {
        const newColors = [...prev];
        const circleColors = getCircleMintColors();
        const lightestColors = [circleColors[4], circleColors[5]];
        const outerColors = circleColors.slice(1);
        const withWhite = [...circleColors, 'transparent'];

        if (isLightColorArea(index)) {
          newColors[index] = Math.random() < 0.2 ? 'transparent' : lightestColors[Math.floor(Math.random() * lightestColors.length)];
          return newColors;
        }
        if (isOutermostArea(index)) {
          newColors[index] = Math.random() < 0.85 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)];
          return newColors;
        }
        if (isOuterRowArea(index)) {
          newColors[index] = Math.random() < 0.6 ? 'transparent' : outerColors[Math.floor(Math.random() * outerColors.length)];
          return newColors;
        }
        newColors[index] = Math.random() < 0.3 ? 'transparent' : withWhite[Math.floor(Math.random() * withWhite.length)];
        return newColors;
      });
    };

    for (let index = 0; index < TOTAL_CIRCLES; index++) {
      const baseInterval = 1500 + Math.random() * 2500;
      const initialDelay = Math.random() * 2000;
      const first = setTimeout(() => {
        changeColor(index);
        intervals.push(setInterval(() => changeColor(index), baseInterval));
      }, initialDelay + index * 30);
      timeouts.push(first);
    }

    return () => {
      timeouts.forEach(t => clearTimeout(t));
      intervals.forEach(i => clearInterval(i));
    };
  }, []);

  const circlesElement = (
    <div
      className="circles-container"
      style={{
        width: `${CIRCLES_WIDTH_VW}vw`,
        height: `calc(${ROWS} * ${DIAMETER_VW}vw + ${ROWS - 1} * ${GAP_VW}vw)`,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${DIAMETER_VW}vw)`,
        gridTemplateRows: `repeat(${ROWS}, ${DIAMETER_VW}vw)`,
        gap: `${GAP_VW}vw`,
        position: 'fixed',
        top: '50%',
        left: 'var(--content-start, 10vw)',
        transform: 'translateY(-50%)',
        zIndex: 400,
      }}
    >
      {Array.from({ length: TOTAL_CIRCLES }, (_, index) => (
        <div
          key={index}
          className="circle"
          style={{
            width: `${DIAMETER_VW}vw`,
            height: `${DIAMETER_VW}vw`,
            borderRadius: '50%',
            backgroundColor: circleColors[index] || getCircleMintColors()[0],
            transition: 'background-color 1s ease-in-out',
          }}
        />
      ))}
    </div>
  );

  const lineHeightVw = 2 * (ROWS * DIAMETER_VW + (ROWS - 1) * GAP_VW);
  const lineElement = typeof document !== 'undefined' && createPortal(
    <div
      className="aufmacher-line"
      style={{
        position: 'fixed',
        left: 'calc(47vw - 1px)',
        top: '50%',
        transform: 'translateY(-50%)',
        transformOrigin: 'center center',
        width: '2px',
        height: `${lineHeightVw}vw`,
        backgroundColor: '#000000',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    />,
    document.body
  );

  const textElement = typeof document !== 'undefined' && createPortal(
    <div
      className="aufmacher-heading"
      style={{
        position: 'fixed',
        left: '50vw',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        minHeight: '5.5em',
        width: 'min(40vw, calc(100vw - 50vw - 24px))',
        maxWidth: 'calc(100vw - 50vw - 24px)',
        boxSizing: 'border-box',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: '#000000',
        /* Proportional wie Kreise: rein vw-basiert, skaliert mit Fensterbreite */
        fontSize: '4vw',
      }}
    >
      <div className="aufmacher-name" style={{ width: '100%', maxWidth: '100%', fontSize: '1em', fontWeight: 400, letterSpacing: '0.05em', lineHeight: 1.2, textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {visibleCount.name === 0 && visibleCount.name < NAME.length && (
          <span className="aufmacher-cursor">|</span>
        )}
        {NAME.split('').map((char, i) => (
          <span key={`name-${i}`}>
            <span style={{ visibility: i < visibleCount.name ? 'visible' : 'hidden' }}>{char}</span>
            {i === visibleCount.name - 1 && visibleCount.name > 0 && visibleCount.name < NAME.length && (
              <span className="aufmacher-cursor">|</span>
            )}
          </span>
        ))}
      </div>
      <div className="aufmacher-title" style={{ width: '100%', maxWidth: '100%', fontSize: '0.55em', fontWeight: 200, letterSpacing: '0.02em', marginTop: '0.25em', marginLeft: '0.15em', lineHeight: 1.4, textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {visibleCount.name >= NAME.length && visibleCount.titleLine1 === 0 && (
          <span className="aufmacher-cursor">|</span>
        )}
        {TITLE_LINE1.split('').map((char, i) => (
          <span key={`t1-${i}`}>
            <span style={{ visibility: i < visibleCount.titleLine1 ? 'visible' : 'hidden' }}>{char}</span>
            {i === visibleCount.titleLine1 - 1 && visibleCount.titleLine1 > 0 && visibleCount.titleLine1 < TITLE_LINE1.length && (
              <span className="aufmacher-cursor">|</span>
            )}
          </span>
        ))}
      </div>
      <div className="aufmacher-title" style={{ width: '100%', maxWidth: '100%', fontSize: '0.55em', fontWeight: 200, letterSpacing: '0.02em', marginLeft: '0.15em', lineHeight: 1.4, textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {visibleCount.titleLine1 >= TITLE_LINE1.length && visibleCount.titleLine2 === 0 && (
          <span className="aufmacher-cursor">|</span>
        )}
        {TITLE_LINE2.split('').map((char, i) => (
          <span key={`t2-${i}`}>
            <span style={{ visibility: i < visibleCount.titleLine2 ? 'visible' : 'hidden' }}>{char}</span>
            {i === visibleCount.titleLine2 - 1 && visibleCount.titleLine2 > 0 && visibleCount.titleLine2 < TITLE_LINE2.length && (
              <span className="aufmacher-cursor">|</span>
            )}
          </span>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {typeof document !== 'undefined' && createPortal(circlesElement, document.body)}
      {lineElement}
      {textElement}
      <div className="aufmacher-wrapper" style={{ position: 'relative' }} />
    </>
  );
}

export default Aufmacher;
