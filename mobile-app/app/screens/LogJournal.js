import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import axios from 'axios';
import { GET_HABIT_BY_ID, GET_USER_HABIT_MAPPING_BY_USER, GET_USER_LOG, DELETE_USER_LOG } from '../config/url'

import Logo from '../component/logo';
import LoadingSpinner from '../component/loadingSpinner';
import LogWindow from '../component/logWindow';
import ToastShow from '../component/toast';
import BottomNavBar from '../component/bottomNavBar';

import { getDeviceId } from '../service/device';
import { formatDateTime } from '../service/utils';
import { analytics, analyticsTrack } from '../service/mixpanel';

import containerStyles from '../styles/containers';
import textStyles from '../styles/text';
import iconStyles from '../styles/icons';



function LogJournal(props) {
    const { navigation } = props
    const [listLogs, setListLogs] = useState([])
    const [editLogContainerVisible, setEditLogContainerVisible] = useState(false)
    const [loggingHabit, SetLoggingHabit] = useState({})
    const [updatePage, setUpdatePage] = useState(false)
    const [loadingIndicator, setLoadingIndicator] = useState(true)
    const [backgroundText, setBackgroundText] = useState('')

    useEffect(() => {
        analyticsTrack(analytics, "logJournal");
    }, []);

    useEffect(() => {
        async function loadscreen(){
            let deviceId = await getDeviceId()
            let userId = deviceId

            const logData = await axios.get(`${GET_USER_LOG}/${userId}`)
            const userData = await axios.get(`${GET_USER_HABIT_MAPPING_BY_USER}/${userId}`)

            var logDataShow = logData.data.filter(log =>
                userData.data[log.userHabitId]
            );
            for (let index = 0; index < logDataShow.length; index++) {
                logDataShow[index].metric = userData.data[logDataShow[index].userHabitId].routine[0][0].metric;
                logDataShow[index].unit = userData.data[logDataShow[index].userHabitId].routine[0][0].unit;

                await axios.get(`${GET_HABIT_BY_ID}/${userData.data[logDataShow[index].userHabitId].habitId}`).then(habitData => {
                    logDataShow[index].habitId = habitData.data._id;
                    logDataShow[index].habitName = habitData.data.name;
                    logDataShow[index].habitAWSkey = habitData.data.awsKey;

                })
            }

            setListLogs(logDataShow);
            setLoadingIndicator(false)
            if (listLogs.length == 0) {
                setBackgroundText('Hi, you have not logged a habit yet')
            }
        }
        loadscreen()
    }, [updatePage])

    const onEditLogPress = (index) => {
        var selectedLog = listLogs[index]
        analyticsTrack(analytics, "logJournal:editLogPressed", { "habitId": listLogs[index].habitId, "habitName": listLogs[index].habitName });
        SetLoggingHabit({
            ...selectedLog,
            logId: selectedLog._id,
            userInputAmount: selectedLog.amount.toString(),
            habitStartTime: selectedLog.time,
            habitEndTime: selectedLog.metric == "Sleep Duration" ? new Date(new Date(selectedLog.time).getTime() + parseFloat(selectedLog.amount) * 3600 * 1000) : '',
            userInputLocation: selectedLog.location,
            userInputSkip: false,
            userInputDate: formatDateTime(selectedLog.time).strDate,
            awsKey: selectedLog.habitAWSkey
        })
        setEditLogContainerVisible(true)
        //analytics.track("logJournal_editHabitPress",{"habitName":currentEditingLog.habitName});
    }

    const onDeleteLogPress = (index) => {
        //var habitName = listLogs[index].habitName
        //analytics.track("logJournal_deleteLogPress",{"habitName":habitName});
        analyticsTrack(analytics, "logJournal:deleteLogPressed", { "habitId": listLogs[index].habitId, "habitName": listLogs[index].habitName });

        Alert.alert(
            "",
            "Delete the log entry?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        var userLogId = listLogs[index]._id
                        axios.delete(`${DELETE_USER_LOG}/${userLogId}`)
                            .then(() => {
                                //analytics.track("logJournal_deletedLog",{"habitName":habitName});
                                analyticsTrack(analytics, "logJournal:deletedLog", { "habitId": listLogs[index].habitId, "habitName": listLogs[index].habitName });
                                ToastShow("Log deleted successfully")
                                setUpdatePage(!updatePage)
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

    return (
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>Log
                        <Text style={textStyles.textRed}> Journal</Text>
                    </Text>
                </View>
                <ScrollView>
                    {
                        listLogs.map((log, i) => {
                            return (
                                <View style={containerStyles.logContainer} key={log._id}>
                                    <View style={[containerStyles.logChildContainer, { justifyContent: "flex-start" }]}>
                                        <View style={[]}>
                                            <Image
                                                style={iconStyles.tinyLogo}
                                                source={{ uri: log.habitAWSkey }} />
                                        </View>
                                        <Text style={textStyles.textMedBlue}>{log.habitName}</Text>
                                        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                                            <TouchableOpacity style={{ height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", marginLeft: 10 }} onPress={() => onEditLogPress(i)}>
                                                <Image style={iconStyles.tiniestLogo} source={require('../assets/icons/Icon_edit.png')} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                                            <TouchableOpacity style={{ height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 0 }} onPress={() => onDeleteLogPress(i)}>
                                                <Image style={iconStyles.tiniestLogo} source={require('../assets/icons/Icon_delete.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={[containerStyles.logChildContainer]}>
                                        <View style={{ flex: 1, alignItems: "flex-start" }}>
                                            <Text style={textStyles.textSmallerBlue}>Habit Time</Text>
                                            <Text style={textStyles.textSmallerBlue}>{formatDateTime(log.time).strDateTime}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: "center" }}>
                                            <Text style={textStyles.textSmallerBlue}>{log.metric}</Text>
                                            <Text style={textStyles.textSmallerBlue}>{log.amount}
                                                <Text style={textStyles.textVerySmallBlue}> {log.unit}</Text>
                                            </Text>

                                        </View>
                                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                                            <Text style={textStyles.textSmallerBlue}>Location</Text>
                                            <Text style={textStyles.textSmallerBlue}>{log.location}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                {(listLogs.length == 0) &&
                    <View style={containerStyles.loadingOverlay}>
                        <Text style={[textStyles.textSmallBlue, { alignSelf: "center" }]}>{backgroundText}</Text>
                    </View>
                }
                {editLogContainerVisible &&
                    <LogWindow loggingHabit={loggingHabit} SetLoggingHabit={SetLoggingHabit} SetLogContainerVisible={setEditLogContainerVisible} refreshPage={updatePage} setRefreshPage={setUpdatePage} disableDate={false} />
                }
            </View>
            <BottomNavBar navigation={navigation}/>
        </View>
    )
}

export default LogJournal;