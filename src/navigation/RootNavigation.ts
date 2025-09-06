import { createNavigationContainerRef } from "@react-navigation/native";
import { AuthStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<AuthStackParamList>();

export function navigate<RouteName extends keyof AuthStackParamList>(
    ...args: undefined extends AuthStackParamList[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: AuthStackParamList[RouteName]]
      : [screen: RouteName, params: AuthStackParamList[RouteName]]
  ) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(...(args as [any, any]));
    }
}

export function reset<RouteName extends keyof AuthStackParamList>(
    ...args: undefined extends AuthStackParamList[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: AuthStackParamList[RouteName]]
      : [screen: RouteName, params: AuthStackParamList[RouteName]]
  ) {
    if (navigationRef.isReady()) {
      const [screen, params] = args;
      navigationRef.reset({
        index: 0,
        routes: [{ name: screen, params }],
      });
    }
}