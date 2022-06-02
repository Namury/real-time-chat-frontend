import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import roomAPI from "api/roomAPI";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { TextInput } from "components";
import { createRoomSchema } from "validations/roomSchema";
import { UserContext } from "context/UserContext";
import { SnackbarContext } from "context/SnackbarContext";
import authAPI from "api/authAPI";
import axios from "axios";
// const APIUrl = "https://namury-rtc-backend.herokuapp.com/chat/room";
var baseUrl = window.location.origin;

export default function Room() {
  const [roomCount, setRoomCount] = useState([0, 0, 0, 0, 0, 0]);

  const snackbarRef = useContext(SnackbarContext);

  useEffect(() => {
    axios
      .get("https://namury-rtc-backend.herokuapp.com/chat/room/all")
      .then((response) => {
        setRoomCount(response.data.content);
      });
  }, []);

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

  const config = () => {
    try {
      navigate("/config", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const submitForm = async (data) => {
    try {
      const res = await authAPI.login(data);
      console.log(res.data);
      setUser(res.data.content);
    } catch (error) {
      snackbarRef.current.error("Login gagal!");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(createRoomSchema) });

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full w-auto rounded-[12px] bg-white p-4">
          <div className="text-center pb-4">
            <p className="lg:text-2xl md:text-xl text-sm font-semibold text-black">
              Select Room
            </p>
            <div className="lg:text-xl md:text-base text-sm font-bold">{`${user?.username}`}</div>
          </div>
          <div className="flex flex-row space-x-5">
            <div className="">
              <p className="lg:text-2xl md:text-xl text-sm font-semibold text-black text-center">
                Public Room
              </p>
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
            <div className="">
              <p className="text-2xl font-semibold text-black text-center">
                Private Room
              </p>
              <div className="flex w-full mb-4">
                <form onSubmit={handleSubmit(submitForm)}>
                  <div className="space-y-4">
                    <TextInput
                      label="Create Room"
                      name="roomName"
                      error={errors.username?.message}
                      register={register}
                      placeholder="Room Name"
                    />
                  </div>
                  <div className="flex justify-center items-center mt-3">
                    <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                      Create
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-xl text-black text-center">Or</p>
              <div className="flex w-full mb-4">
                <form onSubmit={handleSubmit(submitForm)}>
                  <div className="space-y-4">
                    <TextInput
                      label="Join Room"
                      name="roomId"
                      error={errors.username?.message}
                      register={register}
                      placeholder="Room Id"
                    />
                  </div>
                  <div className="flex justify-center items-center mt-3">
                    <button className="h-8 w-[150px] bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600">
                      Join
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <button
            className={
              "bg-blue-500 hover:bg-blue-700 text-white group flex justify-center rounded-md w-full p-2 my-2 font-semibold space-x-2"
            }
            onClick={config}
          >
            Config
          </button>
          <button
            className={
              "bg-red-500 hover:bg-red-700 text-white group flex justify-center rounded-md w-full p-2 my-2 font-semibold space-x-2"
            }
            onClick={logout}
          >
            Logout
          </button>
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
