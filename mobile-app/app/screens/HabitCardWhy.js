import React, { useEffect, useState, useReducer } from 'react';
import { View, Text, Modal, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import Logo from '../component/logo';
import LoadingSpinner from '../component/loadingSpinner.js';
import ProgressDots from '../component/progressDots';
import FrontBackButton from '../component/frontBackButton';
import { analytics, analyticsTrack } from '../service/mixpanel';
import * as habitIds from '../config/habitId'

import containerStyles from '../styles/containers.js';
import textStyles from '../styles/text.js';
import buttonStyles from '../styles/buttons';
import Checkbox from 'expo-checkbox';
import colors from '../config/colors';


const whyListInit = [
                    // walking
                    {"_id":0, "habitId":habitIds.habitIdWalking, "name":"To be generally fit", "check": false}, 
                    {"_id":1, "habitId":habitIds.habitIdWalking, "name":"To lose weight", "check": false}, 
                    {"_id":2, "habitId":habitIds.habitIdWalking, "name":"To get a break in the day", "check": false},
                    
                    // gym
                    {"_id":3, "habitId":habitIds.habitIdGymming, "name":"To be generally fit", "check": false}, 
                    {"_id":4, "habitId":habitIds.habitIdGymming, "name":"To lose weight", "check": false}, 
                    {"_id":5, "habitId":habitIds.habitIdGymming, "name":"To gain weight", "check": false}, 
                    
                    // sleep
                    {"_id":6, "habitId":habitIds.habitIdSleeping, "name":"To exercise in the morning", "check": false}, 
                    {"_id":7, "habitId":habitIds.habitIdSleeping, "name":"To get me time", "check": false}, 
                    {"_id":8, "habitId":habitIds.habitIdSleeping, "name":"To perform duties", "check": false},

                    // drink water
                    {"_id":9, "habitId":habitIds.habitIdDrinkingWater, "name":"To be generally hydrated", "check": false},
                    {"_id":10, "habitId":habitIds.habitIdDrinkingWater, "name":"To control medical conditions", "check": false}, 

                    // global
                    {"_id":11, "habitId":'0', "name":"Other", "showMsg": "Why do you want to build the habit? It helps to be specific" ,"check": false},
                    
                ]

const ADD_TO_whyList = 'ADD_TO_whyList'
const REMOVE_FROM_whyList = 'REMOVE_FROM_whyList'
const EDIT_TASK_CHECK = 'EDIT_TASK_CHECK'
const EDIT_TASK_NAME = 'EDIT_TASK_NAME'

const taskReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_whyList:
            state.push(action.taskObj)
            return state
        case REMOVE_FROM_whyList:
            state.splice(action.index, 1)
            return state
        case EDIT_TASK_CHECK:
            //state.filter(item => item._id === action.index)[0] = {...state.filter(item => item._id === action.index)[0], check: action.check}
            state[action.index] = { ...state[action.index], check: action.check }
            return state
        case EDIT_TASK_NAME:
            state[action.index] = { ...state[action.index], name: action.name }
            return state
    }
}

function HabitCardWhy(props) {
    const { route: { params: { data: { habit } } }, navigation } = props
    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [whyList, dispatchwhyList] = useReducer(taskReducer, whyListInit)
    const [habitWhys, setHabitWhys] = useState([])
    const [showOthersBox, setShowOthersBox] = useState(false)
    const [reflectBoxMsg, setReflectBoxMsg] = useState()
    const [reflectMsg, setReflectMsg] = useState()
    const [refreshScreen, setRefreshScreen] = useState(false)


    useEffect(() => {
        setHabitWhys(whyList.filter(why => why.habitId === habit._id || why.habitId === '0'))
    },[refreshScreen])

    const handleTaskSelection = (task) => {
        if (task.showMsg && task.showMsg != "" && !task.check){
            setReflectBoxMsg(task.showMsg)
            setShowOthersBox(true)
        }

        dispatchwhyList({ type: EDIT_TASK_CHECK, index: task._id, check: !task.check })
        setRefreshScreen(!refreshScreen)
    }

    const reflectDonePress = (task) => {
        setShowOthersBox(false)
        //analyticsTrack(analytics, "beforeSleep:reflectMsgDone", {"reflectMsg":reflectMsg});
        dispatchwhyList({ type: EDIT_TASK_NAME, index: 12, name: reflectMsg })
        setRefreshScreen(!refreshScreen)

    }

    const onBackPress = async () => {
        navigation.navigate('Habit', { refreshPage: true })
    }

    const onNextPress = async () => {
        var whySelectedList = whyList.filter(why => why.check === true)
        navigation.navigate('HabitCardHow', {  
            data: {habit, whySelectedList}, 
            refreshPage: true 
            }
        )
    }

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
                        <Text style={textStyles.text}>Why must you build the habit?</Text>
                    </View>
                    <FlatList
                        data={habitWhys}
                        keyExtractor={item => item._id}
                        renderItem={({ item: task }) => (
                            <TouchableOpacity onPress={() => handleTaskSelection(task)} >
                                <View style={containerStyles.optionWrapper}>
                                    <Checkbox value={task.check} color={task.check ? colors.backgroundDarkBlue : undefined}/>
                                    <Text style={[task.check ? textStyles.textMedGray: textStyles.textMedBlue, {marginLeft: 20}]}>
                                    {task.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                {showOthersBox &&
                    (
                        <Modal 
                        animationType="fade"
                        transparent={true}
                        visible={true}>
                            <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
                                <View style={styles.feedbackMsgContainer}>
                                    <TouchableOpacity style = {[buttonStyles.button, {width: 20, paddingHorizontal:5, alignSelf:"flex-end"}]} onPress={()=>setShowOthersBox(false)}>
                                        <Text style={textStyles.textSmallRed}>X</Text>
                                    </TouchableOpacity>
                                    <Text>{reflectBoxMsg}</Text>
                                    <TextInput style={styles.inputTextBox} multiline={true} onChangeText={(text)=>setReflectMsg(text)}></TextInput>
                                    <View style={{marginTop:20 ,alignItems:"flex-end"}}>
                                        <TouchableOpacity style={[buttonStyles.buttonLog,{width:'22%' ,alignItems:"center"}]} onPress={() => reflectDonePress()}>
                                            <Text>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </Modal>
                    )

                }
                <ProgressDots data={[
                        {
                            complete: true
                        },
                        {
                            complete: false
                        }
                    ]} />
            </View>
            <View>
                <TouchableOpacity style={buttonStyles.bottomButton40pct} onPress={()=>onNextPress()}>
                    <Text style={textStyles.textMedBlue}>Next</Text>
                </TouchableOpacity>
            </View>
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

export default HabitCardWhy;