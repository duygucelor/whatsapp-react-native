import {FlatList } from "react-native";
import ChatListItem from "../components/chatListItem";
import chats from "../../assets/data/chats";

const ChatsScreen = () => {
  return (
      <FlatList
        data={chats}
        renderItem={({item}) => <ChatListItem chat={item} />}
        inverted
      />
  );
};

export default ChatsScreen;
