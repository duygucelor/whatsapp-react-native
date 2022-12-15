import { StyleSheet, FlatList } from "react-native";
import ContactListItem from "../components/contactListItem";
import contacts from "../../assets/data/contacts.json"

const ContactsScreen = () => {
  console.info(contacts)
  return (
    <FlatList
      data={contacts}
      renderItem={({ item }) => <ContactListItem user={item}/>}
      inverted
      style={{ backgroundColor: "white" }}
    />
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});

export default ContactsScreen;
