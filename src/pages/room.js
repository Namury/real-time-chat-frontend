var baseUrl = window.location.origin;

var localVideo;
window.onload = function () {
  localVideo = document.querySelector("#localVideo");
};

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then(gotStream)
  .catch(function (e) {
    console.log(localVideo);
    alert("getUserMedia() error: " + e.name);
  });

//If found local stream
function gotStream(stream) {
  console.log("Adding local stream.");
  localVideo.srcObject = stream;
  localVideo.onloadedmetadata = function (e) {
    localVideo.play();
  };
}

export default function Room() {
  return (
    <div>
      <div className="flex h-screen border">
        <div className="flex flex-col h-full w-full p-8 ">
          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 1</p>
              <p>Capacity 0/2</p>
            </div>
            <a href={baseUrl + "/chat/room1"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
                Join
              </button>
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 2</p>
              <p>Capacity 0/2</p>
            </div>
            <a href={baseUrl + "/chat/room2"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
                Join
              </button>
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 3</p>
              <p>Capacity 0/2</p>
            </div>
            <a href={baseUrl + "/chat/room3"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
                Join
              </button>
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 4</p>
              <p>Capacity 0/2</p>
            </div>
            <a href={baseUrl + "/chat/room4"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
                Join
              </button>
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 5</p>
              <p>Capacity 0/2</p>
            </div>
            <a href={baseUrl + "/chat/room5"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
                Join
              </button>
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 6</p>
              <p>Capacity 0/2</p>
            </div>
            <a href={baseUrl + "/chat/room6"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24">
                Join
              </button>
            </a>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex align-center justify-center aspect-video">
            <video
              id="localVideo"
              className="h-12 sm:h-52 lg:h-96"
              autoPlay
              muted
              playsInline
              poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
            ></video>
          </div>
          <div className="flex align-center justify-center aspect-video">
            <div className="h-52 px-7 w-[300px] rounded-[12px] bg-gray-400 p-4">
              <div className="py-5 bg-yellow">
                <p className="text-xl font-semibold text-black">Config</p>
                <form>
                  <div>Camera</div>
                  <select name="camera" id="camera" className="flex-grow">
                    <option>Camera 1</option>
                    <option>Camera 2</option>
                    <option>Camera 3</option>
                    <option>Camera 4</option>
                  </select>
                  <div>Microphone</div>
                  <select name="mic" id="mic" className="flex-grow">
                    <option>Mic 1</option>
                    <option>Mic 2</option>
                    <option>Mic 3</option>
                    <option>Mic 4</option>
                  </select>
                  <div className="flex justify-center items-center mt-2">
                    <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                      Change
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
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></script>
      <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
    </div>
  );
}
