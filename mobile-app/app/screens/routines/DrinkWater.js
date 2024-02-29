import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

import { GET_ROUTINE_UNIT_BY_HABIT, POST_USER_HABIT, PUT_USER_HABIT, GET_USER_HABIT_BY_ID } from '../../config/url'
import { formatDateTime } from '../../service/utils.js';

import Logo from '../../component/logo';
import LoadingSpinner from '../../component/loadingSpinner.js';
import FrontBackButton from '../../component/frontBackButton.js';
import DateTimePickerComp from '../../component/dateTimePicker';
import ToastShow from '../../component/toast';

import colors from '../../config/colors.js';
import * as habitIds from '../../config/habitId';

import containerStyles from '../../styles/containers.js';
import textStyles from '../../styles/text.js';
import buttonStyles from '../../styles/buttons';

import { createUserHabitNotification, deleteUserHabitNotification } from '../../service/notification'
import { getDeviceId } from '../../service/device'
import { getNotificationToken, setDashboardStatus } from '../../service/storage'
import { analytics, analyticsTrack } from '../../service/mixpanel';
import HabitHowCard from '../../component/habitHowCard';

let startDateInit = new Date()
startDateInit.setHours(9)
startDateInit.setMinutes(0)

let endDateInit = new Date()
endDateInit.setHours(23)
endDateInit.setMinutes(30)
let endDateInit2 = new Date()
endDateInit2.setHours(16)
endDateInit2.setMinutes(0)

let endDateDict = {}
endDateDict[habitIds.habitIdDrinkingWater] = endDateInit
endDateDict[habitIds.habitIdEatingFruits] = endDateInit2

