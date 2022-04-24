var baseUrl = window.location.origin;

var cameraSelector;
var microphoneSelector;
var changeButton;
var localVideo;
var deviceSelected = false;
var preferedCamera = "";
var preferedMicrophone = "";

localStorage.removeItem("preferedCamera");
localStorage.removeItem("preferedMicrophone");

window.onload = function () {
  cameraSelector = document.querySelector("#cameraSelector");
  microphoneSelector = document.querySelector("#micSelector");
  changeButton = document.querySelector("#changeButton");
  localVideo = document.querySelector("#localVideo");

  navigator.mediaDevices
    .enumerateDevices()
    .then(listDevice)
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  changeButton.addEventListener("click", (event) => {
    // if (typeof localVideo !== "undefined") {
    //   stopMediaTracks(localVideo);
    // }
    const videoConstraints = {};
    const audioConstraints = {};

    preferedCamera = cameraSelector.value;
    preferedMicrophone = microphoneSelector.value;

    videoConstraints.deviceId = { exact: preferedCamera };
    audioConstraints.deviceId = { exact: preferedMicrophone };

    const constraints = {
      video: videoConstraints,
      audio: audioConstraints,
    };

    localStorage.setItem("preferedCamera", cameraSelector.value);
    localStorage.setItem("preferedMicrophone", microphoneSelector.value);

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(function (e) {
        console.log(localVideo);
        deviceSelected = false
        alert("getUserMedia() error: " + e.name);
      });
  });
};

// navigator.mediaDevices
//   .getUserMedia({
//     audio: true,
//     video: true,
//   })
//   .then(gotStream)
//   .catch(function (e) {
//     console.log(localVideo);
//     alert("getUserMedia() error: " + e.name);
//   });

//If found local stream
function gotStream(stream) {
  console.log("Adding local stream.");
  localVideo.srcObject = stream;
  localVideo.onloadedmetadata = function (e) {
    localVideo.play();
  };
  deviceSelected = true
}

function listDevice(devices) {
  console.log(devices);
  cameraSelector.innerHTML = "";
  microphoneSelector.innerHTML = "";

  devices.forEach(function (device) {
    if (device.kind === "videoinput") {
      const option = document.createElement("option");
      // if (device.deviceId === "default") option.selected = true;
      option.value = device.deviceId;
      const label = device.label;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      cameraSelector.appendChild(option);
    }
    if (
      device.kind === "audioinput" &&
      device.deviceId !== "default" &&
      device.deviceId !== "communications"
    ) {
      const option = document.createElement("option");
      // if (device.deviceId === "default") option.selected = true;
      option.value = device.deviceId;
      const label = device.label;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      microphoneSelector.appendChild(option);
    }
  });
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
          <div className="flex align-center justify-center">
            <div className="h-52 px-7 py-2 rounded-[12px] bg-gray-400">
              <div className="">
                <p className="text-xl font-semibold text-black">Config</p>
                <div className="pt-2">
                  <div>
                    <label htmlFor="cameraSelector">Camera</label>
                  </div>
                  <select
                    name="cameraSelector"
                    id="cameraSelector"
                    className="flex-grow"
                  ></select>
                </div>
                <div className="pt-2">
                  <div>
                    <label htmlFor="micSelector">Microphone</label>
                  </div>
                  <select
                    name="micSelector"
                    id="micSelector"
                    className="flex-grow"
                  ></select>
                </div>
                <div className="flex justify-center items-center mt-2">
                  <button
                    id="changeButton"
                    className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600"
                  >
                    Select
                  </button>
                </div>
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
