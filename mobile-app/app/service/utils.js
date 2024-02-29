const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatDateTime = (dateObj) => {
    //var date = new Date(date)
    //console.log("formatAPMP: ", dateObj)
    if (typeof (dateObj) == 'string') {
        dateObj = new Date(dateObj)
    }
    if (!dateObj.getDate()) { // not a date
        var strDate = ''
        var strTime = ''
        var hours = ''
        var minutes = ''
        var ampm = ''
        return { strDate, strTime, hours, minutes, ampm };
    }

    // Date
    var date = dateObj.getDate();
    var month = monthList[dateObj.getMonth()];
    var year = dateObj.getFullYear();
    var strDate = date + ' ' + month + ' ' + year
    var strDateShort = date + '/' +(dateObj.getMonth()+1)

    // Time
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var hoursZero = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ' : ' + minutes + ' ' + ampm;
    var strTimeZero = hoursZero + ' : ' + minutes + ' ' + ampm;
    var strDateTime = strTime + '\n' + strDate
    return { strDate, strDateShort, strTime, strTimeZero, strDateTime, hours, minutes, ampm };
}

export const round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export const timeDiff = (date1, date2) => {
    if (typeof (date1) == 'string') {
        date1 = new Date(date1)
    }
    if (typeof (date2) == 'string') {
        date2 = new Date(date2)
    }
    if (!date1.getDate() || !date2.getDate()) { // not a date
        var timeDiffHrs = ''
        var timeDiffHrsMins = ''
        var timeDiffHrsPrecise = ''
        return { timeDiffHrs, timeDiffHrsMins, timeDiffHrsPrecise };
    }

    var date1Time = date1.getTime()
    var date2Time = date2.getTime()
    if (date2Time < date1Time) {
        date2Time = date2Time + 24 * 3600 * 1000 // add 1 day
    }

    var timeDiff = date2Time - date1Time
    var timeDiffHrsPrecise = round(timeDiff / (3600 * 1000), 1)
    var timeDiffHrs = Math.floor(timeDiffHrsPrecise)
    var timeDiffHrsMins = Math.floor((timeDiff%(3600*1000))/(60*1000))
    var timeDiffDays = Math.floor(timeDiff/(24*3600*1000))
    return {timeDiffHrs, timeDiffHrsMins, timeDiffHrsPrecise, timeDiffDays}
}

export const dateToWeekdayInt = (currentDate) => {
    return currentDate.getDay() == 0 ? 6 : currentDate.getDay() - 1
}

export const dateTimetoDateInt = (datetime) => {
    datetime = new Date(datetime)
    return datetime.getFullYear()*10000+datetime.getMonth()*100+datetime.getDate()
}

export const normalizeDate = (date) => {
    let dt = new Date(date)
    dt.setDate(1)
    dt.setMonth(0)
    dt.setFullYear(2022)
    return new Date(dt)
}

export const padToTwo = (number) => (number <= 9 ? `0${number}` : number);