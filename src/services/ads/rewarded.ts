import { RewardedAd, RewardedAdEventType } from "react-native-google-mobile-ads";
import { getRewardedId } from "./adConfig";

const rewarded = RewardedAd.createForAdRequest(getRewardedId());

export const showRewardedAd = async () => {
  return new Promise<void>((resolve) => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
        unsubscribeLoaded();
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        unsubscribeEarned();
        resolve();
      }
    );

    rewarded.load();
  });
};
