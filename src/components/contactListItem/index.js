import { StyleSheet, Text, View, Image, Pressable } from "react-native";
const ContactListItem = ({ user }) => {
  return (
    <Pressable
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={{
          uri: user.image,
        }}
      ></Image>
      <View style={styles.content}>
          <Text numberOfLines={1} style={styles.name}>
            {user.name}
          </Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            {user.status}
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
    height:70,
    alignItems:'center'
  },
  content:{
    flex:1
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
    width:'100%'
  },
});

export default ContactListItem;
