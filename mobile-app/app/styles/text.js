import colors from "../config/colors";
import font from "../config/font";


const text = {
    color: colors.textBlue,
    fontSize: font.contentFontSize, //22
    fontFamily: font.contentFontFamily
}

const textRed = {
    color: colors.textRed,
    fontSize: font.contentFontSize,
    fontFamily: font.contentFontFamily
}

const textWhite = {
    color: '#FFFFFF',
    fontSize: font.contentFontSize,
    fontFamily: font.contentFontFamily
}

const textGray = {
    color: colors.textGray,
    fontSize: font.contentFontSize,
    fontFamily: font.contentFontFamily
}

const textMedBlue = {
    color: colors.textBlue,
    fontSize: font.contentFontSizeMed, //22
    fontFamily: font.contentFontFamily
}

const textMedRed = {
    color: colors.textRed,
    fontSize: font.contentFontSizeMed,
    fontFamily: font.contentFontFamily
}

const textMedGray = {
    color: colors.textGray,
    fontSize: font.contentFontSizeMed,
    fontFamily: font.contentFontFamily
}

const textMedWhite = {
    color: '#FFFFFF',
    fontSize: font.contentFontSizeMed,
    fontFamily: font.contentFontFamily
}

const textSmallBlue = {
    color: colors.textBlue,
    fontSize: font.contentFontSizeSmall,
    fontFamily: font.contentFontFamily,
    //textAlign:"center"
}

const textSmallRed = {
    color: colors.textRed,
    fontSize: font.contentFontSizeSmall,
    fontFamily: font.contentFontFamily,
    //textAlign: 'left',
    //textAlign:"center"
}

const textSmallerBlue = {
    color: colors.textBlue,
    fontSize: font.contentFontSizeSmaller,
    fontFamily: font.contentFontFamily,
    //textAlign:"center"
}

const textSmallerRed = {
    color: colors.textRed,
    fontSize: font.contentFontSizeSmaller,
    fontFamily: font.contentFontFamily,
    //textAlign: 'left',
    //textAlign:"center"
}

const textSmallerGray = {
    color: colors.textGray,
    fontSize: font.contentFontSizeSmaller,
    fontFamily: font.contentFontFamily,
    //textAlign: 'left',
    //textAlign:"center"
}

const textVerySmallRed = {
    color: colors.textRed,
    fontSize: font.contentFontSizeVerySmall,
    fontFamily: font.contentFontFamily,
}

const textVerySmallBlue = {
    color: colors.textBlue,
    fontSize: font.contentFontSizeVerySmall,
    fontFamily: font.contentFontFamily,
}

const textVerySmallGray = {
    color: colors.textGray,
    fontSize: font.contentFontSizeVerySmall,
    fontFamily: font.contentFontFamily,
}

const logWindowText = {
    ...textMedBlue, 
    width: 150
}

// main
const textStyles = {
    text : text,
    textRed : textRed,
    textWhite: textWhite,
    textGray: textGray,
    textMedBlue: textMedBlue,
    textMedRed: textMedRed,
    textMedGray: textMedGray,
    textMedWhite: textMedWhite,
    textSmallBlue : textSmallBlue,
    textSmallRed : textSmallRed,
    textSmallerBlue: textSmallerBlue,
    textSmallerRed: textSmallerRed,
    textSmallerGray: textSmallerGray,
    textVerySmallBlue : textVerySmallBlue,
    textVerySmallRed : textVerySmallRed,
    textVerySmallGray: textVerySmallGray,
    logWindowText: logWindowText,
    
}

export default textStyles;