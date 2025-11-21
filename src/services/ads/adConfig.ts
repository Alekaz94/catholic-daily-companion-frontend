import { TestIds } from "react-native-google-mobile-ads";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

export const getBannerId = () => {
    return extra?.USE_TEST_ADS ? TestIds.BANNER : extra?.ADMOB_BANNER_ID;
};

export const getRewardedId = () => {
    return extra?.USE_TEST_ADS ? TestIds.REWARDED : extra?.ADMOB_REWARDED_ID;
};
