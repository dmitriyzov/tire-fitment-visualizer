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

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function createTireGeometry(spec: TireSpec): TireGeometrySet {
  const values = calculateTire(spec);
  const tireWidth = spec.widthMm * MM_TO_SCENE;
  const wheelWidth = spec.wheelWidthIn * 25.4 * MM_TO_SCENE;
  const overallRadius = (values.overallDiameterMm / 2) * MM_TO_SCENE;
  const rimOpeningRadius = (values.rimDiameterMm / 2) * MM_TO_SCENE;
  const wheelFaceRadius = rimOpeningRadius * 1.1;
  const tireBeadRadius = wheelFaceRadius * 1.025;
  const sidewallHeight = Math.max(0.08, overallRadius - rimOpeningRadius);

  const tireHalfWidth = tireWidth / 2;
  const wheelHalfWidth = wheelWidth / 2;
  const rimVisualHalfWidth = wheelHalfWidth * 1.08;
  const rimVisualWidth = rimVisualHalfWidth * 2;
  const tireBeadHalfWidth = rimVisualHalfWidth * 1.025;
  const tireBeadWidth = tireBeadHalfWidth * 2;
  const widthDelta = tireHalfWidth - tireBeadHalfWidth;
  const stretch = clamp((tireBeadWidth - tireWidth) / tireWidth, 0, 0.85);
  const bulge = clamp(spec.sidewallBulge, 0, 1);
  const roundness = clamp(spec.shoulderRoundness, 0, 1);
  const sidewallBulgeX =
    widthDelta * 0.35 + sidewallHeight * bulge * 0.18 - stretch * tireWidth * 0.16;
  const shoulderDrop = sidewallHeight * (0.03 + roundness * 0.14) * (1 - stretch * 0.65);
  const shoulderInset = tireHalfWidth * (0.03 + roundness * 0.11) * (1 - stretch * 0.7);
  const isStretched = tireBeadHalfWidth > tireHalfWidth;
  const leftLowerSidewallX = isStretched
    ? lerp(-tireBeadHalfWidth, -tireHalfWidth, 0.28)
    : -tireHalfWidth + shoulderInset * 1.25;
  const leftMidSidewallX = isStretched
    ? lerp(-tireBeadHalfWidth, -tireHalfWidth, 0.62)
    : -tireHalfWidth - sidewallBulgeX;
  const rightMidSidewallX = isStretched
    ? lerp(tireBeadHalfWidth, tireHalfWidth, 0.62)
    : tireHalfWidth + sidewallBulgeX;
  const rightLowerSidewallX = isStretched
    ? lerp(tireBeadHalfWidth, tireHalfWidth, 0.28)
    : tireHalfWidth - shoulderInset * 1.25;

  // Revolving this 2D x/r profile around the x axis creates the tire body.
  // The duplicated inner-radius points form the rim opening instead of a solid torus.
  const profile: ProfilePoint[] = [
    { x: -tireBeadHalfWidth, r: tireBeadRadius },
    { x: leftLowerSidewallX, r: rimOpeningRadius + sidewallHeight * 0.2 },
    { x: leftMidSidewallX, r: rimOpeningRadius + sidewallHeight * 0.58 },
    { x: -tireHalfWidth, r: overallRadius - shoulderDrop },
    { x: -tireHalfWidth + shoulderInset, r: overallRadius },
    { x: tireHalfWidth - shoulderInset, r: overallRadius },
    { x: tireHalfWidth, r: overallRadius - shoulderDrop },
    { x: rightMidSidewallX, r: rimOpeningRadius + sidewallHeight * 0.58 },
    { x: rightLowerSidewallX, r: rimOpeningRadius + sidewallHeight * 0.2 },
    { x: tireBeadHalfWidth, r: tireBeadRadius },
  ];

  const points = profile.map((point) => new THREE.Vector2(point.r, point.x));
  const tireGeometry = new THREE.LatheGeometry(points, 96);
  tireGeometry.rotateZ(Math.PI / 2);
  tireGeometry.computeVertexNormals();

  const wheelGeometry = new THREE.CylinderGeometry(
    wheelFaceRadius,
    wheelFaceRadius,
    rimVisualWidth,
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
