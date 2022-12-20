import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import ChatListItem from "../components/ChatListItem.js";
import { listUserChatRooms } from "../graphql/myQueries";

const ChatsScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation(listUserChatRooms, { id: currentUser.attributes.sub })
      );
      const rooms = response?.data?.getUser?.chatrooms?.items || [];
      const sortedRooms = rooms.sort(
        (room1, room2) =>
          new Date(room2.chatRoom.updatedAt) - new Date(room1.chatRoom.updatedAt)
      );
      setChatRooms(sortedRooms);
      setLoading(false);
    } catch (error) {
      console.info(error)
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchChatRooms();
  }, []);
  return (
    <FlatList
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      style={{ backgroundColor: "white" }}
      refreshing={loading}
      onRefresh={fetchChatRooms}
    />
  );
};

export default ChatsScreen;
