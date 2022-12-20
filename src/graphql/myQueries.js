export const listUserChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      chatrooms {
        items {
          chatRoom {
            id
            updatedAt
            Users {
              items {
                user {
                  id
                  name
                  image
                }
              }
            }
            LastMessage {
              id
              text
              createdAt
            }
          }
        }
      }
    }
  }
`;
