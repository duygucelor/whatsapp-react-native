import {
  StyleSheet,
  ImageBackground,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import bg from "../../assets/BG.png";
import Message from "../components/Message.js";
import InputBox from "../components/InputBox.js";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";
import { onCreateMessage, onUpdateChatRoom } from "../graphql/subscriptions";
import { Feather } from "@expo/vector-icons";

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const chatRoomID = route.params.id;


  const fetchChatRoomData = async () => {
    const result = await API.graphql(
      graphqlOperation(getChatRoom, { id: chatRoomID })
    );
    setChatRoom(result.data?.getChatRoom);
  };

  useEffect(() => {
    fetchChatRoomData();
    const subscription1 = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatRoomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data?.onUpdateChatRoom,
        }));
      },
      error: (err) => console.warn(err),
    });
    return () => subscription1.unsubscribe();
  }, [chatRoomID]);

  useEffect(() => {
    const getChatRoomMessages = () => {
      API.graphql(
        graphqlOperation(listMessagesByChatRoom, {
          chatroomID: chatRoomID,
          sortDirection: "ASC",
        })
      ).then((response) => {
        setMessages(response?.data?.ListMessagesByChatRoom?.items);
      });

      const subscription = API.graphql(
        graphqlOperation(onCreateMessage, {
          filter: { chatroomID: { eq: chatRoomID } },
        })
      ).subscribe({
        next: ({ value }) => {
          setMessages((m) => [...m, value.data.onCreateMessage]);
        },
        error: (err) => console.warn(err),
      });
      return () => subscription.unsubscribe();
    };
    getChatRoomMessages();
  }, [chatRoomID]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerRight: () => (
        <Feather
          onPress={() => navigation.navigate("GroupInfo", { id: chatRoomID })}
          name="more-vertical"
          size={24}
          color="gray"
        />
      ),
    });
  }, [route.params.name, chatRoomID]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.bg}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
        />
        <InputBox chatroom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});

export default ChatScreen;
