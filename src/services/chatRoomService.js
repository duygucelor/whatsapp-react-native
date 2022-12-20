import { API, graphqlOperation, Auth } from "aws-amplify";
export const getExistingChatRoom = async (user2ID) => {
  const currentUser = await Auth.currentAuthenticatedUser();
  const myChatRoomsResponse = await API.graphql(
    graphqlOperation(listMyChatRooms, { id: currentUser.attributes.sub })
  );
  const myChatRooms = myChatRoomsResponse.data?.getUser?.chatrooms?.items || []
  const myChatRoom = myChatRooms.find(
    (room) =>
      room.chatRoom?.Users?.items?.length === 2 &&
      room.chatRoom?.Users?.items.some(
        (userItem) => userItem.user.id === user2ID
      )
  );
  return myChatRoom?.chatRoom
};

export const listMyChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      chatrooms {
        items {
          chatRoom {
            id
            Users {
              items {
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
