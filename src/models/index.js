// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AttachmentType = {
  "IMAGE": "IMAGE",
  "VIDEO": "VIDEO"
};

const { Attachment, ChatRoom, Message, User, ChatRoomUser } = initSchema(schema);

export {
  Attachment,
  ChatRoom,
  Message,
  User,
  ChatRoomUser,
  AttachmentType
};