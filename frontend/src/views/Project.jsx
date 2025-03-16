import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoIosSend } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import axios from "../config/axios";
import { initializeSocket, reciveMessage, sendMessage } from "../config/socket";
import { useUser } from "../context/User.context";

const Project = () => {
  const { user } = useUser();
  const location = useLocation();
  const [projectDetails, setProjectDetails] = useState(
    location.state?.project || null
  );
  const [showUsers, setShowUsers] = useState(false);
  const [showAddUsers, setShowAddUsers] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [projectUsers, setProjectUsers] = useState(projectDetails.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [errorOfAddinfcollaborator, setErrorOfAddinfcollaborator] =
    useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store messages
  const messageBoxRef = useRef(null); // Reference to the message container

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  }, [messages]); // Runs when messages update

  const toggleUserSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const searchUserHandler = async () => {
    if (!searchQuery.trim()) {
      setErrorOfAddinfcollaborator("Type Something to Search");
      return;
    }
    axios
      .get(`/users/matchingusers/${searchQuery}`)
      .then((res) => {
        setSearchUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addCollaboratorsToTheProject = () => {
    if (selectedIds.length <= 0) {
      setErrorOfAddinfcollaborator(
        "Selete a Collaborator to add to your Project"
      );
      setTimeout(() => {
        setErrorOfAddinfcollaborator(null);
      }, 2000);
      return;
    }

    axios
      .put("projects/adduser", {
        projectId: projectDetails._id,
        users: selectedIds,
      })
      .then((res) => {
        console.log(res.data);
        setSelectedIds([]);
        if (Array.isArray(res.data.newUsers)) {
          setProjectUsers((prevUsers) => [...prevUsers, ...res.data.newUsers]);
        } else {
          console.error("newUsers is not an array", res.data.newUsers);
        }
        setTimeout(() => {
          setShowAddUsers(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });

    setSelectedIds([]);
  };

  const send = () => {
    const newMessage = { message, sender: user };
    sendMessage("project-message", newMessage);

    setMessages((prev) => [...prev, newMessage]); // Show sent message
    setMessage("");
    scrollDown(); // Auto-scroll
  };

  useEffect(() => {
    initializeSocket(projectDetails._id);

    reciveMessage("project-message", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]); // Append new message
      scrollDown(); // Auto-scroll
    });

    axios
      .get(`/projects/getproject/${projectDetails._id}`)
      .then((res) => {
        console.log(res.data);
        setProjectDetails(res.data);
        setProjectUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [showAddUsers]);

  return (
    <main className="h-screen w-full flex bg-gray-900">
      {/* Left Section */}
      <section className="relative h-full w-80 bg-gray-800 flex flex-col">
        {/* Header with Icon Buttons */}
        <header className="flex justify-end p-4 bg-gray-700 gap-4">
          <button
            onClick={() => setShowAddUsers(!showAddUsers)}
            className="text-white hover:text-blue-500"
          >
            <IoPersonAddOutline size={24} />
          </button>

          <button
            onClick={() => setShowUsers(!showUsers)}
            className="text-white hover:text-blue-500"
          >
            <LiaUserFriendsSolid size={24} />
          </button>
        </header>

        {/* Full-Cover Sliding Modal for Users */}
        {(showUsers || showAddUsers) && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="absolute top-0 left-0 h-full w-full bg-gray-900 shadow-md p-4 overflow-y-auto z-50"
          >
            <button
              onClick={() => {
                setShowUsers(false);
                setShowAddUsers(false);
              }}
              className="absolute top-4 right-4 text-white hover:text-red-500"
            >
              <IoClose size={30} />
            </button>

            {showAddUsers && (
              <>
                <h2 className="text-white text-lg mb-4">Add Users</h2>
                <div className="flex gap-2 mb-4">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Search users..."
                  />
                  <button
                    onClick={searchUserHandler}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>

                {selectedIds.length > 0 && (
                  <div className="mb-4 p-2 bg-gray-800 rounded-md">
                    <h3 className="text-white text-sm mb-2">Selected Users</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedIds.map((id) => {
                        const user =
                          searchUsers.find((u) => u._id === id) ||
                          projectUsers.find((u) => u._id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full"
                          >
                            <span className="mr-2">{user?.name}</span>
                            <button
                              onClick={() => toggleUserSelection(id)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <IoClose size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <ul className="text-gray-300 space-y-2 max-h-[60vh] overflow-y-auto">
                  {searchUsers.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between py-2 px-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.name[0]}
                        </div>
                        <span className="text-white text-sm">{user.name}</span>
                      </div>
                      {projectUsers.some((u) => u._id === user._id) ? (
                        <small>Already in project</small>
                      ) : (
                        <button
                          onClick={() => toggleUserSelection(user._id)}
                          className={
                            selectedIds.includes(user._id)
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-green-400 hover:text-green-500"
                          }
                          disabled={selectedIds.includes(user._id)}
                        >
                          <FiUserPlus size={20} />
                        </button>
                      )}
                    </li>
                  ))}
                  {errorOfAddinfcollaborator ? (
                    <div className="text-red-500 text-sm mb-2 text-center my-1">
                      {errorOfAddinfcollaborator}
                    </div>
                  ) : null}
                  <button
                    onClick={addCollaboratorsToTheProject}
                    className="bg-green-500 p-2"
                  >
                    Add Collaborators
                  </button>
                </ul>
              </>
            )}

            {showUsers && (
              <>
                <h2 className="text-white text-lg mb-4">Project Users</h2>
                <ul className="text-gray-300 space-y-2 max-h-[80vh] overflow-y-auto">
                  {projectUsers.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center gap-2 py-1 px-2 hover:bg-gray-700 rounded-md cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name[0].toUpperCase()}
                      </div>
                      {user._id === projectDetails.author ? (
                        <small className="text-[#FFD700]">Admin</small>
                      ) : (
                        <small className="text-[#1E90FF]">collaborator</small>
                      )}
                      <span className="text-white text-sm">{user.name}</span>
                      <small className="text-white">{user.email}</small>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}

        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-h-0 p-2">
          {/* Messages Container */}
          <div
            ref={messageBoxRef}
            className="messages flex-1 flex flex-col gap-2 overflow-y-auto bg-gray-700 p-2 rounded-md "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] p-3 h-auto rounded-lg text-white break-words ${
                  msg.sender._id === user._id
                    ? "bg-blue-600 ml-auto self-end"
                    : "bg-gray-600 self-start"
                }`}
              >
                <h3 className="text-sm break-words">{msg.message}</h3>
                <small
                  className={
                    msg.sender._id === user._id
                      ? "text-gray-300"
                      : "text-blue-400"
                  }
                >
                  {msg.sender.email}
                </small>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="input-field flex mt-4 bg-gray-700 p-2 rounded-md">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="w-full bg-gray-800 p-2 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={send}
              className="ml-2 text-blue-600 hover:text-blue-700 flex-shrink-0 cursor-pointer"
            >
              <IoIosSend size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex-1 h-full bg-black"></section>
    </main>
  );
};

export default Project;
