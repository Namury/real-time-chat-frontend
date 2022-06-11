import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import authAPI from "api/authAPI";
import { TextInput, PasswordInput } from "components";
import { SnackbarContext } from "context/SnackbarContext";
import { UserContext } from "context/UserContext";
import { createUserSchema } from "validations/userSchema";

var baseUrl = window.location.origin;
console.log(baseUrl);

export default function Register() {
  const { user, setUser } = useContext(UserContext);
  let navigate = useNavigate();
  const snackbarRef = useContext(SnackbarContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(createUserSchema), mode: 'onTouched' });

  const submitForm = async (data) => {
    try {
      snackbarRef.current.warning("Loading..");
      const res = await authAPI.register(data);
      snackbarRef.current.success("Register Success!");
      setUser(res.data.content);
    } catch (error) {
      snackbarRef.current.error("Register Failed!");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full px-7 w-[300px] rounded-[12px] bg-white p-4">
          <div className="py-5 bg-yellow">
            <p className="text-2xl text-center font-semibold text-black">Register</p>
            <form onSubmit={handleSubmit(submitForm)}>
              <TextInput
                label="Username"
                name="username"
                error={errors.username?.message}
                register={register}
                placeholder="Username"
              />
              <PasswordInput
                label="Password"
                name="password"
                error={errors.password?.message}
                register={register}
                placeholder="Password"
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                error={errors.confirmPassword?.message}
                register={register}
                placeholder="Confirm Password"
              />
              <div className="flex justify-center items-center mt-5">
                <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
              <div className="mt-5 text-grey-dark text-center text-sm flex justify-center">
                Already have an account?
                <div
                  className="text-blue-500 hover:underline cursor-pointer text-center w-fit"
                  onClick={() => navigate("/")}
                >
                  Login
                </div>
              </div>
            </form>
            {user && <Navigate to="/config" />}
          </div>
        </div>
      </div>
    </div>
  );
}
