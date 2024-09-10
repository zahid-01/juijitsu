import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import logo from "../../../assets/istockphoto-841971598-1024x1024.jpg";
import "./Messages.css";
import { RxDotsVertical } from "react-icons/rx";
import useFetch from "../../../hooks/useFetch";
import { BASE_URI } from "../../../Config/url";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

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
  {
    id: 3,
    profileName: "Alice Johnson",
    profileImage: logo,
    lastMessage: "Can we reschedule our meeting?",
    lastMessageTime: "2024-07-30T15:20:00",
    isFavorite: true,
    messages: [
      {
        id: 1,
        text: "Can we reschedule our meeting?",
        sender: "Alice Johnson",
        time: "03:20 PM",
      },
      {
        id: 2,
        text: "Of course, when are you available?",
        sender: "You",
        time: "03:22 PM",
      },
    ],
  },
  {
    id: 4,
    profileName: "Bob Brown",
    profileImage: logo,
    lastMessage: "I'll send you the report by EOD.",
    lastMessageTime: "2024-07-29T11:10:00",
    isFavorite: false,
    messages: [
      {
        id: 1,
        text: "I'll send you the report by EOD.",
        sender: "Bob Brown",
        time: "11:10 AM",
      },
      { id: 2, text: "Great, thanks!", sender: "You", time: "11:12 AM" },
    ],
  },
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
  const [popupVisible, setPopupVisible] = useState(false);
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

  const handleOpenChat = (recieverId) => {
    axios
      .get(`${BASE_URI}/api/v1/chat/chatMessages/${recieverId}`, fetchOptions)
      .then((resp) => {
        console.log(resp.data);
      });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "" && selectedChat !== null) {
      const newMessage = {
        id: messages[selectedChat].messages.length + 1,
        text: inputValue,
        sender: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      const updatedMessages = [...messages];
      updatedMessages[selectedChat].messages.push(newMessage);
      setMessages(updatedMessages);
      setInputValue("");
    }
  };

  const handleDotsClick = () => {
    setPopupVisible(!popupVisible);
  };

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupVisible(false);
    }
  };

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

  return (
    <div className="w-100">
      <header className="bg-gradient-custom-div p-3 rounded-3">
        <h3 className="pb-4">Messages</h3>
        <p className="mb-3 fs-4 fw-light">You have 0 unread messages</p>
      </header>
      <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>
        <section className="px-2 py-2 w-50 border-end pe-4">
          <div className="d-flex align-items-center gap-5 mb-3">
            <select
              name=""
              id=""
              className="p-2 bg-custom-secondary rounded-2 w-50 border-0"
            >
              <option value="allMessages">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <button className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto w-50">
              Compose
            </button>
          </div>
          <div className=" input-group mb-4">
            <input
              type="text"
              id="search"
              placeholder="Search here..."
              aria-label="search"
              className=" form-control border-end-0 px-3 bg-custom-secondary"
            />
            <label
              className="input-group-text search-icon border-start-0 bg-custom-secondary"
              htmlFor="search"
            >
              <CiSearch />
            </label>
          </div>

          <div className="px-1 py-3 chat-list">
            {chatList.map((message) => (
              <div
                key={message.id}
                className=" d-flex align-items-center gap-5 py-1 border-bottom cursor-pointer"
                onClick={() => handleOpenChat(message.id)}
              >
                <div>
                  {message.profile_picture ? (
                    <img
                      src={message.profile_picture}
                      alt=""
                      className="rounded-circle mb-1"
                      style={{
                        width: "3rem",
                        height: "3rem",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FaUserCircle className="fs-1" />
                  )}

                  <div className="favorite text-center">
                    {message.is_favorite === 1 ? "⭐" : "☆"}
                  </div>
                </div>
                <div className="message-info w-100">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <h5 className="fw-light">{message.name}</h5>
                    <p className="mb-0 fw-light">
                      {getTimeDifference(message.updated_at)}
                    </p>
                  </div>
                  <p className="fw-light">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="w-50">
          {selectedChat !== null ? (
            <div className="w-100 border rounded-end shadow-sm">
              <header className="d-flex align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center gap-4">
                  <div className="favorite text-center">
                    {messages[selectedChat].isFavorite ? "⭐" : "☆"}
                  </div>
                  <img
                    src={messages[selectedChat].profileImage}
                    alt="Profile"
                    className="rounded-circle me-2 object-fit-cover"
                    width="40"
                    height="40"
                  />
                  <h5 className="mb-0 fw-light">
                    {messages[selectedChat].profileName}
                  </h5>
                </div>
                <div className="ms-auto position-relative" ref={popupRef}>
                  <RxDotsVertical
                    className="fs-3 cursor-pointer"
                    onClick={handleDotsClick}
                  />
                  {popupVisible && (
                    <div
                      className="popup-menu position-absolute bg-white border rounded shadow-sm"
                      style={{ right: "0%", top: "100%", zIndex: 10 }}
                    >
                      <ul
                        className="list-unstyled m-0  text-center"
                        style={{ minWidth: "12rem" }}
                      >
                        <li className="py-2 px-3 cursor-pointer text-light-custom">
                          Remove Important
                        </li>
                        <li className="py-2 px-3 cursor-pointer border-top border-bottom text-light-custom">
                          Mark as Read
                        </li>
                        <li className="py-2 px-3 cursor-pointer text-light-custom">
                          Block
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </header>

              <section
                className=" p-3 flex-grow-1 overflow-auto h-100"
                style={{ minHeight: "23rem" }}
              >
                {messages[selectedChat].messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${
                      msg.sender === "You" ? "sent" : "received"
                    } mb-2`}
                  >
                    <div
                      className="message-content p-2"
                      // style={{ backgroundColor: "#C9D1D5" }}
                    >
                      <p className="text-muted mb-2">{msg.time}</p>
                      <p className="mb-0 fw-light">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </section>

              <footer className="d-flex align-items-center">
                <form className="input-group" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="form-control py-2 rounded-0"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button
                    className="rounded-0 signup-now py-2 px-4 fw-lightBold h-auto mb-0"
                    type="submit"
                  >
                    Send
                  </button>
                </form>
              </footer>
            </div>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <h4 className="fw-light">Select a message to read here!</h4>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Messages;
