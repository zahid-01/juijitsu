import { useState, useEffect } from "react";
import { RiBookFill, RiHome4Fill, RiMessage2Fill,  RiWallet2Fill, RiLifebuoyFill} from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

import { FaFileInvoice, FaUsers, FaUserTie, FaHome,FaBookReader } from "react-icons/fa";
import { MdDashboard,MdMessage } from "react-icons/md";
import "./SmallScreen.css";

const role = localStorage.getItem("userType");
const token = localStorage.getItem("token");

export default function SmallerScreenSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (role === "admin") {
      return "dashboard";
    } else if (role === "user") {
      return "home";
    } else if (role === "expert") {
      return "courses";
    }
  });

  useEffect(() => {
    if (location.pathname === "/") {
      // Update the activeTab state when navigating to the root path
      setActiveTab("login");
    }
    else if (location.pathname === "/userCourses") {
      // Update the activeTab state when navigating to the root path
      setActiveTab("home");
    }
  }, [location]);

  useEffect(() => {
    handleTabClick(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (!token) {
      // User role navigation
      switch (tab) {
        case "home":
          navigate("/userCourses");
          break;
          case "login":
            navigate("/");
            break;
        default:
          break;
      }}
    else if (role === "user") {
      // User role navigation
      switch (tab) {
        case "home":
          navigate("/userCourses");
          break;
        case "myLearning":
          navigate("/myLearning");
          break;
        case "messages":
          navigate("/messages");
          break;
          case "userWallet":
            navigate("/userWallet");
            break;
            case "support":
              navigate("/support");
              break;
        default:
          break;
      }
    } else if (role === "admin") {
      // Admin role navigation
      switch (tab) {
        case "dashboard":
          navigate("/adminDashboard");
          break;
        case "experts":
          navigate("/experts");
          break;
        case "students":
          navigate("/students");
          break;
        case "transactions":
          navigate("/transactions");
          break;
          case "review":
            navigate("/adminReview");
            break;
            case "support":
              navigate("/support");
              break;
        default:
          break;
      }
    } else if (role === "expert") {
      switch (tab) {
        case "dashboardd":
          navigate("/dashboard");
          break;
        case "courses":
          navigate("/courses");
          break;
        case "messages":
          navigate("/messages");
          break;
        case "wallet":
          navigate("/expertWallet");
          break;
          case "support":
              navigate("/support");
              break;
        default:
          break;
      }
    }
  };

  return (
    <div className="bg-gradient-custom-div px-1  d-flex align-items-center justify-content-around w-100 small-screen u-screen">
      {!token && (
        // Render for unauthenticated users
        <>
          <div
            onClick={() => handleTabClick("home")}
            style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "home" && `bg-white text-black`
            }`}
          >
            <FaHome className="fs-5 d-block" />
            <span className="small-screen-text">Home</span>
          </div>
          <div
          style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
            onClick={() => handleTabClick("login")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "login" && `bg-white text-black`
            }`}
          >
            <RiLifebuoyFill className="fs-5 d-block" />
            <span className="small-screen-text">Login</span>
          </div>
        </>)
}

    {role === "user" && (
  <>
    
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("myLearning")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light p-right ${
        activeTab === "myLearning" && `bg-white text-black`
      }`}
    >
      <RiBookFill className="fs-5 d-block" />
      <span className="small-screen-text">Purchased</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("messages")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "messages" && `bg-white text-black  `
      }`}
    >
      <RiMessage2Fill className="fs-5 d-block" />
      <span className="small-screen-text">Messages</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("home")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "home" && `bg-white text-black `
      }`}
    >
      <FaHome className="fs-5 d-block" />
      <span className="small-screen-text">Home</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("userWallet")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "userWallet" && `bg-white text-black`
      }`}
    >
      <RiWallet2Fill className="fs-5 d-block" />
      <span className="small-screen-text">Wallet</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "support" && `bg-white text-black`
      }`}
    >
      <RiLifebuoyFill className="fs-7" />
      <span className="small-screen-text">Support</span>
    </div>
  </>
)}


{role === "admin" && (
  <>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("dashboard")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "dashboard" && `bg-white text-black`
      }`}
    >
      <MdDashboard className="fs-8 d-block " />
      <span className="small-screen-text">Dashboard</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("experts")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "experts" && `bg-white text-black `
      }`}
    >
      <FaUserTie className="fs-7 d-block" />
      <span className="small-screen-text">Experts</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("students")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "students" && `bg-white text-black `
      }`}
    >
      <FaUsers className="fs-7 d-block" />
      <span className="small-screen-text">Students</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("transactions")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "transactions" && `bg-white text-black `
      }`}
    >
      <FaFileInvoice className="fs-7 d-block" />
      <span className="small-screen-text">Transactions</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("review")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "review" && `bg-white text-black `
      }`}
    >
      <FaBookReader className="fs-7" />
      <span className="small-screen-text">Review</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "support" && `bg-white text-black`
      }`}
    >
      <RiLifebuoyFill className="fs-7" />
      <span className="small-screen-text">Support</span>
    </div>
  </>
)}

{role === "expert" && (
  <>
    
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("dashboardd")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "dashboardd" && `bg-white text-black `
      }`}
    >
      <MdDashboard className="fs-5 d-block" />
      <span className="small-screen-text">Dashboard</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("messages")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "messages" && `bg-white text-black `
      }`}
    >
      <MdMessage className="fs-5 d-block" />
      <span className="small-screen-text">Messages</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("courses")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "courses" && `bg-white text-black `
      }`}
    >
      <FaHome className="fs-5 d-block" />
      <span className="small-screen-text">Courses</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("wallet")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "wallet" && `bg-white text-black `
      }`}
    >
      <FaFileInvoice className="fs-5 d-block" />
      <span className="small-screen-text">Wallet</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "support" && `bg-white text-black`
      }`}
    >
      <RiLifebuoyFill className="fs-7" />
      <span className="small-screen-text">Support</span>
    </div>
  </>
)}

    </div>
  );
}
