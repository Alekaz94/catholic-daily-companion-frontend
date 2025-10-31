import PushNotification from "react-native-push-notification";
import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import API from "./api";

const NOTIFICATION_ENABLED_KEY = "notifications_enabled";

export const configureNotifications = async () => {
    PushNotification.configure({
        onNotification: function (notification) {
            console.log("Notification received:", notification);
        },
        requestPermissions: Platform.OS === "android",
    });
        
    PushNotification.createChannel(
        {
            channelId: "daily-reminders",
            channelName: "Daily Reminders",
            importance: 4,
        },
        (created) => console.log(`CreateChannel returned '${created}'`)
    );
}

export const shouldSendRosaryReminder = async (userId: string): Promise<boolean> => {
    try {
        const response = await API.post(`/api/v1/rosary/${userId}/completed-today`);
        const completed = response.data === true;
        return !completed;
    } catch (error) {
        console.error("Error checking rosary completion:", error);
        return true;
    }
}

export const getUserStreak = async (userId: string): Promise<number> => {
    try {
        const response = await API.get(`/api/v1/rosary/${userId}/streak`);
        return response.data ?? 0;
    } catch (error) {
        console.error("Error fetching user streak:", error);
        return 0;
    }
}

export const setNotificationsEnabled = async (enabled: boolean) => {
    await SecureStore.setItemAsync(NOTIFICATION_ENABLED_KEY, JSON.stringify(enabled));

    if(enabled) {
        scheduleAllNotifications();
    } else {
        cancelAllNotifications();
    }
}

export const getNotificationsEnabled = async (): Promise<boolean> => {
    const value = await SecureStore.getItemAsync(NOTIFICATION_ENABLED_KEY);
    return value ? JSON.parse(value) : true;
}

export const scheduleAllNotifications = async (userId?: string) => {
    const enabled = await getNotificationsEnabled();

    if(!enabled) {
        return;
    }

    cancelAllNotifications();

    await scheduleRosaryReminder(userId);
    scheduleSaintOfTheDay();
    scheduleStreakReminder(userId);
}

export const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
}

export const scheduleRosaryReminder = async (userId?: string) => {
    const shouldSend = userId ? await shouldSendRosaryReminder(userId) : true;
    if(!shouldSend) {
        console.log("User already prayed the rosary today. Skipping reminder.")
        return;
    }

    PushNotification.localNotificationSchedule({
        channelId: "daily-reminders",
        title: "Pray the Rosary!",
        message: "Don't forget to pray the rosary today!",
        repeatType: "day",
        date: getNextSchedule(9, 0),
        allowWhileIdle: true,
        id: "1",
    });
}

export const scheduleSaintOfTheDay = () => {
    PushNotification.localNotificationSchedule({
        channelId: "daily-reminders",
        title: "Saint of the Day",
        message: "Check out today's saint!",
        repeatType: "day",
        date: getNextSchedule(9, 0),
        allowWhileIdle: true,
        id: "2",
    });
}

export const scheduleStreakReminder = async (userId?: string) => {
    if(!userId) {
        return;
    }

    const streak = await getUserStreak(userId);
    if(streak < 0) {
        console.log("No streak. Skipping streak reminder.");
        return;
    }

    const shouldSend = await shouldSendRosaryReminder(userId);
    if(!shouldSend) {
        console.log("User already prayed the rosary today. Skipping streak reminder.")
        return;
    }

    PushNotification.localNotificationSchedule({
        channelId: "daily-reminders",
        title: "Keep your streak!",
        message: `You have a ${streak}-day streak. Pray the rosary now to keep it going!`,
        repeatType: "day",
        date: getNextSchedule(20, 0),
        allowWhileIdle: true,
        id: "3",
    });
}

const getNextSchedule = (hour: number, minute: number) => {
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);

    if(scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
    }

    return scheduled;
}