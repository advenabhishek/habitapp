import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../config/colors';


function ProgressDots(props) {
    const { data } = props
    return (
        <View style={styles.progressBarContainer}>
            <View style={{ width: 50, flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'center' }}>
                {data.map((row, key) => {
                    return (
                        <View key={key} style={{ width: 8, height: 8, borderRadius:4, backgroundColor: row.complete ? colors.backgroundDarkBlue : '#aaaaaa' }}>
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
        marginTop: 45,
        marginBottom: 15
    },
})

export default ProgressDots;