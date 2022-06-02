import { io } from "socket.io-client";
import { useContext } from "react";
import { UserContext } from "context/UserContext";
import { SnackbarContext } from "context/SnackbarContext";
import Autolinker from "autolinker";

var autolinker = new Autolinker({
  newWindow: true,
  className: "font-bold underline",
});

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var remoteStream;
var sendChannel = null;
var receiveChannel = null;
var pc;
var urlString = window.location.href.split("/");
var room = urlString[urlString.length - 1].toString();

let preferedCamera = localStorage.getItem("preferedCamera");
let preferedMicrophone = localStorage.getItem("preferedMicrophone");

var localStreamConstraints = {};

if (preferedCamera !== null && preferedMicrophone !== null) {
  localStreamConstraints = {
    audio: { deviceId: { exact: preferedMicrophone } },
    video: { deviceId: { exact: preferedCamera } },
  };
} else {
  localStreamConstraints = {
    audio: true,
    video: true,
  };
}

var pcConfig = {
  iceServers: [
    { urls: ["stun:ss-turn2.xirsys.com"] },
    {
      username:
        "7n-SrMtFI6nAUTHFYVVqA2-i8rFedALQXXp5dKM837NyGDVg34SHtACLDWV0wUocAAAAAGIoUiZuYW11cnk=",
      credential: "8ef08366-9f77-11ec-adb9-0242ac140004",
      urls: [
        "turn:ss-turn2.xirsys.com:80?transport=udp",
        "turn:ss-turn2.xirsys.com:3478?transport=udp",
        "turn:ss-turn2.xirsys.com:80?transport=tcp",
        "turn:ss-turn2.xirsys.com:3478?transport=tcp",
        "turns:ss-turn2.xirsys.com:443?transport=tcp",
        "turns:ss-turn2.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};

var socket = io("https://namury-rtc-backend.herokuapp.com/", {
  withCredentials: true,
});

if (room !== "") {
  socket.emit("create or join", room);
  console.log("Attempted to create or  join room", room);
}

//Defining socket connections for signalling

socket.on("created", function (room) {
  console.log("Created room " + room);
  isInitiator = true;
});

socket.on("full", function (room) {
  console.log("Room " + room + " is full");
});

socket.on("join", function (room) {
  console.log("Another peer made a request to join room " + room);
  console.log("This peer is the initiator of room " + room + "!");
  isChannelReady = true;
});

socket.on("joined", function (room) {
  console.log("joined: " + room);
  isChannelReady = true;
});

socket.on("log", function (array) {
  console.log.apply(console, array);
});

//Driver code
socket.on("message", function (message, room) {
  console.log("Client received message:", message, room);
  if (message === "got user media") {
    maybeStart();
  } else if (message.type === "offer") {
    if (!isInitiator && !isStarted) {
      maybeStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
  } else if (message.type === "answer" && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === "candidate" && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate,
    });
    pc.addIceCandidate(candidate);
  } else if (message === "bye" && isStarted) {
    handleRemoteHangup();
  }
});

//Function to send message in a room
function sendMessage(message, room) {
  console.log("Client sending message: ", message, room);
  socket.emit("message", message, room);
}

console.log("Getting user media with constraints", localStreamConstraints);

//Displaying Local Stream and Remote Stream on webpage

var localVideo;
var remoteVideo;
var messageInput;
var sendButton;
var chatContainer;
var hostUsername;

function initChat() {
  localVideo = document.querySelector("#localVideo");
  remoteVideo = document.querySelector("#remoteVideo");
  messageInput = document.querySelector("#messageInput");
  hostUsername = document.querySelector("#messageUsername");
  sendButton = document.querySelector("#sendButton");
  chatContainer = document.querySelector("#chatContainer");

  sendButton.addEventListener("click", sendChat, false);
  messageInput.addEventListener(
    "keypress",
    function (e) {
      if (e.key === "Enter") {
        sendChat();
      }
    },
    false
  );

  console.log("Going to find Local media");
  navigator.mediaDevices
    .getUserMedia(localStreamConstraints)
    .then(gotStream)
    .catch(function (e) {
      console.log(localVideo);
      alert("getUserMedia() error: " + e.name);
    });
}

//If found local stream
function gotStream(stream) {
  console.log("Adding local stream.");
  localStream = stream;
  localVideo.srcObject = stream;
  localVideo.onloadedmetadata = function (e) {
    localVideo.play();
  };

  sendMessage("got user media", room);
  if (isInitiator) {
    maybeStart();
  }
}

//If initiator, create the peer connection
function maybeStart() {
  console.log(">>>>>>> maybeStart() ", isStarted, localStream, isChannelReady);
  if (!isStarted && typeof localStream !== "undefined" && isChannelReady) {
    console.log(">>>>>> creating peer connection");
    createPeerConnection();
    pc.addStream(localStream);
    isStarted = true;
    console.log(">>>>>> creating data channel");
    sendChannel = pc.createDataChannel(room + "Chat Data Channel");
    sendChannel.onopen = handleSendChannelStatusChange;
    sendChannel.onclose = handleSendChannelStatusChange;
    console.log("isInitiator", isInitiator);
    if (isInitiator) {
      doCall();
    }
  }
}

//Sending bye if user closes the window
window.onbeforeunload = function () {
  sendMessage("bye", room);
  hangup();
};

//Creating peer connection
function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(pcConfig);
    pc.onicecandidate = handleIceCandidate;
    pc.ondatachannel = receiveChannelCallback;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
    console.log("Created RTCPeerConnnection");
  } catch (e) {
    console.log("Failed to create PeerConnection, exception: " + e.message);
    alert("Cannot create RTCPeerConnection object.");
    return;
  }
}

//Function to handle Ice candidates
function handleIceCandidate(event) {
  console.log("icecandidate event: ", event);
  if (event.candidate) {
    sendMessage(
      {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      },
      room
    );
  } else {
    console.log("End of candidates.");
  }
}

function handleCreateOfferError(event) {
  console.log("createOffer() error: ", event);
}

function doCall() {
  console.log("Sending offer to peer");
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function doAnswer() {
  console.log("Sending answer to peer.");
  pc.createAnswer().then(
    setLocalAndSendMessage,
    onCreateSessionDescriptionError
  );
}

function setLocalAndSendMessage(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  console.log("setLocalAndSendMessage sending message", sessionDescription);
  sendMessage(sessionDescription, room);
}

function onCreateSessionDescriptionError(error) {
  console.log("Failed to create session description: " + error.toString());
}

function handleRemoteStreamAdded(event) {
  remoteStream = event.stream;
  remoteVideo.srcObject = remoteStream;
  remoteVideo.onloadedmetadata = function (e) {
    remoteVideo.play();
  };

  console.log(remoteStream);
  console.log(remoteVideo);
  console.log("Remote stream added.");
}

function handleRemoteStreamRemoved(event) {
  console.log("Remote stream removed. Event: ", event);
}

function hangup() {
  console.log("Hanging up.");
  stop();
  sendMessage("bye", room);
}

function handleRemoteHangup() {
  console.log("Session terminated.");
  stop();
  isInitiator = false;
}

function stop() {
  isStarted = false;
  pc.close();
  pc = null;
}

//message
function sendChat() {
  const content = autolinker.link(messageInput.value);
  if (content !== "") {
    const username = document.createTextNode(hostUsername.value); //change username
    const container = document.createElement("div");
    const chatDiv = document.createElement("div");
    const pChat = document.createElement("p");
    const pUsername = document.createElement("p");
    // const txtChat = document.createTextNode(content);

    chatDiv.setAttribute("class", "flex justify-end text-left");
    container.setAttribute("class", "mx-2 text-right");
    pChat.setAttribute("class", "rounded-[12px] bg-green-400 p-2 w-fit");
    pUsername.setAttribute("class", "text-sm");

    // pChat.appendChild(content);
    pChat.innerHTML = content;
    pUsername.appendChild(username);

    chatDiv.appendChild(pChat);

    container.appendChild(pUsername);
    container.appendChild(chatDiv);

    chatContainer.appendChild(container);

    sendChannel.send(content + "S3cretArr4yS3parator" + hostUsername.value);

    messageInput.value = "";
    messageInput.focus();
  }
}

function receiveChannelCallback(event) {
  console.log("data channel received");
  console.log(event.channel);
  receiveChannel = event.channel;
  receiveChannel.onmessage = handleReceiveMessage;
  receiveChannel.onopen = handleReceiveChannelStatusChange;
  receiveChannel.onclose = handleReceiveChannelStatusChange;
}

function handleReceiveMessage(event) {
  const data = event.data.split("S3cretArr4yS3parator");
  console.log(data);
  const username = document.createTextNode(data[1]); //change username
  const container = document.createElement("div");
  const chatDiv = document.createElement("div");
  const pChat = document.createElement("p");
  const pUsername = document.createElement("p");
  // const txtChat = document.createTextNode(autolinker.link(data[0]));

  chatDiv.setAttribute(
    "class",
    "rounded-[12px] bg-blue-400 p-2 pr-3 w-fit text-left"
  );
  container.setAttribute("class", "mx-2 text-left");
  pUsername.setAttribute("class", "text-sm");

  // pChat.appendChild(autolinker.link(data[0]));
  pChat.innerHTML = autolinker.link(data[0]);
  pUsername.appendChild(username);

  chatDiv.appendChild(pChat);

  container.appendChild(pUsername);
  container.appendChild(chatDiv);

  chatContainer.appendChild(container);
}

function handleReceiveChannelStatusChange(event) {
  if (receiveChannel) {
    console.log(
      "Receive channel's status has changed to " + receiveChannel.readyState
    );
  }
}

function handleSendChannelStatusChange(event) {
  if (sendChannel) {
    var state = sendChannel.readyState;

    if (state === "open") {
      messageInput.disabled = false;
      messageInput.focus();
      sendButton.disabled = false;
    } else {
      messageInput.disabled = true;
      sendButton.disabled = true;
    }
  }
}

export default function Chat() {
  const { user } = useContext(UserContext);
  const snackbarRef = useContext(SnackbarContext);
  if (preferedCamera === null && preferedMicrophone === null) {
    snackbarRef.current.warning("Using Default Devices");
  }

  window.onload = setTimeout(initChat, 1000);

  return (
    <div className="">
      <div className="flex flex-row h-screen bg-gray-400">
        <div className="flex flex-col grow-0 max-h-screen px-7 rounded-[12px] bg-white p-4">
          <div id="chatContainer" className="overflow-auto scroll-auto max-h-full">
            {/* <div className="mx-2 text-right">
              <p className="text-sm">lorem1</p>
              <div className="flex justify-end text-left">
                  <p className="rounded-[12px] bg-green-400 p-2 w-fit">awe</p>
              </div>
            </div> */}
          </div>
          <div className="flex flex-row py-3">
            <input
              id="messageInput"
              type="textarea"
              className="pl-2 mr-4 border-2"
              disabled
            />
            <input
              id="messageUsername"
              value={`${user?.username}`}
              type="hidden"
            />
            <button
              id="sendButton"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-1 px-4 w-fit"
              disabled
            >
              Send
            </button>
          </div>
          <div>
            <button
              id="disconnectButton"
              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded px-4 w-fit"
              disabled
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex align-center justify-center py-5">
            <video
              id="localVideo"
              className="h-12 sm:h-52 lg:h-96 aspect-video object-cover"
              autoPlay
              muted
              playsInline
              poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
            ></video>
          </div>
          <div className="flex justify-center py-5">
            <video
              id="remoteVideo"
              className="h-12 sm:h-52 lg:h-96 aspect-video object-cover"
              autoPlay
              playsInline
              poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"
            ></video>
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
