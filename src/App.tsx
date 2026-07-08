import { FormEvent, useEffect, useState } from 'react';
import ControlsPanel from './ControlsPanel';
import TireVisualizer from './TireVisualizer';
import { defaultSpec, type TireSpec } from './calculations';

function formatTireSize(spec: TireSpec) {
  return `${spec.widthMm}/${spec.aspectRatio}r${spec.rimDiameterIn}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseTireSize(value: string) {
  const match = value.trim().match(/^(\d{3})\s*\/\s*(\d{2})\s*r\s*(\d{2})$/i);

  if (!match) {
    return null;
  }

  return {
    widthMm: clamp(Number(match[1]), 155, 405),
    aspectRatio: clamp(Number(match[2]), 25, 85),
    rimDiameterIn: clamp(Number(match[3]), 13, 24),
  };
}

export default function App() {
  const [spec, setSpec] = useState<TireSpec>(defaultSpec);
  const [tireSizeInput, setTireSizeInput] = useState(formatTireSize(defaultSpec));

  useEffect(() => {
    setTireSizeInput(formatTireSize(spec));
  }, [spec.widthMm, spec.aspectRatio, spec.rimDiameterIn]);

  const applyTireSizeInput = () => {
    const parsed = parseTireSize(tireSizeInput);

    if (!parsed) {
      setTireSizeInput(formatTireSize(spec));
      return;
    }

    setSpec((currentSpec) => ({
      ...currentSpec,
      ...parsed,
    }));
  };

  const handleTireSizeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyTireSizeInput();
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Tire fitment</p>
          <form className="tire-size-form" onSubmit={handleTireSizeSubmit}>
            <input
              aria-label="Tire size"
              className="tire-size-input"
              inputMode="text"
              spellCheck={false}
              value={tireSizeInput}
              onBlur={applyTireSizeInput}
              onChange={(event) => setTireSizeInput(event.target.value)}
            />
          </form>
        </div>
        <div className="size-pill">{spec.wheelWidthIn}" wheel</div>
      </header>

      <TireVisualizer spec={spec} />
      <ControlsPanel spec={spec} onChange={setSpec} />
    </main>
  );
}
