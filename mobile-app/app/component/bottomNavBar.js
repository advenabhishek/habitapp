import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';

import colors from '../config/colors.js';
import textStyles from '../styles/text.js';
import buttonStyles from '../styles/buttons.js';

function BottomNavBar({
    navigation,
}) {
    return (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.pressStyle} onPress={() => navigation.navigate("TodayScreen")}>
                <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_today.png')} />
                <Text style = {textStyles.textVerySmallBlue}>Today</Text>
            </TouchableOpacity>    
            <TouchableOpacity style={styles.pressStyle} onPress={() => navigation.navigate("HomeScreen")}>
                <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_dashboard.png')} />
                <Text style = {textStyles.textVerySmallBlue}>Your Habits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressStyle} onPress={() => navigation.navigate("Habit")}>
                <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_addButton.png')} />
                <Text style = {textStyles.textVerySmallBlue}>Add Habit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressStyle} onPress={() => navigation.navigate("LogJournal")} >  
                <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_logjournal.png')} />
                <Text style = {textStyles.textVerySmallBlue}>Log Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressStyle} onPress={() => navigation.navigate("ProfileScreen")}>
                <Image style={buttonStyles.bottomNavBarButton} source={require('../assets/icons/Icon_yourprofile.png')} />
                <Text style = {textStyles.textVerySmallBlue}>Profile</Text>
            </TouchableOpacity>    
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: 'absolute',
        bottom: '0%',
        borderTopColor: colors.bordorColor,
        borderTopWidth: 1,
        paddingVertical: 0,
        backgroundColor: colors.backgroundBlue
        
    },
    pressStyle: { 
        height: 60, 
        width: 60, 
        borderRadius: 30, 
        alignItems: "center", 
        justifyContent: "center"
    }
})

export default BottomNavBar;

