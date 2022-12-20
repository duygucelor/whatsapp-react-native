import { useState, useEffect } from "react";
import { Pressable, Text, FlatList } from "react-native";
import ContactListItem from "../components/ContactListItem.js";
import { listUsers } from "../graphql/queries";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createChatRoom, createChatRoomUser } from "../graphql/mutations";
import { getExistingChatRoom } from "../services/chatRoomService";

const ContactsScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) =>
      setUsers(result.data?.listUsers?.items)
    );
  }, []);
  const createPrivateChatRoom = async (user) => {
    try {
      const existingChatRoom = await getExistingChatRoom(user.id);
      if (existingChatRoom) {
        navigation.navigate("Chat", {
          id: existingChatRoom.id,
          name: user.name,
        });
      } else {
        const newChatRoomData = await API.graphql(
          graphqlOperation(createChatRoom, { input: {} })
        );
        if (newChatRoomData.data?.createChatRoom) {
          const newChatRoom = newChatRoomData.data?.createChatRoom;
          await API.graphql(
            graphqlOperation(createChatRoomUser, {
              input: { chatRoomId: newChatRoom.id, userId: user.id },
            })
          );
          const currentUser = await Auth.currentAuthenticatedUser({
            bypassCache: true,
          });
          await API.graphql(
            graphqlOperation(createChatRoomUser, {
              input: {
                chatRoomId: newChatRoom.id,
                userId: currentUser.attributes.sub,
              },
            })
          );
          navigation.navigate("Chat", { id: newChatRoom.id, name: user.name });
        }
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <ContactListItem
          user={item}
          onPress={() => createPrivateChatRoom(item)}
        />
      )}
      style={{ backgroundColor: "white" }}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => navigation.navigate("NewGroup")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};

export default ContactsScreen;
