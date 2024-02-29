import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

import Logo from '../component/logo';
import LoadingSpinner from '../component/loadingSpinner.js';
import {getDeviceId} from '../service/device';
import BottomNavBar from '../component/bottomNavBar';

import containerStyles from '../styles/containers.js';
import iconStyles from '../styles/icons.js';
import textStyles from '../styles/text.js';


import { GET_HABIT_BY_ID, GET_USER_HABIT_BY_USER } from '../config/url'
import * as habitIds from '../config/habitId'

import {analytics, analyticsTrack} from '../service/mixpanel.js'
import ChatWidget from '../component/chatWidget.js';


function HabitScreen(props) {
    const { navigation } = props
    const [HabitList, setHabitList] = useState([])
    const [loadingIndicator, setLoadingIndicator] = useState(true)
    //const habitIdList = [habitIds.habitIdSleeping, habitIds.habitIdDrinkingWater, habitIds.habitIdWalking]
    const habitIdList = Object.values(habitIds)

    useEffect(() => {
        async function loadscreen(){
            analyticsTrack(analytics, "habit");
            let deviceId = await getDeviceId()
            let userId = deviceId
            let userHabitResponse = await axios.get(`${GET_USER_HABIT_BY_USER}/${userId}`)
            let userHabitResponseData = userHabitResponse.data

            var habitDataList = []
            for (let index = 0; index < habitIdList.length; index++) {
                if (!userHabitResponseData.some(e => e.habitId === habitIdList[index])){
                    var habitData = await axios.get(GET_HABIT_BY_ID + `/${habitIdList[index]}`)
                    habitDataList.push(habitData.data)
                    console.log("awskey: ", habitData.data.awsKey)
                }
            }
            setHabitList(habitDataList)
            setLoadingIndicator(false)
        }
        loadscreen();
    }, [])

    const handleHabitSelection = (habit) => {
        const habitName = habit.name
        analyticsTrack(analytics, "habit:selectedHabit", {"habitId":habit._id,"habitName":habitName});
        
        if (habit._id === habitIds.habitIdSleeping) {
            navigation.navigate('SleepRoutine', {
                data: {
                    habit,
                    //whySelectedList
                }
            })
        }
        else if (habit._id === habitIds.habitIdDrinkingWater || habit._id === habitIds.habitIdEatingFruits) {
            navigation.navigate('DrinkWaterRoutine', {
                data: {
                    habit,
                    //whySelectedList
                }
            })
        }
        else {
            navigation.navigate('WalkRoutine', {
                data: {
                    habit,
                    //whySelectedList
                }
            })
        }

    }

    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>Select
                        <Text style={textStyles.textRed}> Habit</Text>
                    </Text>
                </View>
                <View style={containerStyles.optionBodymainContainer}>
                    <FlatList
                        data={HabitList}
                        keyExtractor={item => item._id}
                        renderItem={({ item: habit }) => (
                            <TouchableOpacity onPress={() => handleHabitSelection(habit)} >
                                <View style={containerStyles.optionWrapper}>
                                    <Image
                                        style={iconStyles.tinyLogo}
                                        source={{ uri: habit.awsKey }}
                                    />
                                    <Text style={textStyles.text}>
                                        {habit.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </View>
            <BottomNavBar navigation={navigation}/>
        </View>
    );
}


export default HabitScreen;
