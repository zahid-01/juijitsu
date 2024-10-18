import { useState, useEffect } from "react";
import { RiBookFill, RiHome4Fill, RiMessage2Fill,  RiWallet2Fill, RiLifebuoyFill,RiSettings4Fill,RiLogoutBoxRFill} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { FaFileInvoice, FaUsers, FaUserTie, FaHome,FaBookReader } from "react-icons/fa";
import { MdDashboard,MdMessage } from "react-icons/md";
import "./SmallScreen.css";

const role = localStorage.getItem("userType");
const token = localStorage.getItem("token");
// const [showMoreOptions, setShowMoreOptions] = useState(false);

export default function SmallerScreenSidebar() {
  const navigate = useNavigate();
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
    handleTabClick(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (role === "user") {
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
            case "settings":
              navigate("/settings");
              break;
              case "logout":
              navigate("/logout");
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
              case "settings":
                navigate("/settings");
                break;
                case "logout":
                navigate("/logout");
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
          case "settings":
            navigate("/settings");
            break;
            case "logout":
              navigate("/logout");
              break;
        default:
          break;
      }
    }
  };
  
  return (
    <div className="bg-gradient-custom-div px-1  d-flex align-items-center justify-content-around w-100 small-screen u-screen">
    {role === "user" && (
  <>
    <div
      onClick={() => handleTabClick("home")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "home" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiHome4Fill className="fs-5 d-block" />
      <span className="small-screen-text">Home</span>
    </div>
    <div
      onClick={() => handleTabClick("myLearning")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light p-right ${
        activeTab === "myLearning" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiBookFill className="fs-5 d-block" />
      <span className="small-screen-text">Purchased</span>
    </div>
    <div
      onClick={() => handleTabClick("messages")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "messages" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiMessage2Fill className="fs-5 d-block" />
      <span className="small-screen-text">Messages</span>
    </div>
    <div
      onClick={() => handleTabClick("userWallet")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "userWallet" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiWallet2Fill className="fs-5 d-block" />
      <span className="small-screen-text">Wallet</span>
    </div>
    <div
      onClick={() => handleTabClick("settings")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "settings" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiSettings4Fill  className="fs-5 d-block" />
      <span className="small-screen-text">Settings</span>
    </div>
    <div
      onClick={() => handleTabClick("logout")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "logout" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiLogoutBoxRFill   className="fs-5 d-block" />
      <span className="small-screen-text">Logout</span>
    </div>
   
  </>
)}


{role === "admin" && (
  <>
    <div
      onClick={() => handleTabClick("dashboard")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "dashboard" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <MdDashboard className="fs-8 d-block " />
      <span className="small-screen-text-admin">Dashboard</span>
    </div>
    <div
      onClick={() => handleTabClick("experts")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "experts" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <FaUserTie className="fs-7 d-block" />
      <span className="small-screen-text-admin">Experts</span>
    </div>
    <div
      onClick={() => handleTabClick("students")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "students" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <FaUsers className="fs-7 d-block" />
      <span className="small-screen-text-admin">Students</span>
    </div>
    <div
      onClick={() => handleTabClick("transactions")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "transactions" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <FaFileInvoice className="fs-7 d-block" />
      <span className="small-screen-text-admin">Transactions</span>
    </div>
    <div
      onClick={() => handleTabClick("review")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "review" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <FaBookReader className="fs-7" />
      <span className="small-screen-text-admin">Review</span>
    </div>
    <div
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "support" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiLifebuoyFill className="fs-7" />
      <span className="small-screen-text-admin">Support</span>
    </div>
    <div
      onClick={() => handleTabClick("settings")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "settings" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiSettings4Fill className="fs-7" />
      <span className="small-screen-text-admin">Settings</span>
    </div>
    <div
      onClick={() => handleTabClick("logout")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "logout" && `bg-white text-black rounded-4 u-screen`
      }`}
    >
      <RiLogoutBoxRFill className="fs-7" />
      <span className="small-screen-text-admin">Logout</span>
    </div>
  </>
)}

{role === "expert" && (
  <>
    <div
      onClick={() => handleTabClick("courses")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "courses" && `bg-white text-black rounded-4`
      }`}
    >
      <FaHome className="fs-5 d-block" />
      <span className="small-screen-text">Courses</span>
    </div>
    <div
      onClick={() => handleTabClick("dashboardd")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "dashboardd" && `bg-white text-black rounded-4`
      }`}
    >
      <MdDashboard className="fs-5 d-block" />
      <span className="small-screen-text">Dashboard</span>
    </div>
    <div
      onClick={() => handleTabClick("messages")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "messages" && `bg-white text-black rounded-4`
      }`}
    >
      <MdMessage className="fs-5 d-block" />
      <span className="small-screen-text">Messages</span>
    </div>
    <div
      onClick={() => handleTabClick("wallet")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "wallet" && `bg-white text-black rounded-4`
      }`}
    >
      <FaFileInvoice className="fs-5 d-block" />
      <span className="small-screen-text">Wallet</span>
    </div>
    <div
      onClick={() => handleTabClick("settings")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "settings" && `bg-white text-black rounded-4`
      }`}
    >
      <RiSettings4Fill className="fs-5 d-block" />
      <span className="small-screen-text">Settings</span>
    </div>
    <div
      onClick={() => handleTabClick("logout")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "logout" && `bg-white text-black rounded-4`
      }`}
    >
      <RiLogoutBoxRFill className="fs-5 d-block" />
      <span className="small-screen-text">Logout</span>
    </div>
  </>
)}

    </div>
  );
}
