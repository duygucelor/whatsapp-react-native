import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../screens/ChatScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ContactsScreen from "../screens/ContactsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: "whitesmoke" } }}
      >
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
