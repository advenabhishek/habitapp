import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard'
import Logo from '../component/logo';
import ToastShow from '../component/toast';

import containerStyles from '../styles/containers.js';
import textStyles from '../styles/text.js';
import buttonStyles from '../styles/buttons';
import { analytics, analyticsTrack } from '../service/mixpanel';
import BottomNavBar from '../component/bottomNavBar';

import {getDeviceId} from '../service/device';
import * as appJSON from '../../app.json';
import colors from '../config/colors';
import iconStyles from '../styles/icons';

const shareURL = 'https://play.google.com/store/apps/details?id=com.thedoitapp.doit&referrer=utm_source%3Drefer'


function ProfileScreen(props) {
    const {navigation} = props
    const [deviceId, setDeviceId] = useState()
    const [showShareMsg, setShowShareMsg] = useState(false)
    const [showFeedbackBox, setShowFeedbackBox] = useState(false)
    const [feedbackBoxMsg, setFeedbackBoxMsg] = useState()
    const [feedback, setFeedback] = useState()
    const [feedbackSentiment, setFeedbackSentiment] = useState()

    useEffect(() => {
        async function loadscreen(){
            let deviceId = await getDeviceId()
            setDeviceId(deviceId)
            analyticsTrack(analytics, "profile");
        }
        loadscreen()    
    },[]);

    const likeButtonPress = (like) => {
        if(like==1){
            setFeedbackBoxMsg('Wohoo! Please tell us what you are liking :)')
            setFeedbackSentiment("positive")
            analyticsTrack(analytics, "profile:feedbackPositive");
        }
        else{
            setFeedbackBoxMsg('Sorry about the troubles, friend. Please tell us how we can do better and we will make it happen.')
            setFeedbackSentiment("negative")
            analyticsTrack(analytics, "profile:feedbackNegative");
        }
        setShowFeedbackBox(true)
    }

    const feedbackSubmitPress = () => {
        setShowFeedbackBox(false)
        analyticsTrack(analytics, "profile:feedbackSubmit", {"feedback":feedback, "sentiment": feedbackSentiment});
        ToastShow("Feedback submitted successfully")

    }
    
    const shareIconPress = () => {
        analyticsTrack(analytics, "profile:shareIconPressed");
        setShowShareMsg(true)
        Clipboard.setString("Hey there! Join me in building habits together on: "+shareURL);
        // ToastShow("Message copied to clipboard")
        };
    


    return(
        <View style={containerStyles.container}>
            <Logo />
            <View style={containerStyles.mainContainer}>
                <View style={containerStyles.screenHeadingContainer}>
                    <Text style={textStyles.text}>Your
                        <Text style={textStyles.textRed}> Profile</Text>
                    </Text>
                </View>
                <View style={{height:"40%", alignItems:"center"}}>
                    <Image style={iconStyles.bigImage} source={require('../assets/GIF_plantGrow.gif')} />
                </View>
                <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal: 40, marginTop: 40}}>
                    <View style={{width:"60%" ,alignItems:"center", justifyContent:"center"}}>
                        <Text style={textStyles.textSmallBlue}>Are you finding Do.it helpful for building habits?</Text>
                    </View>
                    <View style={{width:"30%" ,flexDirection:"row", alignItems:"flex-start", justifyContent:"space-evenly"}}>
                        <TouchableOpacity onPress={() => likeButtonPress(1)}>
                            <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_like.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => likeButtonPress(0)}>
                            <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_dislike.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {showFeedbackBox &&
                    (
                        <Modal 
                        animationType="fade"
                        transparent={true}
                        visible={true}>
                            <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
                                <View style={styles.feedbackMsgContainer}>
                                    <TouchableOpacity style = {[buttonStyles.button, {width: 20, paddingHorizontal:5, alignSelf:"flex-end"}]} onPress={()=>setShowFeedbackBox(false)}>
                                        <Text style={textStyles.textSmallRed}>X</Text>
                                    </TouchableOpacity>
                                    <Text>{feedbackBoxMsg}</Text>
                                    <TextInput style={styles.inputTextBox} multiline={true} onChangeText={(text)=>setFeedback(text)}></TextInput>
                                    <View style={{marginTop:20 ,alignItems:"flex-end"}}>
                                        <TouchableOpacity style={[buttonStyles.buttonLog,{width:'22%' ,alignItems:"center"}]} onPress={() => feedbackSubmitPress()}>
                                            <Text>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </Modal>
                    )

                }
                <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal: 40, marginTop: 40}}>
                    <View style={{width:"60%" ,alignItems:"center", justifyContent:"center"}}>
                        <Text style={textStyles.textSmallBlue}>It's nice to have someone by your side. Share an invite with friends and family.</Text>
                    </View>
                    <View style={{width:"30%" ,flexDirection:"row", alignItems:"flex-end", justifyContent:"space-evenly"}}>
                        <TouchableOpacity onPress={() => shareIconPress()}>
                            <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_share.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[textStyles.textVerySmallGray, {textAlign:"center", marginTop: 80}]}>{deviceId} | v{appJSON['expo']['version']} | {appJSON['expo']['android']['versionCode']}</Text>
                {showShareMsg &&
                    (
                        <Modal 
                        animationType="fade"
                        transparent={true}
                        visible={true}>
                            <View style={{ backgroundColor: "rgba(224, 242, 241,0.8)", flex: 1 }}>
                                <View style={styles.shareMsgContainer}>
                                    <TouchableOpacity style = {[buttonStyles.button, {width: 20, paddingHorizontal:5, alignSelf:"flex-end"}]} onPress={()=>setShowShareMsg(false)}>
                                        <Text style={textStyles.textSmallRed}>X</Text>
                                    </TouchableOpacity>
                                    <Text>Hey there! Join me in building good habits together on: {shareURL}</Text>
                                    <Text style={[textStyles.textVerySmallRed, {textAlign:"right", marginTop: 10}]}>...Copied to clipboard!</Text>
                                </View>
                            </View>

                        </Modal>
                    )
                }
            </View>
            <BottomNavBar navigation={navigation}/>
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

export default ProfileScreen;