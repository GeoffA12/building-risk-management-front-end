import PushNotification from 'react-native-push-notification';
import { channelConfig } from '../../config/NotificationConfig';

export const useNotifications = () => {
    function showNotification(title, message) {
        return PushNotification.localNotification({
            channelId: channelConfig.channelId,
            title,
            message,
            vibration: 300,
        });
    }

    function createScheduledNotification(title, message, seconds) {
        return PushNotification.localNotificationSchedule({
            channelId: channelConfig.channelId,
            title,
            message,
            date: new Date(Date.now() * seconds * 1000),
            vibration: 300,
        });
    }

    function cancelAllNotifications() {
        return PushNotification.cancelAllLocalNotifications();
    }

    return {
        showNotification,
        createScheduledNotification,
        cancelAllNotifications,
    };
};
