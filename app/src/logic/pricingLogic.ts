import { APP_CONFIG } from "../config/appConfig";

export function calculateFinalBill({
  nightsCount,
  couponsApplied,
  budget,
}: {
  nightsCount: number;
  couponsApplied: number;
  budget: number;
}) {
const baseAmount = nightsCount * APP_CONFIG.pricing.pricePerNight;

  let discountedAmount = baseAmount;
  for (let i = 0; i < couponsApplied; i++) {
    discountedAmount = discountedAmount * (1 - APP_CONFIG.coupon.discount);
  }

  const gst =
    discountedAmount > 999
      ? discountedAmount * APP_CONFIG.pricing.gstRate
      : 0;

  const finalAmount = discountedAmount + gst;

  return {
    baseAmount,
    discountedAmount,
    gst,
    finalAmount,
    appliedCoupons: couponsApplied,
    withinBudget: finalAmount <= budget,
  };
}
