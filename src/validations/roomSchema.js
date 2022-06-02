import * as yup from 'yup';

export const createRoomSchema = yup.object().shape({
  roomname: yup.string().required('Room Name is required')
});
