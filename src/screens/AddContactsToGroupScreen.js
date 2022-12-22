import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Button } from "react-native";
import ContactListItem from "../components/ContactListItem.js";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createChatRoomUser } from "../graphql/mutations";

const AddContactToGroupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const chatRoom = route.params.chatRoom;
  const alreadyExistedUserIds = chatRoom?.Users?.items
    .filter((item) => !item._deleted)
    .map((userItem) => userItem.userId);

  const addContactsToGroup = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedUserIds.map((id) => {
          API.graphql(
            graphqlOperation(createChatRoomUser, {
              input: {
                chatRoomId: chatRoom.id,
                userId: id,
              },
            })
          );
        })
      );
      setLoading(false);
      navigation.navigate("Chat", {
        id: chatRoom.id,
        name: chatRoom.name,
      });
    } catch (error) {
      console.info(error);
    }
  };

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) =>
      setUsers(
        result.data?.listUsers?.items.filter(
          (item) => !item._deleted && !alreadyExistedUserIds?.includes(item.id)
        )
      )
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add"
          disabled={selectedUserIds.length < 1}
          onPress={addContactsToGroup}
        />
      ),
    });
  }, [selectedUserIds.length]);

  const selectUser = (id) => {
    setSelectedUserIds((ids) => {
      if (ids.includes(id)) {
        return [...ids].filter((uid) => uid !== id);
      } else {
        return [...ids, id];
      }
    });
  };

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            onPress={() => selectUser(item.id)}
            selectable
            isSelected={selectedUserIds.includes(item.id)}
          />
        )}
        style={{ backgroundColor: "white" }}
        refreshing={loading}
      />
    </View>
  );
};

export default AddContactToGroupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  input: {
    margin: 10,
    padding: 10,
    borderColor: "lightgray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
