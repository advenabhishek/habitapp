import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../config/colors';


function ProgressBar(props) {
    const { data } = props
    return (
        <View style={styles.progressBarContainer}>
            <View style={{ display: 'flex',  flexDirection: 'row' }}>
                {data.map((row, key) => (
                    <Text key={key} numberOfLines={1} style={{ flex: 1, margin: 2,color: colors.textBlue, textAlign: "center" }}>
                        {row.text || ''}
                    </Text>
                ))}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                {data.map((row, key) => {
                    return (
                        <View key={key} style={{ flex: 1, margin: 2, height: 2, backgroundColor: row.complete ? colors.backgroundDarkBlue : '#aaaaaa' }}>

                        </View>
                    )
                })}
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    progressBarContainer: {
        //flex: 1,
        //justifyContent: "center",
        marginTop: -15,
        marginBottom: 15
    },
})

export default ProgressBar;