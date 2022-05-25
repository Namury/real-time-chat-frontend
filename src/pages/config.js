import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "context/UserContext";
import authAPI from "api/authAPI";

var baseUrl = window.location.origin;
var cameraSelector;
var microphoneSelector;
var changeButton;
var localVideo;
var preferedCamera = "";
var preferedMicrophone = "";

localStorage.removeItem("preferedCamera");
localStorage.removeItem("preferedMicrophone");

function initConfig() {
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
    const videoConstraints = { width: 1280, height: 720 };
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
        alert("getUserMedia() error: " + e.name);
      });
  });
}

//If found local stream
function gotStream(stream) {
  console.log("Adding local stream.");

  localVideo.srcObject = stream;
  localVideo.onloadedmetadata = function (e) {
    localVideo.play();
  };
}

function listDevice(devices) {
  // console.log(devices);
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

export default function Config() {
  const { user, setUser } = useContext(UserContext);
  let navigate = useNavigate();

  const logout = async () => {
    try {
      const res = authAPI.logout();
      if (res === true) {
        setUser(null);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  window.onload = setTimeout(initConfig, 100);

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full px-7 w-auto rounded-[12px] bg-white p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-black">Config</p>
            <div className="font-bold">{`${user?.username}`}</div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex align-center justify-center">
              <video
                id="localVideo"
                className="h-12 sm:h-52 lg:h-96 p-7 aspect-video object-cover"
                autoPlay
                playsInline
                poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
              ></video>
            </div>
            <div className="flex align-center justify-center">
              <div className="h-full px-7 py-2 rounded-[12px] bg-gray-400">
                <div className="">
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
                      Preview
                    </button>
                  </div>
                  <div className="flex justify-center items-center mt-2">
                    <a href={baseUrl + "/room"}>
                      <button
                        id="changeButton"
                        className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600"
                      >
                        Select
                      </button>
                    </a>
                  </div>
                  <div className="flex justify-center items-center mt-2">
                    <button
                      onClick={logout}
                      className="h-8 w-[150px] bg-red-500 text-sm text-white rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
