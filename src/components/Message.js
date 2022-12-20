import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  useEffect(() => {
    const isMyMessage = async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      setIsMe(message.userID === currentUser.attributes.sub);
    };
    isMyMessage();
  }, []);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#DCF8C5" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text>{message?.text}</Text>
      <Text style={styles.time}>{dayjs(message?.createdAt).fromNow(true)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
});

export default Message;
