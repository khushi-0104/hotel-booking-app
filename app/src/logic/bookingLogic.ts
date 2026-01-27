import { APP_CONFIG } from "../config/appConfig";
import { hotels } from "../data/hotels";

export function generateWeeklyBooking() {
  console.log("CONFIG CHECK:", APP_CONFIG);
  const nights = [];
  const totalNights = APP_CONFIG.booking.nights;

  for (let i = 0; i < totalNights; i++) {
    const hotelIndex = i % hotels.length;

    nights.push({
      night: i + 1,
      hotel: hotels[hotelIndex],
    });
  }

  return nights;
}
