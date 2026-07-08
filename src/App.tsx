import { useState } from 'react';
import ControlsPanel from './ControlsPanel';
import TireVisualizer from './TireVisualizer';
import { defaultSpec, type TireSpec } from './calculations';

export default function App() {
  const [spec, setSpec] = useState<TireSpec>(defaultSpec);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Meaty Tires</p>
          <h1>
            {spec.widthMm}/{spec.aspectRatio}R{spec.rimDiameterIn}
          </h1>
        </div>
        <div className="size-pill">{spec.wheelWidthIn}" wheel</div>
      </header>

      <TireVisualizer spec={spec} />
      <ControlsPanel spec={spec} onChange={setSpec} />
    </main>
  );
}
