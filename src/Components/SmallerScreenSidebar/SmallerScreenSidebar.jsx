import { useState, useEffect } from "react";
import { RiBookFill, RiHome4Fill, RiMessage2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { FaFileInvoice, FaUsers, FaUserTie } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import './SmallScreen.css';

const role = localStorage.getItem("userType");
const token = localStorage.getItem("token");

export default function SmallerScreenSidebar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(role === "admin" ? "dashboard" : "home");

  useEffect(() => {
    handleTabClick(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    if (role === 'user') {
      // User role navigation
      switch (tab) {
        case 'home':
          navigate('/userCourses');
          break;
        case 'myLearning':
          navigate('/myLearning');
          break;
        case 'purchaseHistory':
          navigate('/purchaseHistory');
          break;
        default:
          break;
      }
    } else if (role === 'admin') {
      // Admin role navigation
      switch (tab) {
        case 'dashboard':
          navigate('/adminDashboard');
          break;
        case 'experts':
          navigate('/experts');
          break;
        case 'students':
          navigate('/students');
          break;
        case 'transactions':
          navigate('/transactions');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="bg-gradient-custom-div px-1  d-flex align-items-center justify-content-around position-fixed w-100 small-screen" >
      {role === 'user' && (
        <>
          <div 
            onClick={() => handleTabClick('home')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'home' && `bg-white text-black rounded-4`}`}
          >
            <RiHome4Fill className="fs-5 d-block" />
            Home
          </div>
          <div 
            onClick={() => handleTabClick('myLearning')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'myLearning' && `bg-white text-black rounded-4`}`}
          >
            <RiBookFill className="fs-5 d-block" />
            My Learning
          </div>
          <div 
            onClick={() => handleTabClick('purchaseHistory')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'purchaseHistory' && `bg-white text-black rounded-4`}`}
          >
            <RiMessage2Fill className="fs-5 d-block" />
            Messages
          </div>
        </>
      )}

      {role === 'admin' && (
        <>
          <div 
            onClick={() => handleTabClick('dashboard')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'dashboard' && `bg-white text-black rounded-4`}`}
          >
            <MdDashboard  className="fs-5 d-block" />
            Dashboard
          </div>
          <div 
            onClick={() => handleTabClick('experts')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'experts' && `bg-white text-black rounded-4`}`}
          >
            <FaUserTie className="fs-5 d-block" />
            Experts
          </div>
          <div 
            onClick={() => handleTabClick('students')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'students' && `bg-white text-black rounded-4`}`}
          >
            <FaUsers  className="fs-5 d-block" />
            Students
          </div>
          <div 
            onClick={() => handleTabClick('transactions')} 
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'transactions' && `bg-white text-black rounded-4`}`}
          >
            <FaFileInvoice className="fs-5 d-block" />
            Transactions
          </div>
        </>
      )}
    </div>
  );
}