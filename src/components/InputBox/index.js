import { StyleSheet, View, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const InputBox = () => {
  return (
    <View style={styles.container}>
      <AntDesign name="plus" size={20} color="royalblue" />
      <TextInput style={styles.input} placeholder="Type your message" />
      <MaterialIcons
        onPress={() => console.info("asd")}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal:10,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginHorizontal:10,
    padding: 5,
    borderRadius: 50,
    borderColor:'lightGray',
    borderWidth: StyleSheet.hairlineWidth
  },
  send: {
    backgroundColor:'royalblue',
    padding:7,
    borderRadius:15,
    overflow: 'hidden'
  },
});

export default InputBox;
