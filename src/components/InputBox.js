import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMessage } from "../graphql/mutations";
import { updateChatRoom } from "../graphql/mutations";

const InputBox = ({ chatroom }) => {
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      if(authUser){
        const newMessageData = await API.graphql(
          graphqlOperation(createMessage, {
            input: {
              chatroomID: chatroom.id,
              text: newMessage,
              userID: authUser?.attributes?.sub,
            },
          })
        );
        await API.graphql(
          graphqlOperation(updateChatRoom, {
            input: {
              _version: chatroom._version,
              chatRoomLastMessageId: newMessageData?.data?.createMessage?.id,
              id: chatroom.id,
            },
          })
        );
        setNewMessage("");
      }

    } catch (error) {
      console.log(error)
    }

  };
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AntDesign name="plus" size={20} color="royalblue" />
      <TextInput
        onChangeText={(text) => setNewMessage(text)}
        value={newMessage}
        style={styles.input}
        placeholder="Type your message"
      />
      <MaterialIcons
        onPress={sendMessage}
        disabled={newMessage === ""}
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
