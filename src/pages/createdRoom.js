import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import roomAPI from "api/roomAPI";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { TextInput } from "components";
import { createRoomSchema, joinRoomSchema } from "validations/roomSchema";
import { UserContext } from "context/UserContext";
import { SnackbarContext } from "context/SnackbarContext";
import authAPI from "api/authAPI";

export default function CreatedRoom() {

  const snackbarRef = useContext(SnackbarContext);

  const { user, setUser } = useContext(UserContext);

  const [privateRoom, setPrivateRoom] = useState([]);

  useEffect(() => {
    async function getRoom() {
      try {
        const res = await roomAPI.getAll(user.token);
        setPrivateRoom(res.data.content);
      } catch (error) {
        snackbarRef.current.error("Create Private Room Failed!");
      }
    }
    getRoom();
  }, [snackbarRef, user.token]);

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

  const room = () => {
    try {
      navigate("/room", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    register: registerCreate,
    handleSubmit: handleCreateRoom,
    formState: { errors: errorsCreate },
  } = useForm({ resolver: yupResolver(createRoomSchema) });

  const submitCreateRoom = async (data) => {
    try {
      snackbarRef.current.warning("Loading...");
      await roomAPI.create(data, user.token);
      const res = await roomAPI.getAll(user.token);
      setPrivateRoom(res.data.content);
      snackbarRef.current.success("Create New Room Success!");
    } catch (error) {
      snackbarRef.current.error("Create New Room Failed!");
    }
  };

  const {
    register: registerJoin,
    handleSubmit: handleJoinRoom,
    formState: { errors: errorsJoin },
  } = useForm({ resolver: yupResolver(joinRoomSchema) });

  const submitJoinRoom = async (data) => {
    try {
      console.log(data)
      snackbarRef.current.warning("Loading...");
      const res = await roomAPI.getById(data.roomUuid, user.token);
      console.log(res.data);
      // setRoom(res.data.content);
      navigate("/chat/private/"+res.data.content.uuid, { replace: true });
    } catch (error) {
      snackbarRef.current.error("Room Does Not Exist!");
    }
  };

  const joinPrivateRoom = (roomUuid) => {
    try {
      navigate("/chat/private/"+roomUuid, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const copyPrivateRoomId = (roomUuid) => {
    try {
      navigator.clipboard.writeText(roomUuid)
      snackbarRef.current.success("ID Copied!");
    } catch (error) {
      console.log(error);
      snackbarRef.current.error("Copy Failed!");
    }
  };

  const deletePrivateRoom = async (data) => {
    try {
      snackbarRef.current.warning("Loading...");
      await roomAPI.delete(data, user.token);
      const res = await roomAPI.getAll(user.token);
      setPrivateRoom(res.data.content);
      snackbarRef.current.success("Delete Private Room Success!");
    } catch (error) {
      snackbarRef.current.error("Delete Private Room Failed!");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-400">
        <div className="h-full w-auto rounded-[12px] bg-white p-4">
          <div className="text-center pb-4">
            <p className="lg:text-2xl md:text-xl text-sm font-semibold text-black">
              Private Room
            </p>
            <div className="lg:text-xl md:text-base text-sm font-bold">{`${user?.username}`}</div>
          </div>
          <div className="flex flex-col-reverse lg:flex-row space-x-8">
            <div className="max-h-64 lg:max-h-96 overflow-y-auto scroll-auto">
              <p className="lg:text-2xl md:text-xl text-sm font-semibold text-black text-center">
                Created Private Room
              </p>

              {privateRoom.length !== 0 &&
                privateRoom.map((room) => (
                  <div className="flex flex-col w-full space-x-2 mb-2 justify-end" id={room.id}>
                    <div className="text-center w-full break-words max-w-xs">
                      {room.name}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full"
                        onClick={() => joinPrivateRoom(room.uuid)}
                      >
                        Join
                      </button>

                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex-initial w-24 h-full"
                        onClick={() => copyPrivateRoomId(room.uuid)}
                      >
                        Copy ID
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold rounded flex-initial w-24 h-full"
                        onClick={() => deletePrivateRoom(room.uuid)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <div className="">
              {/* <p className="text-2xl font-semibold text-black text-center">
                Private Room
              </p> */}
              <div className="flex w-full mb-4">
                <form onSubmit={handleCreateRoom(submitCreateRoom)}>
                  <div className="space-y-4">
                    <TextInput
                      label="Create Room"
                      name="roomName"
                      error={errorsCreate.roomName?.message}
                      register={registerCreate}
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
                <form onSubmit={handleJoinRoom(submitJoinRoom)}>
                  <div className="space-y-4">
                    <TextInput
                      label="Join Room"
                      name="roomUuid"
                      error={errorsJoin.roomUuid?.message}
                      register={registerJoin}
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
            onClick={room}
          >
            Room
          </button>
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
