import {
  applyPreset,
  calculateTire,
  tirePresets,
  type TirePresetName,
  type TireSpec,
} from './calculations';

type ControlsPanelProps = {
  spec: TireSpec;
  onChange: (spec: TireSpec) => void;
};

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
};

function Slider({ label, value, min, max, step, unit, onChange }: SliderProps) {
  return (
    <label className="control">
      <span className="control__label">{label}</span>
      <span className="control__inputs">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="number-field">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          {unit ? <span>{unit}</span> : null}
        </span>
      </span>
    </label>
  );
}

function formatMm(value: number) {
  return `${Math.round(value)} mm`;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatSignedPercent(value: number) {
  const rounded = Math.round(value * 100);

  return rounded > 0 ? `+${rounded}%` : `${rounded}%`;
}

export default function ControlsPanel({ spec, onChange }: ControlsPanelProps) {
  const calculations = calculateTire(spec);

  const setSpec = (patch: Partial<TireSpec>) => {
    onChange({ ...spec, ...patch });
  };

  return (
    <section className="panel" aria-label="Tire controls and measurements">
      <div className="preset-row" role="group" aria-label="Tire profile presets">
        {tirePresets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className={spec.preset === preset.name ? 'preset preset--active' : 'preset'}
            onClick={() => onChange(applyPreset(spec, preset.name as TirePresetName))}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="controls-grid">
        <Slider
          label="Tire width"
          min={155}
          max={405}
          step={10}
          value={spec.widthMm}
          unit="mm"
          onChange={(widthMm) => setSpec({ widthMm })}
        />
        <Slider
          label="Aspect ratio"
          min={25}
          max={85}
          step={5}
          value={spec.aspectRatio}
          unit="%"
          onChange={(aspectRatio) => setSpec({ aspectRatio })}
        />
        <Slider
          label="Rim diameter"
          min={13}
          max={24}
          step={1}
          value={spec.rimDiameterIn}
          unit="in"
          onChange={(rimDiameterIn) => setSpec({ rimDiameterIn })}
        />
        <Slider
          label="Wheel width"
          min={4.5}
          max={14}
          step={0.5}
          value={spec.wheelWidthIn}
          unit="in"
          onChange={(wheelWidthIn) => setSpec({ wheelWidthIn })}
        />
        <Slider
          label="Shoulder roundness"
          min={0}
          max={1}
          step={0.01}
          value={spec.shoulderRoundness}
          onChange={(shoulderRoundness) => setSpec({ shoulderRoundness, preset: spec.preset })}
        />
        <Slider
          label="Sidewall bulge"
          min={0}
          max={1}
          step={0.01}
          value={spec.sidewallBulge}
          onChange={(sidewallBulge) => setSpec({ sidewallBulge, preset: spec.preset })}
        />
      </div>

      <dl className="metrics">
        <div>
          <dt>Sidewall height</dt>
          <dd>{formatMm(calculations.sidewallMm)}</dd>
        </div>
        <div>
          <dt>Overall diameter</dt>
          <dd>{formatMm(calculations.overallDiameterMm)}</dd>
        </div>
        <div>
          <dt>Overall diameter Δ</dt>
          <dd>{formatSignedPercent(calculations.overallDiameterDelta)}</dd>
        </div>
        <div>
          <dt>Meat index</dt>
          <dd>{formatPercent(calculations.meatIndex)}</dd>
        </div>
        <div>
          <dt>Width / diameter</dt>
          <dd>{formatPercent(calculations.widthToHeight)}</dd>
        </div>
        <div>
          <dt>Tire / wheel width</dt>
          <dd>{Math.round(calculations.tireToWheelWidthRatio)} mm/in</dd>
        </div>
      </dl>
    </section>
  );
}
