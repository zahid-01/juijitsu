import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import logo from "../../assets/istockphoto-841971598-1024x1024.jpg";
import './Support.css'
import { RxDotsVertical } from "react-icons/rx";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const [activeTab, setActiveTab] = useState("allChats");
  
  const token = localStorage.getItem("token");
  const chatListUrl = `${BASE_URI}/api/v1/chat`;

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data } = useFetch(chatListUrl, fetchOptions);
  const chatList = useMemo(() => data?.data || [], [data]);

  const handleOpenChat = (recieverId) => {
    axios
      .get(`${BASE_URI}/api/v1/chat/chatMessages/${recieverId}`, fetchOptions)
      .then((resp) => {
        console.log("Chat messages response:", resp.data);
      })
      .catch((error) => {
        console.error("Error fetching chat messages:", error);
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
        <h3 className="pb-4">Support</h3>
        <div className="d-flex gap-5 px-3 p-btm">
          <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "allChats" ? "border-bottom border-4" : ""
            }`}
            onClick={() => setActiveTab("allChats")}
          >
            All Chats
          </h5>
        </div>
      </header>

      {activeTab === "allChats" && (
        <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>
          <section className="px-2 py-2 w-50 border-end pe-4">
            <div className="input-group mb-4">
              <input
                type="text"
                id="search"
                placeholder="Search User"
                aria-label="search"
                className="form-control border-end-0 px-3 bg-custom-secondary"
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
                  className="d-flex align-items-center gap-5 py-1 border-bottom cursor-pointer"
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
                          className="list-unstyled m-0 text-center"
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
                  className="p-3 flex-grow-1 overflow-auto h-100"
                  style={{ minHeight: "23rem" }}
                >
                  {messages[selectedChat].messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${
                        msg.sender === "You" ? "sent" : "received"
                      } mb-2`}
                    >
                      <div className="message-content p-2">
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
      )}
    </div>
  );
};

export default Support;
