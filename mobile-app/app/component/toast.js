import Toast from 'react-native-root-toast';
import colors from '../config/colors';

export default function ToastShow(message){
    return (
        Toast.show(message, {
            duration: Toast.durations.LONG,
            backgroundColor: "white",
            textColor: colors.textBlue,
            opacity: 1,
            position: -50
        })
    )
}


