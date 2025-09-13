import { TouchableOpacity, View, Text } from "react-native";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";
import CalendarModal from "./CalendarModal";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type NavbarButtonConfig = {
  title: string;
  screen: keyof AuthStackParamList;
  icon?: keyof typeof Ionicons.glyphMap;
  activeScreens?: (keyof AuthStackParamList)[];
};

const screenStyles: Record<string, { backgroundColor: string; buttons: NavbarButtonConfig[]}> = {
    Home: {
      backgroundColor: "#FAF3E0",
      buttons: [
        { title: "Home", screen: "Home", icon: "home-outline" },
        { title: "Saints", screen: "Saint", icon: "people-outline" },
        { title: "Journal", screen: "Journal", icon: "book-outline", activeScreens: ["Journal", "CreateJournalEntry"] },
        { title: "Prayers", screen: "Prayer", icon: "heart-outline", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
      ],
    },
    Journal: {
      backgroundColor: "#B794F4",
      buttons: [
        { title: "Home", screen: "Home", icon: "home-outline" },
        { title: "Saints", screen: "Saint", icon: "people-outline" },
        { title: "Journal", screen: "Journal", icon: "book-outline", activeScreens: ["Journal", "CreateJournalEntry"] },
        { title: "Prayers", screen: "Prayer", icon: "heart-outline", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
      ],
    },
    CreateJournalEntry: {
      backgroundColor: "#B794F4",
      buttons: [
        { title: "Home", screen: "Home", icon: "home-outline" },
        { title: "Saints", screen: "Saint", icon: "people-outline" },
        { title: "Journal", screen: "Journal", icon: "book-outline", activeScreens: ["Journal", "CreateJournalEntry"] },
        { title: "Prayers", screen: "Prayer", icon: "heart-outline", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
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
        { title: "Home", screen: "Home", icon: "home-outline" },
        { title: "Saints", screen: "Saint", icon: "people-outline" },
        { title: "Journal", screen: "Journal", icon: "book-outline", activeScreens: ["Journal", "CreateJournalEntry"] },
        { title: "Prayers", screen: "Prayer", icon: "heart-outline", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
      ]
    },
    PrayerList: {
      backgroundColor: "#ADD8E6",
      buttons: [
        { title: "Home", screen: "Home", icon: "home-outline" },
        { title: "Saints", screen: "Saint", icon: "people-outline" },
        { title: "Journal", screen: "Journal", icon: "book-outline", activeScreens: ["Journal", "CreateJournalEntry"] },
        { title: "Prayers", screen: "Prayer", icon: "heart-outline", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
      ]
    },
    Rosary: {
      backgroundColor: "#ADD8E6",
      buttons: [
        { title: "Home", screen: "Home", icon: "home-outline" },
        { title: "Saints", screen: "Saint", icon: "people-outline" },
        { title: "Journal", screen: "Journal", icon: "book-outline", activeScreens: ["Journal", "CreateJournalEntry"] },
        { title: "Prayers", screen: "Prayer", icon: "heart-outline", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
      ]
    }
  };

const Navbar = () => {
    const navigation = useNavigation<NavbarNavigationProp>();
    const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
    const [modalVisible, setModalVisible] = useState(false);
    const currentScreen = route.name;
    const config = screenStyles[currentScreen] || screenStyles["Home"];

    const isProfileActive = currentScreen === "Profile";
    const isCalendarActive = modalVisible;

    return (
        <View
          testID="navbar-container"
          style={[Layout.navbarContainer, {backgroundColor: config.backgroundColor,}]}
         >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <NavButton
                title="Profile"
                icon="person-circle-outline"
                style={{ backgroundColor: config.backgroundColor }}
                isActive={route.name === "Profile"}
                onPress={() => navigation.navigate("Profile")}
              />

              {config.buttons.map((btn) => (
                  <NavButton 
                      key={btn.screen}
                      style={{ backgroundColor: config.backgroundColor }}
                      title={btn.title}
                      screen={btn.screen}
                      icon={btn.icon}
                      activeScreens={btn.activeScreens}
                      textStyle={{ fontSize: 14 }}
                  />
              ))}
                
              <NavButton
                title="Calendar"
                icon="calendar-outline"
                isActive={modalVisible}
                style={{ backgroundColor: config.backgroundColor }}
                onPress={() => setModalVisible(true)}
              />
              </View>
            </View>

              <CalendarModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
              />
        </View>
    );
}

export default Navbar;