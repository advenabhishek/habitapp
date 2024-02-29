import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native";

// apis
import { GET_HABIT_BY_ID, GET_USER_HABIT_LOG_SUMMARY, DELETE_USER_HABIT, GET_USER_HABIT_BY_USER, GET_USER_LOG } from '../config/url'

// components
import Logo from '../component/logo';
import LoadingSpinner from '../component/loadingSpinner';
import BottomNavBar from '../component/bottomNavBar';
import LogWindow from '../component/logWindow';
import ToastShow from '../component/toast';
import HabitInsights from '../component/habitInsights';

// functions
import { formatDateTime, timeDiff, round } from '../service/utils.js';
import { getDeviceId } from '../service/device.js';
import * as habitId from '../config/habitId';
import { analytics, analyticsTrack } from '../service/mixpanel';
import { deleteUserHabitNotification } from '../service/notification';

// styles
import containerStyles from '../styles/containers';
import textStyles from '../styles/text';
import iconStyles from '../styles/icons';
import buttonStyles from '../styles/buttons';
import colors from '../config/colors';

//const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function HomeScreen(props) {
    const { navigation } = props
    const [loadingIndicator, setLoadingIndicator] = useState(true)
    const [listHabits, SetListHabits] = useState([])
    const [refreshPage, setRefreshPage] = useState(true)
    //const [trigger, SetTrigger] = useState(true)
    const [backgroundText, setBackgroundText] = useState(true)

    const [loggingHabit, SetLoggingHabit] = useState({})
    const [logContainerVisible, SetLogContainerVisible] = useState(false)
    const isFocused = useIsFocused();
    const [showInsights, setShowInsights] = useState(false)
    const [userHabitPressed, setUserHabitPressed] = useState([])

    useEffect(() => {
        analyticsTrack(analytics, "home");
    }, []);

    useEffect(() => {
        async function screenload() {
            let deviceId = await getDeviceId()
            let userId = deviceId
            let userHabitResponse = await axios.get(`${GET_USER_HABIT_BY_USER}/${userId}`)
            let userHabitResponseData = userHabitResponse.data
            const logData = await axios.get(`${GET_USER_LOG}/${userId}`)
            let userHabitList = []
            for (let j = 0; j < (userHabitResponseData.length); j++) {
                let userHabit = userHabitResponseData[j]
                let userHabitRoutine = userHabit.routine[0][0]
                let habitResponse = await axios.get(`${GET_HABIT_BY_ID}/${userHabit.habitId}`)
                let habitData = habitResponse.data

                let userHabitLogData = logData.data.filter(log => log.userHabitId === userHabit._id);
                //console.log("userHabitLogData: ", userHabitLogData)

                let userHabitDict = {}
                userHabitDict._id = userHabit._id
                userHabitDict.habitId = userHabit.habitId
                userHabitDict.habitName = habitData.name
                userHabitDict.habitObj = habitData
                userHabitDict.createdAt = userHabit.createdAt
                userHabitDict.awsKey = habitData.awsKey
                userHabitDict.metric = userHabitRoutine.metric
                userHabitDict.unit = userHabitRoutine.unit
                userHabitDict.startTime = userHabitRoutine.startTime
                if (userHabitRoutine.endTime) {
                    userHabitDict.endTime = userHabitRoutine.endTime
                }
                userHabitDict.totalAmt = userHabitLogData.reduce((accumulator, object) => {
                    return accumulator + object.amount;
                }, 0);

                var countDays = userHabitLogData.reduce((counts, object) => {
                    if (userHabitDict.habitId === habitId.habitIdSleeping) {
                        var logdt = formatDateTime(new Date(new Date(object.time).getTime() + parseFloat(object.amount) * 3600 * 1000)).strDate
                    }
                    else {
                        var logdt = formatDateTime(object.time).strDate
                    }
                    counts[logdt] = (counts[logdt] || 0) + 1;
                    return counts
                }, {})
                userHabitDict.count = Object.keys(countDays).length
                userHabitDict.average = round(userHabitDict.totalAmt / userHabitDict.count) || 0

                var maxCountDays = timeDiff(userHabitDict.createdAt, new Date()).timeDiffDays
                userHabitDict.maxCount = maxCountDays || 0
                userHabitDict.amount = userHabitRoutine.amount
                userHabitDict.location = userHabitRoutine.location || " "

                userHabitList.push(userHabitDict)
            }
            userHabitList.sort((a, b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0))
            SetListHabits(userHabitList);
            setLoadingIndicator(false)
            if (listHabits.length == 0) {
                setBackgroundText('Hi, you have not added a habit yet')
            }
        }
        screenload();
    }, [refreshPage, isFocused]);

    // notification press
    const onNotificationsPress = (index) => {
        analyticsTrack(analytics, "home:notificationPressed", { "habitId": listHabits[index].habitObj._id, "habitName": listHabits[index].habitObj.name });
        Alert.alert(
            "Thanks for your interest",
            "Notification customization is coming soon :)",
            [{}, {}]
        );
    }

    // edit habit press
    const onEditHabitPress = async (index) => {
        var userHabitId = listHabits[index]._id
        var habit = listHabits[index].habitObj

        if (habit._id === habitId.habitIdSleeping) {
            navigation.navigate('SleepRoutine', {
                data: {
                    habit, userHabitId
                    //whySelectedList
                }
            })
        }
        else if (habit._id === habitId.habitIdDrinkingWater || habit._id === habitId.habitIdEatingFruits) {
            navigation.navigate('DrinkWaterRoutine', {
                data: {
                    habit, userHabitId
                    //whySelectedList
                }
            })
        }
        else {
            navigation.navigate('WalkRoutine', {
                data: {
                    habit, userHabitId
                    //whySelectedList
                }
            })
        }
        //analytics.track("editHabitPress",{"habitId":habit._id, "habitName":habit.name});
    }

    // delete habit press
    const onDeleteHabitPress = (index) => {
        analyticsTrack(analytics, "home:deleteHabitPressed", { "habitId": listHabits[index].habitObj._id, "habitName": listHabits[index].habitObj.name });
        var habitName = listHabits[index].habitObj.name
        Alert.alert(
            "",
            "Delete the habit: " + habitName + "?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        var userHabitId = listHabits[index]._id
                        deleteUserHabitNotification(userHabitId)
                        axios.delete(`${DELETE_USER_HABIT}/${userHabitId}`)
                            .then(() => {
                                analyticsTrack(analytics, "home:deletedHabit", { "habitId": listHabits[index].habitObj._id, "habitName": listHabits[index].habitObj.name });
                                ToastShow("Habit deleted successfully")
                                setRefreshPage(!refreshPage)
                            }).catch(e => {
                                //show error interaction
                            })
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    const onLogButtonPress = (index) => {

        analyticsTrack(analytics, "home:logHabitPressed", { "habitId": listHabits[index].habitObj._id, "habitName": listHabits[index].habitObj.name });
        SetLoggingHabit({
            ...listHabits[index],
            userInputAmount: parseInt(listHabits[index].amount).toString(),
            habitStartTime: listHabits[index].startTime,
            habitEndTime: listHabits[index].endTime || '',
            userInputLocation: listHabits[index].location,
            userInputSkip: false,
            userInputDate: new Date(),
            awsKey: listHabits[index].awsKey
        })

        SetLogContainerVisible(true)
    }

    const habitPress = (index) => {
        analyticsTrack(analytics, "home:habitInsights", { "habitId": listHabits[index].habitObj._id, "habitName": listHabits[index].habitObj.name });
        setUserHabitPressed(listHabits[index])
        setShowInsights(true)
    }

    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>Your
                        <Text style={textStyles.textRed}> Habits</Text>
                    </Text>
                </View>
                <View style={{ height: "77%" }}>
                    <ScrollView>
                        {
                            listHabits.map((habit, i) => {
                                return (
                                    <View style={[containerStyles.habitOverviewContainer, { flexDirection: "row" }]} key={habit._id}>
                                        <View style={[containerStyles.habitOverviewChildContainer, { width: "82%" }]}>
                                            <View style={{ flexDirection: "row", alignContent: "flex-start", alignItems: 'center', marginTop: -7 }}>
                                                <View style={[iconStyles.tinyIcon]}>
                                                    <Image
                                                        style={iconStyles.tinyLogo}
                                                        source={{ uri: habit.awsKey}}
                                                    />
                                                </View>
                                                <Text style={textStyles.text}>{habit.habitName}</Text>
                                                <TouchableOpacity style={[iconStyles.tinyIcon, {marginLeft:10}]} onPress={()=>habitPress(i)}>
                                                    <Image
                                                            style={iconStyles.tinyLogo}
                                                            source={require('../assets/icons/Icon_insights.png')}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ height: "60%", flexDirection: "column", justifyContent: "space-evenly" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <View style={{ width: "50%" }}>
                                                        <Text style={[textStyles.textSmallerBlue]}>Days Logged</Text>
                                                    </View>
                                                    <View style={{ width: "30%" }}>
                                                        <Text style={textStyles.textSmallerBlue}>{habit.count}
                                                            <Text style={textStyles.textVerySmallBlue}> days</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <View style={{ width: "50%" }}>
                                                        <Text style={[textStyles.textSmallerBlue]}>Total {habit.metric}</Text>
                                                    </View>
                                                    <View style={{ width: "30%" }}>
                                                        <Text style={textStyles.textSmallerBlue}>{habit.totalAmt}
                                                            <Text style={textStyles.textVerySmallBlue}> {habit.unit}</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <View style={{ width: "50%" }}>
                                                        <Text style={[textStyles.textSmallerBlue]}>Avg {habit.metric}</Text>
                                                    </View>
                                                    <View style={{ width: "30%" }}>
                                                        <Text style={textStyles.textSmallerBlue}>{habit.average}
                                                            <Text style={textStyles.textVerySmallBlue}> {habit.unit}</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ justifyContent: "flex-end" }}>
                                                <Text style={textStyles.textVerySmallGray}>Started on {formatDateTime(new Date(habit.createdAt)).strDate}</Text>
                                            </View>
                                            {showInsights &&
                                                <HabitInsights userHabit={userHabitPressed} setShowInsights={setShowInsights}/>
                                            }
                                        </View>
                                        <View style={[containerStyles.habitOverviewChildContainer, { width: "18%", flexDirection: "column", alignItems: "flex-end", borderColor: colors.backgroundDarkBlue }]}>
                                            <View>
                                                <TouchableOpacity style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }} onPress={() => onNotificationsPress(i)}>
                                                    <Image style={iconStyles.tinierLogo} source={require('../assets/icons/Icon_notification.png')} />
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }} onPress={() => onEditHabitPress(i)}>
                                                    <Image style={iconStyles.tinierLogo} source={require('../assets/icons/Icon_edit.png')} />
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }} onPress={() => onDeleteHabitPress(i)}>
                                                    <Image style={iconStyles.tinierLogo} source={require('../assets/icons/Icon_delete.png')} />
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <TouchableOpacity style={buttonStyles.buttonLog} onPress={() => onLogButtonPress(i)}>
                                                    <Text style={textStyles.textSmallBlue}>Log</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                {(listHabits.length == 0) &&
                    <View style={containerStyles.loadingOverlay}>
                        <Text style={[textStyles.textSmallBlue, { alignSelf: "center" }]}>{backgroundText}</Text>
                    </View>
                }
                {logContainerVisible &&
                    <LogWindow loggingHabit={loggingHabit} SetLoggingHabit={SetLoggingHabit} SetLogContainerVisible={SetLogContainerVisible} refreshPage={refreshPage} setRefreshPage={setRefreshPage} />
                }
                <BottomNavBar navigation={navigation} />
            </View>

        </View>
    );

}

export default HomeScreen;