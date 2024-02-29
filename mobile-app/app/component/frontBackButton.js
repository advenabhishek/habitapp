import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import colors from '../config/colors.js';
import font from '../config/font.js';

import textStyles from '../styles/text.js';

function FrontBackButton({
    onNextPress = () => { console.warn('No next action defined') },
    onFinishPress = () => { console.warn('No finish action defined') },
    onBackPress,
    back = true,
    next = true,
    finish = false,
    navigation,
}) {
    return (
        <View style={styles.buttonsContainer}>
            {
                back &&
                <TouchableOpacity style={styles.buttonContainer} onPress={onBackPress || (() => navigation.goBack())}>
                    <Text style={textStyles.text}>{'<'} Back</Text>
                </TouchableOpacity>
            }
            {
                next &&
                <TouchableOpacity style={styles.buttonContainer} onPress={onNextPress}>
                    <Text style={textStyles.text}>Next {'>'}</Text>
                </TouchableOpacity>
            }
            {
                finish &&
                <TouchableOpacity style={styles.buttonContainer} onPress={onFinishPress}>
                    <Text style={textStyles.text}>Finish</Text>
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        position: 'absolute',
        bottom: '0%',
        borderTopColor: colors.bordorColor,
        borderTopWidth: 1,
        paddingVertical: 20,
        
    },
    buttonContainer: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
})

export default FrontBackButton;

