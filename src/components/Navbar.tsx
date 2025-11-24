import { TouchableOpacity, View, Text } from "react-native";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";
import CalendarModal from "./CalendarModal";
import { useTypography } from "../styles/Typography";
import { useAppTheme } from "../hooks/useAppTheme";
import { useTheme } from "../context/ThemeContext";
import { useDrawer } from "../context/DrawerContext";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type NavbarButtonConfig = {
  title: string;
  screen: keyof AuthStackParamList;
  icon?: keyof typeof Ionicons.glyphMap;
  activeScreens?: (keyof AuthStackParamList)[];
};

type NavbarProps = {
    openDrawer?: () => void;
};

const Navbar = () => {
  const theme = useAppTheme();
  const {isDark} = useTheme();
  const Typography = useTypography();

  const screenStyles: Record<string, { backgroundColor: string; buttons: NavbarButtonConfig[]}> = {
      Home: {
        backgroundColor: theme.auth.navbar,
        buttons: [
          { title: "Home", screen: "Home", icon: isDark ? "home-outline" : "home" },
          { title: "Saints", screen: "Saint", icon: isDark ? "people-outline" : "people" },
          { title: "Journal", screen: "Journal", icon: isDark ? "book-outline" : "book" , activeScreens: ["Journal", "CreateJournalEntry"] },
          { title: "Prayers", screen: "Prayer", icon: isDark ? "heart-outline" : "heart", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
        ],
      },
      Journal: {
        backgroundColor: theme.journal.primary,
        buttons: [
          { title: "Home", screen: "Home", icon: isDark ? "home-outline" : "home" },
          { title: "Saints", screen: "Saint", icon: isDark ? "people-outline" : "people" },
          { title: "Journal", screen: "Journal", icon: isDark ? "book-outline" : "book" , activeScreens: ["Journal", "CreateJournalEntry"] },
          { title: "Prayers", screen: "Prayer", icon: isDark ? "heart-outline" : "heart", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
        ],
      },
      CreateJournalEntry: {
        backgroundColor: theme.journal.primary,
        buttons: [
          { title: "Home", screen: "Home", icon: isDark ? "home-outline" : "home" },
          { title: "Saints", screen: "Saint", icon: isDark ? "people-outline" : "people" },
          { title: "Journal", screen: "Journal", icon: isDark ? "book-outline" : "book" , activeScreens: ["Journal", "CreateJournalEntry"] },
          { title: "Prayers", screen: "Prayer", icon: isDark ? "heart-outline" : "heart", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
        ],
      },
      Prayer: {
        backgroundColor: theme.prayer.primary,
        buttons: [
          { title: "Home", screen: "Home", icon: isDark ? "home-outline" : "home" },
          { title: "Saints", screen: "Saint", icon: isDark ? "people-outline" : "people" },
          { title: "Journal", screen: "Journal", icon: isDark ? "book-outline" : "book" , activeScreens: ["Journal", "CreateJournalEntry"] },
          { title: "Prayers", screen: "Prayer", icon: isDark ? "heart-outline" : "heart", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
        ],
      },
      PrayerList: {
        backgroundColor: theme.prayer.primary,
        buttons: [
          { title: "Home", screen: "Home", icon: isDark ? "home-outline" : "home" },
          { title: "Saints", screen: "Saint", icon: isDark ? "people-outline" : "people" },
          { title: "Journal", screen: "Journal", icon: isDark ? "book-outline" : "book" , activeScreens: ["Journal", "CreateJournalEntry"] },
          { title: "Prayers", screen: "Prayer", icon: isDark ? "heart-outline" : "heart", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
        ],
      },
      Rosary: {
        backgroundColor: theme.prayer.primary,
        buttons: [
          { title: "Home", screen: "Home", icon: isDark ? "home-outline" : "home" },
          { title: "Saints", screen: "Saint", icon: isDark ? "people-outline" : "people" },
          { title: "Journal", screen: "Journal", icon: isDark ? "book-outline" : "book" , activeScreens: ["Journal", "CreateJournalEntry"] },
          { title: "Prayers", screen: "Prayer", icon: isDark ? "heart-outline" : "heart", activeScreens: ["Prayer", "Rosary", "PrayerList"] },
        ],
      }
    };

    const navigation = useNavigation<NavbarNavigationProp>();
    const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
    const [modalVisible, setModalVisible] = useState(false);
    const currentScreen = route.name;
    const config = screenStyles[currentScreen] || screenStyles["Home"];
    const { openDrawer } = useDrawer();

    const isProfileActive = currentScreen === "Profile";
    const isCalendarActive = modalVisible;    

    return (
        <View
          testID="navbar-container"
          style={[Layout.navbarContainer, {backgroundColor: config.backgroundColor, flexDirection: "column"}]}
         >
            <Text style={[Typography.label, {marginBottom: -10, color: theme.auth.text}]}>Catholic Daily Companion</Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12}}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={openDrawer}
                  style={{ paddingHorizontal: 10, paddingVertical: 5}}
                  accessibilityLabel="Open menu"
                  accessibilityRole="button"
                >
                  <Ionicons name={isDark ? "menu-outline" : "menu"} size={28} color={theme.auth.text} />
                </TouchableOpacity>

                {config.buttons.map((btn) => (
                    <NavButton 
                        key={btn.screen}
                        style={{ backgroundColor: config.backgroundColor }}
                        title={btn.title}
                        screen={btn.screen}
                        icon={btn.icon}
                        activeScreens={btn.activeScreens}
                        textStyle={{ fontSize: 12 }}
                    />
                ))}
                  
                <NavButton
                  title="Calendar"
                  icon= {isDark ? "calendar-outline" : "calendar"}
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