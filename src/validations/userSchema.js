import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password Does Not Match'),
});

export const updateUserSchema = yup.object().shape({
  username: yup.string(),
  password: yup.string(),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password Doesn Not Match'),
});
