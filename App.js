import { StyleSheet,View } from 'react-native';
// import ChatsScreen from './src/screens/ChatsScreen';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {

  return (
    <View style={styles.container}>
     {/* <ChatsScreen/> */}
     <ChatScreen/>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical:50,
    paddingHorizontal:5,
  },
});
