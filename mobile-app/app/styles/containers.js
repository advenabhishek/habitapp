import { Dimensions } from 'react-native';
import colors from "../config/colors";
const windowHeight = Dimensions.get('window').height;


const container = {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.backgroundWhite,
    justifyContent: "flex-end",
}

const mainContainer = {
    backgroundColor: colors.backgroundBlue,
    height: .9 * windowHeight,
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
}

const screenHeadingContainer = {
    height: 100,
    justifyContent: "center",
    alignItems:"center",
    // borderBottomColor: colors.bordorColor,
    // borderBottomWidth: 1,

}

const optionBodymainContainer = {
    //flex: 5,
    //justifyContent: "space-evenly",
    paddingHorizontal: 30,
}

const optionWrapper =  {
    borderBottomColor: colors.bordorColor,
    borderBottomWidth: 1,
    height: .1 * windowHeight,
    flexDirection: "row",
    alignItems: 'center',
    paddingLeft: 15,
}

const optionWrapper2 =  {
    borderBottomColor: colors.bordorColor,
    borderBottomWidth: 1,
    height: .12 * windowHeight,
    flexDirection: "row",
    alignItems: 'center',
}

const timeContainer = {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
}

const optionHeadercontainer = {
    //flex: 1,
    height: 100,
    paddingHorizontal: 35,
    justifyContent: "center",
}

const trackingMetricAmountContainer = {
    //backgroundColor: colors.backgroundBlue,
    flex: 1,
    //borderBottomColor: colors.bordorColor,
    //borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: 'center',
}

const habitOverviewContainer = {
    backgroundColor: colors.backgroundBlue,
    marginHorizontal: 30,
    //paddingTop: 5,
    //paddingBottom: 5,
    borderBottomColor: colors.bordorColor,
    borderBottomWidth: 1,
    height: 0.19 * windowHeight
}

const routineOverviewContainer = {
    backgroundColor: colors.backgroundBlue,
    marginHorizontal: 30,
    //paddingTop: 5,
    //paddingBottom: 5,
    borderBottomColor: colors.bordorColor,
    borderBottomWidth: 1,
    height: 0.14 * windowHeight
}

const habitOverviewChildContainer = {
    //flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7.5,
    marginTop: 7.5,
    // borderColor: colors.bordorColor,
    // borderWidth: 2,
}

const loadingOverlay = {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '50%',
    elevation: 10,
  }

const logContainer = {
    backgroundColor: colors.backgroundBlue,
    marginHorizontal: 35,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: colors.bordorColor,
    borderBottomWidth: 2,
}
const logChildContainer = {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    marginTop: 4,
}


const userDataLoggingContainer = {
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
}

const habitCardContainer ={
    height: 600,
    width: 360,
    backgroundColor: colors.backgroundBlue,
    alignSelf: "center",
    marginTop: windowHeight * .5 - 220,
    borderRadius: 12,
    flexDirection: "column",
    borderColor: colors.bordorColor,
    borderWidth: 2,
}

const insightsContainer ={
    height: 600,
    width: 360,
    backgroundColor: colors.backgroundBlue,
    alignSelf: "center",
    marginTop: windowHeight * .5 - 300,
    borderRadius: 12,
    flexDirection: "column",
    borderColor: colors.bordorColor,
    borderWidth: 2,
}

const loggingWindowChildContainer = {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems:"center",
    marginBottom: 7,
    marginTop: 7,
    height:30,
}

// main
const containerStyles = {
    container: container,
    mainContainer: mainContainer,
    screenHeadingContainer: screenHeadingContainer,
    optionBodymainContainer: optionBodymainContainer,
    optionWrapper: optionWrapper,
    optionWrapper2: optionWrapper2,
    timeContainer: timeContainer,
    optionHeadercontainer: optionHeadercontainer,
    trackingMetricAmountContainer: trackingMetricAmountContainer,
    habitOverviewContainer: habitOverviewContainer,
    habitOverviewChildContainer: habitOverviewChildContainer,
    routineOverviewContainer: routineOverviewContainer,
    loadingOverlay: loadingOverlay,
    logContainer: logContainer,
    logChildContainer: logChildContainer,
    userDataLoggingContainer: userDataLoggingContainer,
    loggingWindowChildContainer: loggingWindowChildContainer,
    habitCardContainer: habitCardContainer,
    insightsContainer: insightsContainer
};

export default containerStyles;