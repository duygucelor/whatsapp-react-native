import { useState, useEffect } from "react";
import { View, FlatList, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../components/ContactListItem.js";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useNavigation } from "@react-navigation/native";

const NewGroupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const createNewGroup = async (user) => {
    try {
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: {name} })
      );
      const newChatRoom = newChatRoomData.data?.createChatRoom;
      await API.graphql(
        graphqlOperation(createChatRoomUser, {
          input: { chatRoomId: newChatRoom.id, userId: user.id },
        })
      );
      const currentUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setSelectedUserIds((ids) => [...ids, currentUser.attributes.sub]);
      await Promise.all(
        selectedUserIds.map((id) => {
          API.graphql(
            graphqlOperation(createChatRoomUser, {
              input: {
                chatRoomId: newChatRoom.id,
                userId: id,
              },
            })
          );
        })
      );

      navigation.navigate("Chat", { id: newChatRoom.id, name: user.name });
    } catch (error) {
      console.info(error);
    }
  };

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) =>
      setUsers(result.data?.listUsers?.items)
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create"
          disabled={!name || selectedUserIds.length < 1}
          onPress={createNewGroup}
        />
      ),
    });
  }, [name]);

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
      <TextInput
        onChangeText={setName}
        value={name}
        style={styles.input}
        placeholder="Group name"
      />
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
      />
    </View>
  );
};

export default NewGroupScreen;

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
