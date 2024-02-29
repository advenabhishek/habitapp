
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

function DateTimePickerComp(props) {
    const {mode, setShow, currentDate, minimumDate, maximumDate, setCurrentDate, routineTime} = props

    const onChange = (event, selectedDate) => {
        setShow(false);
        if (selectedDate){
            setCurrentDate(selectedDate);
        }
        if(routineTime && selectedDate){
            routineTime[0](selectedDate, routineTime[1], routineTime[2]) //update routine time
        }
    };
    return(
    <DateTimePicker
        testID="dateTimePicker"
        value={currentDate}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        mode={mode}
        is24Hour={false}
        onChange={onChange}
        />
    )
}

export default DateTimePickerComp;