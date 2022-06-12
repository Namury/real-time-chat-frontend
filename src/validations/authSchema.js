import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup
  .string()
  .required('Username is required')
  .matches(
    /[a-zA-Z1-9].*/,
    'Invalid Name'
  ),
  password: yup.string().required('Password is required')
});
