import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
const ContactListItem = ({
  user,
  onPress = () => {},
  selectable = false,
  isSelected = false,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {user?.image ? (
        <Image
          style={styles.image}
          source={{
            uri: user?.image,
          }}
        />
      ) : (
        <View style={styles.image}>
          <FontAwesome name="user-circle" size={60} color="black" />
        </View>
      )}
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {user?.name}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {user?.status}
        </Text>
      </View>
      {selectable &&
        (isSelected ? (
          <AntDesign name="checkcircle" size={24} color="royalblue" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="lightgray" />
        ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    width: "100%",
  },
});

export default ContactListItem;