function DrinkWaterRoutine(props) {
    const { route: { params: { data: { habit, userHabitId } } }, navigation } = props
    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [metricTypes, setMetricTypes] = useState([])
    const [selectedMetric, setSelectedMetric] = useState({})
    const [showTips, setShowTips] = useState(false)
    // Time Picker hooks
    const [showStartTimer, setShowStartTimer] = useState(false);
    const [startDate, setStartDate] = useState('');

    const [showEndTimer, setShowEndTimer] = useState(false);
    const [endDate, setEndDate] = useState('');

    // userHabit Data if exists
    const getUserHabitData = async () => {
        var response = await axios.get(GET_USER_HABIT_BY_ID + `/${userHabitId}`)
        let routineData = response.data.routine
        let routineOne = routineData[0][0]
        console.log("routineOne", routineOne)
        setStartDate(new Date(routineOne.startTime))
        setEndDate(new Date(routineOne.endTime))
        setSelectedMetric({
            type: routineOne.metric,
            name: routineOne.unit,
            amount: routineOne.amount
        })
    }

    useEffect(() => {
        axios.get(GET_ROUTINE_UNIT_BY_HABIT + `/${habit._id}`)
            .then(metric => {
                setMetricTypes(metric.data.units)
                console.log({ metric: metric.data })
                if (userHabitId) {
                    console.log("userHabitId ", userHabitId)
                    analyticsTrack(analytics, "routine:editHabit", { "habitId": habit._id, "habitName": habit.name });
                    getUserHabitData()
                }
                else {
                    analyticsTrack(analytics, "routine:newHabit", { "habitId": habit._id, "habitName": habit.name });
                    const defaultMetric = metric.data.units.find(metric => metric.default)
                    setStartDate(startDateInit)
                    setEndDate(endDateDict[habit._id])
                    setSelectedMetric({
                        ...defaultMetric,
                        amount: defaultMetric.defaultAmount
                    })
                }
            }).catch(e => {
                console.error('Unable to fetch Tracking Metric!')
            }).finally(() => {
                setLoadingIndicator(false)
            })
    }, [])

    const onTrackingMetricSelection = (value, index) => {
        console.log(value)
        if (!userHabitId) {
            analyticsTrack(analytics, "routine:selectedTrackingMetric", { "habitId": habit._id, "habitName": habit.name, "metric": value });
            let defaultMetricObject = metricTypes.filter(v => v.type === value)
            console.log(defaultMetricObject)
            setSelectedMetric({
                ...defaultMetricObject[0],
                amount: defaultMetricObject[0].defaultAmount,
                //type: value,
                //name: defaultMetricObject?.name,
            })
        }
    }
    const onAmountInput = (value) => {
        setSelectedMetric({
            ...selectedMetric,
            amount: value,
        })
    };
    const onFinishPress = async () => {
        let deviceId = await getDeviceId()
        let token = (await getNotificationToken()) || '123'
        const routine = []
        for (let i = 0; i < 7; i++) {
            routine[i.toString()] = [{
                startTime: startDate,
                endTime: endDate,
                metric: selectedMetric.type,
                unit: selectedMetric.name,
                amount: selectedMetric.amount,

            }]
        }

        if (userHabitId) {
            await axios.put(`${PUT_USER_HABIT}/${userHabitId}`, { deviceId, token, routine, habit }).catch(e => console.error(e))
            analyticsTrack(analytics, "routine:editedHabit", { "habitId": habit._id, "habitName": habit.name, "startTime": startDate, "endTime": endDate, "amount": selectedMetric.amount, "metric": selectedMetric.type, "unit": selectedMetric.name });
            ToastShow("Habit edited successfully")
        }
        else {
            let result = await axios.post(POST_USER_HABIT, { deviceId, token, routine, habit }).catch(e => console.error(e))
            var newUserHabitId = result.data.data._id
            analyticsTrack(analytics, "routine:finishedHabit", { "habitId": habit._id, "habitName": habit.name, "startTime": startDate, "endTime": endDate, "amount": selectedMetric.amount, "metric": selectedMetric.type, "unit": selectedMetric.name });
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
                <TouchableOpacity onPress={() => setShowTips(true)}>
                    <Text style={{ textAlign: 'center', textDecorationLine: 'underline' }}>Show tips</Text>
                </TouchableOpacity>
                {showTips &&
                    <HabitHowCard habitId={habit._id} setShowTips={setShowTips} />
                }
                <View style={[containerStyles.optionBodymainContainer, { marginTop: 30 }]}>
                    <View style={containerStyles.optionWrapper}>
                        <Text style={textStyles.textMedBlue}>Remind me everyday between</Text>
                    </View>
                    <View style={containerStyles.optionWrapper}>
                        <View style={[containerStyles.timeContainer, { justifyContent: "center" }]}>
                            <TouchableOpacity onPress={() => setShowStartTimer(true)}>
                                <Text style={[textStyles.textMedBlue, { textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                    {"    " + formatDateTime(startDate).strTime + "    "}
                                </Text>
                            </TouchableOpacity>
                            <Text style={textStyles.textMedBlue}>     and     </Text>
                            <TouchableOpacity onPress={() => setShowEndTimer(true)}>
                                <Text style={[textStyles.textMedBlue, { textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                    {"    " + formatDateTime(endDate).strTime + "    "}
                                </Text>
                            </TouchableOpacity>

                            {showStartTimer &&
                                (<DateTimePickerComp mode={'time'} setShow={setShowStartTimer} currentDate={startDate} setCurrentDate={setStartDate} />)
                            }
                            {showEndTimer &&
                                (<DateTimePickerComp mode={'time'} setShow={setShowEndTimer} currentDate={endDate} setCurrentDate={setEndDate} />)
                            }
                        </View>
                    </View>
                    <View style={containerStyles.optionWrapper}>
                        <View style={{ width: "20%", marginRight: 10 }}>
                            <Text style={textStyles.textMedBlue}>to have</Text>
                        </View>
                        <View style={{ width: "25%", marginRight: 10 }}>
                            <TextInput style={[textStyles.textMedBlue, { textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]} keyboardType='numeric' value={selectedMetric.amount} onChangeText={(text) => onAmountInput(text)}></TextInput>
                        </View>
                        <View style={{ width: "50%", borderColor: colors.textGray, borderWidth: 0.5, borderRadius: 8, height: "60%", justifyContent: 'center' }}>
                            {/* <Text style={textStyles.text}>{selectedMetric.type}</Text> */}
                            {!userHabitId &&
                                <Picker style={{ color: colors.textBlue, flex: 0.5 }} selectedValue={selectedMetric.type} onValueChange={onTrackingMetricSelection}>
                                    {
                                        metricTypes.map((trackingMetric, i) => {
                                            return (
                                                <Picker.Item style={[textStyles.textMedBlue]} label={trackingMetric.type} value={trackingMetric.type} key={trackingMetric._id} />
                                            )
                                        })
                                    }
                                </Picker>
                            }
                            {userHabitId &&
                                <Text style={textStyles.textMedBlue}>  {selectedMetric?.type || ''}</Text>
                            }
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[buttonStyles.bottomButton75pct, { alignSelf: "center" }]} onPress={() => onFinishPress()}>
                    <Text style={textStyles.textMedBlue}>Finish</Text>
                </TouchableOpacity>
                {/* <FrontBackButton navigation={navigation} next={false} finish={true} onFinishPress={onFinishPress} onBackPress={onBackPress} /> */}
            </View>
        </View>
    );
}

export default DrinkWaterRoutine;