import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootSiblingParent } from 'react-native-root-siblings';

import HabitScreen from './app/screens/HabitScreen';
import HabitCardWhy from './app/screens/HabitCardWhy';
import HabitCardHow from './app/screens/HabitCardHow';
import DrinkWaterRoutine from './app/screens/routines/DrinkWater';
import SleepRoutine from './app/screens/routines/Sleep';
import BeforeSleep from './app/screens/routines/BeforeSleep';
import WalkRoutine from './app/screens/routines/Walk';
import HomeScreen from './app/screens/HomeScreen';
import TodayScreen from './app/screens/TodayScreen';
import LogJournal from './app/screens/LogJournal'
import ProfileScreen from './app/screens/ProfileScreen';
import { getDashboardStatus, setDashboardStatus } from './app/service/storage';
import { setNotificationListner } from './app/service/notification';

const { Screen, Navigator } = createNativeStackNavigator();
import { registerForPushNotifications } from './app/service/notification'

export default function App(props) {

  const [firstScreen, setFirstScreen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    //await setDashboardStatus(false)

    getDashboardStatus().then(
      (data) => {
        data = data === 'true' ? true : false
        setFirstScreen(data ? 'TodayScreen' : 'Habit')
        setLoading(false);
      }
    ).catch((err) => {
      setLoading(false);
      setFirstScreen('TodayScreen');
    });
  }, []);

  useEffect(() => {
    registerForPushNotifications()
    const subscription = setNotificationListner(props)
    return () => subscription.remove();
  }, [])

  if (loading) {
    return null
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Navigator initialRouteName={firstScreen}>
          <Screen
            name="Habit"
            component={HabitScreen}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="HabitCardWhy"
            component={HabitCardWhy}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="HabitCardHow"
            component={HabitCardHow}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="SleepRoutine"
            component={SleepRoutine}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="BeforeSleep"
            component={BeforeSleep}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="DrinkWaterRoutine"
            component={DrinkWaterRoutine}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="WalkRoutine"
            component={WalkRoutine}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="TodayScreen"
            component={TodayScreen}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="LogJournal"
            component={LogJournal}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
        </Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}
