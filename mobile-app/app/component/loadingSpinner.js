import { ActivityIndicator, View } from 'react-native';
import colors from "../config/colors";
import containerStyles from '../styles/containers';


function LoadingSpinner(props) {
    const {loadingIndicator} = props

    return (
            <View style={containerStyles.loadingOverlay}>
            <ActivityIndicator
                animating = {loadingIndicator}
                hidesWhenStopped = {true}
                color = {colors.backgroundDarkBlue}
                size = "large"
            />
            </View>
        )
}
;

export default LoadingSpinner;