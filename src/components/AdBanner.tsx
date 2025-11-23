import React from "react";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { getBannerId } from "../services/ads/adConfig";
import { useAuth } from "../context/AuthContext";

const AdBanner = () => {
    const { user } = useAuth();

    if(user?.role === "ADMIN") {
        return null;
    }

    return (
        <BannerAd
            unitId={getBannerId()}
            size={BannerAdSize.FULL_BANNER}
        />
    )
}

export default AdBanner;