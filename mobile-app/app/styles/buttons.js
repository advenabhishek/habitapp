import colors from "../config/colors";

const buttonLog = {
    borderColor: colors.backgroundDarkBlue,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 5,
    alignItems: "center",
}

const buttonCounter = {
    borderColor: colors.backgroundDarkBlue,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    alignItems: "center",
}

const button20pct = {
    borderColor: colors.backgroundDarkBlue,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "20%"
}

const button40pct = {
    borderColor: colors.backgroundDarkBlue,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "40%"    
}

const bottomButton75pct = {
    borderColor: colors.backgroundDarkBlue,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    bottom: '0%',
    marginBottom: 25,
    height: 35,
    width: "75%"    
}

const bottomButton75pctGray = {
    borderColor: colors.textWhite,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    bottom: '0%',
    marginBottom: 25,
    height: 35,
    width: "75%"    
}

const bottomButton40pct = {
    borderColor: colors.backgroundDarkBlue,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    bottom: '0%',
    marginBottom: 25,
    height: 35,
    width: "40%"    
}

const bottomNavBarButton = {
    width: 30,
    height: 30,
    resizeMode: 'contain'
}

const button = {
    borderColor: "#FFFFFF",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 5,
}

// main
const buttonStyles = {
    buttonLog: buttonLog,
    buttonCounter: buttonCounter,
    button20pct: button20pct,
    button40pct: button40pct,
    bottomButton75pct: bottomButton75pct,
    bottomButton75pctGray: bottomButton75pctGray,
    bottomButton40pct: bottomButton40pct,
    bottomNavBarButton: bottomNavBarButton,
    button: button,
}

export default buttonStyles;