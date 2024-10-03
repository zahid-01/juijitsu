import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./UserCourseOverview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faAngleDown,
  faStar,
  faArrowRight,
  faCoins,
  faCross,
  faCut,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FaYoutube } from "react-icons/fa";
import cardImage from "../../assets/coursesCard.png";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import "ldrs/grid";
import "ldrs/bouncy";
import {useGSAP} from "@gsap/react"
import gsap from "gsap";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import ReactPlayer from "react-player";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const UserCourseOverview = () => {
  const [isLoding, setIsLoding] = useState(false);
  const [loadingItems, setLoadingItems] = useState(null);
  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [selectedLesson, setSelectedLesson] = useState("");
  const [video_url, setVideo_url] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [viseo_type, setVideo_type] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
const {contextSafe} = useGSAP();
  const handleLeftToggle = (chapterIndex) => {
    setOpenChapters((prevOpenChapters) => ({
      ...prevOpenChapters,
      [chapterIndex]: !prevOpenChapters[chapterIndex],
    }));
  };

  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} sec`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours} hr ${remainingMinutes} min ${remainingSeconds} sec`;
    }
  }

  const url = `${BASE_URI}/api/v1/courses/courseOverviewWithoutPurchase/${id}`;
  const token = localStorage.getItem("token");
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const courseData = useMemo(() => data?.data || [], [data]);
  console.log(courseData)

  useEffect(() => {
    setVideo_url(
      courseData?.courseChapters?.chapters[0]?.lessons[0]?.video_url
    );
    setVideo_type(
      courseData?.courseChapters?.chapters[0]?.lessons[0]?.video_type
    );
    setVideo_thumb(courseData?.course?.thumbnail);

    setSelectedLesson(
      courseData?.courseChapters?.chapters[0]?.lessons[0]?.lesson_id
    );
  }, [courseData]);

  const chapters = useMemo(
    () => courseData?.courseChapters?.chapters || [],
    [courseData]
  );

  const handleCart = async (course_id, e) => {
    e.stopPropagation();
    setLoadingItems(course_id);
    setIsLoding(true);
    if (!token) {
      setIsLoding(false);
      navigate(`/`);
      return toast.error(`Error: Please Login First!`);
    }
    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/cart`,
        { course_id: course_id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setIsLoding(false);
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
      toast.success(`${response?.data?.message}`);
    } catch (err) {
      setIsLoding(false);
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
      toast.error(`Error: ${err?.response?.data?.message}`);
    }
  };

  const paymentPopUpClick = contextSafe(()=>{
    console.log("popup has been clicked");
    gsap.to(".paymentPopUp", {
      scale:1,
      duration:0.3,
      ease:"back.in"
    })
  })
  const removePayPopUp = contextSafe(()=>{
    console.log("popup has been removed");
    gsap.to(".paymentPopUp", {
      scale:0,
      duration:0.4,
      ease:"back.inOut"
    })
  })

  const handleVideoChange = useCallback((video_url, video_thumb, lesson_id, noLesson) => {
    setVideo_url(video_url);
    setVideo_thumb(video_thumb);
    setSelectedLesson(lesson_id);
  }, []);

  return (
    <>
      {isLoading ? (
        <l-grid
          id="spinner-usercourseview"
          size="60"
          speed="1.5"
          color="black"
        ></l-grid>
      ) : (
        <div className="wrapper-userCourseview position-relative">

<div
    style={{
      top:0,
      left:0,
      scale: 0, // Scale to 1 to show it at full size
      height: "100vh", // Full viewport height
      width: "100vw",  // Full viewport width
      position: "fixed", // Fixed to cover the entire viewport
      zIndex: 100,
      backgroundColor: "transparent", // Ensure background color covers the area
      display: "flex", // Center the content inside
      alignItems: "center",
      justifyContent: "center",
      
    }}
    className="paymentPopUp"
  >
    <div style={{zIndex:101,padding:"2%", backgroundColor:"white", borderRadius:"1rem", height:"60%", width:"50%"
    }}>
      <div className="flex justify-content-between pb-3 align-items-center">
         <span><h5>Unlock this course by</h5></span> 
      <FontAwesomeIcon onClick={removePayPopUp} className="fs-5 cursor-pointer" icon={faXmarkCircle}/>
      </div>
      <div style={{height:"87%"}} className="rounded border flex justify-content-evenly align-items-center">
        <div className="rounded flex flex-column bg-gradient-custom-div justify-content-center gap-5 w-40 p-3">
          <h6>UnLock by Coins <FontAwesomeIcon icon={faCoins}/></h6>
          <div className="flex flex-column gap-2">
          <h2><FontAwesomeIcon icon={faCoins}/> {courseData?.course?.coins}</h2>
          <div className="rounded bg-white text-black p-2 flex justify-content-center cursor-pointer">
            <p>Buy</p>
          </div>
          </div>
        </div>
        <h5>OR</h5>
        <div className="rounded flex flex-column bg-gradient-custom-div justify-content-center gap-5 w-40 p-3">
          <h6>UnLock by payment</h6>
          <div className="flex flex-column gap-2">
          <h2>${courseData?.course?.price}</h2>
          <div className="rounded bg-white text-black p-2 flex justify-content-center cursor-pointer">
            <p>Checkout</p>
          </div>
          </div>    
        </div>
      </div>
     
    </div>
    <div
    style={{
      opacity:0.3,
      zIndex:100,
      top: 0,
      left: 0,
      height: "100vh", // Full viewport height
      width: "100vw",  // Full viewport width
      position: "fixed", // Fixed to cover the entire viewport
      zIndex: 100,
      backgroundColor: "grey", // Ensure background color covers the area
      display: "flex", // Center the content inside
      alignItems: "center",
      justifyContent: "center",
    }}
    >


    </div>
  </div>
          <div className="top-userCourseview d-flex">
            <h3 className="text-uppercase">
              {courseData?.course?.title || "No title available"}
            </h3>

            

                <span className="gap-3 flex align-items-center">
                <div>
                  <span className="d-flex justify-content-between align-items-center p-1">
                    
                  <h5 style={{fontSize:'1.3rem', fontWeight:'bold'}}>
                    
                  <FontAwesomeIcon icon={faCoins}/> {courseData?.course?.coins}
                  </h5></span>
                  <div style={{width:"max-content"}} className="cursor-pointer rounded bg-white d-flex justify-content-between p-2">
                    <p className="text-black">Checkout <FontAwesomeIcon icon={faCoins}/> {courseData?.course?.discounted_price}</p>
                  </div>
                  </div>
                 <p>OR</p>
                  <div>
                  <span className="d-flex justify-content-between align-items-center p-1">
                    <h5 style={{textDecoration:'line-through', fontSize:'1rem'}}>
                      ${courseData?.course?.price || "No price available"}
                      </h5>
                  <h5 style={{fontSize:'1.3rem', fontWeight:'bold'}}>

                    $
                    {courseData?.course?.discounted_price ||
                      "No discount available"}
                  </h5></span>
                  <div style={{width:"max-content"}} className="cursor-pointer bg-white rounded  d-flex justify-content-between p-2">
                    <p className="text-black">Checkout ${courseData?.course?.discounted_price}</p>
                  </div>
                  </div>
                </span>
                

                
            

            {/* <h6
              dangerouslySetInnerHTML={{
                __html: courseData?.course?.description
                  ? courseData.course.description
                      .split(" ")
                      .slice(0, 7)
                      .join(" ") + "..."
                  : "No description available",
              }}
            ></h6>
            <h5>{courseData?.course?.tags || "No tags available"}</h5>
            <h6>
              {courseData?.review?.totalReviews || 0} reviews (
              {courseData?.review?.averageRating || 0}{" "}
              <FontAwesomeIcon icon={faStar} className="staricon" />)
            </h6> */}
          </div>
          <div className="mid-userCourseview">
          <div className="right-mid-userCourseview p-3">
              {/* <VideoPlayer
                videoUrl={video_url}
                videoType={viseo_type}
                className="tumbnail-userCourseview"
              /> */}
               <VideoPlayer
                videoUrl={video_url}
                videoType={viseo_type}
                className="tumbnail-userCourseview"
              />

<div className="left-bottom-mid-userCourseview second-leftuserCourse">
                <h4>Course Lessons</h4>
                <div>
                  {courseData?.courseChapters?.chapters?.length > 0 ? (
                    chapters.map((chapter, chapterIndex) => (
                      <details
                        key={chapter?.chapter_id}
                        open={
                          (chapterIndex === 0 && true) ||
                          openChapters[chapterIndex]
                        }
                        onToggle={() => handleLeftToggle(chapterIndex)}
                      >
                        <summary>
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className={
                              openChapters[chapterIndex]
                                ? "up-icon"
                                : "down-icon"
                            }
                          />
                          <h6>
                            {chapter.chapter_no || "No chapter number"}.{" "}
                            {chapter.chapterTitle || "No chapter title"}
                          </h6>
                        </summary>
                        {chapter?.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              handleVideoChange(
                                lesson?.video_url,
                                lesson?.thumbnail,
                                lesson?.lesson_id
                              )
                            }
                            style={{
                              cursor: "pointer",
                              color:
                                selectedLesson === lesson?.lesson_id && "red",
                            }}
                          >
                            <h6>
                              <FaYoutube
                                color="black"
                                style={{
                                  cursor: "pointer",
                                  color:
                                    selectedLesson === lesson?.lesson_id &&
                                    "red",
                                  transition: "all ease-in-out 0.5s",
                                }}
                              />
                              Lesson {idx + 1}:{" "}
                              {lesson?.lessonTitle || "No lesson title"}
                            </h6>
                            <h6>
                              {formatTime(lesson?.duration) ||
                                "No duration available"}
                            </h6>
                          </div>
                        ))}
                      </details>
                    ))
                  ) : (
                    <div>No chapters found</div>
                  )}
                </div>
              </div>

              
              
              <div className="details-right-mid-userCourseview">
              <span>
              <img 
              src={courseData?.course?.profile_picture} 
              alt="Profile" 
              style={{ width: '8%', height: '8%', borderRadius: '50%' }} 
                />
                  <h6>
                    {courseData?.course?.name}
                  </h6>
                </span>
                
                <span>
                  <h5>Access:</h5>
                  <h6>
                    {courseData?.course?.access || "No access information"}
                  </h6>
                </span>
                <span>
                  <h5>Enrolled:</h5>
                  <h6>{courseData?.course?.total_enrollments || 0}</h6>
                </span>
                <span>
                  <h5>Certification:</h5>
                  <h6>
                    {courseData?.course?.certification
                      ? "Yes"
                      : "No certification available"}
                  </h6>
                </span>
              </div>
              <div className="left-top-mid-userCourseview">
                <h3>Description</h3>
                <div className="description-data"
                  dangerouslySetInnerHTML={{
                    __html:
                      courseData?.course?.description ||
                      "No description available",
                  }}
                ></div>
                <h4 className="cursor-pointer hover-underline">
                  Watch 3 Free Lessons to get insights of what to Learn{" "}
                  <FontAwesomeIcon icon={faArrowRight} />
                </h4>
              </div>
            </div>

            <div className="left-mid-userCourseview">
              
              <div className="left-bottom-mid-userCourseview new-left">
                <h4>Course Lessons</h4>
                <div>
  {courseData?.courseChapters?.chapters?.length > 0 ? (
    chapters.map((chapter, chapterIndex) => (
      <details
        key={chapter?.chapter_id}
        open={
          (chapterIndex === 0 && true) ||
          openChapters[chapterIndex]
        }
        onToggle={() => handleLeftToggle(chapterIndex)}
      >
        <summary>
          <FontAwesomeIcon
            icon={faAngleDown}
            className={
              openChapters[chapterIndex]
                ? "up-icon"
                : "down-icon"
            }
          />
          <h6>
            {chapter.chapter_no || "No chapter number"}.{" "}
            {chapter.chapterTitle || "No chapter title"}
          </h6>
        </summary>
        {chapter?.lessons.map((lesson, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (chapterIndex >= 1) { // Assuming 2nd course has index 1
                paymentPopUpClick();
              } else {
                handleVideoChange(
                  lesson?.video_url,
                  lesson?.thumbnail,
                  lesson?.lesson_id
                );
              }
            }}
            style={{
              cursor: "pointer",
              color:
                selectedLesson === lesson?.lesson_id && "red",
            }}
          >
            <h6>
              <FaYoutube
                color="black"
                style={{
                  cursor: "pointer",
                  color:
                    selectedLesson === lesson?.lesson_id &&
                    "red",
                  transition: "all ease-in-out 0.5s",
                }}
              />
              Lesson {idx + 1}:{" "}
              {lesson?.lessonTitle || "No lesson title"}
            </h6>
            <h6>
              {formatTime(lesson?.duration) ||
                "No duration available"}
            </h6>
          </div>
        ))}
      </details>
    ))
  ) : (
    <div>No chapters found</div>
  )}
</div>

              </div>
              <div className="ratings-right-mid-userCourseview">
                <h5>Reviews & Ratings:</h5>
                <div className="map-ratings-right-mid-userCourseview">
                  {courseData?.review?.userReviews?.length > 0 ? (
                    courseData.review.userReviews.map((review, index) => (
                      <div key={index}>
                        <div>
                          {review?.profile_picture ? (
                            <img
                            loading="lazy"
                              src={review?.profile_picture}
                              alt="profile image"
                            />
                          ) : (
                            <FaUserCircle className="fs-1" />
                          )}
                          <h5>{review?.name || "No name available"}</h5>
                          <p>
                            {review?.review_date
                              ? review?.review_date.split("T")[0]
                              : "No review date"}
                          </p>
                        </div>
                        <div>
                          <span>
                            {[...Array(5)].map((_, i) =>
                              i < review.rating ? (
                                <AiFillStar key={i} className="staricon" />
                              ) : (
                                <AiOutlineStar key={i} className="staricon" />
                              )
                            )}
                          </span>
                          <p>{review.comment || "No comment available"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available!</p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="right-mid-userCourseview"> */}
              {/* <VideoPlayer
                videoUrl={video_url}
                videoType={viseo_type}
                className="tumbnail-userCourseview"
              />

              <div className="pricing-right-mid-userCourseview">
                <span>
                  <h5>${courseData?.course?.price || "No price available"}</h5>
                  <h5>
                    $
                    {courseData?.course?.discounted_price ||
                      "No discount available"}
                  </h5>
                </span>

                <div onClick={(e) => handleCart(id, e)}>
                  {isLoding ? (
                    <l-bouncy size="35" speed="1.2" color="white"></l-bouncy>
                  ) : (
                    "Add to Cart"
                  )}
                </div>
              </div>
              <div className="details-right-mid-userCourseview">
                <span>
                  <h5>Access:</h5>
                  <h6>
                    {courseData?.course?.access || "No access information"}
                  </h6>
                </span>
                <span>
                  <h5>Enrolled:</h5>
                  <h6>{courseData?.course?.total_enrollments || 0}</h6>
                </span>
                <span>
                  <h5>Certification:</h5>
                  <h6>
                    {courseData?.course?.certification
                      ? "Yes"
                      : "No certification available"}
                  </h6>
                </span>
              </div>
              */}
               
            {/* </div> */}
          </div>
          <div className="bottom-userCourseview">
            <h3>Other Courses You Might Like</h3>
            <div className="cards-userCourseview">
              {courseData?.other_courses?.length > 0 ? (
                courseData.other_courses.map((course, index) => (
                  <div
                    onClick={() =>
                      course?.is_purchased
                        ? navigate(`/userPurchasedCourses/${course?.id}`)
                        : course?.is_in_cart
                        ? navigate("/userCart")
                        : navigate(`/userCourses/userCourseView/${course?.id}`)
                    }
                    className="card-bottom-userCourseview"
                    key={index}
                  >
                    <span>
                      {" "}
                      <img
                        src={course?.thumbnail || cardImage}
                        alt="Course image"
                      />
                    </span>

                    <div className="middle-sec-card-userCourseview">
                      <div className="addCourse-card-userCourseview">
                        <h6>
                          {course?.category || "No title available"}
                        </h6>
                      </div>
                      <div className="pricing-card-userCourseview">
                        <h5>{course?.tags?.split(" ").slice(0, 2).join(" ") + "..." || "No tags available"}</h5>
                        {/* <h5>$10.99</h5> */}
                      </div>
                    </div>
                    <p >{course?.name}</p>
                    <h5 >{course?.title}</h5>
                    
                    <div className="bottom-card-useruserCourseview">
                      <span>
                        <h5>${course?.price}</h5>
                        <h5>${course?.discounted_price}</h5>
                      </span>
                      <div
                        onClick={(e) =>
                          course?.is_purchased
                            ? navigate(`/userPurchasedCourses/${course?.id}`)
                            :  navigate(`/userCourses/userPurchasedCourse/${course?.id}`)
                           
                        }
                      >
                        {loadingItems === course?.id ? (
                          <l-bouncy
                            size="35"
                            speed="1.2"
                            color="white"
                          ></l-bouncy>
                        ) : course?.is_purchased ? (
                          <h6>Purchased!</h6>
                        ) : (
                          <h6>Go to courses</h6>
                        )}
                      </div>
                      {/* <div onClick={() => handleCart(course?.id)}>{loadingItems[course?.id] ? <PulseLoader size={8} color="white"/> :<h6> Add to Cart </h6>}</div> */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No other courses available!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCourseOverview;