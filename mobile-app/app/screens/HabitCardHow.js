import React, { useEffect, useState, useReducer } from 'react';
import { View, Text, Modal, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import Logo from '../component/logo';
import LoadingSpinner from '../component/loadingSpinner.js';
import ChatWidget from '../component/chatWidget';
import { analytics, analyticsTrack } from '../service/mixpanel';
import * as habitIds from '../config/habitId'

import containerStyles from '../styles/containers.js';
import textStyles from '../styles/text.js';
import buttonStyles from '../styles/buttons';
//import Checkbox from 'expo-checkbox';
import colors from '../config/colors';





var howListInit = {}
howListInit[habitIds.habitIdWalking] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Create a clear and realistic walking plan - e.g., I will walk at 8am in the neighborhood for 15 mins everyday. Use reminders to follow the plan."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Club your walk with another fun activity - e.g., listen to music while you walk, etc."}, 
    {"_id":2, "bold":"3. Make it easy", "name":"Start with an easy walking plan and focus on consistency. Gradually progress towards your desired walking plan."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Clearly define a rewarding post-walking routine - e.g., log your walk, get a cup of tea or a glass of healthy fruit/vegetable juice after the walk, etc."},
]
howListInit[habitIds.habitIdGymming] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Create a clear and realistic gym plan - e.g., I will go to the gym at 8am and work out for 30 mins everyday. Use reminders to follow the plan."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Club your work out with another fun activity - e.g., listen to music while you work out, etc."}, 
    {"_id":2, "bold":"3. Make it easy", "name":"Start with an easy work out plan and focus on consistency. Gradually progress towards your desired work out plan."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Clearly define a rewarding post-workout routine - e.g., log your work out, get a cold shower after your work out, have a protein shake, etc."},
]
howListInit[habitIds.habitIdSleeping] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Fix a realistic sleep and wake up time. Use reminders to follow it everyday."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Define a pre-sleep routine with relaxing activities  - e.g., listening to music, reading a book, etc."},
    {"_id":2, "bold":"3. Make it easy", "name":"Start easy and gradually progress towards your desired sleep and wake up time."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Clearly define a rewarding post-waking up morning routine - e.g., log your sleep, get a shower, meditate, etc."}
]
howListInit[habitIds.habitIdDrinkingWater] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Always keep a water bottle with you. Use regular reminders for drinking small amounts of water."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Get a cool looking water bottle. Keep the water at a temperature which you enjoy."}, 
    {"_id":2, "bold":"3. Make it easy", "name":"Fix an amount of water to drink everday. Start easy and gradually progress towards your desired amount of water."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Track the amount of water you are drinking."},
]
howListInit[habitIds.habitIdReading] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Keep the book you want to read near you. Create a clear reading plan - e.g., I will read 'Book X' at 10pm on the couch for 2 mins everyday. Use reminders."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Get into a comfortable chair or couch. Play some light music to go with it if you'd like."}, 
    {"_id":2, "bold":"3. Make it easy", "name":"Start easy and focus on being consistent. Gradually progress towards your desired reading plan."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Clearly define a rewarding post-reading routine - e.g., log your reading, journal it, do a joy dance, etc."},
]
howListInit[habitIds.habitIdMeditation] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Create a clear plan - e.g., I will meditate in the living room at 8am for 10 mins everyday. Use reminders to follow the plan."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Get comfortable. Can follow a guided meditation or play some ambient sound music."}, 
    {"_id":2, "bold":"3. Make it easy", "name":"Start easy (5 mins a day) and focus on being consistent. Gradually increase the meditation duration."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Observe how you feel after meditating. Make a note of it."},
]
howListInit[habitIds.habitIdEatingFruits] = [
    {"_id":0, "bold":"1. Make it obvious", "name":"Keep 1 or 2 fruits near you. Use regular reminders for eating the fruits."}, 
    {"_id":1, "bold":"2. Make it attractive", "name":"Can consume fruits in the form of juice, shake or salad. Some fruits taste better slightly chilled."}, 
    {"_id":2, "bold":"3. Make it easy", "name":"Fix the number of fruits to eat everday. Start easy and gradually progress towards your desired number."},
    {"_id":3, "bold":"4. Make it satisfying", "name":"Track the number of fruits you are eating."},
]

function HabitCardHow(props) {
    const { route: { params: { data: { habit } } }, navigation } = props
    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [habitHows, setHabitHows] = useState([])
    const [refreshScreen, setRefreshScreen] = useState(false)


    useEffect(() => {
        setHabitHows(howListInit[habit._id])
    },[refreshScreen])

    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>{habit.name}
                        <Text style={textStyles.textRed}> Habit</Text>
                    </Text>
                </View>
                <View style={containerStyles.optionBodymainContainer}>
                    <View style={[containerStyles.optionWrapper,{borderTopColor: colors.backgroundDarkBlue, borderTopWidth: 0.5, borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 0.5}]}>
                        <Text style={textStyles.text}>Tips on how to build the habit</Text>
                    </View>
                    <FlatList
                        data={habitHows}
                        keyExtractor={item => item._id}
                        renderItem={({ item: task }) => (
                                <View style={containerStyles.optionWrapper2}>
                                    <Text style={textStyles.textSmallRed}>
                                        {task.bold}{'\n'}
                                        <Text style={textStyles.textSmallBlue}>
                                            {task.name}
                                        </Text>
                                    </Text>
                                </View>
                        )}
                    />
                </View>
            <ChatWidget/>
            </View>
            <TouchableOpacity style={[buttonStyles.bottomButton75pct, {alignSelf:"center"}]} onPress={()=>onAddToRoutinePress()}>
                <Text style={textStyles.textMedBlue}>Create Routine</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    shareMsgContainer: {
        height: 150,
        width: 360,
        backgroundColor: colors.backgroundBlue,
        alignSelf: "center",
        padding: 15,
        borderRadius: 12,
        flexDirection: "column",
        borderColor: colors.bordorColor,
        borderWidth: 2,
        position: 'absolute',
        bottom: "10%",
    },
    feedbackMsgContainer: {
        height: 300,
        width: 360,
        backgroundColor: colors.backgroundBlue,
        alignSelf: "center",
        padding: 15,
        borderRadius: 12,
        flexDirection: "column",
        borderColor: colors.bordorColor,
        borderWidth: 2,
        position: 'absolute',
        bottom: "10%",
    },
    inputTextBox: {
        height: 150,
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.textGray,
        padding: 10,
        borderRadius: 5,
        justifyContent:"flex-start"
      },
})

export default HabitCardHow;