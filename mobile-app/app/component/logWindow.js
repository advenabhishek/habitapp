import React, { useState, useEffect } from 'react';
import { Dimensions, View, Modal, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import CheckBox from 'expo-checkbox'
import axios from 'axios';
import ToastShow from './toast';


import { POST_USER_HABIT_LOG, PUT_USER_LOG } from '../config/url'


import DateTimePickerComp from './dateTimePicker';

import colors from '../config/colors';
import containerStyles from '../styles/containers';
import textStyles from '../styles/text';
import iconStyles from '../styles/icons';
import buttonStyles from '../styles/buttons';
import { formatDateTime, timeDiff } from '../service/utils';
import { analytics, analyticsTrack } from '../service/mixpanel';

import * as habitId from '../config/habitId'


const windowHeight = Dimensions.get('window').height;

function LogWindow(props) {
    const { loggingHabit, SetLoggingHabit, SetLogContainerVisible, refreshPage, setRefreshPage, disableDate, showSkip = false } = props
    const [showDate, setShowDate] = useState(false)
    const [showStartTime, setShowStartTime] = useState(false)
    const [showEndTime, setShowEndTime] = useState(false)
    const [skippedDay, setSkippedDay] = useState(false)
    const [showSkipButton, setShowSkipButton] = useState(showSkip)
    const [startTimeString, setStartTimeString] = useState()
    const [endTimeString, setEndTimeString] = useState()
    const [calcMetric, setCalcMetric] = useState()

    useEffect(async () => {
        //analytics.track("visitedHabit");
        let logHabId = loggingHabit.habitId
        analyticsTrack(analytics, "logWindow");
        if (logHabId == habitId.habitIdDrinkingWater) {
            setShowSkipButton(false)
            setStartTimeString("Drink Time")
            setCalcMetric(false)
        }
        else if (logHabId == habitId.habitIdSleeping) {
            setShowSkipButton(false)
            setStartTimeString("Sleep Time")
            setEndTimeString("Wake-up Time")
            setCalcMetric(true)
        }
        else {
            setCalcMetric(false)
        }
    }, [])


    const handleLogFinishClick = async () => {
        let habitStartDate = new Date(loggingHabit.userInputDate)
        let habitStartTime = new Date(loggingHabit.habitStartTime)
        habitStartDate.setHours(habitStartTime.getHours())
        habitStartDate.setMinutes(habitStartTime.getMinutes())
        habitStartDate.setSeconds(0)
        if (loggingHabit.habitEndTime != '') {
            let habitEndDate = new Date(loggingHabit.userInputDate)
            let habitEndTime = new Date(loggingHabit.habitEndTime)
            habitEndDate.setHours(habitEndTime.getHours())
            habitEndDate.setMinutes(habitEndTime.getMinutes())
            habitEndDate.setSeconds(0)
            if (habitStartDate.getTime() > habitEndDate.getTime()) {
                habitStartDate = habitStartDate - 24 * 3600 * 1000
            }
        }
        if (loggingHabit.logId) {
            analyticsTrack(analytics, "logWindow:editedLog", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName, "habitStartTime": habitStartDate, "amount": loggingHabit.userInputAmount });
            ToastShow("Log edited successfully")
            axios.put(`${PUT_USER_LOG}/${loggingHabit._id}`, {
                time: habitStartDate,
                amount: loggingHabit.userInputAmount,
                location: loggingHabit.userInputLocation || " ",

                // startTime: loggingHabit.habitStartTime,
                // endTime: loggingHabit.endTime || "",
                // amount: loggingHabit.userInputAmount,
                // location: loggingHabit.userInputLocation || " ",
                // skip: skippedDay
            })
                .then(() => {
                    console.log("successfully edited log")
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            await axios.post(POST_USER_HABIT_LOG, {
                userHabitId: loggingHabit._id,
                time: habitStartDate,
                amount: loggingHabit.userInputAmount,
                location: loggingHabit.userInputLocation || " ",
            })
            ToastShow("Log added successfully")
            analyticsTrack(analytics, "logWindow:finishedLog", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName, "habitStartTime": habitStartDate, "amount": loggingHabit.userInputAmount });
        }
        SetLogContainerVisible(false)
        setRefreshPage(!refreshPage)
    }

    const onChangeDate = (selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            analyticsTrack(analytics, "logWindow:changeDate", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName, "daysDiff": timeDiff(loggingHabit.userInputDate, selectedDate).timeDiffDays })
            SetLoggingHabit({ ...loggingHabit, userInputDate: selectedDate })
        }
    };

    const onChangeStartTime = (selectedDate) => {
        setShowStartTime(false)
        if (selectedDate) {
            let habitDuration = timeDiff(selectedDate, loggingHabit.habitEndTime).timeDiffHrsPrecise.toString()
            analyticsTrack(analytics, "logWindow:changeStartTime", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName, "timeDiffHrs": timeDiff(loggingHabit.habitStartTime, selectedDate).timeDiffHrsPrecise })
            //setCalcTimeDiff(habitDuration)
            SetLoggingHabit({ ...loggingHabit, habitStartTime: selectedDate, userInputAmount: calcMetric ? habitDuration : loggingHabit.userInputAmount })
        }
    };

    const onChangeEndTime = (selectedDate) => {
        setShowEndTime(false)
        if (selectedDate) {
            let habitDuration = timeDiff(loggingHabit.habitStartTime, selectedDate).timeDiffHrsPrecise.toString()
            analyticsTrack(analytics, "logWindow:changeEndTime", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName, "timeDiffHrs": timeDiff(loggingHabit.habitEndTime, selectedDate).timeDiffHrsPrecise })
            SetLoggingHabit({ ...loggingHabit, habitEndTime: selectedDate, userInputAmount: calcMetric ? habitDuration : loggingHabit.userInputAmount })

        }
    };

    const daySkipped = (value) => {
        analyticsTrack(analytics, "logWindow:skipPressed", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName });
        setSkippedDay(value);
        SetLoggingHabit({
            ...loggingHabit,
            userInputAmount: "0",
            userInputLocation: " "
        })
    }

    const closeLogBox = () => {
        analyticsTrack(analytics, "logWindow:closePressed", { "habitId": loggingHabit.habitId, "habitName": loggingHabit.habitName });
        setSkippedDay(false)
        SetLogContainerVisible(false)
    }


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
        >
            <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
                <View style={containerStyles.userDataLoggingContainer}>
                    <View style={containerStyles.loggingWindowChildContainer}>
                        <View style={iconStyles.tinyIcon}>
                            <Image
                                style={iconStyles.tinyLogo}
                                source={{ uri: loggingHabit.awsKey }}
                            />
                        </View>
                        <Text style={textStyles.text}>{loggingHabit.habitName || ""}</Text>
                        <View style={{ position: "absolute", left: 300 }}>
                            <TouchableOpacity style={[buttonStyles.button, { paddingHorizontal: 5 }]} onPress={() => closeLogBox()}>
                                <Text style={textStyles.textSmallRed}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={containerStyles.loggingWindowChildContainer}></View>
                    <View style={containerStyles.loggingWindowChildContainer}>
                        <Text style={textStyles.logWindowText} >Date</Text>
                        <TouchableOpacity onPress={() => setShowDate(true)}>
                            <Text style={[textStyles.textMedBlue, { width: 140, textAlign: 'center', borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                {formatDateTime(loggingHabit.userInputDate).strDate}
                            </Text>
                        </TouchableOpacity>
                        {showDate && !disableDate &&
                            (<DateTimePickerComp mode={'date'} setShow={setShowDate} currentDate={new Date(loggingHabit.userInputDate)} maximumDate={new Date()} setCurrentDate={onChangeDate} />)
                        }
                    </View>
                    {endTimeString &&
                        <View style={containerStyles.loggingWindowChildContainer}>
                            <Text style={textStyles.logWindowText}>{endTimeString || "End Time"}</Text>
                            <TouchableOpacity onPress={() => setShowEndTime(true)}>
                                <Text style={[textStyles.textMedBlue, { width: 140, textAlign: 'center', borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                    {formatDateTime(loggingHabit.habitEndTime).strTime}
                                </Text>
                            </TouchableOpacity>
                            {showEndTime &&
                                (<DateTimePickerComp mode={'time'} setShow={setShowEndTime} currentDate={new Date(loggingHabit.habitEndTime)} setCurrentDate={onChangeEndTime} />)
                            }
                        </View>
                    }
                    <View style={containerStyles.loggingWindowChildContainer}>
                        <Text style={textStyles.logWindowText}>{startTimeString || "Start Time"}</Text>
                        <TouchableOpacity onPress={() => setShowStartTime(true)}>
                            <Text style={[textStyles.textMedBlue, { width: 140, textAlign: 'center', borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                {formatDateTime(loggingHabit.habitStartTime).strTime}
                            </Text>
                        </TouchableOpacity>
                        {showStartTime &&
                            (<DateTimePickerComp mode={'time'} setShow={setShowStartTime} currentDate={new Date(loggingHabit.habitStartTime)} setCurrentDate={onChangeStartTime} />)
                        }
                    </View>
                    <View style={containerStyles.loggingWindowChildContainer}>
                        <Text style={textStyles.logWindowText}>{loggingHabit.metric || ""}</Text>
                        {!calcMetric &&
                            <TextInput style={[textStyles.textMedBlue, { textAlign: "center", width: 80, borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]} editable={!skippedDay} keyboardType='numeric' value={loggingHabit.userInputAmount} onChangeText={(text) => { SetLoggingHabit({ ...loggingHabit, userInputAmount: text }) }}></TextInput>
                        }
                        {calcMetric &&
                            <Text style={[textStyles.textMedBlue, { textAlign: "center", width: 80 }]}>{loggingHabit.userInputAmount}</Text>
                        }
                        <Text style={textStyles.textMedBlue}>  {loggingHabit.unit || ""}</Text>
                    </View>
                    <View style={containerStyles.loggingWindowChildContainer}>
                        <Text style={textStyles.logWindowText} >Location
                            <Text style={textStyles.textSmallerGray}> (optional)</Text>
                        </Text>
                        <TextInput style={[textStyles.textMedBlue, { textAlign: "center", width: 140, borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]} editable={!skippedDay} value={loggingHabit.userInputLocation || " "} onChangeText={(text) => { SetLoggingHabit({ ...loggingHabit, userInputLocation: text }) }}></TextInput>
                    </View>
                    {showSkipButton &&
                        <View style={containerStyles.loggingWindowChildContainer}>
                            <Text style={textStyles.logWindowText} >Skip Day</Text>
                            <CheckBox style={{ alignSelf: "center" }} value={skippedDay} onValueChange={(value) => daySkipped(value)}></CheckBox>
                        </View>
                    }
                    <View style={{ position: "absolute", bottom: 20, right: 20 }}>
                        <TouchableOpacity style={[buttonStyles.buttonLog, { height: 33 }]} onPress={handleLogFinishClick}>
                            <Text style={textStyles.textMedBlue}>Log</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    )
};

export default LogWindow;