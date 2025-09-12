import { TouchableOpacity, View } from "react-native";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";
import CalendarModal from "./CalendarModal";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const screenStyles: Record<string, { backgroundColor: string; buttons: { title: string; screen: keyof AuthStackParamList }[] }> = {
    Home: {
      backgroundColor: "#FAF3E0",
      buttons: [
        { title: "Home", screen: "Home" },
        { title: "Saints", screen: "Saint" },
        { title: "Journal", screen: "Journal" },
        { title: "Prayers", screen: "Prayer" },
      ],
    },
    Journal: {
      backgroundColor: "#B794F4",
      buttons: [
        { title: "Home", screen: "Home" },
        { title: "Saints", screen: "Saint" },
        { title: "Journal", screen: "Journal" },
        { title: "Prayers", screen: "Prayer" },
      ],
    },
    CreateJournalEntry: {
      backgroundColor: "#B794F4",
      buttons: [
        { title: "Home", screen: "Home" },
        { title: "Saints", screen: "Saint" },
        { title: "Journal", screen: "Journal" },
        { title: "Prayers", screen: "Prayer" },
      ],
    },
    // Reading: {
    //   backgroundColor: "#ADD8E6",
    //   buttons: [
    //     { title: "Home", screen: "Home" },
    //     { title: "Saints", screen: "Saint" },
    //     { title: "Readings", screen: "Reading" },
    //     { title: "Journal", screen: "Journal" },
    //     { title: "Prayers", screen: "Prayer" }
    //   ],
    // },
    Prayer: {
      backgroundColor: "#ADD8E6",
      buttons: [
        { title: "Home", screen: "Home" },
        { title: "Saints", screen: "Saint" },
        { title: "Journal", screen: "Journal" },
        { title: "Prayers", screen: "Prayer" },
      ]
    },
    PrayerList: {
      backgroundColor: "#ADD8E6",
      buttons: [
        { title: "Home", screen: "Home" },
        { title: "Saints", screen: "Saint" },
        { title: "Journal", screen: "Journal" },
        { title: "Prayers", screen: "Prayer" },
      ]
    },
    Rosary: {
      backgroundColor: "#ADD8E6",
      buttons: [
        { title: "Home", screen: "Home" },
        { title: "Saints", screen: "Saint" },
        { title: "Journal", screen: "Journal" },
        { title: "Prayers", screen: "Prayer" },
      ]
    }
  };

const Navbar = () => {
    const navigation = useNavigation<NavbarNavigationProp>();
    const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
    const [modalVisible, setModalVisible] = useState(false);
    const currentScreen = route.name;
    const config = screenStyles[currentScreen] || screenStyles["Home"];

    return (
        <View
          testID="navbar-container"
          style={[Layout.navbarContainer, {backgroundColor: config.backgroundColor}]}
         >
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginHorizontal: 10, alignItems: "center" }}>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ paddingHorizontal: 5 }}>
                <Ionicons name="person-circle-outline" size={26} color="#1A1A1A" />
              </TouchableOpacity>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                {config.buttons.map((btn) => (
                    <NavButton 
                        key={btn.screen}
                        style={{ backgroundColor: config.backgroundColor }}
                        title={btn.title}
                        screen={btn.screen}
                        textStyle={{ fontSize: 14 }}
                    />
                ))}
              </View>

              <TouchableOpacity onPress={() => setModalVisible(true)} style={{ paddingHorizontal: 5 }}>
                <Ionicons name="calendar-outline" size={26} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <CalendarModal 
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

export default Navbar;