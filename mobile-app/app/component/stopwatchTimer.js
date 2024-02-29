import  React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, AppState, Modal, Image, TextInput, Alert } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogWindow from "./logWindow";
import { analytics, analyticsTrack } from '../service/mixpanel';

import colors from "../config/colors";
import { padToTwo } from "../service/utils";
import textStyles from "../styles/text";
import iconStyles from "../styles/icons";


function StopwatchTimer(props) {
    const {loggingHabit, SetLoggingHabit, refreshPage, setRefreshPage} = props

    const [time, setTime] = useState(0);
    const [isRunning, setRunning] = useState(false);
    const [logContainerVisible, SetLogContainerVisible] = useState(false);
    const [timerFirstStart, setTimerFirstStart] = useState(true)
    const timer = useRef(null);
    const [habitStartTime, setHabitStartTime] = useState()
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        analyticsTrack(analytics, "stopwatch", {"habitId":loggingHabit.habitId, "habitName":loggingHabit.habitName});
        AppState.addEventListener("change", handleAppStateChange);
        return () => AppState.removeEventListener("change", handleAppStateChange);
    }, []);

    const handleAppStateChange = async (nextAppState) => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {    
            // We just became active again: recalculate elapsed time based 
            // on what we stored in AsyncStorage when we started.
            await getElapsedTime();    // Update the elapsed seconds state
        }  
        appState.current = nextAppState;
    };
    
    const getElapsedTime = async () => {
        try {
            const startTime = await AsyncStorage.getItem("@start_time");
            const currTime = await AsyncStorage.getItem("@timer_currTime");
            const now = new Date();
            var elapsedTimeSeconds = Math.round((now.getTime() - new Date(Date.parse(startTime)).getTime())/1000)
            if (elapsedTimeSeconds){
                setTime(Number(currTime) + elapsedTimeSeconds)
            }
            
        } 
        catch (err) {
            console.warn(err);
        }
    };

    useEffect(async () => {
        if(timerFirstStart){
            await AsyncStorage.removeItem("@start_time");
            await AsyncStorage.removeItem("@timer_currTime")
        }
    }, [timerFirstStart]);

    const displayTime = (seconds) => {
        let minutes = 0;
        let hours = 0;
        if (seconds < 0) {
        seconds = 0;
        }
        if (seconds < 60) {
            return `00:00:${padToTwo(seconds)}`;
        }
        let remainSeconds = seconds % 60;
        minutes = (seconds - remainSeconds) / 60;
        if (minutes < 60) {
            return `00:${padToTwo(minutes)}:${padToTwo(remainSeconds)}`;
        }
        let remainMinutes = minutes % 60;
        hours = (minutes - remainMinutes) / 60;
        if (minutes >= 60) {
            return `${padToTwo(hours)}:${padToTwo(remainMinutes)}:${padToTwo(remainSeconds)}`;
        }
    };

    const onResetPress = async () =>{
        analyticsTrack(analytics, "stopwatch:resetPressed", {"habitId":loggingHabit.habitId, "habitName":loggingHabit.habitName});
        setTime(0);
        setRunning(false);
        setTimerFirstStart(true)
        await AsyncStorage.setItem("@timer_currTime", '0'); // save 0 as current time
    }

    const onStartPress = async () => {
        if (!isRunning) {
            if (timerFirstStart){
                analyticsTrack(analytics, "stopwatch:startPressed", {"habitId":loggingHabit.habitId, "habitName":loggingHabit.habitName});
                if (time==0){
                    setHabitStartTime(new Date())
                  }
                const recordStartTime = async () => {
                    try {
                        const now = new Date();
                        await AsyncStorage.setItem("@start_time", now.toISOString());
                        const currTimeFetched = await AsyncStorage.getItem("@timer_currTime");
                        if (!currTimeFetched){ // if starting after reset, then don't save current time - stale state issue workaround
                            await AsyncStorage.setItem("@timer_currTime", time.toString());
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                  };
                recordStartTime()
                setTimerFirstStart(false)
            }
            const interval = setInterval(() => {
                setTime((previousTime) => previousTime + 1);
            }, 1000);
            timer.current = interval;
        } 
        else {
          analyticsTrack(analytics, "stopwatch:pausePressed", {"habitId":loggingHabit.habitId, "habitName":loggingHabit.habitName, "elapsedTime":time});
          clearInterval(timer.current);
          setTimerFirstStart(true)
        }
        setRunning(!isRunning);
    }

    const onLogPress = () => {
        analyticsTrack(analytics, "stopwatch:logPressed", {"habitId":loggingHabit.habitId, "habitName":loggingHabit.habitName, "amount":Math.round(time/60)});
        SetLoggingHabit({ ...loggingHabit, userInputAmount: Math.round(time/60).toString(), habitStartTime: habitStartTime || new Date() })
        SetLogContainerVisible(true)
    }

    const dummyButton = () => {

    }
    return(
        <View style={styles.container}>
            <View style={[{width:'50%', alignSelf: 'center', marginTop:-60, marginBottom: 40, flexDirection: 'row', alignItems:'center'}]}>
                <Image style={iconStyles.tinyLogo} source={require('../assets/icons/Icon_timer.png')} />
                <Text style={[textStyles.text, {textAlign: 'center'}]}>Stopwatch</Text>
            </View>
            <Text style={[styles.displayText]}>{displayTime(time)}</Text>
            <View style={styles.control}>
                <TouchableOpacity
                    style={[styles.controlButtonBorder,]}
                    onPress={isRunning ? dummyButton : onResetPress}
                >
                    <View style={[{width: 80, paddingHorizontal: 15, paddingVertical: 5}]}>
                        <Text style={{ textAlign: 'center', color: isRunning ? colors.textWhite : colors.textBlue }}>Reset</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.controlButtonBorder,]}
                    onPress={onStartPress}
                >
                    <View style={[styles.controlButton, {borderColor: isRunning ? colors.textBlue : colors.textRed}]}>
                        <Text style={{ textAlign: 'center',color: isRunning ? colors.textBlue : colors.textRed }}>
                            {isRunning ? "Pause" : "Start"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.controlButtonBorder,]}
                    onPress={isRunning ? dummyButton : onLogPress}
                >
                    <View style={[{width: 80, paddingHorizontal: 15, paddingVertical: 5}]}>
                        <Text style={{ textAlign: 'center',color: isRunning ? colors.textWhite : colors.textBlue }}>Log</Text>
                    </View>
                </TouchableOpacity>  
            </View>
            {logContainerVisible && 
                <LogWindow loggingHabit={loggingHabit} SetLoggingHabit={SetLoggingHabit} SetLogContainerVisible={SetLogContainerVisible} refreshPage={refreshPage} setRefreshPage={setRefreshPage} showSkip={false}/>
            }
        </View>
    )
}

export default StopwatchTimer;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "black",
        // paddingTop: Constants.statusBarHeight,
      },
    displayText: {
        //fontFamily: 'monospace',
        color: colors.textBlue,
        fontSize: 55,
        textAlign: 'left',
        marginLeft: 40,
        marginTop: 20,
    },
    control: {
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 60,
        borderBottomColor: colors.bordorColor,
        borderTopColor: colors.bordorColor,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    button: {
        borderColor: colors.backgroundDarkBlue,
        borderWidth: 1,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    controlButtonBorder: {
        justifyContent: "center",
        alignContent: "center",
        width: 70,
        height: 70,
        borderRadius: 70,
      },
    controlButton: {
        justifyContent: "center",
        alignContent: "center",
        width: 65,
        height: 65,
        borderRadius: 65,
        borderWidth: 1,
      },
});  