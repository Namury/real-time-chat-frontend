export default function Login() {
  return (
    <div>
      <div class="flex justify-center items-center min-h-screen bg-gray-400">
        <div class="h-52 px-7 w-[300px] rounded-[12px] bg-white p-4">
          <div class="py-5 bg-yellow">
            <p class="text-xl font-semibold text-black">Login</p>
            <form>
              <input
                type={"text"}
                class="px-3 text-sm py-1 mt-5 border-blue-400 w-full border rounded-lg placeholder:text-sm"
                placeholder="Username"
              ></input>
              <div class="flex justify-center items-center mt-2">
                <button class="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"
        integrity="sha512-MgkNs0gNdrnOM7k+0L+wgiRc5aLgl74sJQKbIWegVIMvVGPc1+gc1L2oK9Wf/D9pq58eqIJAxOonYPVE5UwUFA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      ></script>
      <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
    </div>
  );
}
