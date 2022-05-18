var baseUrl = window.location.origin;
console.log(baseUrl);

navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then()
  .catch(function (e) {
    alert("getUserMedia() error: " + e.name);
  });

export default function Login() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full px-7 w-[300px] rounded-[12px] bg-white p-4">
          <div className="py-5 bg-yellow">
            <p className="text-2xl font-semibold text-black">Login</p>
            {/* <form> */}
            <input
              type={"text"}
              className="px-3 text-sm py-1 mt-5 border-blue-400 w-full border rounded-lg placeholder:text-sm"
              placeholder="Username"
            ></input>
            <input
              type={"password"}
              className="px-3 text-sm py-1 my-5 border-blue-400 w-full border rounded-lg placeholder:text-sm"
              placeholder="Password"
            ></input>
            <div className="flex justify-center items-center">
              <a href={baseUrl + "/config"}>
                <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </a>
            </div>
            <div className="mt-5 text-grey-dark text-sm">
              Don't have an account?
              <a
                className="text-blue-500 hover:underline"
                href={baseUrl + "/register"}
              >
                Register
              </a>
            </div>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
}
