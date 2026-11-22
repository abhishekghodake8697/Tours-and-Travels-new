import { RateConfig } from "@/types";

export interface CalculationResult {
  distanceKm: number;
  perKm: {
    billableKm: number;
    ratePerKm: number;
    subtotal: number;
    driverAllowance: number;
    estimatedTotal: number;
    minApplied: boolean;
  };
  dayPackage: {
    basePackagePrice: number;
    packageLimitKm: number;
    extraKm: number;
    extraKmRate: number;
    extraKmCost: number;
    driverAllowanceIncluded: boolean;
    estimatedTotal: number;
  };
}

export function calculateTripFares(
  distanceKm: number,
  rates: RateConfig,
  customPerKmRate?: number,
  customDayPackagePrice?: number
): CalculationResult {
  const km = Math.max(1, Math.round(distanceKm));

  // 1. Per KM Model
  const ratePerKm = customPerKmRate || rates.perKmRate;
  const billableKm = Math.max(km, rates.perKmMinDistance);
  const minApplied = km < rates.perKmMinDistance;
  const perKmSubtotal = billableKm * ratePerKm;
  const perKmTotal = perKmSubtotal + rates.driverAllowancePerDay;

  // 2. Fixed Day Package Model (250 KM base limit)
  const basePackagePrice = customDayPackagePrice || rates.dayPackagePrice;
  const packageLimitKm = rates.dayPackageKmLimit;
  const extraKm = Math.max(0, km - packageLimitKm);
  const extraKmCost = extraKm * rates.extraKmRate;
  const dayPackageTotal = basePackagePrice + extraKmCost;

  return {
    distanceKm: km,
    perKm: {
      billableKm,
      ratePerKm,
      subtotal: perKmSubtotal,
      driverAllowance: rates.driverAllowancePerDay,
      estimatedTotal: perKmTotal,
      minApplied,
    },
    dayPackage: {
      basePackagePrice,
      packageLimitKm,
      extraKm,
      extraKmRate: rates.extraKmRate,
      extraKmCost,
      driverAllowanceIncluded: true,
      estimatedTotal: dayPackageTotal,
    },
  };
}
