import React, { useEffect, useState } from "react";
import axios from "axios";
// const APIUrl = "https://namury-rtc-backend.herokuapp.com/chat/room";
var baseUrl = window.location.origin;

export default function Room() {
  const [roomCount, setRoomCount] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    axios
      .get("https://namury-rtc-backend.herokuapp.com/chat/room/all")
      .then((response) => {
        setRoomCount(response.data.content);
      });
  }, []);

  console.log(roomCount);

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full px-7 w-auto rounded-[12px] bg-white p-4">
        <p className="text-2xl font-semibold text-black pb-4">Select Room</p>
          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 1</p>
              <p>Capacity {roomCount[0]}/2</p>
            </div>
            <a href={baseUrl + "/chat/room1"}>
              {roomCount[0] >= 2 && (
                <button
                  className="bg-blue-300 text-white font-bold rounded flex-initial w-24 h-full"
                  disabled
                >
                  Join
                </button>
              )}
              {roomCount[0] < 2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full">
                  Join
                </button>
              )}
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 2</p>
              <p>Capacity {roomCount[1]}/2</p>
            </div>
            <a href={baseUrl + "/chat/room2"}>
            {roomCount[1] >= 2 && (
                <button
                  className="bg-blue-300 text-white font-bold rounded flex-initial w-24 h-full"
                  disabled
                >
                  Join
                </button>
              )}
              {roomCount[1] < 2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full">
                  Join
                </button>
              )}
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 3</p>
              <p>Capacity {roomCount[2]}/2</p>
            </div>
            <a href={baseUrl + "/chat/room3"}>
            {roomCount[2] >= 2 && (
                <button
                  className="bg-blue-300 text-white font-bold rounded flex-initial w-24 h-full"
                  disabled
                >
                  Join
                </button>
              )}
              {roomCount[2] < 2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full">
                  Join
                </button>
              )}
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 4</p>
              <p>Capacity {roomCount[3]}/2</p>
            </div>
            <a href={baseUrl + "/chat/room4"}>
            {roomCount[3] >= 2 && (
                <button
                  className="bg-blue-300 text-white font-bold rounded flex-initial w-24 h-full"
                  disabled
                >
                  Join
                </button>
              )}
              {roomCount[3] < 2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full">
                  Join
                </button>
              )}
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 5</p>
              <p>Capacity {roomCount[4]}/2</p>
            </div>
            <a href={baseUrl + "/chat/room5"}>
            {roomCount[4] >= 2 && (
                <button
                  className="bg-blue-300 text-white font-bold rounded flex-initial w-24 h-full"
                  disabled
                >
                  Join
                </button>
              )}
              {roomCount[4] < 2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full">
                  Join
                </button>
              )}
            </a>
          </div>

          <div className="flex w-full mb-4">
            <div className="flex flex-col mr-4">
              <p>Room 6</p>
              <p>Capacity {roomCount[5]}/2</p>
            </div>
            <a href={baseUrl + "/chat/room6"}>
            {roomCount[5] >= 2 && (
                <button
                  className="bg-blue-300 text-white font-bold rounded flex-initial w-24 h-full"
                  disabled
                >
                  Join
                </button>
              )}
              {roomCount[5] < 2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full">
                  Join
                </button>
              )}
            </a>
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
