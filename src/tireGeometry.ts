import * as THREE from 'three';
import { calculateTire, type TireSpec } from './calculations';

export type TireGeometrySet = {
  tireGeometry: THREE.BufferGeometry;
  wheelGeometry: THREE.BufferGeometry;
  rimOpeningRadius: number;
  overallRadius: number;
  tireWidth: number;
  wheelWidth: number;
};

type ProfilePoint = {
  x: number;
  r: number;
};

const MM_TO_SCENE = 1 / 180;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createTireGeometry(spec: TireSpec): TireGeometrySet {
  const values = calculateTire(spec);
  const tireWidth = spec.widthMm * MM_TO_SCENE;
  const wheelWidth = spec.wheelWidthIn * 25.4 * MM_TO_SCENE;
  const overallRadius = (values.overallDiameterMm / 2) * MM_TO_SCENE;
  const rimOpeningRadius = (values.rimDiameterMm / 2) * MM_TO_SCENE;
  const sidewallHeight = Math.max(0.08, overallRadius - rimOpeningRadius);

  const tireHalfWidth = tireWidth / 2;
  const wheelHalfWidth = wheelWidth / 2;
  const widthDelta = tireHalfWidth - wheelHalfWidth;
  const stretch = clamp((wheelWidth - tireWidth) / tireWidth, 0, 0.35);
  const bulge = clamp(spec.sidewallBulge, 0, 1);
  const roundness = clamp(spec.shoulderRoundness, 0, 1);
  const sidewallBulgeX =
    widthDelta * 0.35 + sidewallHeight * bulge * 0.18 - stretch * tireWidth * 0.11;
  const shoulderDrop = sidewallHeight * (0.03 + roundness * 0.14);
  const shoulderInset = tireHalfWidth * (0.03 + roundness * 0.11);

  // Revolving this 2D x/r profile around the x axis creates the tire body.
  // The duplicated inner-radius points form the rim opening instead of a solid torus.
  const profile: ProfilePoint[] = [
    { x: -wheelHalfWidth, r: rimOpeningRadius },
    { x: -tireHalfWidth + shoulderInset * 1.25, r: rimOpeningRadius + sidewallHeight * 0.2 },
    { x: -tireHalfWidth - sidewallBulgeX, r: rimOpeningRadius + sidewallHeight * 0.58 },
    { x: -tireHalfWidth, r: overallRadius - shoulderDrop },
    { x: -tireHalfWidth + shoulderInset, r: overallRadius },
    { x: tireHalfWidth - shoulderInset, r: overallRadius },
    { x: tireHalfWidth, r: overallRadius - shoulderDrop },
    { x: tireHalfWidth + sidewallBulgeX, r: rimOpeningRadius + sidewallHeight * 0.58 },
    { x: tireHalfWidth - shoulderInset * 1.25, r: rimOpeningRadius + sidewallHeight * 0.2 },
    { x: wheelHalfWidth, r: rimOpeningRadius },
  ];

  const points = profile.map((point) => new THREE.Vector2(point.r, point.x));
  const tireGeometry = new THREE.LatheGeometry(points, 96);
  tireGeometry.rotateZ(Math.PI / 2);
  tireGeometry.computeVertexNormals();

  const wheelGeometry = new THREE.CylinderGeometry(
    rimOpeningRadius * 1.01,
    rimOpeningRadius * 1.01,
    wheelWidth * 0.92,
    96,
    1,
    false,
  );
  wheelGeometry.rotateZ(Math.PI / 2);

  return {
    tireGeometry,
    wheelGeometry,
    rimOpeningRadius,
    overallRadius,
    tireWidth,
    wheelWidth,
  };
}
