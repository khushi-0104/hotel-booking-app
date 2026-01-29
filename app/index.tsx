import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { hotels } from "./src/data/hotels";

const VALID_COUPON = "FRANTIGER2026";
const DISCOUNT_RATE = 0.2;
const GST_RATE = 0.18;

export default function Index() {
  const TOTAL_NIGHTS = 7;

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [people, setPeople] = useState("");
  const [budget, setBudget] = useState("");

  const [currentNight, setCurrentNight] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [totalBill, setTotalBill] = useState(0);

  const [nightsData, setNightsData] = useState(
    Array.from({ length: TOTAL_NIGHTS }, (_, i) => ({
      night: i + 1,
      hotel: null as any,
      originalPrice: 0,
      discountedPrice: 0,
      couponApplied: false,
    }))
  );

  function handleSelectHotel(hotel: any) {
    if (currentNight === 0) return;

    setNightsData((prev) => {
      const updated = [...prev];
      const idx = currentNight - 1;
      const prevHotel = updated[idx].hotel;

      if (prevHotel) {
        const prevPrice = updated[idx].couponApplied
          ? updated[idx].discountedPrice
          : updated[idx].originalPrice;
        setTotalBill((b) => b - prevPrice);
      }

      updated[idx].hotel = hotel;
      updated[idx].originalPrice = hotel.price;
      updated[idx].discountedPrice = hotel.price;
      updated[idx].couponApplied = false;

      setTotalBill((b) => b + hotel.price);
      return updated;
    });
  }

  function handleApplyCoupon() {
    if (couponCount >= 3) return;
    if (couponInput !== VALID_COUPON) return;

    setNightsData((prev) => {
      const updated = [...prev];
      const idx = currentNight - 1;
      const night = updated[idx];

      if (!night.hotel || night.couponApplied) return prev;

      const discount = night.originalPrice * DISCOUNT_RATE;
      night.discountedPrice = night.originalPrice - discount;
      night.couponApplied = true;

      setTotalBill((b) => b - discount);
      setCouponCount((c) => c + 1);
      return updated;
    });
  }

  const subtotal = totalBill;
  const gst = subtotal * GST_RATE;
  const finalAmount = subtotal + gst;

  const numericBudget = Number(budget);
  const isBudgetExceeded =
    numericBudget > 0 && finalAmount > numericBudget;

  return (
    <ScrollView style={{ backgroundColor: "#EEE" }}>
      <View style={{ backgroundColor: "#000075", padding: 25 }}>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
          My Hotel App
        </Text>
        <Text style={{ color: "white" }}>
          MakeMyTrip-style Booking
        </Text>
      </View>

      <View style={{ padding: 15 }}>
        <View style={{ backgroundColor: "white", padding: 15, borderRadius: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Trip Details</Text>

          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={{ borderBottomWidth: 1, marginVertical: 10 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TextInput
              placeholder="Check-in"
              value={checkIn}
              onChangeText={setCheckIn}
              style={{ borderBottomWidth: 1, width: "45%" }}
            />
            <TextInput
              placeholder="Check-out"
              value={checkOut}
              onChangeText={setCheckOut}
              style={{ borderBottomWidth: 1, width: "45%" }}
            />
          </View>

          <TextInput
            placeholder="Guests"
            value={people}
            onChangeText={setPeople}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, marginTop: 15 }}
          />

          <TextInput
            placeholder="Budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, marginTop: 15 }}
          />

          <Pressable
            style={{ marginTop: 20, backgroundColor: "#008000", padding: 10 }}
            onPress={() => {
              setCurrentNight(1);
              setTotalBill(0);
              setCouponCount(0);
              setCouponInput("");
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              SEARCH NOW
            </Text>
          </Pressable>
        </View>
      </View>

      {currentNight > 0 && currentNight <= TOTAL_NIGHTS && (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Night {currentNight} / {TOTAL_NIGHTS}
          </Text>

          {hotels.map((hotel) => {
            const prevHotel =
              currentNight > 1 ? nightsData[currentNight - 2].hotel : null;
            const disabled = prevHotel?.id === hotel.id;

            return (
              <Pressable
                key={hotel.id}
                disabled={disabled}
                onPress={() => handleSelectHotel(hotel)}
                style={{
                  backgroundColor: "white",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 10,
                  opacity: disabled ? 0.4 : 1,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{hotel.name}</Text>
                <Text>₹ {hotel.price}</Text>
              </Pressable>
            );
          })}

          {!nightsData[currentNight - 1].couponApplied && couponCount < 3 && (
            <>
              <TextInput
                placeholder="Coupon code"
                value={couponInput}
                onChangeText={setCouponInput}
                style={{ borderWidth: 1, marginTop: 15, padding: 8 }}
              />
              <Pressable onPress={handleApplyCoupon}>
                <Text style={{ color: "green" }}>Apply Coupon</Text>
              </Pressable>
            </>
          )}

          <Pressable
            style={{ marginTop: 15 }}
            disabled={!nightsData[currentNight - 1].hotel}
            onPress={() => setCurrentNight((n) => n + 1)}
          >
            <Text style={{ fontWeight: "bold" }}>Next Night</Text>
          </Pressable>

          <Text style={{ marginTop: 10 }}>
            Running Total: ₹{totalBill.toFixed(2)}
          </Text>
        </View>
      )}

      {currentNight > TOTAL_NIGHTS && (
        <View style={{ padding: 20 }}>
          <View style={{ backgroundColor: "white", padding: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              Checkout Summary
            </Text>

            {nightsData.map((n) => (
              <Text key={n.night}>
                Night {n.night}: {n.hotel?.name} – ₹
                {n.couponApplied ? n.discountedPrice : n.originalPrice}
              </Text>
            ))}

            <Text style={{ marginTop: 10 }}>
              Subtotal: ₹{subtotal.toFixed(2)}
            </Text>
            <Text>GST (18%): ₹{gst.toFixed(2)}</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Final Amount: ₹{finalAmount.toFixed(2)}
            </Text>

            {isBudgetExceeded && (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: "#FFE5E5",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  ⚠ Budget Exceeded
                </Text>
                <Text style={{ color: "red" }}>
                  Budget: ₹{numericBudget} | Final: ₹{finalAmount.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
