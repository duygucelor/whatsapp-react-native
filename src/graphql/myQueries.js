export const listUserChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      chatrooms {
        items {
          _deleted
          chatRoom {
            id
            updatedAt
            name
            image
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
