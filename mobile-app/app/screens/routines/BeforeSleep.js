import React, { useEffect, useState, useReducer } from 'react';
import { View, Text, Modal, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import Logo from '../../component/logo';
import LoadingSpinner from '../../component/loadingSpinner.js';
import { analytics, analyticsTrack } from '../../service/mixpanel';

import containerStyles from '../../styles/containers.js';
import textStyles from '../../styles/text.js';
import buttonStyles from '../../styles/buttons';
import Checkbox from 'expo-checkbox';
import colors from '../../config/colors';


const taskListInit = [
                    {"_id":0, "name":"Review your day", "navigation":"TodayScreen", "check": false}, 
                    {"_id":1, "name":"Confirm wake-up time", "navigation":"", "check": false}, 
                    {"_id":2, "name":"Reflect", "navigation":"", "showMsg": "Gratitude: What are 3 things you are grateful for today?" ,"check": false},
                    {"_id":3, "name":"Take a sip of water", "navigation":"", "check": false},
                    {"_id":4, "name":"Put away electronics", "navigation":"", "check": false},
                ]

const ADD_TO_TASKLIST = 'ADD_TO_TASKLIST'
const REMOVE_FROM_TASKLIST = 'REMOVE_FROM_TASKLIST'
const EDIT_TASK_CHECK = 'EDIT_TASK_CHECK'

const taskReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_TASKLIST:
            state.push(action.taskObj)
            return state
        case REMOVE_FROM_TASKLIST:
            state.splice(action.index, 1)
            return state
        case EDIT_TASK_CHECK:
            state[action.index] = { ...state[action.index], check: action.check }
            return state
    }
}

function BeforeSleep(props) {
    const {navigation} = props
    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [taskList, dispatchTaskList] = useReducer(taskReducer, taskListInit)
    const [showReflectBox, setShowReflectBox] = useState(false)
    const [reflectBoxMsg, setReflectBoxMsg] = useState()
    const [reflectMsg, setReflectMsg] = useState()
    const [refreshScreen, setRefreshScreen] = useState(false)


    useEffect(() => {

    },[refreshScreen])

    const handleTaskSelection = (task) => {
        if (task.navigation != "" && !task.check){
            navigation.navigate(task.navigation)
        }
        if (task.showMsg && task.showMsg != "" && !task.check){
            setReflectBoxMsg(task.showMsg)
            setShowReflectBox(true)
        }

        dispatchTaskList({ type: EDIT_TASK_CHECK, index: task._id, check: !task.check })
        setRefreshScreen(!refreshScreen)
    }

    const reflectDonePress = () => {
        setShowReflectBox(false)
        analyticsTrack(analytics, "beforeSleep:reflectMsgDone", {"reflectMsg":reflectMsg});

    }

    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>Before {"Sleep"}
                        <Text style={textStyles.textRed}> Routine</Text>
                    </Text>
                </View>
                <View style={containerStyles.optionBodymainContainer}>
                    <FlatList
                        data={taskList}
                        keyExtractor={item => item._id}
                        renderItem={({ item: task }) => (
                            <TouchableOpacity onPress={() => handleTaskSelection(task)} >
                                <View style={containerStyles.optionWrapper}>
                                    <Checkbox value={task.check} color={task.check ? colors.backgroundDarkBlue : undefined}/>
                                    <Text style={[task.check ? textStyles.textGray: textStyles.text, {marginLeft: 20}]}>
                                        {task.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                {showReflectBox &&
                    (
                        <Modal 
                        animationType="fade"
                        transparent={true}
                        visible={true}>
                            <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
                                <View style={styles.feedbackMsgContainer}>
                                    <TouchableOpacity style = {[buttonStyles.button, {width: 20, paddingHorizontal:5, alignSelf:"flex-end"}]} onPress={()=>setShowReflectBox(false)}>
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

export default BeforeSleep;