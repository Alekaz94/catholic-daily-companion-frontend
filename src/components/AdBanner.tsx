import React from "react";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { getBannerId } from "../services/ads/adConfig";

const AdBanner = () => {
    return (
        <BannerAd
            unitId={getBannerId()}
            size={BannerAdSize.BANNER}
        />
    )
}

export default AdBanner;