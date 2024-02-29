import React, { useEffect, useState, useReducer } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'
import WeekdayPicker from "react-native-weekday-picker"

import colors from '../../config/colors'
import { POST_USER_HABIT, PUT_USER_HABIT, GET_ROUTINE_UNIT_BY_HABIT, GET_USER_HABIT_BY_ID } from '../../config/url'

import DateTimePickerComp from '../../component/dateTimePicker'
import Logo from '../../component/logo'
import FrontBackButton from '../../component/frontBackButton.js'
import ToastShow from '../../component/toast'
import HabitHowCard from '../../component/habitHowCard';

import containerStyles from '../../styles/containers.js'
import font from '../../config/font'
import textStyles from '../../styles/text.js'
import iconStyles from '../../styles/icons'
import buttonStyles from '../../styles/buttons'

import { formatDateTime, dateToWeekdayInt } from '../../service/utils.js'
import { analytics, analyticsTrack } from '../../service/mixpanel';
import { createUserHabitNotification, deleteUserHabitNotification } from '../../service/notification'
import { getDeviceId } from '../../service/device'
import { getNotificationToken, setDashboardStatus } from '../../service/storage'
import { color } from 'react-native-reanimated'

const daysMapping = { 0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday" }
const ADD_TO_ROUTINE = 'ADD_TO_ROUTINE'
const REMOVE_FROM_ROUTINE = 'REMOVE_FROM_ROUTINE'
const EDIT_ROUTINE_TIME = 'EDIT_ROUTINE_TIME'
const EDIT_ROUTINE_AMT = 'EDIT_ROUTINE_AMT'
const PASTE_ROUTINE = 'PASTE_ROUTINE'
const SET_ROUTINE = 'SET_ROUTINE'
const RESET = 'RESET'
const daysRoutineInit = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
const daysRoutineInit_bk = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }

const routineReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_ROUTINE:
            state[action.dayVal].push(action.routineObj)
            return state
        case REMOVE_FROM_ROUTINE:
            state[action.dayVal].splice(action.index, 1)
            return state
        case EDIT_ROUTINE_TIME:
            state[action.dayVal][action.index] = { ...state[action.dayVal][action.index], startTime: action.startTime }
            return state
        case EDIT_ROUTINE_AMT:
            state[action.dayVal][action.index] = { ...state[action.dayVal][action.index], amount: action.amount }
            return state
        case PASTE_ROUTINE:
            state[action.dayVal] = []
            state[action.dayVal] = action.copiedRoutine
            return state
        case SET_ROUTINE:
            state = action.routine
            return state
        case RESET:
            state = daysRoutineInit_bk
            return state
    }
}

