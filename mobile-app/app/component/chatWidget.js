import { View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import tawkto_chat_url from '../service/tawkto.js';
import { analytics, analyticsTrack } from '../service/mixpanel';


function ChatWidget() {

    const launchChat = async () => {
        analyticsTrack(analytics, "chat:launched");
        let result = await WebBrowser.openBrowserAsync(tawkto_chat_url);
    };

    return (
    <View style={styles.chatOverlay}>
        <TouchableOpacity style={{ height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: "center"}} onPress={launchChat}>
            <Image style={styles.AddChatLogo} source={require('../assets/icons/Icon_chat.png')} />
        </TouchableOpacity>    
    </View>
    );
};

const styles = StyleSheet.create({
    AddChatLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    chatOverlay: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: '15%',
      }  
});

export default ChatWidget;
