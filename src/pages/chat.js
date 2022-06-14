import { io } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "context/UserContext";
import { SnackbarContext } from "context/SnackbarContext";
import Autolinker from "autolinker";
import roomAPI from "api/roomAPI";

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
    { urls: ["stun:stun.l.google.com:19302", "stun:openrelay.metered.ca:80", "stun:ss-turn2.xirsys.com"] },
    {
      username: "openrelayproject",
      credential: "openrelayproject",
      urls: [
        "turn:openrelay.metered.ca:80",
        "turn:openrelay.metered.ca:80?transport=tcp",
        "turns:openrelay.metered.ca:443",
        "turn:openrelay.metered.ca:443",
        "turn:openrelay.metered.ca:443?transport=tcp"
      ],
    },
    {
      username:
        "pTIwO_1U1gXJNEA3sD9Tk9kJz-zQdf5dXphIydn11fl2U3Xy2ZsaVoAfHbEWbxCfAAAAAGKoslp1Y2luZ25n",
      credential: "25cdd826-ebfc-11ec-adc6-0242ac140004",
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

var socket = io(process.env.REACT_APP_API_BASE_URL, {
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
var fileContainer;
var filebutton;

function initChat() {
  localVideo = document.querySelector("#localVideo");
  remoteVideo = document.querySelector("#remoteVideo");
  messageInput = document.querySelector("#messageInput");
  hostUsername = document.querySelector("#messageUsername");
  sendButton = document.querySelector("#sendButton");
  chatContainer = document.querySelector("#chatContainer");
  fileContainer = document.querySelector("#fileToSend");
  filebutton = document.querySelector("#sendFileButton");

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
  if (content !== "" && content !== " ") {
    const username = document.createTextNode(hostUsername.value); //change username
    const container = document.createElement("div");
    const chatDiv = document.createElement("div");
    const pChat = document.createElement("p");
    const pUsername = document.createElement("p");
    // const txtChat = document.createTextNode(content);

    chatDiv.setAttribute("class", "flex justify-end text-left");
    container.setAttribute("class", "mx-2 text-right");
    pChat.setAttribute(
      "class",
      "rounded-[12px] bg-green-400 p-2 w-fit max-w-sm break-words"
    );
    pUsername.setAttribute("class", "text-sm");

    // pChat.appendChild(content);
    pChat.innerHTML = content;
    pUsername.appendChild(username);

    chatDiv.appendChild(pChat);

    container.appendChild(pUsername);
    container.appendChild(chatDiv);

    chatContainer.appendChild(container);

    chatContainer.scrollBy(0, 1000);

    const chatContent = {
      isChat: true,
      message: content,
      username: hostUsername.value,
    };

    sendChannel.send(JSON.stringify(chatContent));

    messageInput.value = "";
    messageInput.focus();
  }
}

async function sendFileToDataChannel(file) {
  try {
    var reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onload = onReadAsDataURL;
    var chunkLength = 128000;
    var fileUrl;

    function onReadAsDataURL(event, text) {
      var data = {};
      if (event) {
        text = event.target.result;
        fileUrl = text;
      }

      if (text.length > chunkLength) {
        data.message = text.slice(0, chunkLength);
      } else {
        data.message = text;
        data.fileType = file.type;
        data.fileName = file.name;
        data.username = hostUsername.value;
        data.last = true;

        var fileName = file.name;
        const username = document.createTextNode(hostUsername.value);
        const fileNameNode = document.createTextNode(fileName);
        const container = document.createElement("div");
        const chatDiv = document.createElement("div");
        const aDownload = document.createElement("a");
        const buttonDownload = document.createElement("button");
        const pUsername = document.createElement("p");
        const pChat = document.createElement("p");

        pChat.setAttribute(
          "class",
          "grow-0 rounded-[12px] bg-green-400 p-2 max-w-sm"
        );
        chatDiv.setAttribute("class", "flex grow-0 justify-end text-left");
        buttonDownload.setAttribute(
          "class",
          "bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 w-fit"
        );

        container.setAttribute("class", "mx-2 text-right");
        pUsername.setAttribute("class", "text-sm");

        aDownload.href = fileUrl;
        aDownload.download = fileName || fileUrl;

        pUsername.appendChild(username);
        buttonDownload.appendChild(fileNameNode);
        aDownload.appendChild(buttonDownload);
        pChat.appendChild(buttonDownload);
        chatDiv.appendChild(pChat);
        container.appendChild(pUsername);
        container.appendChild(chatDiv);

        chatContainer.appendChild(container);
      }

      sendChannel.send(JSON.stringify(data));

      var remainingDataURL = text.slice(data.message.length);
      if (remainingDataURL.length) {
        setTimeout(function () {
          onReadAsDataURL(null, remainingDataURL);
        }, 500);
      }
    }
  } catch (error) {
    console.log(error);
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

var arrayToStoreChunks = [];
function handleReceiveMessage(event) {
  var data = JSON.parse(event.data);
  console.log(data);

  if (!data.isChat) {
    arrayToStoreChunks.push(data.message); // pushing chunks in array
    if (data.last) {
      var fileName = data.fileName;
      var fileUrl = arrayToStoreChunks.join("");
      const username = document.createTextNode(data.username);
      const fileNameNode = document.createTextNode(fileName);
      const container = document.createElement("div");
      const chatDiv = document.createElement("div");
      const aDownload = document.createElement("a");
      const buttonDownload = document.createElement("button");
      const pUsername = document.createElement("p");

      chatDiv.setAttribute(
        "class",
        "rounded-[12px] bg-blue-400 p-2 pr-3 w-fit max-w-sm text-left"
      );
      buttonDownload.setAttribute(
        "class",
        "bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 w-fit"
      );

      container.setAttribute("class", "mx-2 text-left");
      pUsername.setAttribute("class", "text-sm");

      aDownload.href = fileUrl;
      aDownload.download = fileName || fileUrl;

      pUsername.appendChild(username);
      buttonDownload.appendChild(fileNameNode);
      aDownload.appendChild(buttonDownload);
      chatDiv.appendChild(aDownload);
      container.appendChild(pUsername);
      container.appendChild(chatDiv);

      chatContainer.appendChild(container);

      arrayToStoreChunks = []; // resetting array
    }
  } else {
    const username = document.createTextNode(data.username); //change username
    const container = document.createElement("div");
    const chatDiv = document.createElement("div");
    const pChat = document.createElement("p");
    const pUsername = document.createElement("p");

    chatDiv.setAttribute(
      "class",
      "rounded-[12px] bg-blue-400 p-2 pr-3 w-fit max-w-sm text-left"
    );
    container.setAttribute("class", "mx-2 text-left");
    pUsername.setAttribute("class", "text-sm");
    pChat.setAttribute("class", "break-words");

    pChat.innerHTML = autolinker.link(data.message);
    pUsername.appendChild(username);

    chatDiv.appendChild(pChat);

    container.appendChild(pUsername);
    container.appendChild(chatDiv);

    chatContainer.appendChild(container);

    chatContainer.scrollBy(0, 1000);
  }
}

function handleReceiveChannelStatusChange(event) {
  if (receiveChannel) {
    console.log(
      "Receive channel's status has changed to " + receiveChannel.readyState
    );
    console.log(pc);
  }
}

function handleSendChannelStatusChange(event) {
  if (sendChannel) {
    var state = sendChannel.readyState;

    if (state === "open") {
      messageInput.disabled = false;
      messageInput.focus();
      sendButton.disabled = false;
      sendButton.setAttribute(
        "class",
        "bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 py-1 w-fit"
      );
      filebutton.disabled = false;
      filebutton.setAttribute(
        "class",
        "bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 py-1  w-fit"
      );
    } else {
      messageInput.disabled = true;
      sendButton.disabled = true;
      sendButton.setAttribute(
        "class",
        "bg-blue-400 text-white font-bold rounded px-4 py-1 w-fit"
      );
      filebutton.disabled = true;
      filebutton.setAttribute(
        "class",
        "bg-blue-400 text-white font-bold rounded px-4 py-1 w-fit"
      );
    }
  }
}

export default function Chat() {
  const { user } = useContext(UserContext);
  const { roomUuid } = useParams();
  const [privateRoom, setPrivateRoom] = useState();
  let navigate = useNavigate();
  const snackbarRef = useContext(SnackbarContext);

  useEffect(() => {
    async function getRoom() {
      try {
        if (roomUuid) {
          const response = await roomAPI.getById(roomUuid, user.token);
          setPrivateRoom(response.data.content);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getRoom();
  }, [roomUuid, snackbarRef, user.token]);

  console.log(privateRoom);
  if (preferedCamera === null && preferedMicrophone === null) {
    snackbarRef.current.warning("Using Default Devices");
  }

  const disconnect = () => {
    try {
      if (pc !== null && pc !== undefined) {
        hangup();
      }
      snackbarRef.current.success("Disconnect Success!");
      navigate("/room", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const sendFile = () => {
    try {
      console.log(fileContainer.files[0]);
      sendFileToDataChannel(fileContainer.files[0]);
      fileContainer.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const copyPrivateRoomId = (roomUuid) => {
    try {
      navigator.clipboard.writeText(roomUuid);
      snackbarRef.current.success("ID Copied!");
    } catch (error) {
      console.log(error);
      snackbarRef.current.error("Copy Failed!");
    }
  };

  window.onload = setTimeout(initChat, 1000);

  return (
    <div className="">
      <div className="flex flex-col-reverse lg:flex-row h-screen bg-gray-400">
        <div className="flex flex-col grow-1 sm:grow-0 max-h-fit lg:max-h-screen max-w-fit px-7 rounded-[12px] bg-white p-4">
          <div>
            {privateRoom ? (
              <div className="flex flex-row space-x-3">
                <div>
                  <p className="lg:text-2xl md:text-xl text-sm font-semibold text-black">
                    {privateRoom.name}
                  </p>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full"
                  onClick={() => copyPrivateRoomId(privateRoom.uuid)}
                >
                  Copy ID
                </button>
              </div>
            ) : (
              <p className="lg:text-2xl md:text-xl text-sm font-semibold text-black">
                {room}
              </p>
            )}
          </div>
          <div
            id="chatContainer"
            className="flex flex-col flex-grow overflow-y-auto scroll-auto max-h-64 lg:max-h-full max-w-full"
          ></div>
          <div className="flex flex-initial flex-row py-3">
            <input
              id="messageInput"
              type="textarea"
              className="pl-2 mr-4 w-full border-2"
              disabled
            />
            <input
              id="messageUsername"
              value={`${user?.username}`}
              type="hidden"
            />
            <button
              id="sendButton"
              className="bg-blue-400 text-white font-bold rounded py-1 px-4 w-fit"
              disabled
            >
              Send
            </button>
          </div>
          <div>
            <button
              id="disconnectButton"
              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded py-1 px-4 mb-2 w-fit"
              onClick={disconnect}
            >
              Disconnect
            </button>
            <input type="file" id="fileToSend" name="fileToSend" />
            <button
              id="sendFileButton"
              className="bg-blue-400 text-white font-bold rounded py-1 px-4 mt-2 w-fit"
              onClick={sendFile}
            >
              Send File
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full overflow-auto">
          <div className="flex align-center justify-center py-5">
            <video
              id="localVideo"
              className="h-16 sm:h-52 lg:h-96 aspect-video object-cover"
              autoPlay
              muted
              playsInline
              poster="https://res.cloudinary.com/dqv5d1ji8/image/upload/v1654935255/localVideo_br6lbq.png"
            ></video>
          </div>
          <div className="flex justify-center py-5">
            <video
              id="remoteVideo"
              className="h-36 sm:h-52 lg:h-96 aspect-video object-cover"
              autoPlay
              playsInline
              poster="https://res.cloudinary.com/dqv5d1ji8/image/upload/v1654935255/remoteVideo_rphapu.png"
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
