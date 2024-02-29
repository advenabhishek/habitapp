import React from 'react';
import { View, StyleSheet, Image,Dimensions } from 'react-native';
//impot Image from 'react-native-svg-uri';
import colors from '../config/colors.js';
const windowHeight = Dimensions.get('window').height;


function Logo() {
    return (
        <View style={styles.LogoContainer}>
            <Image
                style={styles.Logo}
                source={require('../assets/logo-white.png')}
            />            
        </View>
    );
}

const styles = StyleSheet.create({
    LogoContainer: {
        backgroundColor: colors.backgroundDarkBlue,
        marginBottom:-.025*windowHeight,
        marginTop:-.025*windowHeight,
        height:0.12*windowHeight,
        width:0.12*windowHeight,
        borderRadius:0.125*windowHeight,
        zIndex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    Logo: {
        width: 0.15*windowHeight,
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain'
    }
})

export default Logo;

