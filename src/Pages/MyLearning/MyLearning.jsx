







import { useEffect, useMemo, useState } from "react";
import "./MyLearning.css";
import cardImage from "../../assets/coursesCard.png";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader, SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

const Card = ({
  id,
  category,
  description,
  expert,
  title,
  tags,
  thumbnail,
  onClick,
  completed
}) => {
 

 
  return (
    <div className="card-bottom-myLearning" onClick={() => onClick(id)}>
        <span>
          <img src={thumbnail} alt="Course image" />  
        </span>
      
      <div className="middle-sec-card-myLearning">
        <div className="addCourse-card-myLearning">
          <h6>{category}</h6>
        </div>
        <div className="pricing-card-myLearning">
          <h5>{tags}</h5>
        </div>
      </div>
      <p>{expert}</p>
      <h4 style={{fontSize:15}}>{title}</h4>
      <h4
      dangerouslySetInnerHTML={{
          
        __html: description?.split(" ").slice(0, 6).join(" ") + "..."
        
      }}
      >
       
          
          
   
      </h4>
      <div className="bottom-card-usermyLearning">
        <span><span style={{width:`${completed}%`}}></span></span>
        <div><p>{completed}% complete</p> <p>Add rating</p></div>
      </div>
    </div>
  );
};




const MyLearning = () => {
  // console.log("ok here");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("All Courses");


 


  const url = `${BASE_URI}/api/v1/users/myLearning`;
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  // console.log(data.data);
  // // const coursesData = data;
  const coursesData = useMemo(() => data?.data || [], [data]);
  console.log(data)


  const handleNavigate = (id) => {
    navigate(`/userPurchasedCourses/${id}`);
  };

  return (
    <>
      {isLoading ? (
           
            <l-grid
id="myLearningLoader"
  size="60"
  speed="1.5"
  color="black" 
></l-grid>
          ) : (
        <div className="wrapper-myLearning">
          <header className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-3.5 custom-box ">
         <h3 className="pb-5">My Learning</h3>
         <div className="d-flex gap-5 px-4">
           <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "All Courses" ? "border-bottom border-4" : ""
            }`}
            onClick={() => setActiveTab("All Courses")}
          >
            All Courses
          </h5>
          <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "Archieved" ? "border-bottom border-4" : ""
            }`}
            onClick={() => setActiveTab("Archieved")}
          >
            Archieved
          </h5>
          <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "Favorite" ? "border-bottom border-4" : ""
            }`}
            onClick={() => setActiveTab("Favorite")}
          >
            Favorite
          </h5>
        </div>
      </header>
          
            <div className="bottom-myLearning">
              {error?.response?.data?.message === "No courses found" ? (
                <div className="no-courses-userCourses">
                <div >
                  <h1 style={{marginLeft:"41%"}}>No Courses Purchased Yet!</h1>
                  <h5>
                    Purchase a course and join the world of athletes!
                  </h5>
                  <Link
                    to="/userCourses"
                    className="text-decoration-none text-white"
                  >
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      className="add-icon-courses"
                    />
                  </Link>
                </div>
              </div>
              ) : (
                coursesData?.course?.map((course) => (
                  <Card
                    key={course.id}
                    id={course.id}
                    category={course.category}
                    description={course.description}
                    expert={course.name}
                    completed={course.completion_percentage}
                    title={course.title}
                    tags={course.tags}
                    thumbnail={course.thumbnail}
                    onClick={handleNavigate}
                    
                  />
                ))
              )}
            </div>
          
        </div>
      )}
    </>
  );
};

export default MyLearning;

