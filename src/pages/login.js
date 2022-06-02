import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import authAPI from "api/authAPI";
import { TextInput, PasswordInput } from "components";
import { SnackbarContext } from "context/SnackbarContext";
import { UserContext } from "context/UserContext";
import { loginSchema } from "validations/authSchema";

var baseUrl = window.location.origin;
console.log(baseUrl);
navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then()
  .catch(function (e) {
    alert("getUserMedia() error: " + e.name);
  });

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  let navigate = useNavigate();
  const snackbarRef = useContext(SnackbarContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema),  });

  const submitForm = async (data) => {
    try {
      snackbarRef.current.warning("Loading..");
      const res = await authAPI.login(data);
      snackbarRef.current.success("Login Success!");
      setUser(res.data.content);
    } catch (error) {
      snackbarRef.current.error("Login gagal!");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full px-7 w-[300px] rounded-[12px] bg-white p-4">
          <div className="py-5">
            <p className="text-2xl text-center font-semibold text-black">
              Login
            </p>
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="space-y-4">
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
              </div>
              <div className="flex justify-center items-center mt-5">
                <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
              <div className="mt-5 text-grey-dark text-center text-sm flex justify-center">
                Don't have an account?
                <div 
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Register
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
