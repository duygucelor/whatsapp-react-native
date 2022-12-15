import { StyleSheet, View, Button } from "react-native";
import { Auth } from "aws-amplify";

const SettingsScreen = () => {
  const signOut = async () => {
    await Auth.signOut();
  };
  return (
    <View style={styles.container}>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;
