# Tire Fitment Visualizer

A small browser-based 3D tire and wheel visualizer. Enter tire and wheel specs, adjust sidewall shape controls, and the parametric model updates live.

## ✨ Features

- Procedural 3D tire generated from tire/wheel inputs
- Live sliders and numeric inputs
- UHP, Touring, and Slick profile presets
- Left-to-right drag rotation
- Live fitment calculations
- Mobile-friendly layout

## 🧮 Calculations

Given a tire size like `245/55R18`:

```txt
sidewall_mm = width_mm * aspect_ratio / 100
rim_diameter_mm = rim_diameter_in * 25.4
overall_diameter_mm = rim_diameter_mm + 2 * sidewall_mm
meat_index = (2 * sidewall_mm) / overall_diameter_mm
width_to_height = width_mm / overall_diameter_mm
tire_to_wheel_width_ratio = width_mm / wheel_width_in
```

The UI displays:

- Sidewall height
- Overall diameter
- Meat index
- Width / overall diameter
- Tire width / wheel width

## 🛞 3D Model

The tire is generated procedurally by revolving a 2D cross-section with Three.js `LatheGeometry`. The cross-section changes based on tire width, wheel width, shoulder roundness, and sidewall bulge.

The model is a visual approximation, not a physically exact tire simulation.

## 🧰 Stack

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- Plain CSS

## 🚀 Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

See [PLAN.md](https://github.com/dmitriyzov/tire-fitment-visualizer/blob/main/PLAN.md) for the original project outline.
