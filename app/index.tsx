import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
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
  function startBooking() {
    if (!budget || Number(budget) <= 0) {
      alert("Please enter a valid budget");
      return;
    }

    setCurrentNight(1);
    setCouponCount(0);
    setCouponInput("");
    setTotalBill(0);

    setNightsData(
      Array.from({ length: TOTAL_NIGHTS }, (_, i) => ({
        night: i + 1,
        hotel: null,
        originalPrice: 0,
        discountedPrice: 0,
        couponApplied: false,
      }))
    );
  }

  function handleSelectHotel(hotel: any) {
    const idx = currentNight - 1;

    setNightsData((prev) => {
      const updated = [...prev];
      const prevNight = updated[idx];

      if (prevNight.hotel) {
        const prevPrice = prevNight.couponApplied
          ? prevNight.discountedPrice
          : prevNight.originalPrice;
        setTotalBill((b) => b - prevPrice);
      }

      prevNight.hotel = hotel;
      prevNight.originalPrice = hotel.price;
      prevNight.discountedPrice = hotel.price;
      prevNight.couponApplied = false;

      setTotalBill((b) => b + hotel.price);
      return updated;
    });
  }

  function handleApplyCoupon() {
    if (couponCount >= 3) return;
    if (couponInput !== VALID_COUPON) {
      alert("Invalid coupon code");
      return;
    }

    const idx = currentNight - 1;

    setNightsData((prev) => {
      const updated = [...prev];
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
      <View
        style={{
          backgroundColor: "#000075",
          padding: 30,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
          My Hotel App
        </Text>
        <Text style={{ color: "white" }}>Book smart. Pay less.</Text>
      </View>

      <View style={{ padding: 15 }}>
        <View style={{ backgroundColor: "white", padding: 15, borderRadius: 12 }}>
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
            style={{
              marginTop: 20,
              backgroundColor: "#008000",
              padding: 12,
              borderRadius: 10,
            }}
            onPress={startBooking}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              SEARCH NOW
            </Text>
          </Pressable>
        </View>
      </View>

      {currentNight >= 1 && currentNight <= TOTAL_NIGHTS && (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Night {currentNight} / {TOTAL_NIGHTS}
          </Text>

          {hotels.map((hotel, index) => {
            const prevHotel =
              currentNight > 1 ? nightsData[currentNight - 2].hotel : null;
            const disabled = prevHotel === hotel;

            return (
              <Pressable
                key={index}
                disabled={disabled}
                onPress={() => handleSelectHotel(hotel)}
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 12,
                  marginTop: 12,
                  elevation: 3,
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                    }}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 10,
                      marginRight: 12,
                    }}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {hotel.name}
                    </Text>
                    <Text style={{ marginTop: 4 }}>
                      ₹ {hotel.price} / night
                    </Text>
                  </View>
                </View>

              </Pressable>
            );
          })}

          {!nightsData[currentNight - 1].couponApplied &&
            couponCount < 3 && (
              <>
                <TextInput
                  placeholder="Coupon code"
                  value={couponInput}
                  onChangeText={setCouponInput}
                  style={{
                    borderWidth: 1,
                    marginTop: 15,
                    padding: 8,
                    borderRadius: 8,
                  }}
                />
                <Pressable
                  onPress={handleApplyCoupon}
                  style={{
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: "#008000",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#008000",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Apply Coupon
                  </Text>
                </Pressable>
              </>
            )}

          <Pressable
            disabled={!nightsData[currentNight - 1].hotel}
            onPress={() => setCurrentNight((n) => n + 1)}
            style={{
              marginTop: 20,
              backgroundColor: nightsData[currentNight - 1].hotel
                ? "#000075"
                : "#AAA",
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {currentNight === TOTAL_NIGHTS
                ? "Proceed to Checkout →"
                : "Continue to Next Night →"}
            </Text>
          </Pressable>

          <View
            style={{
              marginTop: 20,
              padding: 18,
              backgroundColor: "#F0F4FF",
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: "#555" }}>
              Current Total
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#000075",
              }}
            >
              ₹ {totalBill.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {currentNight === TOTAL_NIGHTS + 1 && (
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 15,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              Checkout Summary
            </Text>

            {nightsData.map((n) => (
              <View key={n.night} style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Night {n.night}: {n.hotel?.name}
                </Text>
                <Text>
                  ₹{" "}
                  {n.couponApplied
                    ? n.discountedPrice
                    : n.originalPrice}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10 }}>
              Subtotal: ₹{subtotal.toFixed(2)}
            </Text>
            <Text>GST (18%): ₹{gst.toFixed(2)}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Final Amount: ₹{finalAmount.toFixed(2)}
            </Text>

            {isBudgetExceeded && (
              <Text style={{ color: "red", marginTop: 8 }}>
                ⚠ Budget exceeded
              </Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
