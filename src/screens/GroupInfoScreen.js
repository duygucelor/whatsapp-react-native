import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../graphql/subscriptions";
import ContactListItem from "../components/ContactListItem";
import { deleteChatRoomUser } from "../graphql/mutations";

const GroupInfoScreen = () => {
  const navigation = useNavigation();
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  const chatRoomID = route.params.id;

  const fetchChatRoom = async () => {
    setLoading(true);
    const result = await API.graphql(
      graphqlOperation(getChatRoomInfo, { id: chatRoomID })
    );
    setChatRoom(result.data?.getChatRoom);
    setLoading(false);
  };

  const onContactPress = (item) => {
    Alert.alert(
      "Removing the user from chat room",
      `Are you sure to remove ${item.user.name}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeChatRoomUser(item),
        },
      ]
    );
  };

  const removeChatRoomUser = async (chatRoomUser) => {
    await API.graphql(
      graphqlOperation(deleteChatRoomUser, {
        input: { _version: chatRoomUser._version, id: chatRoomUser.id },
      })
    );
    fetchChatRoom();
  };
  useEffect(() => {
    fetchChatRoom();
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatRoomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });
    return () => subscription.unsubscribe();
  }, [chatRoomID]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  const users = chatRoom?.Users?.items.filter((item) => !item._deleted) || [];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom.name}</Text>
      <View style={styles.subTitleView}>
        <Text style={styles.subTitle1}>{users.length} Participants</Text>
        <Text
          style={styles.subTitle2}
          onPress={() =>
            navigation.navigate("Add Contacts", { chatRoom })
          }
        >
          Invite friends
        </Text>
      </View>
      <View style={styles.section}>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              onPress={() => onContactPress(item)}
            />
          )}
          onRefresh={fetchChatRoom}
          refreshing={loading}
        />
      </View>
    </View>
  );
};
export const getChatRoomInfo = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      name
      image
      Users {
        items {
          id
          chatRoomId
          userId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          user {
            id
            name
            status
            image
          }
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      chatRoomLastMessageId
    }
  }
`;

export default GroupInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  subTitleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle1: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  subTitle2: {
    color: "royalblue",
    fontSize: 16,
    marginTop: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
});
