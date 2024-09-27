import { useState } from "react";
import { RiBookFill, RiHome4Fill, RiMessage2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function SmallerScreenSidebar() {
  const navigate = useNavigate();

const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if(tab === "home"){
      navigate('/userCourses');
    }else if(tab === "myLearning"){
      navigate('/myLearning');
    }else{
      navigate('/purchaseHistory');
    }
   
  };






  return (
    <div className="bg-gradient-custom-div px-1 d-flex align-items-center justify-content-around position-fixed w-100">
      <div onClick={()=>handleTabClick('home')} className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'home' && ` bg-white text-black rounded-4`}`}>
        <RiHome4Fill className="fs-5 d-block" />
        Home
      </div>
      <div onClick={()=>handleTabClick('myLearning')} className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'myLearning' && ` bg-white text-black rounded-4`}`}>
        <RiBookFill className="fs-5 d-block" />
        My Learning
      </div>
      <div onClick={()=>handleTabClick('purchaseHistory')} className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${activeTab === 'purchaseHistory' && ` bg-white text-black rounded-4`}`}>
        <RiMessage2Fill className="fs-5 d-block" />
        Messages
      </div>
    </div>
  );
}