function WalkRoutine(props) {
    const { route: { params: { data: { habit, userHabitId } } }, navigation } = props
    const [selectedDay, setSelectedDay] = useState({ 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 })
    const [metricTypes, setMetricTypes] = useState([])
    const [selectedMetric, setSelectedMetric] = useState({})
    const [daysCountState, setDaysCountState] = useState(0)
    const [showTips, setShowTips] = useState(false)
    // Time Picker hooks
    const [showTimer, setShowTimer] = useState(false);
    const [startTime, setStartTime] = useState(new Date())
    const [routine, dispatchRoutine] = useReducer(routineReducer, daysRoutineInit)
    const [activeDayVal, setActiveDayVal] = useState(0)
    const [prevActiveDayVal, setPrevActiveDayVal] = useState(0)
    const [activeDaysKeys, setActiveDaysKeys] = useState([0, 1, 2, 3, 4, 5, 6]) // all days allowed
    const [defaultAdded, setDefaultAdded] = useState(false)
    const [refreshScreen, setRefreshScreen] = useState(false)

    const currentDate = new Date()
    var routineObj = { startTime: "", metric: selectedMetric.type, unit: selectedMetric.name, amount: selectedMetric.amount, location: "" }

    const onTrackingMetricSelection = (value) => {
        if (!userHabitId) {
            analyticsTrack(analytics, "routine:selectedTrackingMetric", { "habitId": habit._id, "habitName": habit.name, "metric": value });
            let defaultMetricObject = metricTypes.filter(v => v.type === value)
            console.log(defaultMetricObject)
            setSelectedMetric({
                ...defaultMetricObject[0],
                amount: defaultMetricObject[0].defaultAmount,
                type: value,
                name: defaultMetricObject[0].name
            })
        }
    }

    // userHabit Data if exists
    const getUserHabitData = async () => {

        var response = await axios.get(GET_USER_HABIT_BY_ID + `/${userHabitId}`)
        let routineData = response.data.routine
        dispatchRoutine({ type: SET_ROUTINE, routine: routineData })
        let routineOne = routineData[0][0]
        setSelectedMetric({
            type: routineOne.metric,
            name: routineOne.unit,
            amount: routineOne.amount
        })
    }

    // on screen load
    useEffect(() => {
        axios.get(GET_ROUTINE_UNIT_BY_HABIT + `/${habit._id}`)
            .then(metric => {
                setMetricTypes(metric.data.units)
                if (userHabitId) {
                    analyticsTrack(analytics, "routine:editHabit", { "habitId": habit._id, "habitName": habit.name });
                    getUserHabitData()
                }

                else {
                    const defaultMetric = metric.data.units.find(metric => metric.default)
                    setSelectedMetric({
                        ...defaultMetric,
                        amount: defaultMetric.defaultAmount
                    })
                }


            }).catch(e => {
                console.error('Unable to fetch Tracking Metric!')
                //analytics.track("visitedRoutineUnitSelection_fail");
            })
    }, [])


    const getWeekdayStartTime = (targetWeekdayInt, currentDate) => {
        const currentWeekdayInt = dateToWeekdayInt(currentDate)
        var weekdayIntDiff = targetWeekdayInt - currentWeekdayInt

        if (weekdayIntDiff < 0) {
            weekdayIntDiff = 7 + weekdayIntDiff
        }
        return new Date(currentDate.getTime() + 24 * 3600 * 1000 * weekdayIntDiff).toISOString()
    }

    const addDefaultRoutines = () => {
        for (let i = 0; i < 7; i++) {
            if (selectedDays[i] == 1) {
                addToRoutine(i)
                setActiveDaysKeys(activeDaysKeys => [...activeDaysKeys, i]) // get list of days when user wants to do the habit
            }
        }
    }

    const copyPasteRoutine = (fromDay, toDay) => {
        analyticsTrack(analytics, "routine:copyRoutineOneDay", { "habitId": habit._id, "habitName": habit.name, "fromDay": fromDay, "toDay": toDay, "metric": selectedMetric.type, "unit": selectedMetric.name });
        copyRoutine(fromDay, toDay)
    }

    const copyRoutine = (fromDay, toDay) => {
        let routineList = routine[fromDay]
        let routineListCopy = JSON.parse(JSON.stringify(routineList));
        dispatchRoutine({ type: PASTE_ROUTINE, dayVal: toDay, copiedRoutine: routineListCopy })
        setRefreshScreen(!refreshScreen)
    }

    const copyRoutineAllDays = (fromDay) => {
        analyticsTrack(analytics, "routine:copyRoutineAllDays", { "habitId": habit._id, "habitName": habit.name, "fromDay": fromDay, "metric": selectedMetric.type, "unit": selectedMetric.name });
        for (let i = 0; i < 7; i++) {
            if (fromDay != i) {
                copyRoutine(fromDay, i)
            }
        }
    }

    const countNumRoutineItems = () => {
        let temp = 0
        for (let i = 0; i < 7; i++) {
            temp = temp + routine[i].length
        }
        return temp
    }

    // on screen load
    useEffect(() => {
        async function loadscreen() {
            // get the info from backend
            if (!defaultAdded) {
                //addDefaultRoutines()
                setDefaultAdded(true)
            }
            let { daysList, daysCount, sessionCount } = getRoutineDays(routine)
            setDaysCountState(daysCount)
        }
        loadscreen()
    }, [refreshScreen])

    const occursString = () => {
        //let daysWithRoutine = []
        let totalActiveDays = 0
        let activeDaysString = []

        for (let i = 0; i < 7; i++) {
            if (routine[i].length > 0) {
                totalActiveDays++
                activeDaysString.push(daysMapping[i])
            }
        }
        if (totalActiveDays == 0)
            return "Please add an activity"
        if (totalActiveDays === 1)
            return "Occurs every " + activeDaysString[0]
        if (totalActiveDays == 7)
            return "Occurs everyday"

        const lastDay = activeDaysString.pop()
        return "Occurs every " + activeDaysString.join(', ') + ', and ' + lastDay
    }

    const handleDaysSelectionPressed = (days) => {
        var daysInt = days
        for (let i = 0; i < 7; i++) {
            if (days[i] == 1 && i != activeDayVal && activeDaysKeys.includes(i)) {
                analyticsTrack(analytics, "routine:selectedDay", { "habitId": habit._id, "habitName": habit.name, "prevDay": activeDayVal, "selectedDay": i });
                setActiveDayVal(i)
                daysInt[i] = 1
            }
            else if (days[i] == 0 && i == activeDayVal && activeDaysKeys.includes(i)) {
                daysInt[i] = 1
            }
            else {
                daysInt[i] = 0
            }
        }
        setSelectedDay(daysInt)
        setRefreshScreen(!refreshScreen)
    }

    // handle add to routine
    const addToRoutine = (dayVal) => {
        analyticsTrack(analytics, "routine:addToRoutine", { "habitId": habit._id, "habitName": habit.name, "day": activeDayVal, "metric": selectedMetric.type, "unit": selectedMetric.name });
        routineObj.startTime = getWeekdayStartTime(dayVal, currentDate)
        dispatchRoutine({ type: ADD_TO_ROUTINE, dayVal: dayVal, routineObj: routineObj })
        setPrevActiveDayVal(activeDayVal)
        setRefreshScreen(!refreshScreen)
    }
    const removeFromRoutine = (index) => {
        analyticsTrack(analytics, "routine:removeFromRoutine", { "habitId": habit._id, "habitName": habit.name, "day": activeDayVal, "metric": selectedMetric.type, "unit": selectedMetric.name });
        dispatchRoutine({ type: REMOVE_FROM_ROUTINE, dayVal: activeDayVal, index: index, routineObj: routineObj })
        setRefreshScreen(!refreshScreen)
    }

    // on amount input
    const onAmountInput = (value, activeDayVal, index) => {
        //analytics.track("setRoutineUnitVal");
        dispatchRoutine({ type: EDIT_ROUTINE_AMT, dayVal: activeDayVal, index: index, amount: value })
        setRefreshScreen(!refreshScreen)
    };

    // on time input
    const onTimeInput = (value, activeDayVal, index) => {
        //analytics.track("setRoutineUnitVal");
        let valueMod = getWeekdayStartTime(activeDayVal, value)
        dispatchRoutine({ type: EDIT_ROUTINE_TIME, dayVal: activeDayVal, index: index, startTime: valueMod })
        setRefreshScreen(!refreshScreen)
    };

    const getRoutineDays = (routine) => {
        var daysList = []
        var daysCount = 0
        var sessionCount = 0
        for (let i = 0; i < 7; i++) {
            if (routine[i].length > 0) {
                daysList.push(i)
                daysCount = daysCount + 1
                sessionCount = sessionCount + routine[i].length
            }
        }
        return { daysList, daysCount, sessionCount }
    }

    // Finish Screen
    const onFinishPress = async () => {
        let deviceId = await getDeviceId()
        let token = (await getNotificationToken()) || '123'
        let { daysList, daysCount, sessionCount } = getRoutineDays(routine)
        if (daysCount > 0) {
            if (userHabitId) {
                await axios.put(`${PUT_USER_HABIT}/${userHabitId}`, { deviceId, token, routine, habit }).catch(console.error)
                analyticsTrack(analytics, "routine:editedHabit", { "habitId": habit._id, "habitName": habit.name, "daysList": daysList, "daysCount": daysCount, "sessionCount": sessionCount, "metric": selectedMetric.type, "unit": selectedMetric.name });
                ToastShow("Habit edited successfully")
            }
            else {
                let result = await axios.post(POST_USER_HABIT, { deviceId, token, routine, habit })
                var newUserHabitId = result.data.data._id
                analyticsTrack(analytics, "routine:finishedHabit", { "habitId": habit._id, "habitName": habit.name, "daysList": daysList, "daysCount": daysCount, "sessionCount": sessionCount, "metric": selectedMetric.type, "unit": selectedMetric.name });
                ToastShow("Habit added successfully")
                // analytics.track("finishRoutineLocation_new", { "location": location, "habitId": habit._id, "habitName": habit.name });
            }

            await setDashboardStatus(true)
            navigation.navigate('TodayScreen', { refreshPage: true })
            let data = Object.entries(routine).map(i => i[1])
            await deleteUserHabitNotification(userHabitId || newUserHabitId)
            await createUserHabitNotification(userHabitId || newUserHabitId, { data, habit })
            dispatchRoutine({ type: RESET })
        }
        else {
            Alert.alert(
                "Your Routine is empty",
                "Please add an activity to the routine with the '+' button :)",
                [{}, {}]
            );
        }

    }

    // let 
    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                {/* <LoadingSpinner loadingIndicator={loadingIndicator} /> */}
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
                <View style={[containerStyles.optionBodymainContainer, { marginTop: 15 }]}>
                    {metricTypes.length > 1 && !userHabitId &&
                        <View style={[containerStyles.optionWrapper, { height: "12%", flexDirection: 'column', justifyContent: 'space-evenly', borderTopColor: colors.backgroundDarkBlue, borderBottomColor: colors.backgroundDarkBlue, borderTopWidth: 0.5, borderBottomWidth: 0.5 }]}>
                            {/* <Text style={[textStyles.textSmallRed, {alignSelf:'flex-start'}]}>Step 1</Text> */}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: "50%" }}>
                                    <Text style={textStyles.textMedBlue}>Tracking Metric</Text>
                                </View>
                                <View style={{ width: "50%", borderColor: colors.textGray, borderWidth: 0.5, borderRadius: 8, justifyContent: 'center' }}>
                                    {!userHabitId &&
                                        <Picker style={{ color: colors.textBlue, flex: 1 }} selectedValue={selectedMetric.type} onValueChange={onTrackingMetricSelection}>
                                            {
                                                metricTypes.map((trackingMetric, i) => {
                                                    return (
                                                        <Picker.Item style={textStyles.text} label={trackingMetric.type} value={trackingMetric.type} key={trackingMetric._id}>
                                                        </Picker.Item>
                                                    )
                                                })
                                            }
                                        </Picker>
                                    }
                                    {userHabitId &&
                                        <Text style={textStyles.textMedBlue}>{selectedMetric?.type || ''}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                    }
                    <View style={[containerStyles.optionWrapper, { flexDirection: 'column', justifyContent: 'space-evenly', borderBottomWidth: 1 }]}>
                        {/* <Text style={[textStyles.textSmallRed, {alignSelf:'flex-start'}]}>Step 2</Text> */}
                        <WeekdayPicker days={selectedDay} onChange={handleDaysSelectionPressed} />
                    </View>
                    <View style={[containerStyles.optionWrapper, { height: "10%", justifyContent: "center", marginBottom: 25 }]}>
                        <Text style={[textStyles.textSmallBlue, { textAlign: "center" }]}>{daysMapping[activeDayVal]} Routine</Text>
                    </View>
                    {/* <View style={[containerStyles.optionWrapper, {height:"5%", borderBottomWidth:0}]}></View> */}
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "50%" }}>
                            <Text style={[textStyles.textSmallerGray, { marginTop: 5 }]}>Start Time</Text>
                        </View>
                        <View style={{ width: "50%" }}>
                            <Text style={[textStyles.textSmallerGray, { marginTop: 5 }]}>{selectedMetric.type} ({selectedMetric.name})</Text>
                        </View>
                    </View>
                    <ScrollView style={{ height: "18%" }}>
                        {
                            routine[activeDayVal].map((dayRoutineItem, i) => {
                                return (

                                    <View style={[containerStyles.optionWrapper, { height: 50 }]} key={i}>
                                        <View style={{ width: "50%" }}>
                                            <View style={[containerStyles.timeContainer, { justifyContent: "center", padding: 10 }]}>
                                                <TouchableOpacity onPress={() => setShowTimer(true)}>
                                                    <Text style={[textStyles.textMedBlue, { width: "100%", textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]}>
                                                        {formatDateTime(dayRoutineItem.startTime).strTime}
                                                    </Text>
                                                </TouchableOpacity>
                                                {showTimer &&
                                                    (<DateTimePickerComp mode={'time'} setShow={setShowTimer} currentDate={new Date(dayRoutineItem.startTime)} setCurrentDate={setStartTime} routineTime={[onTimeInput, activeDayVal, i]} />)
                                                }
                                            </View>
                                        </View>
                                        <View style={{ width: "50%" }}>
                                            <View style={[containerStyles.timeContainer, { justifyContent: "center", padding: 10 }]}>
                                                <TextInput style={[textStyles.textMedBlue, { width: "80%", textAlign: "center", borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }]} keyboardType='numeric' value={dayRoutineItem.amount} onChangeText={(text) => onAmountInput(text, activeDayVal, i)}></TextInput>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                                            <TouchableOpacity style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }} onPress={() => removeFromRoutine(i)}>
                                                <Image style={iconStyles.tiniestLogo} source={require('../../assets/icons/Icon_delete.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                    <View style={{ alignItems: "center", marginTop: 10 }}>
                        <TouchableOpacity style={[buttonStyles.button20pct, { borderColor: colors.textRed }]} onPress={() => addToRoutine(activeDayVal)}>
                            <Text style={[textStyles.textRed]}> + </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: "center", marginTop: 10 }}>
                        {routine[activeDayVal].length == 0 && (countNumRoutineItems() > 0) &&
                            (<TouchableOpacity onPress={() => copyPasteRoutine(prevActiveDayVal, activeDayVal)}>
                                <Text style={{ borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }}> Copy from {daysMapping[prevActiveDayVal]} </Text>
                            </TouchableOpacity>)
                        }
                        {routine[activeDayVal].length > 0 &&
                            (<TouchableOpacity onPress={() => copyRoutineAllDays(activeDayVal)}>
                                <Text style={{ borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1 }}> Follow {daysMapping[activeDayVal]} routine on all days </Text>
                            </TouchableOpacity>)
                        }

                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={[textStyles.textSmallRed, { textAlign: "center" }]}>{occursString()}</Text>
                    </View>

                </View>
                <TouchableOpacity style={[daysCountState > 0 ? buttonStyles.bottomButton75pct : buttonStyles.bottomButton75pctGray, { alignSelf: "center" }]} onPress={() => onFinishPress()}>
                    <Text style={daysCountState > 0 ? textStyles.textMedBlue : textStyles.textMedGray}>Finish</Text>
                </TouchableOpacity>
                {/* <FrontBackButton navigation={navigation} next={false} finish={true} onFinishPress={onFinishPress} /> */}
            </View>
        </View>
    );
}

export default WalkRoutine;