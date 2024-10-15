import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RxDotsVertical } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import useFetch from "../../../hooks/useFetch";
import { BASE_URI } from "../../../Config/url";
import "./Messages.css";

// Sample data
const initialMessages = [
  {
    id: 1,
    profileName: "John Doe",
    profileImage: "https://via.placeholder.com/150",
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
    profileImage: "https://via.placeholder.com/150",
    lastMessage: "See you tomorrow!",
    lastMessageTime: "2024-07-31T09:45:00",
    isFavorite: false,
    messages: [
      { id: 1, text: "See you tomorrow!", sender: "Jane Smith", time: "09:45 AM" },
      { id: 2, text: "Sure!", sender: "You", time: "09:46 AM" },
    ],
  },
];

const getTimeDifference = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const differenceInMilliseconds = now - messageDate;
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays > 0) {
    return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  } else if (differenceInHours > 0) {
    return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
  } else if (differenceInMinutes > 0) {
    return `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""} ago`;
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

  const handleOpenChat = (receiverId) => {
    console.log(receiverId);
    axios
      .get(`${BASE_URI}/api/v1/chat/chatMessages${receiverId}`, fetchOptions)
      .then((resp) => {
        console.log(resp?.data);
        setSelectedChat(receiverId);
      })
      .catch((err) => {
        console.log(err);
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

  const handleComposeClick = async (click) => {
    if (click) {
      setAllExpertsPopUp(true);
    }

    setAllExpertsLoading(true);
    const url = `${BASE_URI}/api/v1/users/otherExperts${
      allExpertsInput !== "" ? `?search=${allExpertsInput}` : ""
    }`;
    await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        setAllExpertsError("");
        setAllExpertsData(res?.data?.data);
        setAllExpertsLoading(false);
      })
      .catch((err) => {
        setAllExpertsError(err?.response?.data?.message);
        setAllExpertsLoading(false);
      });
  };

  useEffect(() => {
    handleComposeClick();
  }, [allExpertsInput]);

  return (
    <div className="w-100">
      <header className="bg-gradient-custom-div p-3 rounded-3">
        <h3 className="pb-4">Messages</h3>
        <p className="mb-3 fs-4 fw-light">You have 0 unread messages</p>
      </header>
      <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>
        <section className="px-2 py-2 w-50 border-end pe-4">
          <div className="d-flex align-items-center gap-5 mb-3">
            <select className="p-2 bg-custom-secondary rounded-2 w-50 border-0">
              <option value="allMessages">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <div style={{ position: "relative", width: "50%" }}>
              <button
                onClick={() => handleComposeClick("click")}
                className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto w-100"
              >
                Compose
              </button>
              {allExpertsPopUp && (
                <div
                  className="position-absolute bg-white p-3 rounded"
                  style={{
                    bottom: "-550%",
                    color: "black",
                    zIndex: "100",
                    height: "40vh",
                    width: "25vw",
                    boxShadow: "0px 0px 4px 0.2px #00000040",
                  }}
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
                    placeholder="Search here..."
                    className="form-control border-end-0 px-3 bg-custom-secondary"
                    onChange={(e) => setAllExpertsInput(e.target.value)}
                  />
                  <div className="flex flex-column position-relative" style={{ height: "70%", overflowX: "hidden" }}>
                    {allExpertsLoading ? (
                      <PulseLoader size={8} color="black" />
                    ) : allExpertsError ? (
                      <p>{allExpertsError}</p>
                    ) : (
                      allExpertsData?.map((profile, index) => (
                        <span key={index} className="d-flex gap-2 align-items-center m-2">
                          <img
                            src={profile.profile_picture}
                            alt={profile.name}
                            className="rounded-circle"
                            width="30"
                            height="30"
                          />
                          <p>{profile.name}</p>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="input-group mb-4">
            <input
              type="text"
              placeholder="Search here..."
              className="form-control border-end-0 px-3 bg-custom-secondary"
            />
            <label className="input-group-text search-icon border-start-0 bg-custom-secondary">
              <CiSearch />
            </label>
          </div>

          <div className="px-1 py-3 chat-list">
            {chatList?.map((message) => (
              <div
                key={message?.expert_id}
                className="d-flex align-items-center gap-4 cursor-pointer mb-3"
                onClick={() => handleOpenChat(message.expert_id)}
              >
                <div>
                  <FaUserCircle size="4em" />
                </div>
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <p className="fs-5 mb-1 fw-medium">{message.expert_name}</p>
                    <p className="m-0 fs-6 text-muted fw-lighter">
                      {message.latestMessage ? message.latestMessage : "Start your conversation"}
                    </p>
                  </div>
                  <div>
                    <span>{getTimeDifference(message.updated_at)}</span>
                  </div>
                  <div className="flex justify-content-end">
                    <RxDotsVertical />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chat Window */}
        <section className="w-50 px-2">
          {selectedChat !== null ? (
            <div className="d-flex flex-column h-100">
              <header className="chat-header p-3 bg-light border-bottom">
                <h5>{messages[selectedChat].profileName}</h5>
              </header>
              <div className="chat-body p-3 flex-grow-1 overflow-auto">
                {messages[selectedChat].messages.map((message) => (
                  <div key={message.id} className={`message ${message.sender === "You" ? "sent" : "received"}`}>
                    <p className="mb-1">{message.text}</p>
                    <small>{message.time}</small>
                  </div>
                ))}
              </div>
              <footer className="chat-footer p-3 bg-light border-top">
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </footer>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Select a chat to view messages</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Messages;
