import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import logo from "../../../assets/istockphoto-841971598-1024x1024.jpg";
import "./Messages.css";
import { RxDotsVertical } from "react-icons/rx";
import useFetch from "../../../hooks/useFetch";
import { BASE_URI } from "../../../Config/url";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";
import { io } from "socket.io-client";
import { socket } from "../../../socket";

const initialMessages = [
  {
    id: 1,
    profileName: "John Doe",
    profileImage: logo,
    lastMessage: "Hey, how are you?",
    lastMessageTime: "2024-07-31T10:30:00",
    isFavorite: true,
    messages: [
      { id: 1, text: "Hello!", sender: "John Doe", time: "10:00 AM" },
      { id: 2, text: "Hi, how are you?", sender: "You", time: "10:02 AM" },
    ],
  },
  {
    id: 2,
    profileName: "Jane Smith",
    profileImage: logo,
    lastMessage: "See you tomorrow!",
    lastMessageTime: "2024-07-31T09:45:00",
    isFavorite: false,
    messages: [
      {
        id: 1,
        text: "See you tomorrow!",
        sender: "Jane Smith",
        time: "09:45 AM",
      },
      { id: 2, text: "Sure!", sender: "You", time: "09:46 AM" },
    ],
  },

  // Add more profiles as needed
];

const getTimeDifference = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const differenceInMilliseconds = now - messageDate;
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays > 0) {
    return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  } else if (differenceInHours > 0) {
    return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
  } else if (differenceInMinutes > 0) {
    return `${differenceInMinutes} minute${
      differenceInMinutes > 1 ? "s" : ""
    } ago`;
  } else {
    return `Just now`;
  }
};

