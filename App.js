import { StyleSheet, View } from "react-native";
import Navigator from "./src/navigation";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import awsconfig from "./src/aws-exports";
import { useEffect } from "react";
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

const App = () => {
  useEffect(() => {
    const syncUser = async () => {
      const currentUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      const userData = await API.graphql(
        graphqlOperation(getUser, { id: currentUser.attributes.sub })
      );
      if (userData.data.getUser) {
        return;
      }
      const newUser = {
        id: currentUser.attributes.sub,
        name: currentUser.attributes.phone_number,
        status: "Hey! I am using Whatsapp",
      };
      await API.graphql(graphqlOperation(createUser, { input: newUser }));
    };
    syncUser();
  }, []);
  return (
    <View style={styles.container}>
      <Navigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
});

export default withAuthenticator(App);
