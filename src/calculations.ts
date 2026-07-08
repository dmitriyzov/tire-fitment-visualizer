export type TireSpec = {
  widthMm: number;
  aspectRatio: number;
  rimDiameterIn: number;
  wheelWidthIn: number;
  shoulderRoundness: number;
  sidewallBulge: number;
  preset: TirePresetName;
};

export type TirePresetName = 'UHP' | 'Touring' | 'Slick';

export type TireCalculations = {
  sidewallMm: number;
  rimDiameterMm: number;
  overallDiameterMm: number;
  overallDiameterDelta: number;
  meatIndex: number;
  widthToHeight: number;
  tireToWheelWidthRatio: number;
};

export type TirePreset = {
  name: TirePresetName;
  shoulderRoundness: number;
  sidewallBulge: number;
};

export const tirePresets: TirePreset[] = [
  { name: 'UHP', shoulderRoundness: 0.34, sidewallBulge: 0.38 },
  { name: 'Touring', shoulderRoundness: 0.68, sidewallBulge: 0.62 },
  { name: 'Slick', shoulderRoundness: 0.16, sidewallBulge: 0.12 },
];

export const defaultSpec: TireSpec = {
  widthMm: 225,
  aspectRatio: 60,
  rimDiameterIn: 17,
  wheelWidthIn: 7.5,
  shoulderRoundness: tirePresets[0].shoulderRoundness,
  sidewallBulge: tirePresets[0].sidewallBulge,
  preset: 'UHP',
};

function calculateOverallDiameterMm(spec: TireSpec) {
  const sidewallMm = (spec.widthMm * spec.aspectRatio) / 100;
  const rimDiameterMm = spec.rimDiameterIn * 25.4;

  return rimDiameterMm + 2 * sidewallMm;
}

export function calculateTire(spec: TireSpec): TireCalculations {
  const sidewallMm = (spec.widthMm * spec.aspectRatio) / 100;
  const rimDiameterMm = spec.rimDiameterIn * 25.4;
  const overallDiameterMm = rimDiameterMm + 2 * sidewallMm;
  const defaultOverallDiameterMm = calculateOverallDiameterMm(defaultSpec);

  return {
    sidewallMm,
    rimDiameterMm,
    overallDiameterMm,
    overallDiameterDelta: (overallDiameterMm - defaultOverallDiameterMm) / defaultOverallDiameterMm,
    // Meat index is how much of the tire diameter is sidewall instead of rim.
    meatIndex: (2 * sidewallMm) / overallDiameterMm,
    widthToHeight: spec.widthMm / overallDiameterMm,
    tireToWheelWidthRatio: spec.widthMm / spec.wheelWidthIn,
  };
}

export function applyPreset(spec: TireSpec, presetName: TirePresetName): TireSpec {
  const preset = tirePresets.find((item) => item.name === presetName);

  if (!preset) {
    return spec;
  }

  return {
    ...spec,
    preset: preset.name,
    shoulderRoundness: preset.shoulderRoundness,
    sidewallBulge: preset.sidewallBulge,
  };
}
