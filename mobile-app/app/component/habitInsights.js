import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

// apis
import { GET_HABIT_BY_ID, GET_USER_HABIT_LOG_SUMMARY, DELETE_USER_HABIT, GET_USER_HABIT_BY_USER, GET_USER_LOG } from '../config/url'

// components
import Logo from '../component/logo';
import LoadingSpinner from '../component/loadingSpinner';
import BottomNavBar from '../component/bottomNavBar';
import LogWindow from '../component/logWindow';
import ToastShow from '../component/toast';

// functions
import { formatDateTime, timeDiff, round, dateToWeekdayInt } from '../service/utils.js';
import { MyLineChart, MyBarChart, VictoryBarChart, VictoryLineChart } from './chartTemplates.js';
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

function HabitInsights(props) {
    const { userHabit, setShowInsights } = props
    const [loadingIndicator, setLoadingIndicator] = useState(true)
    const [d1F, setD1] = useState([])
    const [d2F, setD2] = useState([])
    const [d3F, setD3] = useState([])
    const [d4F, setD4] = useState([])


    var getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    };
    const subSet = (o, keys) => keys.reduce((r, k) => (r[k] = o[k], r), {})
    function groupByTotal(arr, groupByCols, aggregateCols) {
        let grouped = {};
      
        arr.forEach(o => {
          const values = groupByCols.map(k => o[k]).join("|");
          if (grouped[values])
            grouped[values][aggregateCols] += o[aggregateCols]
          else
            grouped[values] = { ...subSet(o, groupByCols), [aggregateCols]: o[aggregateCols] }
        })
      
        return Object.values(grouped);
      }

    useEffect(async () => {
        const userId = await getDeviceId()
        // target
        let userHabitResponse = await axios.get(`${GET_USER_HABIT_BY_USER}/${userId}`)
        let userHabitResponseData = userHabitResponse.data.filter(userHab => userHab._id === userHabit._id);
        //console.log(userHabitResponseData)
        let target = {}
        for (let i = 0; i < 7; i++) {
            target[i] = userHabitResponseData[0].routine[i].reduce((accumulator, object) => {
                return accumulator + parseInt(object.amount);
              }, 0);
            }
        //console.log(target)
        
        // actual
        const logData = await axios.get(`${GET_USER_LOG}/${userId}`)
        let userHabitLogData = logData.data.filter(log => log.userHabitId === userHabit._id);
        //console.log(userHabitLogData)
        userHabitLogData.forEach(v => {v.logDate = formatDateTime(v.time).strDate;});
        userHabitLogData.forEach(v => {v.logWeekday = dateToWeekdayInt(new Date(v.time));});

        let actuals= groupByTotal(userHabitLogData, ['logDate','logWeekday'], 'amount')
        //console.log(actuals)

        // calendar days
        var calendarDaysList = getDaysArray(new Date(new Date().getTime()-24*3600*7*1000), new Date())
        console.log(calendarDaysList)
        var createDate = new Date(userHabit.createdAt)
        createDate.setHours(0)
        createDate.setMinutes(0)
        var validDay = calendarDaysList.map(function(e) {
            e = e.getTime() >= createDate.getTime() ? 1: 0
            return e
        });
        console.log(createDate, validDay)
        var caledarDaysWeekdayList = calendarDaysList.map(function(e) {
            e = dateToWeekdayInt(e)
            return e
        });
        //console.log(caledarDaysWeekdayList)
        var calendarDatesList = calendarDaysList.map(function(e) {
            e = formatDateTime(e).strDate
            return e
        });

        var calendarDatesShortList = calendarDaysList.map(function(e) {
            e = formatDateTime(e).strDateShort
            return e
        });
        //console.log(calendarDatesList)

        var d1 = [] //actual y/n
        var d2 = [] // target y/n
        var d3 = [] // actual amt
        var d4 = [] // target amt

        for (let i = 0; i < calendarDatesList.length; i++) {
            let x = calendarDatesList[i]
            let x_ = calendarDatesShortList[i]
            let valid = validDay[i]
            let actAmt = actuals.filter(log => log.logDate === x)
            console.log(actuals.filter(log => log.logDate === x))
            let tgtAmt = target[caledarDaysWeekdayList[i]]
            
            if (actAmt.length>0){
                d1.push({'x':x_, 'y': actAmt[0].amount>0?1:0})
                d3.push({'x':x_, 'y': actAmt[0].amount>0?actAmt[0].amount:0})
            }
            else {
                d1.push({'x':x_, 'y': 0})
                d3.push({'x':x_, 'y': 0})
            }
            d2.push({'x':x_, 'y': tgtAmt>0?1*valid:0})
            d4.push({'x':x_, 'y': tgtAmt>0?tgtAmt*valid:0})

        }
        // console.log(d1)
        // console.log(d2)
        // console.log(d3)
        // console.log(d4)
        setD1(d1)
        setD2(d2)
        setD3(d3)
        setD4(d4)
        setLoadingIndicator(false)

    }, []);

    const closeInsights = () => {
        setShowInsights(false)
    }

    return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={true}
    >
    <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
        <View style={containerStyles.insightsContainer}>
        <LoadingSpinner loadingIndicator={loadingIndicator} />
            <View style={{ position: "absolute", left: 320, marginTop:15 }}>
                <TouchableOpacity style={[buttonStyles.button, { paddingHorizontal: 5 }]} onPress={() => closeInsights()}>
                    <Text style={textStyles.textSmallRed}>X</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:"row" ,alignContent:"flex-start", alignItems:'center', marginTop:15, marginLeft:15}}>
                <View>
                    <Image
                        style={iconStyles.tinyLogo}
                        source={{ uri: userHabit.awsKey}}
                    />
                </View>
                <Text style={[textStyles.text, {marginLeft:5}]}>{userHabit.habitName} Insights</Text>
            </View>
            <ScrollView>
                <Text style={[textStyles.textMedBlue, {marginBottom:15, marginLeft: 10, marginTop: 30}]}>Today and Previous 7 days</Text>
                <VictoryBarChart title = {'Habit Done (Yes/No)'} 
                                data1 = {d1F}
                                data2 = {d2F}                               
                />
                <VictoryBarChart title = {userHabit.metric + ' (' + userHabit.unit +')'} 
                                data1 = {d3F}
                                data2 = {d4F}                               
                />

            </ScrollView>
        </View>
    </View>
    </Modal>
);
}

export default HabitInsights;