const Messages = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [allExpertsPopUp, setAllExpertsPopUp] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [allExpertsData, setAllExpertsData] = useState(null);
  const [allExpertsInput, setAllExpertsInput] = useState("");
  const [selectedEmail, setSelecetedEmail] = useState(null);
  const [allExpertsLoading, setAllExpertsLoading] = useState(false);
  const [allExpertsError, setAllExpertsError] = useState("");
  const popupRef = useRef(null);
  const token = localStorage.getItem("token");
  const chatListUrl = `${BASE_URI}/api/v1/chat`;

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data } = useFetch(chatListUrl, fetchOptions);
  const chatList = useMemo(() => data?.data || [], [data]);
  console.log(chatList);

  // const handleOpenChat = (recieverId) => {
  //   console.log(recieverId);

  // Initialize socket connection
  // useEffect(() => {
  // Listen for incoming messages
  // socket.current.on("message", (message) => {
  //   const newMessage = {
  //     id: message.id,
  //     text: message.message,
  //     sender: message.sender_id === selectedChat ? "Receiver" : "You",
  //     time: new Date(message.created_at).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //   };

  //   setMessages((prevMessages) => {
  //     const updatedMessages = [...prevMessages];
  //     const chatIndex = updatedMessages.findIndex(msg => msg.id === message.sender_id);
  //     if (chatIndex !== -1) {
  //       updatedMessages[chatIndex].messages.push(newMessage);
  //     }
  //     return updatedMessages;
  //   });
  // });

  //   return () => {
  //     socket.current.disconnect(); // Disconnect socket on component unmount
  //   };
  // }, [selectedChat, token]);

  const handleOpenChat = (receiverId, receiverEmail) => {
    setSelecetedEmail(receiverEmail);
    setSelectedChat(receiverId);
    console.log(receiverEmail);
    axios
      .get(`${BASE_URI}/api/v1/chat/chatMessages/${receiverId}`, fetchOptions)
      .then((resp) => {
        const chatMessages = resp?.data?.data?.map((msg) => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_id === receiverId ? "Receiver" : "You",
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages((prevMessages) => ({
          ...prevMessages,
          [receiverId]: chatMessages, // Save the messages for the selected chat
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Emit the message via socket
    socket.emit("private_message", {
      msg: inputValue,
      friend: selectedEmail,
    });
    setInputValue(null);

    //   const updatedMessages = [...messages];
    //   updatedMessages[selectedChat].messages.push(newMessage);
    //   setMessages(updatedMessages);
    //   setInputValue("");
    // }
  };

  const handleDotsClick = () => {
    setPopupVisible(!popupVisible);
  };

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupVisible(false);
    }
  };

  const handleComposeClick = async (click) => {
    if (click) {
      setAllExpertsPopUp(true);
    }

    setAllExpertsLoading(true);
    const url = `${BASE_URI}/api/v1/users/otherExperts${
      allExpertsInput !== "" ? `?search=${allExpertsInput}` : ""
    }`;
    console.log(url);
    await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res?.data);
        setAllExpertsError("");
        setAllExpertsData(res?.data?.data);
        setAllExpertsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAllExpertsError(err?.response?.data?.message);
        setAllExpertsLoading(false);
      });
  };

  useEffect(() => {
    handleComposeClick();
  }, [allExpertsInput]);

  useEffect(() => {
    socket.on("privateMessage", (message) => {
      console.log(message);
    });
  });

  useEffect(() => {
    if (popupVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [popupVisible]);

  const getRandomColor = () => {
    const colors = [
      "#2C3E50", // Dark Blue-Gray
      "#8E44AD", // Deep Purple
      "#2980B9", // Soft Blue
      "#16A085", // Teal
      "#27AE60", // Green
      "#F39C12", // Muted Orange
      "#D35400", // Burnt Orange
      "#C0392B", // Deep Red
      "#BDC3C7", // Light Gray
      "#7F8C8D", // Slate Gray
      "#34495E", // Steel Blue
      "#E67E22", // Warm Orange
      "#9B59B6", // Purple
      "#1ABC9C", // Aquamarine
      "#3498DB", // Light Blue
      "#95A5A6", // Cool Gray
      "#E74C3C", // Muted Red
      "#F1C40F", // Soft Yellow
      "#AAB7B8", // Soft Silver
      "#5D6D7E", // Dark Slate Blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-100">
      <header className="bg-gradient-custom-div p-3 rounded-3">
        <h3 className="pb-4">Messages</h3>
        <p className="mb-3 fs-4 fw-light">You have 0 unread messages</p>
      </header>
      <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>
        <section className="px-2 py-2 w-50 border-end pe-4">
          <div
            className="d-flex align-items-center gap-5 mb-3"
            style={{ overflow: "auto" }}
          >
            <select
              name=""
              id=""
              className="p-2 bg-custom-secondary rounded-2 w-50 border-0"
            >
              <option value="allMessages">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <div style={{}} className="position-relative w-50">
              <button
                onClick={() => handleComposeClick("click")}
                className=" signup-now py-2 px-3 fw-lightBold mb-0 h-auto  "
              >
                Compose
              </button>
              {allExpertsPopUp && (
                <div
                  style={{
                    bottom: "-550%",
                    color: "black",
                    zIndex: "100",
                    height: "40vh",
                    width: "25vw",
                    boxShadow: "0px 0px 4px 0.2px #00000040",
                  }}
                  className="position-absolute bg-white  p-3 rounded"
                >
                  <span className="flex justify-content-between pb-1 align-items-center">
                    <p style={{ marginLeft: "30%" }}>All Experts</p>
                    <FontAwesomeIcon
                      onClick={() => setAllExpertsPopUp(false)}
                      className="cursor-pointer"
                      icon={faXmark}
                    />
                  </span>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search here..."
                    aria-label="search"
                    className=" form-control border-end-0 px-3 bg-custom-secondary"
                    onChange={(e) => setAllExpertsInput(e.target.value)}
                  />
                  <div
                    style={{
                      height: "70%",
                      scrollbarWidth: "none",
                      overflowX: "hidden",
                    }}
                    className="flex flex-column position-relative"
                  >
                    {allExpertsLoading ? (
                      <PulseLoader
                        size={8}
                        style={{ top: "40%", left: "45%" }}
                        color="black"
                        className="position-absolute "
                      />
                    ) : allExpertsError === "No expert found" ? (
                      <p
                        style={{
                          top: "40%",
                          left: "25%",
                          whiteSpace: "nowrap",
                        }}
                        className="position-absolute "
                      >
                        {allExpertsError}
                      </p>
                    ) : (
                      allExpertsData?.map((profile, index) => (
                        <span
                          key={index}
                          className="d-flex gap-2 align-items-center m-2"
                        >
                          {profile.profile_picture ? (
                            <img
                              src={profile.profile_picture}
                              alt={profile.name}
                              className="rounded-circle"
                              width="30"
                              height="30"
                            />
                          ) : (
                            <div
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: getRandomColor(), // Function to get a random color
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{ color: "#fff", fontWeight: "bold" }}
                              >
                                {profile.name.charAt(0).toUpperCase()}{" "}
                                {/* Display first letter */}
                              </span>
                            </div>
                          )}
                          <p className="fs-6">{profile.name}</p>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="position-relative w-100">
            <CiSearch
              size="1.3rem"
              className="position-absolute search-icon text-black-50 ms-2"
            />
            <input
              type="text"
              placeholder="Search Messages"
              className="form-control bg-custom-secondary border-end-0 px-5 py-2 rounded-2 w-100"
            />
          </div>
          <div className="mt-3 pe-1 w-100" style={{ height: "450px" }}>
            {chatList.map((chat) => (
              <div
                key={chat.chat_id}
                className={`cursor-pointer bg-white d-flex justify-content-between p-3 mb-3 border rounded-3 no-flex ${
                  selectedChat === chat.chat_id && "selected"
                }`}
                onClick={() => handleOpenChat(chat?.expert_id, chat?.email)}
              >
                <div className="d-flex gap-2 align-items-center no-flex">
                  <img
                    src={chat.profile_picture || logo}
                    alt={chat.name}
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className=" ">
                    <h6 className="mb-0">{chat.name}</h6>
                    <p className="text-muted mb-0">{chat.message}</p>
                  </div>
                </div>
                <div className="d-flex  justify-content-between c-rep no-flex">
                  <small>{getTimeDifference(chat.updated_at)}</small>{" "}
                  {/* Use the time difference here */}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="px-4 py-2 flex-grow-1">
          {selectedChat === null ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-between h-100">
              <div className="d-flex flex-column">
                {messages[selectedChat]?.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${
                      msg.sender === "You"
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      style={{ background: "white" }}
                      className="d-flex flex-column p-3 rounded-3 m-2"
                    >
                      <p className="mb-0">{msg.text}</p>
                      <small className="text-muted">{msg.time}</small>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="d-flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="form-control me-2"
                  placeholder="Type your message"
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Messages;
