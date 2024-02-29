import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox'
import axios from 'axios';

import { POST_USER_HABIT, PUT_USER_HABIT, GET_USER_HABIT_BY_ID } from '../../config/url'
import { formatDateTime, timeDiff } from '../../service/utils.js';
import { createUserHabitNotification, deleteUserHabitNotification } from '../../service/notification'
import {getDeviceId} from '../../service/device'
import { getNotificationToken, setDashboardStatus } from '../../service/storage'
import { analytics, analyticsTrack } from '../../service/mixpanel';

import Logo from '../../component/logo';
import LoadingSpinner from '../../component/loadingSpinner.js';
import DateTimePickerComp from '../../component/dateTimePicker';
import FrontBackButton from '../../component/frontBackButton.js';
import ToastShow from '../../component/toast';
import HabitHowCard from '../../component/habitHowCard';

import colors from '../../config/colors.js';

import containerStyles from '../../styles/containers.js';
import textStyles from '../../styles/text.js';
import buttonStyles from '../../styles/buttons';


let sleepDateInit = new Date()
sleepDateInit.setHours(0)
sleepDateInit.setMinutes(30)
sleepDateInit.setSeconds(0)

let wakeDateInit = new Date()
wakeDateInit.setHours(8)
wakeDateInit.setMinutes(30)
wakeDateInit.setSeconds(0)

