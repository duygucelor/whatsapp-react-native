import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { onUpdateChatRoom } from "../graphql/subscriptions";

dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [chatRoom, setChatRoom] = useState(chat);
  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      const userToChat = chatRoom.Users.items.filter(
        (item) => item.user.id !== currentUser?.attributes.sub
      )[0].user;
      setUser(userToChat);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const subscription1 = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chat.id } },
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
  }, [chat.id]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", { id: chatRoom.id, name: user?.name })
      }
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={{
          uri: user?.image,
        }}
      ></Image>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {user?.name}
          </Text>
          {chatRoom.LastMessage && (
            <Text style={styles.subtitle}>
              {dayjs(chatRoom.LastMessage?.createdAt).fromNow(true)}
            </Text>
          )}
        </View>
        <Text numberOfLines={2} style={styles.subtitle}>
          {chatRoom.LastMessage?.text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
  },
});

export default ChatListItem;