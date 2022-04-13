var baseUrl = window.location.origin;
console.log(baseUrl);

export default function Login() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-52 px-7 w-[300px] rounded-[12px] bg-white p-4">
          <div className="py-5 bg-yellow">
            <p className="text-xl font-semibold text-black">Login</p>
            <form>
              <input
                type={"text"}
                className="px-3 text-sm py-1 mt-5 border-blue-400 w-full border rounded-lg placeholder:text-sm"
                placeholder="Username"
              ></input>
              <div className="flex justify-center items-center mt-2">
                <a href={baseUrl + "/room"}>
                  <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                    Submit
                  </button>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