function SleepRoutine(props) {
    const { route: { params: { data: { habit, userHabitId } } }, navigation } = props

    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [showTips, setShowTips] = useState(false)
    // Time Picker hooks
    const [showSleepTimer, setShowSleepTimer] = useState(false);
    const [sleepDate, setSleepDate] = useState('');

    const [showWakeTimer, setShowWakeTimer] = useState(false);
    const [wakeDate, setWakeDate] = useState('');

    // weekend skip
    const [skipOnWeekends, setSkipOnWeekends] = useState(false);

    // userHabit Data if exists
    const getUserHabitData = async () => {
        var response = await axios.get(GET_USER_HABIT_BY_ID + `/${userHabitId}`)
        let routineData = response.data.routine
        let routineOne = routineData[0][0]
        setSleepDate(new Date(routineOne.startTime))
        setWakeDate(new Date(routineOne.endTime))
    }

    useEffect(() => {
                if (userHabitId) {
                    analyticsTrack(analytics, "routine:editHabit", {"habitId":habit._id,"habitName":habit.name});
                    getUserHabitData()
                }
                else {
                    analyticsTrack(analytics, "routine:newHabit", {"habitId":habit._id,"habitName":habit.name});
                    setSleepDate(sleepDateInit)
                    setWakeDate(wakeDateInit)
                }
    }, [])

    const onFinishPress = async () => {
        let deviceId = await getDeviceId()
        let token = (await getNotificationToken()) || '123'
        let amount = timeDiff(sleepDate, wakeDate).timeDiffHrsPrecise
        const routine = []

        if (skipOnWeekends){
            analyticsTrack(analytics, "routine:skippedFriSat", {"habitId":habit._id,"habitName":habit.name, "startTime":sleepDate, "endTime":wakeDate, "amount":amount});
        }
        
        for (let i = 0; i < 7; i++) {
            if (skipOnWeekends && (i == 4 || i == 5)) {
                continue;
            }
            routine[i.toString()] = [{
                startTime: sleepDate,
                endTime: wakeDate,
                metric: 'Sleep Duration',
                unit: 'hr',
                amount: amount,
            }]
        }

        if (userHabitId) {
            await axios.put(`${PUT_USER_HABIT}/${userHabitId}`, { deviceId, token, routine, habit })
            analyticsTrack(analytics, "routine:editedHabit", {"habitId":habit._id,"habitName":habit.name, "startTime":sleepDate, "endTime":wakeDate, "amount":amount});
            ToastShow("Habit edited successfully")
        }
        else {
            let result = await axios.post(POST_USER_HABIT, { deviceId, token, routine, habit })
            var newUserHabitId = result.data.data._id
            analyticsTrack(analytics, "routine:finishedHabit", {"habitId":habit._id,"habitName":habit.name, "startTime":sleepDate, "endTime":wakeDate, "amount":amount});
            ToastShow("Habit added successfully")
        }

        await setDashboardStatus(true)
        navigation.navigate('TodayScreen', { refreshPage: true })
        let data = Object.entries(routine).map(i => i[1])
        await deleteUserHabitNotification(userHabitId || newUserHabitId)
        await createUserHabitNotification(userHabitId || newUserHabitId, { data, habit })
    }

    const onBackPress = async () => {
        navigation.navigate('Habit', { refreshPage: true })
    }

    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>{habit.name}
                        <Text style={textStyles.textRed}> Routine</Text>
                    </Text>
                </View>
                <TouchableOpacity onPress={()=>setShowTips(true)}>
                    <Text style={{textAlign:'center', textDecorationLine: 'underline'}}>Show tips</Text>
                </TouchableOpacity>
                {showTips &&
                    <HabitHowCard habitId={habit._id} setShowTips={setShowTips}/>
                }
                <View style={[containerStyles.optionBodymainContainer, { marginTop: 30 }]}>
                    <View style={containerStyles.optionWrapper}>
                        <View style={{ width: "50%" , paddingHorizontal: 10}}>
                            <Text style={textStyles.textMedBlue}>Sleep Time</Text>
                        </View>
                        <View style={[containerStyles.timeContainer, { justifyContent: "center" }]}>
                            <TouchableOpacity onPress={() => setShowSleepTimer(true)}>
                                <Text style={[textStyles.textMedBlue, { textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                    {"       " + formatDateTime(sleepDate).strTime + "       "}
                                </Text>
                            </TouchableOpacity>

                            {showSleepTimer &&
                                (<DateTimePickerComp mode={'time'} setShow={setShowSleepTimer} currentDate={sleepDate} setCurrentDate={setSleepDate} />)
                            }
                        </View>
                    </View>
                    <View style={containerStyles.optionWrapper}>
                        <View style={{ width: "50%" , paddingHorizontal: 10}}>
                            <Text style={textStyles.textMedBlue}>Wake-up Time</Text>
                        </View>
                        <View style={[containerStyles.timeContainer, { justifyContent: "center" }]}>
                            <TouchableOpacity onPress={() => setShowWakeTimer(true)}>
                                <Text style={[textStyles.textMedBlue, { textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                    {"       " + formatDateTime(wakeDate).strTime + "       "}
                                </Text>
                            </TouchableOpacity>

                            {showWakeTimer &&
                                (<DateTimePickerComp mode={'time'} setShow={setShowWakeTimer} currentDate={wakeDate} setCurrentDate={setWakeDate} />)
                            }
                        </View>
                    </View>
                    <View style={containerStyles.optionWrapper}>
                        <View style={{ width: "50%" , paddingHorizontal: 10}}>
                            <Text style={textStyles.textMedBlue}>Sleep Duration</Text>
                        </View>
                        <View style={{ width: "50%" , paddingHorizontal: 10}}>
                            <Text style={[textStyles.textMedBlue, { textAlign: "center" }]}>{timeDiff(sleepDate, wakeDate).timeDiffHrs}
                                <Text style={textStyles.textSmallBlue}> hr </Text>
                                {timeDiff(sleepDate, wakeDate).timeDiffHrsMins}
                                <Text style={textStyles.textSmallBlue}> min </Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "flex-end", }}>
                        <Text style={[textStyles.textSmallBlue, { width: 150 }]} >Skip on Fri, Sat nights</Text>
                        <CheckBox value={skipOnWeekends} onValueChange={(value) => setSkipOnWeekends(value)}></CheckBox>
                    </View>
                </View>
                <TouchableOpacity style={[buttonStyles.bottomButton75pct, {alignSelf:"center"}]} onPress={()=>onFinishPress()}>
                    <Text style={textStyles.textMedBlue}>Finish</Text>
                </TouchableOpacity>
                {/* <FrontBackButton navigation={navigation} next={false} finish={true} onFinishPress={onFinishPress} onBackPress={onBackPress}/> */}
            </View>
        </View>
    );
}

export default SleepRoutine;