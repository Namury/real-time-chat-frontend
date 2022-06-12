import * as yup from 'yup';

export const createRoomSchema = yup.object().shape({
  roomName: yup
  .string()
  .required('Room Name is required')
  .matches(
    /[a-zA-Z1-9].*/,
    'Invalid Name'
  )
});

export const joinRoomSchema = yup.object().shape({
  roomUuid: yup.string().required('Room Uuid is required')
});
