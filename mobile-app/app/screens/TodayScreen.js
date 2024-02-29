import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import CheckBox from 'expo-checkbox'
import { useIsFocused } from "@react-navigation/native";
// apis
import { POST_USER_HABIT_LOG, GET_USER_HABIT_BY_USER, GET_HABIT_BY_ID, GET_USER_LOG } from '../config/url'
//components
import Logo from '../component/logo';
import BottomNavBar from '../component/bottomNavBar';
import LoadingSpinner from '../component/loadingSpinner';
import LogWindow from '../component/logWindow';
import StopwatchTimer from '../component/stopwatchTimer';
import DateTimePickerComp from '../component/dateTimePicker';

//utils
import {getDeviceId} from '../service/device';
import { formatDateTime, timeDiff, dateToWeekdayInt, dateTimetoDateInt, normalizeDate } from '../service/utils';
import * as habitId from '../config/habitId';
import { analytics, analyticsTrack } from '../service/mixpanel';

// styles
import colors from '../config/colors';
import containerStyles from '../styles/containers';
import textStyles from '../styles/text';
import iconStyles from '../styles/icons';
import buttonStyles from '../styles/buttons';

const windowHeight = Dimensions.get('window').height;
const todayDate = new Date();


function TodayScreen(props){
    const {navigation} = props
    const countMetrics = {'Glasses':1, 'Litres':'.25', 'Pages':1, '# fruits':1}
    const [loadingIndicator, setLoadingIndicator] = useState(true)
    const [listHabits, SetListHabits] = useState([])
    const [refreshPage, setRefreshPage] = useState(true)
    const [backgroundText, setBackgroundText] = useState(true)
    const [activeDate, setActiveDate] = useState(new Date())
    const [showDate, setShowDate] = useState(false)
    //const [activeDate, setactiveDate] = useState(new Date(new Date().getTime()+1*24*3600*1000))
    //const [activeDate, setactiveDate] = useState(new Date(new Date().getTime()-1*24*3600*1000))
    const [loggingHabit, SetLoggingHabit] = useState({})
    const [logContainerVisible, SetLogContainerVisible] = useState(false)
    const [showLogButton, setShowLogButton] = useState(true)
    //const [skippedDay, SetSkippedDay] = useState(false)
    const isFocused = useIsFocused();
    const [stopwatchTimerVisible, setStopwatchTimerVisible] = useState(false)

    useEffect(()=>{
        analyticsTrack(analytics, "today");
    },[]);

    const listToString = (itemList, sep=", ") => {
        var newItemList = itemList.map(function(e) { 
            return normalizeDate(e)
          });
        newItemList.sort()

        var newItemList2 = newItemList.map(function(e) { 
            return formatDateTime(e).strTime 
          });
        let newItemSet = [...new Set(newItemList2)];        
        
        let listString = newItemSet.join(sep)
        return listString
    }

    const getHabitTime = (habit, startTimeList) => {
        let habitTimeStr = ''
        if (habit._id == habitId.habitIdWalking ||  habitId.habitIdGymming){
            habitTimeStr = listToString(startTimeList)
        }
        else if (habit._id == habitId.habitIdSleeping){
            habitTimeStr = listToString(startTimeList)
        }
        else if (habit._id == habitId.habitIdDrinkingWater){
            habitTimeStr = 'All day'
        }
        return habitTimeStr
    }

    useEffect(() => {
        async function loadscreen(){
            console.log("---------- Today Screen ------")
            setLoadingIndicator(true)
            let deviceId = await getDeviceId()
            let userId = deviceId
            console.log(deviceId)
            let userHabitResponse = await axios.get(`${GET_USER_HABIT_BY_USER}/${userId}`)
            //console.log(userHabitResponse.data)
            let todayWeekdayInt = dateToWeekdayInt(activeDate)
            let tempList = []
    
            const logData = await axios.get(`${GET_USER_LOG}/${userId}`)
            //console.log("logData : ",logData.data)
    
            for (let i = 0; i < (userHabitResponse.data.length); i++) { //iterate over all habits of user
                let userHabitObj = userHabitResponse.data[i]
                console.log(userHabitObj)
                console.log("userHabitId: ", userHabitObj._id)
                var userHabitLogDataToday =  logData.data.filter(log => (log.userHabitId === userHabitObj._id) && (new Date(log.time).getDate()==activeDate.getDate()));
                console.log("userHabitLogDataToday: ",userHabitLogDataToday)
    
    
                let userHabitRoutineObj = userHabitObj.routine
                //console.log(userHabitRoutineObj)
                let userHabitTodayRoutineObj = userHabitRoutineObj[todayWeekdayInt]
                console.log("TodayRoutine ::: ", i, " ::: ",userHabitTodayRoutineObj)
                
                let habitResponse = await axios.get(`${GET_HABIT_BY_ID}/${userHabitObj.habitId}`) // .then()
                let habitObj = habitResponse.data
                if ( userHabitTodayRoutineObj && userHabitTodayRoutineObj.length>0){
                    let userHabitActivityObj = {}
                    userHabitActivityObj._id = userHabitObj._id
                    userHabitActivityObj.habitId = userHabitObj.habitId
                    userHabitActivityObj.habitName = habitObj.name
                    userHabitActivityObj.awsKey = habitObj.awsKey
                    let startTimeList = []
                    let endTimeList = []
                    let amountTotal = 0
                    for (let j = 0; j < (userHabitTodayRoutineObj.length); j++){
                        //userHabitActivityObj = userHabitTodayRoutineObj[j]
                        let activityObj = userHabitTodayRoutineObj[j]
                        if (userHabitObj.habitId === habitId.habitIdSleeping){
                            //endTimeList.push(formatDateTime(activityObj.endTime).strTimeZero)
                            userHabitActivityObj.endTime = activityObj.endTime
                            endTimeList.push(activityObj.endTime)
                        }
                        //startTimeList.push(formatDateTime(activityObj.startTime).strTimeZero)
                        startTimeList.push(activityObj.startTime)
                        amountTotal = amountTotal + parseInt(activityObj.amount)
                        //userHabitActivityObj.startHourMins = parseInt(formatDateTime(userHabitActivityObj.startTime).hours)*100+parseInt(formatDateTime(userHabitActivityObj.startTime).minutes)
                        //console.log(userHabitActivityObj)
                        if(!userHabitActivityObj.minStartTime || normalizeDate(userHabitActivityObj.minStartTime).getTime() > normalizeDate(activityObj.startTime).getTime()){
                            userHabitActivityObj.minStartTime = activityObj.startTime
                            userHabitActivityObj.minStartTimeNorm = normalizeDate(userHabitActivityObj.minStartTime)
                            userHabitActivityObj.metric = activityObj.metric
                            userHabitActivityObj.unit = activityObj.unit
                        }
                    }
                    userHabitActivityObj.startTimeString = getHabitTime(habitObj,startTimeList)
                    userHabitActivityObj.amount = amountTotal
                    userHabitActivityObj.actualAmount = userHabitLogDataToday.reduce((accumulator, object) => {
                        return accumulator + object.amount;
                      }, 0);
                    if (userHabitObj.habitId === habitId.habitIdSleeping){ // sleep habit, break into 2
                        let userHabitActivityObj2 = JSON.parse(JSON.stringify(userHabitActivityObj))
                        userHabitActivityObj2.habitName = "Waking Up"
                        userHabitActivityObj2.awsKey = "https://doitappicons.s3.ap-south-1.amazonaws.com/icons/Icon_wakeupearly.png"
                        userHabitActivityObj2.startTimeString = getHabitTime(habitObj,endTimeList)
                        userHabitActivityObj2.minStartTimeNorm = normalizeDate(userHabitActivityObj.endTime)
                        userHabitActivityObj._id = "no log"
                        userHabitActivityObj.minStartTimeNorm = new Date(userHabitActivityObj.minStartTimeNorm.getTime()+1*24*3600*1000) // push by 1 day for optics
                        tempList.push(userHabitActivityObj2)
                    }
                    tempList.push(userHabitActivityObj)
                }
            }
            tempList.sort((a,b) => (a.minStartTimeNorm > b.minStartTimeNorm) ? 1 : ((b.minStartTimeNorm > a.minStartTimeNorm) ? -1 : 0))
            SetListHabits(tempList)
    
            setLoadingIndicator(false)
            // console.log(listHabits)
            if (listHabits.length == 0){
                setBackgroundText('Hi, your routine for today looks empty')
            }
        }
        loadscreen();
    },[refreshPage, isFocused]);


    const updateActiveDate = (date) => {
        analyticsTrack(analytics, "today:changedActiveDay", {"daysDiff":timeDiff(activeDate,date).timeDiffDays});
        setActiveDate(date)
        setRefreshPage(!refreshPage)
        if (dateTimetoDateInt(date) > dateTimetoDateInt(todayDate)){
            setShowLogButton(false)
        }
        else {
            setShowLogButton(true)
        }
    }

    const onLogButtonPress = (index) => {
        
        console.log("Log Button pressed")
        analyticsTrack(analytics, "today:logHabitPressed", {"habitId":listHabits[index].habitId, "habitName":listHabits[index].habitName});

        SetLoggingHabit({
            ...listHabits[index],
            userInputAmount: (listHabits[index].amount).toString(),
            habitStartTime: listHabits[index].minStartTime,
            habitEndTime: listHabits[index].endTime || '',
            userInputLocation: listHabits[index].location,
            userInputSkip: false,
            userInputDate: formatDateTime(activeDate).strDate,
            awsKey: listHabits[index].awsKey
        })

        SetLogContainerVisible(true)
        console.log("loggingHabit:: ", loggingHabit)
    }

    const closeTimer = () => {
        setStopwatchTimerVisible(false)
    }

    const onTimerPress = (index) => {
        console.log("Timer Button pressed")
        analyticsTrack(analytics, "today:timerPressed", {"habitId":listHabits[index].habitId, "habitName":listHabits[index].habitName});
        SetLoggingHabit({
            ...listHabits[index],
            userInputAmount: (listHabits[index].amount).toString(),
            habitStartTime: listHabits[index].minStartTime,
            habitEndTime: listHabits[index].endTime || '',
            userInputLocation: listHabits[index].location,
            userInputSkip: false,
            userInputDate: formatDateTime(activeDate).strDate,
            awsKey: listHabits[index].awsKey
        })

        setStopwatchTimerVisible(true)
        console.log("loggingHabit:: ", loggingHabit)     
      }

    const onCounterPress = async (index, amount) => {
    
        await axios.post(POST_USER_HABIT_LOG, {
            userHabitId: listHabits[index]._id,
            time: new Date(),
            amount: parseFloat(amount),
            location: listHabits[index].location || " ",
        })
        setRefreshPage(!refreshPage)
    }  

    return(
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <LoadingSpinner loadingIndicator={loadingIndicator} />
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>Day's
                        <Text style={textStyles.textRed}> Routine</Text>
                    </Text>
                </View>
                
                <View style={{alignItems:"center", marginTop: -12, marginBottom: 10}}>
                    <TouchableOpacity onPress={() => setShowDate(true)}>
                        <Text style={[textStyles.textSmallBlue, {borderBottomColor: colors.backgroundDarkBlue, borderBottomWidth: 1}]}>{formatDateTime(activeDate).strDate}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height:"77%"}}>
                <ScrollView>
                    {
                        listHabits.map((habit, i) => {
                            return (
                            <View style={[containerStyles.routineOverviewContainer, {flexDirection: "row"}]} key={habit._id}>
                                <View style={[containerStyles.habitOverviewChildContainer, { height: "80%", width: "82%" }]}>
                                    {/* <Text style={[textStyles.text]}>{formatDateTime(new Date(habit.startTime)).strTime}</Text> */}
                                    <View style={{flexDirection:"row" ,alignContent:"flex-start"}}>
                                        <View style={[]}>
                                            <Image
                                                style={iconStyles.tinyLogo}
                                                source={{ uri: habit.awsKey }}
                                            />
                                        </View>
                                        <Text style={textStyles.textMedBlue}>{habit.habitName}</Text>
                                    </View>
                                    <View style={{height: "55%", flexDirection:"column", justifyContent:"space-between"}}>
                                        <View style={{flexDirection:"row"}}>
                                            <View>
                                                <Text style={textStyles.textSmallBlue}>{(habit.habitId === habitId.habitIdDrinkingWater || habit.habitId === habitId.habitIdEatingFruits)? 'All day' : habit.startTimeString}</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:"row"}}>
                                            <View style={{width: "50%"}}>
                                                <Text style={[textStyles.textSmallerBlue]}>Total {habit.metric}</Text>
                                            </View>
                                            <View style={{width: "25%"}}>
                                            {habit._id != "no log" &&
                                                <Text style={textStyles.textSmallerBlue}>{habit.actualAmount}</Text>
                                            }
                                            </View> 
                                            <View style={{width: "25%"}}>
                                                <Text style={textStyles.textSmallerGray}>/ {habit.amount}
                                                    <Text style={textStyles.textVerySmallGray}> {habit.unit}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </View>        
                                </View>
                                <View style={[containerStyles.habitOverviewChildContainer, {width: "18%", flexDirection: "column", alignItems: "center", borderColor: colors.backgroundDarkBlue}]}>
                                    <View>
                                        {habit._id != "no log" && showLogButton &&
                                        (
                                            // <TouchableOpacity style={buttonStyles.buttonLog} onPress={() => onLogButtonPress(i)}>
                                            //     <Text style={textStyles.textSmallBlue}>Log</Text>
                                            // </TouchableOpacity>
                                            <View>
                                                <CheckBox style={{ alignSelf: "center" }} color={colors.backgroundDarkBlue} value={habit.actualAmount>=habit.amount? true : false} onValueChange={(value) => habit.actualAmount>=habit.amount? null: onLogButtonPress(i)}></CheckBox>
                                                <Text style={[textStyles.textVerySmallBlue, {textAlign:'center'}]}>Done</Text>
                                            </View>
                                            
                                        )
                                        }
                                    </View>          
                                    <View>
                                        {habit.metric=="Duration" && habit._id != "no log" && showLogButton && timeDiff(activeDate,todayDate).timeDiffDays === 0 &&
                                        (
                                            <TouchableOpacity style={{ height : 30, alignItems: "center", justifyContent: "center"}} onPress={() => onTimerPress(i)}>
                                                <Image style={[iconStyles.tinyLogo, {marginRight:0}]} source={require('../assets/icons/Icon_timer.png')} />
                                                <Text style={[textStyles.textVerySmallBlue, {textAlign:'center'}]}>Stopwatch</Text>
                                            </TouchableOpacity>
                                        )
                                        }
                                        {(habit.metric in countMetrics) && habit._id != "no log" && showLogButton && timeDiff(activeDate,todayDate).timeDiffDays === 0 &&
                                        (
                                            <TouchableOpacity style={{ height: 30}} onPress={() => onCounterPress(i, countMetrics[habit.metric])}>
                                                <View style={[buttonStyles.buttonCounter,{width:50}]}>
                                                    <Text style={textStyles.textSmallerBlue}>+ {countMetrics[habit.metric]}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                        }          
                                    </View>  
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
            </View>
            {showDate &&
                (<DateTimePickerComp mode={'date'} setShow={setShowDate} currentDate={activeDate} setCurrentDate={updateActiveDate}/>)
            }
            <Modal
                animationType="fade"
                transparent={true}
                visible={stopwatchTimerVisible}
            >
                <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
                    <View style={styles.userDataLoggingContainer}>
                        <View style={[styles.loggingWindowChildContainer]}>
                            <View style={{position:"absolute", left:300}}>
                                <TouchableOpacity style = {[buttonStyles.button, {paddingHorizontal:5}]} onPress={()=>closeTimer()}>
                                    <Text style={textStyles.textSmallRed}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <StopwatchTimer loggingHabit = {loggingHabit} SetLoggingHabit={SetLoggingHabit} refreshPage={refreshPage} setRefreshPage={setRefreshPage}/>
                    </View>
                </View>
                
            </Modal>
            {(listHabits.length == 0) &&    
                    <View style={containerStyles.loadingOverlay}>
                        <Text style={[textStyles.textSmallBlue, { alignSelf: "center"}]}>{backgroundText}</Text>
                    </View>
                }
            {logContainerVisible && 
                <LogWindow loggingHabit={loggingHabit} SetLoggingHabit={SetLoggingHabit} SetLogContainerVisible={SetLogContainerVisible} refreshPage={refreshPage} setRefreshPage={setRefreshPage} disableDate={true}/>
            }
            </View>
            <BottomNavBar navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    userDataLoggingContainer: {
        height: 400,
        width: 360,
        backgroundColor: colors.backgroundBlue,
        alignSelf: "center",
        marginTop: windowHeight * .5 - 140,
        padding: 20,
        borderRadius: 12,
        flexDirection: "column",
        borderColor: colors.bordorColor,
        borderWidth: 2,
    },
    loggingWindowChildContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems:"center",
        marginBottom: 7,
        marginTop: 7,
        height:30,
    },
    logWindowText: {
        ...textStyles.text, 
        width: 150
    }
})

export default TodayScreen;