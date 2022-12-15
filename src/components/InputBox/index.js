import { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const InputBox = () => {
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = () => {
    console.info(newMessage);
    //send newMessage to back
  };
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AntDesign name="plus" size={20} color="royalblue" />
      <TextInput
        onTextChange={setNewMessage}
        value={newMessage}
        style={styles.input}
        placeholder="Type your message"
      />
      <MaterialIcons
        onPress={sendMessage}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 50,
    borderColor: "lightGray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default InputBox;
