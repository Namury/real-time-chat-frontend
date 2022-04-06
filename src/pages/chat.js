export default function Chat() {
  return (
    <div className="">
      {/* <header className="text-3xl font-bold underline text-center">
              Real Time Chat
          </header> */}
      <div class="flex h-screen border">
        <div class="flex flex-col h-full p-8">
          <div class="flex-grow">
            <div class="">lorem1: Lorem Ipsum Dolor Sit Amet</div>
            <div>lorem2: Dolor Sit Amet Lorem Ipsum</div>
            <div>lorem1: Lorem Ipsum Dolor Sit Amet</div>
            <div>lorem2: Dolor Sit Amet Lorem Ipsum</div>
            <div>lorem1: Lorem Ipsum Dolor Sit Amet</div>
            <div>lorem2: Dolor Sit Amet Lorem Ipsum</div>
            <div>lorem1: Lorem Ipsum Dolor Sit Amet</div>
            <div>lorem2: Dolor Sit Amet Lorem Ipsum</div>
            <div>lorem1: Lorem Ipsum Dolor Sit Amet</div>
            <div>lorem2: Dolor Sit Amet Lorem Ipsum</div>
          </div>
          <div class="flex w-full">
            <input type="textarea" class="form-textarea flex-grow mr-4 border-2" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
              Send
            </button>
          </div>
        </div>

        <div class="flex flex-col w-full">
          <div class="flex align-center justify-center aspect-video">
            <video
              id="localVideo"
              class="h-12 sm:h-52 lg:h-96"
              autoplay
              muted
              playsinline
              poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
            ></video>
          </div>
          <div class="flex justify-center aspect-video">
            <video
              id="remoteVideo"
              class="h-12 sm:h-52 lg:h-96"
              autoplay
              playsinline
              poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
            ></video>
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
