# Hotel Booking Prototype (React Native)

## Overview
This is a React Native prototype for a hotel booking platform.
The app allows a traveler to book hotels for an entire week with
specific constraints on hotel selection, pricing, coupons, GST, and budget.

## Features
- Weekly booking for 7 nights
- Ensures no hotel is repeated on consecutive nights
- Platform-level coupon support (FRANTIGER2026)
- 20% discount per coupon, max 3 applications
- Conditional 5% GST on final bill above ₹999
- Budget validation against ₹6000
- Transparent price breakdown
- Local computation (no backend)

## Tech Stack
- React Native (Expo)
- TypeScript
- Local state management (useState)

## Architecture
- Data layer: static hotel list
- Logic layer: booking & pricing rules
- UI layer: simple, functional screens

## Assumptions
- One room per night
- Price per room is ₹1000
- Coupons are applied sequentially
- GST is applied after discounts
- Budget is checked after all charges

## How to Run
1. Install dependencies: `npm install`
2. Start app: `npx expo start`
3. Run on Expo Go or web
