export default function Room() {
  return (
    <div>
      <div class="flex h-screen border">
        <div class="flex flex-col h-full w-full p-8 ">
          <div class="flex w-full mb-4">
            <div class="flex flex-col mr-4">
              <p>Room 1</p>
              <p>Capacity 0/2</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Join
            </button>
          </div>

          <div class="flex w-full mb-4">
            <div class="flex flex-col mr-4">
              <p>Room 2</p>
              <p>Capacity 0/2</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Join
            </button>
          </div>

          <div class="flex w-full mb-4">
            <div class="flex flex-col mr-4">
              <p>Room 3</p>
              <p>Capacity 0/2</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Join
            </button>
          </div>

          <div class="flex w-full mb-4">
            <div class="flex flex-col mr-4">
              <p>Room 4</p>
              <p>Capacity 0/2</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Join
            </button>
          </div>

          <div class="flex w-full mb-4">
            <div class="flex flex-col mr-4">
              <p>Room 5</p>
              <p>Capacity 0/2</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Join
            </button>
          </div>

          <div class="flex w-full mb-4">
            <div class="flex flex-col mr-4">
              <p>Room 6</p>
              <p>Capacity 0/2</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Join
            </button>
          </div>
        </div>

        <div class="flex flex-col w-full">
          <div class="flex align-center justify-center aspect-video">
            <video
              class="h-12 sm:h-52 lg:h-96"
              autoplay
              playsinline
              poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
            ></video>
          </div>
          <div class="flex align-center justify-center aspect-video">
            <div class="h-52 px-7 w-[300px] rounded-[12px] bg-gray-400 p-4">
              <div class="py-5 bg-yellow">
                <p class="text-xl font-semibold text-black">Config</p>
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
        </div>
      </div>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"
        integrity="sha512-MgkNs0gNdrnOM7k+0L+wgiRc5aLgl74sJQKbIWegVIMvVGPc1+gc1L2oK9Wf/D9pq58eqIJAxOonYPVE5UwUFA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      ></script>
      <script src="js\config.js"></script>
      <script src="js\main.js"></script>
    </div>
  );
}
