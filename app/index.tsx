import { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { APP_CONFIG } from "./src/config/appConfig";
import { generateWeeklyBooking } from "./src/logic/bookingLogic";
import { calculateFinalBill } from "./src/logic/pricingLogic";

export default function Index() {
  const [nights, setNights] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [people, setPeople] = useState("2");
  const [budget, setBudget] = useState("");

  const [showResults, setShowResults] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponsApplied, setCouponsApplied] = useState(0);
  const [bill, setBill] = useState<any>(null);

  function handleCoupon() {
    if (couponsApplied < APP_CONFIG.coupon.maxUses) {
      const nextCount = couponsApplied + 1;
      const res = calculateFinalBill({
        nightsCount: nights.length,
        couponsApplied: nextCount,
        budget: Number(budget),
      });
      setCouponsApplied(nextCount);
      setBill(res);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: "#CCC7D2" }}>
      <View style={{ backgroundColor: "#000075", padding: 30 }}>
        <Text style={{ color: "white", fontSize: 40, fontWeight: "bold" }}>My Hotel App</Text>
        <Text style={{ color: "white" }}>Plan your trip with us</Text>
      </View>

      <View style={{ padding: 15 }}>
        <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}>
          <Text>Vacation Incoming....🏝️</Text>
          <TextInput 
            style={{ borderBottomWidth: 1, 
              marginTop:10, marginBottom: 20 }} 
            value={location} 
            onChangeText={setLocation} 
            placeholder="Location:"
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
             <TextInput 
              placeholder="Check-in" 
              style={{ borderBottomWidth: 1, width: "45%" }} 
              value={checkIn} 
              onChangeText={setCheckIn} 
             />
             <TextInput 
              placeholder="Check-out" 
              style={{ borderBottomWidth: 1, width: "45%" }} 
              value={checkOut} 
              onChangeText={setCheckOut} 
             />
          </View>

          <Text style={{ marginTop: 20 }}>No. of Guest:</Text>
          <TextInput 
            keyboardType="numeric" 
            style={{ borderBottomWidth: 1 }} 
            value={people} 
            onChangeText={setPeople} 
          />

          <Text style={{ marginTop: 20 }}>Your Budget (Rs.)</Text>
          <TextInput 
            keyboardType="numeric" 
            style={{ borderBottomWidth: 1 }} 
            value={budget} 
            onChangeText={setBudget} 
          />

          <Pressable
            onPress={() => {
              const data = generateWeeklyBooking();
              setNights(data);
              setShowResults(true);
              setCouponsApplied(0);
              const b = calculateFinalBill({ 
                nightsCount: data.length, 
                couponsApplied: 0, 
                budget: Number(budget) 
              });
              setBill(b);
            }}
            style={{ backgroundColor: "#000075", padding: 10, marginTop: 15, borderRadius: 5 }}
          >
            <Text style={{ textAlign: "center", color: "white", fontWeight: "bold" }}>SEARCH NOW</Text>
          </Pressable>
        </View>

        {showResults && (
          <View style={{ marginTop: 20 }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' }} 
              style={{ width: "100%", height: 150, borderRadius: 10 }}
            />

            <Text style={{ fontSize: 20, marginVertical: 10 }}>Results for {location}:</Text>

            <View style={{ backgroundColor: "white", padding: 10, borderRadius: 5 }}>
              {nights.map((n, i) => (
                <Text key={i} style={{ marginBottom: 5 }}>-🏨Night {n.night}: {n.hotel.name}</Text>
              ))}
            </View>

            <View style={{ marginVertical: 15, flexDirection: "row" }}>
              <TextInput 
                placeholder="Coupon here" 
                style={{ backgroundColor: "white", flex: 1, padding: 5, borderWidth: 1 }} 
                value={couponCode} 
                onChangeText={setCouponCode}
              />
              <Pressable 
                onPress={handleCoupon} 
                style={{ backgroundColor: "#008000", padding: 10 }}
              >
                <Text style={{ color: "white" }}>Apply</Text>
              </Pressable>
            </View>

            {/* Bill Info */}
            {bill && (
              <View style={{ backgroundColor: "#ddd", padding: 15, borderRadius: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Bill Summary:</Text>
                <Text>Base: Rs {bill.baseAmount}</Text>
                <Text>GST: Rs {Math.round(bill.gst)}</Text>
                <Text>Discount: Rs {Math.round(bill.baseAmount - bill.discountedAmount)}</Text>
                <Text style={{ fontSize: 18, marginTop: 10 }}>Total: Rs {Math.round(bill.finalAmount)}</Text>
                
                {bill.withinBudget === false && (
                  <Text style={{ color: "red" }}>Budget exceeded!</Text>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}