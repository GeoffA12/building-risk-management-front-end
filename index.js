/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { channelConfig } from './src/config/NotificationConfig';

import PushNotification from 'react-native-push-notification';

PushNotification.configure({
    onRegister: function (token) {
        console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
    },

    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
    {
        channelId: channelConfig.channelId,
        channelName: channelConfig.channelName,
        playSound: false,
        soundName: 'default',
        vibrate: true,
    },
    (created) => console.log(`createChannel returned ${created}`)
);

AppRegistry.registerComponent(appName, () => App);
