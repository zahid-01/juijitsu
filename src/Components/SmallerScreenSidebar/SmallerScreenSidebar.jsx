import { useState, useEffect } from "react";
import { RiBookFill, RiHome4Fill, RiMessage2Fill,  RiWallet2Fill,} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { FaFileInvoice, FaUsers, FaUserTie, FaHome,FaBookReader } from "react-icons/fa";
import { MdDashboard,MdMessage } from "react-icons/md";
import "./SmallScreen.css";

const role = localStorage.getItem("userType");
const token = localStorage.getItem("token");

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
        default:
          break;
      }
    }
  };

  return (
    <div className="bg-gradient-custom-div px-1  d-flex align-items-center justify-content-around position-fixed w-100 small-screen">
      {role === "user" && (
        <>
          <div
            onClick={() => handleTabClick("home")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "home" && `bg-white text-black rounded-4`
            }`}
          >
            <RiHome4Fill className="fs-5 d-block" />
            Home
          </div>
          <div
            onClick={() => handleTabClick("myLearning")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "myLearning" && `bg-white text-black rounded-4`
            }`}
          >
            <RiBookFill className="fs-5 d-block" />
            Purchased Courses
          </div>
          <div
            onClick={() => handleTabClick("messages")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "messages" && `bg-white text-black rounded-4`
            }`}
          >
            <RiMessage2Fill className="fs-5 d-block" />
            Messages
          </div>
          <div
            onClick={() => handleTabClick("userWallet")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "userWallet" && `bg-white text-black rounded-4`
            }`}
          >
            <RiWallet2Fill className="fs-5 d-block" />
            Wallet
          </div>
        </>
      )}

      {role === "admin" && (
        <>
          <div
            onClick={() => handleTabClick("dashboard")}
            className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
              activeTab === "dashboard" && `bg-white text-black rounded-4`
            }`}
          >
            <MdDashboard className="fs-8 d-block" />
            Dashboard
          </div>
          <div
            onClick={() => handleTabClick("experts")}
            className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
              activeTab === "experts" && `bg-white text-black rounded-4`
            }`}
          >
            <FaUserTie className="fs-7 d-block" />
            Experts
          </div>
          <div
            onClick={() => handleTabClick("students")}
            className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
              activeTab === "students" && `bg-white text-black rounded-4`
            }`}
          >
            <FaUsers className="fs-7 d-block" />
            Students
          </div>
          <div
            onClick={() => handleTabClick("transactions")}
            className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
              activeTab === "transactions" && `bg-white text-black rounded-4`
            }`}
          >
            <FaFileInvoice className="fs-7 d-block" />
            Transactions
          </div>
          <div
            onClick={() => handleTabClick("review")}
            className={`d-flex flex-column align-items-center py-1 fw-light ${
              activeTab === "review" && `bg-white text-black rounded-4`
            }`}
          >
            <FaBookReader className=" fs-7" />
            Review 
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
            <FaHome  className="fs-5 d-block" />
            Courses
          </div>
          <div
            onClick={() => handleTabClick("dashboardd")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "dashboardd" && `bg-white text-black rounded-4`
            }`}
          >
            <MdDashboard className="fs-5 d-block" />
            Dashboard
          </div>

          <div
            onClick={() => handleTabClick("messages")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "messages" && `bg-white text-black rounded-4`
            }`}
          >
            <MdMessage className="fs-5 d-block" />
            Messages
          </div>
          <div
            onClick={() => handleTabClick("wallet")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "wallet" && `bg-white text-black rounded-4`
            }`}
          >
            <FaFileInvoice className="fs-5 d-block" />
            wallet
          </div>
        </>
      )}
    </div>
  );
}
