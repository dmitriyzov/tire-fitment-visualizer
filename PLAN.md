Create a mobile-friendly web app called “Meaty Tires.”

Goal:
A browser-based 3D wheel+tire visualizer where the user can enter tire/wheel specs and see a simple parametric 3D model update in real time.

Tech stack:
- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- Plain CSS or Tailwind, whichever is simpler

Core UI:
- Large 3D viewport at top
- Sliders/inputs below for:
  - Tire width, mm
  - Aspect ratio
  - Wheel/rim diameter, inches
  - Wheel width, inches
  - Shoulder roundness (can be in v2)
  - Sidewall bulge (can be in v2)
- Preset tire profiles:
  - UHP: squarer shoulder, moderate bulge
  - Touring: rounded shoulder, more bulge (can be in v2)
  - Slick: very square shoulder, minimal tread detail (can be in v2)
- Allow drag left/right to rotate the model

Calculations:
Given tire size like 245/55R18:
- sidewall_mm = width_mm * aspect_ratio / 100
- rim_diameter_mm = rim_diameter_in * 25.4
- overall_diameter_mm = rim_diameter_mm + 2 * sidewall_mm
- meat_index = (2 * sidewall_mm) / overall_diameter_mm
- width_to_height = width_mm / overall_diameter_mm
- tire_to_wheel_width_ratio = width_mm / wheel_width_in

Display these results:
- Sidewall height, mm
- Overall diameter, mm
- Meat index as %
- Width / overall diameter as %
- Tire width / wheel width as mm/in

3D model requirements:
- Generate the tire procedurally, not from a static model.
- Use LatheGeometry or custom mesh generation by revolving a 2D tire cross-section around the center axis.
- Model should include:
  - tire outer surface
  - rim opening
  - simple wheel/rim cylinder
  - simple sidewall shape
- Sidewall shape should respond to:
  - shoulder roundness
  - sidewall bulge
  - tire width vs wheel width
- It does not need to be physically perfect, but it should visually communicate:
  - flat vertical sidewall
  - rounded balloon sidewall
  - stretched sidewall
  - square shoulder
- Use neutral colors:
  - black/dark tire
  - silver/gunmetal wheel
- Add basic lighting and orbit controls.

Important implementation details:
- Keep the app simple and readable.
- Prioritize working functionality over perfect realism.
- Use clean components:
  - App.tsx
  - TireVisualizer.tsx
  - ControlsPanel.tsx
  - calculations.ts
  - tireGeometry.ts
- Add comments explaining the formulas and geometry generation.
- Make the layout work well on iPhone-sized screens.
- No backend.
- No authentication.
- No external APIs.

Default setup:
- Tire: 245/55R18
- Wheel width: 8.5"
- Shoulder profile: UHP

Acceptance criteria:
- I can change width/aspect/wheel diameter/wheel width and the 3D model updates.
- I can rotate the wheel/tire left-right with touch/mouse.
- The calculated values update live.
- The model visibly changes when I adjust shoulder roundness and bulge.
- The app runs locally with npm install and npm run dev.
