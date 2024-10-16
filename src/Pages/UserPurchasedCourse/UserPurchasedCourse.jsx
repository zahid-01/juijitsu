import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../UserCourseOverview/UserCourseOverview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faAngleDown,
  faArrowRight,
  faCoins,
  faPencil,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FaStar, FaYoutube } from "react-icons/fa";
import cardImage from "../../assets/coursesCard.png";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import "ldrs/grid";
import "ldrs/bouncy";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import ReactPlayer from "react-player";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PubCwDq08j41MMz9w7CFKlaPOPT4YlfciU9GCgXcxBmve17go3ryZQKVBcQJ3pzW86Z1mDb1bLTnkXFiTZKBu8O00CGdw624j"
);

const UserPurchasedCourse = () => {
  const [loadingItems, setLoadingItems] = useState(null);
  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [verificationPopUp, setVerificationPopUp] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [video_url, setVideo_url] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [viseo_type, setVideo_type] = useState("");
  const [is_rated, setIs_rated] = useState(false);
  const [editRatingPopUp, setEditRatingPopUp] = useState(false);
  const [addRatingPopUp, setAddRatingPopUp] = useState(false);
  const [review, setReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [optionsPopUp, setOptionsPopUp] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [hearted, setHearted] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextSafe } = useGSAP();

  


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

  const url = `${BASE_URI}/api/v1/courses/usersCourseOverview/${id}`;
  const token = localStorage.getItem("token");
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const courseData = useMemo(() => data?.data || [], [data]);
 console.log(data?.data);
  useEffect(() => {
    setIs_rated(data?.data?.course?.is_rated);
    setHearted(courseData?.course?.is_favourite);
    if (courseData?.course?.is_rated) {
      setSelectedRating(courseData?.course?.rating);
      setReview(courseData?.course?.comment);
    }
  
  }, [data]);
 

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
  const paymentPopUpClick = contextSafe(() => {
    console.log("popup has been clicked");
    gsap.to(".paymentPopUp", {
      scale: 1,
      duration: 0.3,
      ease: "back.in",
    });
  });
  const removePayPopUp = contextSafe(() => {
    console.log("popup has been removed");
    gsap.to(".paymentPopUp", {
      scale: 0,
      duration: 0.4,
      ease: "back.inOut",
    });
  });

  const handleVideoChange = useCallback(
    (video_url, video_thumb, lesson_id, noLesson) => {
      setVideo_url(video_url);
      setVideo_thumb(video_thumb);
      setSelectedLesson(lesson_id);
    },
    []
  );

  const handleCoinCheckout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/payment/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setVerificationPopUp(false);
      toast.success(`${response?.data?.message}`);
    } catch (err) {
      setVerificationPopUp(false);
      toast.error(`Error: ${err?.response?.data?.message}`);
    }
  };

  const checkoutHandler = async () => {
    try {
      const stripe = await stripePromise;
      // Fetch the session from your backend
      // const session = await axios(`http://localhost:3000/api/v1/payment`);
      const session = await axios(`${BASE_URI}/api/v1/payment/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  };

    const handleEditClick = async (e) => {
    e.stopPropagation();
    setOptionsPopUp(false);
    setEditRatingPopUp(true);
  };
  const handleAddRatingClick = (e) => {
    e.stopPropagation();
    setOptionsPopUp(false);
    setAddRatingPopUp(true);
  };
  const handleRating = (value) => {
    setSelectedRating(value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedRating, review, id);
    try {
      const url = `${BASE_URI}/api/v1/reviews`;
      const response = await axios({
        method: "POST",
        url,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          comment: review,
          rating: selectedRating,
          courseId: id,
        },
      });
      toast.success("Rating Added successfully");
      setReview("");
      setSelectedRating(0);
      setIs_rated(true)
      setAddRatingPopUp(false);
      setReviewsLoading(false);
      refetch();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const updateRating = async () => {
    try {
      const url = `${BASE_URI}/api/v1/reviews/${courseData?.course?.review_id}`;
      const response = await axios({
        method: "PATCH",
        url,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          rating: selectedRating,
          comment: review,
        },
      });
      toast.success("Rating updated successfully");
      // setReviewData(response?.data);
      setEditRatingPopUp(false);
      refetch();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const deleteRating = async () => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BASE_URI}/api/v1/reviews/${courseData?.course?.review_id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setEditRatingPopUp(false);
      setIs_rated(false);
      setReview(null);
      setSelectedRating(null);
      // setIs_rated(false)
      refetch();
      toast.success("Rating deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

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
               {optionsPopUp && (
            <div
              onClick={() => setOptionsPopUp(false)}
              className="rating-popup d-flex justify-content-center align-items-center"
            >
              <div
                className="flex-column gap-2 shadow-lg bg-white rounded"
                onClick={(e) => e.stopPropagation()} // Prevents the outer div from being triggered
              >
                <span
                  onClick={() => handleAddToFavClick()}
                  className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
                >
                  <FontAwesomeIcon
                    style={{ color: "yellow", cursor: "pointer" }}
                    icon={faStar}
                  />
                  <p>Add to favorites</p>
                </span>
                {is_rated ? (
                  <span
                    onClick={handleEditClick}
                    className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    <p>Edit Your Rating</p>
                  </span>
                ) : (
                  <span
                    onClick={handleAddRatingClick}
                    className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    <p>Add Rating</p>
                  </span>
                )}

                <span className="cursor-pointer d-flex w-100 gap-4 align-items-center p-2">
                  <FontAwesomeIcon icon={faCircleInfo} />
                  <p className="fs-6 fw-2">Not refundable!</p>
                </span>
              </div>
            </div>
          )}

          {addRatingPopUp && (
            <div className="rating-popup d-flex justify-content-center align-items-center">
              <div className="card p-4 shadow-lg bg-white rounded">
                <h5>Add Your Rating</h5>
                <div className="star-rating mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${
                        selectedRating >= star ? "text-warning" : ""
                      }`}
                      onClick={() => handleRating(star)}
                      style={{ cursor: "pointer", fontSize: "2rem" }}
                    />
                  ))}
                </div>
                <div className="mb-3">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add Your Review"
                    className="form-control"
                    rows={4}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setAddRatingPopUp(false)}
                  >
                    Discard
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleReviewSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {editRatingPopUp && (
            <div className="rating-popup d-flex justify-content-center align-items-center">
              <div className="card p-4 shadow-lg bg-white rounded">
                <h5>Add Your Rating</h5>
                <div className="star-rating mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${
                        selectedRating >= star ? "text-warning" : ""
                      }`}
                      onClick={() => handleRating(star)}
                      style={{ cursor: "pointer", fontSize: "2rem" }}
                    />
                  ))}
                </div>
                <div className="mb-3">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add Your Review"
                    className="form-control"
                    rows={4}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={deleteRating}>
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditRatingPopUp(false)}
                  >
                    Discard
                  </button>
                  <button className="btn btn-primary" onClick={updateRating}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {verificationPopUp && (
            <div className="popup ">
              <div className="popup-content-review">
                <div className="popup-buttons-review">
                  <h5
                    style={{
                      maxHeight: "12rem",
                      border: "1px solid grey",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    Are You Sure to buy this course!
                  </h5>
                  <button
                    onClick={() => setVerificationPopUp(false)}
                    className="cancel-button-review"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCoinCheckout}
                    className="continue-button-review"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              top: 0,
              left: 0,
              scale: 0, // Scale to 1 to show it at full size
              height: "100vh", // Full viewport height
              width: "100vw", // Full viewport width
              position: "fixed", // Fixed to cover the entire viewport
              zIndex: 100,
              backgroundColor: "transparent", // Ensure background color covers the area
              display: "flex", // Center the content inside
              alignItems: "center",
              justifyContent: "center",
            }}
            className="paymentPopUp"
          >
            <div
              style={{
                zIndex: 101,
                padding: "2%",
                backgroundColor: "white",
                borderRadius: "1rem",
                height: "60%",
                width: "50%",
              }}
            >
              <div className="flex justify-content-between pb-3 align-items-center">
                <span>
                  <h5>Unlock this course by</h5>
                </span>
                <FontAwesomeIcon
                  onClick={removePayPopUp}
                  className="fs-5 cursor-pointer"
                  icon={faXmarkCircle}
                />
              </div>
              <div
                style={{ height: "87%" }}
                className="rounded border flex justify-content-evenly align-items-center"
              >
                <div className="rounded flex flex-column bg-gradient-custom-div justify-content-center gap-5 w-40 p-3">
                  <h6>
                    UnLock by Coins <FontAwesomeIcon icon={faCoins} />
                  </h6>
                  <div className="flex flex-column gap-2">
                    <h2>
                      <FontAwesomeIcon icon={faCoins} />{" "}
                      {courseData?.course?.coins}
                    </h2>
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
                opacity: 0.3,
                zIndex: 100,
                top: 0,
                left: 0,
                height: "100vh", // Full viewport height
                width: "100vw", // Full viewport width
                position: "fixed", // Fixed to cover the entire viewport
                zIndex: 100,
                backgroundColor: "grey", // Ensure background color covers the area
                display: "flex", // Center the content inside
                alignItems: "center",
                justifyContent: "center",
              }}
            ></div>
          </div>
          <div className="top-userCourseview d-flex">
            <h3 className="text-uppercase">
              {courseData?.course?.title || "No title available"}
            </h3>

            {is_rated ? (
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={handleEditClick}
                  icon={faPencil}
                />
              ) : (
                <>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={handleAddRatingClick}
                  icon={faPlus}
                />
                </>
              )}

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

              <div className="details-right-mid-userCourseview">
                <span>
                  <img
                    src={courseData?.course?.profile_picture}
                    alt="Profile"
                    style={{ width: "8%", height: "8%", borderRadius: "50%" }}
                  />
                  <h6>{courseData?.course?.name}</h6>
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
                <div
                  className="description-data"
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
          </div>
          {/* <div className="bottom-userCourseview">
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
                        <h6>{course?.category || "No title available"}</h6>
                      </div>
                      <div className="pricing-card-userCourseview">
                        <h5>
                          {course?.tags?.split(" ").slice(0, 2).join(" ") +
                            "..." || "No tags available"}
                        </h5>
                       
                      </div>
                    </div>
                    <p>{course?.name}</p>
                    <h5>{course?.title}</h5>

                    <div className="bottom-card-useruserCourseview">
                      <span>
                        <h5>${course?.price}</h5>
                        <h5>${course?.discounted_price}</h5>
                      </span>
                      <div
                        onClick={(e) =>
                          course?.is_purchased
                            ? navigate(`/userPurchasedCourses/${course?.id}`)
                            : navigate(
                                `/userCourses/userPurchasedCourse/${course?.id}`
                              )
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
                     
                    </div>
                  </div>
                ))
              ) : (
                <p>No other courses available!</p>
              )}
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default UserPurchasedCourse;





// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import "./UserPurchasedCourse.css";
// import videoPlayer from "../../assets/videoPlayer.png";
// import profile from "../../assets/profile.png";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faAngleDown,
//   faStar,
//   faEllipsisVertical,
//   faChevronLeft,
//   faChevronRight,
//   faPencil,
//   faCircleInfo,
//   faHeart,
//   faEdit,
//   faPlus,
// } from "@fortawesome/free-solid-svg-icons";
// import { useParams } from "react-router-dom";
// import useFetch from "../../hooks/useFetch";
// import { BASE_URI } from "../../Config/url";
// import { SyncLoader } from "react-spinners";
// import { BsTwitterX } from "react-icons/bs";
// import twitter from "../../assets/Vector.svg";
// import youtube from "../../assets/Vector (1).svg";
// import chain from "../../assets/Vector (2).svg";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import "ldrs/grid";
// import axios from "axios";
// import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
// import ReactPlayer from "react-player";
// import { FaUserCircle, FaStar } from "react-icons/fa";
// import { AiFillStar, AiOutlineStar } from "react-icons/ai";
// import toast from "react-hot-toast";
// import { CiHeart } from "react-icons/ci";
// // import { bouncy } from "ldrs";

// const UserPurchasedCourse = () => {
//   const { id } = useParams();
//   // console.log(id);
//   const [buttonPick, setButtonPick] = useState("Overview");
//   const [videosResponsive, setVideosResponsive] = useState(true);
//   const [openDetails, setOpenDetails] = useState({});
//   const [openChapters, setOpenChapters] = useState({ 0: true });
//   const [video_url, setVideo_url] = useState("");
//   const [video_thumb, setVideo_thumb] = useState("");
//   const [selectedLesson, setSelectedLesson] = useState("");
//   const [reviewData, setReviewData] = useState(null);
//   const [show, setShow] = useState(false);
//   const [isEnter, setIsEnter] = useState(false);
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [video_type, setVideo_type] = useState("");
//   const [optionsPopUp, setOptionsPopUp] = useState(false);
//   const [is_rated, setIs_rated] = useState(false);
//   const [editRatingPopUp, setEditRatingPopUp] = useState(false);
//   const [addRatingPopUp, setAddRatingPopUp] = useState(false);
//   const [review, setReview] = useState("");
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [certificate, setcertificate] = useState(null);
//   const navigate = useNavigate();
//   const [hearted, setHearted] = useState(null);
//   const handleMouseEnter = () => {
//     setShow(true);
//     setIsEnter(true);
//   };

//   const handleMouseLeave = () => {
//     setShow(false);
//   };

//   function formatTime(seconds) {
//     if (seconds < 60) {
//       return `${seconds} sec`;
//     } else if (seconds < 3600) {
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
//       return `${minutes} min ${remainingSeconds} sec`;
//     } else {
//       const hours = Math.floor(seconds / 3600);
//       const remainingMinutes = Math.floor((seconds % 3600) / 60);
//       const remainingSeconds = seconds % 60;
//       return `${hours} hr ${remainingMinutes} min ${remainingSeconds} sec`;
//     }
//   }

//   const handleButtonToggle = async (event) => {
//     const text = event.currentTarget.querySelector("h5").textContent;
//     setButtonPick(text);

//     if (text === "Reviews") {
//       setReviewsLoading(true);
//       try {
//         const url = `${BASE_URI}/api/v1/reviews/totalReview/${id}`;
//         const response = await axios({
//           method: "GET",
//           url,
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         });
//         // const reviews = useMemo(() => response?.data?.data || [], [response?.data?.data]);
//         setReviewData(response.data);
//         console.log(reviewData.data);
//         setReviewsLoading(false);
//       } catch (error) {
//         console.error(error);
//         setReviewsLoading(false);
//       }
//     }
//   };

//   const handleLeftToggle = (chapterIndex) => {
//     // console.log(chapterIndex);
//     setOpenChapters((prevOpenChapters) => ({
//       ...prevOpenChapters,
//       [chapterIndex]: !prevOpenChapters[chapterIndex],
//     }));
//   };

//   // const handleLeftToggle = (index) => {
//   //   setOpenDetailsLeft((prevState) => ({
//   //     ...prevState,
//   //     [index]: !prevState[index],
//   //   }));
//   // };

//   const url = `${BASE_URI}/api/v1/courses/usersCourseOverview/${id}`;
//   const token = localStorage.getItem("token");

//   const { data, isLoading, error, refetch } = useFetch(url, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   });
//   //  setData(data.data[0]);
//   //  console.log(data);
//   const courseData = useMemo(() => data?.data || [], [data]);
//   console.log(courseData);

//   useEffect(() => {
//     setIs_rated(courseData?.course?.is_rated);
//     setHearted(courseData?.course?.is_favourite);
//     if (courseData?.course?.is_rated) {
//       setSelectedRating(courseData?.course?.rating);

//       setReview(courseData?.course?.comment);
//     }
//   }, [courseData]);

//   const percentage =
//     (courseData?.course?.lessons_completed /
//       courseData?.course?.total_lessons) *
//     100;
//   // console.log(percentage);
//   // const convertSecondsToMinutes = (totalSeconds) => {
//   //   const minutes = Math.floor(totalSeconds / 60);
//   //   const seconds = totalSeconds % 60;
//   //   return `${minutes}m ${seconds}s`;
//   // };

//   useEffect(() => {
//     // setShow(false)
//     setVideo_url(
//       courseData?.courseChapters?.chapters[0]?.lessons[0]?.video_url
//     );
//     setVideo_type(
//       courseData?.courseChapters?.chapters[0]?.lessons[0]?.video_type
//     );
//     setVideo_thumb(courseData?.course?.thumbnail);

//     setSelectedLesson(
//       courseData?.courseChapters?.chapters[0]?.lessons[0]?.lesson_id
//     );
//     // console.log(video_thumb);
//   }, [courseData]);

//   // console.log(courseData);

//   const handleVideoChange = (video_url, video_thumb, lesson_id) => {
//     setVideo_url(video_url);
//     setVideo_thumb(video_thumb);
//     setSelectedLesson(lesson_id);
//     // refetch();
//   };
//   // console.log(show)

//   const checkedLesson = async ({ chapter_id, lesson_id }) => {
//     const checkResponse = await axios({
//       method: "PATCH",
//       url: `${BASE_URI}/api/v1/lessons/markLessonAsRead`,
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//       data: {
//         course_id: id,
//         lesson_id: lesson_id,
//       },
//     });

//     // window.location.reload();
//     // console.log(checkResponse?.data )
//   };

//   const handleEditClick = async (e) => {
//     e.stopPropagation();
//     setOptionsPopUp(false);
//     setEditRatingPopUp(true);
//   };
//   const handleAddRatingClick = (e) => {
//     e.stopPropagation();
//     setOptionsPopUp(false);
//     setAddRatingPopUp(true);
//   };
//   const handleRating = (value) => {
//     setSelectedRating(value);
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();

//     console.log(selectedRating, review, id);
//     try {
//       const url = `${BASE_URI}/api/v1/reviews`;
//       const response = await axios({
//         method: "POST",
//         url,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//         data: {
//           comment: review,
//           rating: selectedRating,
//           courseId: id,
//         },
//       });
//       toast.success("Rating Added successfully");
//       setReview("");
//       setSelectedRating(0);
//       setAddRatingPopUp(false);
//       setReviewsLoading(false);
//       refetch();
//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.error(error);
//     }
//   };

//   const updateRating = async () => {
//     try {
//       const url = `${BASE_URI}/api/v1/reviews/${courseData?.course?.review_id}`;
//       const response = await axios({
//         method: "PATCH",
//         url,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//         data: {
//           rating: selectedRating,
//           comment: review,
//         },
//       });
//       toast.success("Rating updated successfully");
//       setReviewData(response.data);
//       setEditRatingPopUp(false);
//       refetch();
//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.error(error);
//     }
//   };

//   const deleteRating = async () => {
//     try {
//       const response = await axios({
//         method: "DELETE",
//         url: `${BASE_URI}/api/v1/reviews/${courseData?.course?.review_id}`,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });
//       setEditRatingPopUp(false);
//       setIs_rated(false);
//       setReview(null);
//       setSelectedRating(null);
//       toast.success("Rating deleted successfully");
//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.error(error);
//     }
//   };
//   const handlePrint = async (id) => {
//     try {
//       const url = `${BASE_URI}/api/v1/users/certificates/${id}`;
//       const response = await axios({
//         method: "GET",
//         url,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });
//       setcertificate(response?.data?.data);
//       console.log(response?.data?.data);
//     } catch (error) {
//       toast.error(
//         "Certificate cant be generated as the course is not completed yet!."
//       );
//       // alert("No certificate found for the provided ID.");
//     }

//     const printContent = `
//     <html>
//     <head>
//    <link rel="stylesheet" type="text/css" href="/src/Pages/UserPurchasedCourse/UserPurchasedCourse.css">
//     </head>
//     <body>
//     <div class="certificate">
//       <div class="certificate-container">
//         <div>
//           <div class="certificate-number">Certificate no: <strong> ${
//             certificate.certificate_id
//           }</strong></div>
//           <div class="firstHeader" >jiujitsux</div>
//         </div>
//         <div class="header">Certificate of Completion</div>
//         <div class="title">${certificate.title}</div>
//         <div class="instructors">Instructors: <strong>${
//           certificate.expert_name
//         }</strong></div>
//         <div class="description">
//           This certificate above verifies that <strong>${
//             certificate.user
//           }</strong> successfully completed the course ${
//       certificate.title
//     } on 11/09/2024 as taught by <strong>${
//       certificate.expert_name
//     }</strong> on Juijitsux. The certificate indicates the entire course was completed as validated by the student. The course duration represents the total video hours of the course at time of most recent completion.
//         </div>
//         <div class="signature"><strong>${certificate.expert_name}</strong></div>
//         <div class="date"> Date: <strong>${new Date(
//           certificate.created_at
//         ).toLocaleDateString("en-GB")}</strong></div>
//         <div class="length">Length: <strong>
//           ${Math.floor(certificate.total_duration / 3600)} hours 
//           ${Math.floor((certificate.total_duration % 3600) / 60)} minutes
//         </strong></div>
//         <div class="watermark">Jiujitsux</div>
//       </div>
//     </div>
//     </body>
//     </html>
//   `;

//     const newWindow = window.open("", "_blank", "width=600,height=400");
//     newWindow.document.open();
//     newWindow.document.write(printContent);
//     newWindow.document.close();
//     newWindow.focus(); // Ensure the new window is focused before printing
//     newWindow.print();
//   };

//   const handleFavrouite = async (e) => {
//     e.stopPropagation();
//     if (!token) {
//       navigate("/");
//     }
//     try {
//       setHearted(!hearted);
//       await axios({
//         method: "post",
//         url: `${BASE_URI}/api/v1/courses/favouriteCourse/${id}`,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to add to favorites");
//     }
//   };
//   // console.log(courseData?.review?.userReviews)
//   return (
//     <>
//       {/* {error2?.response?.data?.message === "No courses found" ? (
//         <h1>No courses found</h1> */}
//       {/* ) : */}
//       {isLoading ? (
//         <l-grid
//           id="spinner-usercourseview"
//           size="60"
//           speed="1.5"
//           color="black"
//         ></l-grid>
//       ) : (
//         <div className="wrapper-purchasedCourse">
//           {optionsPopUp && (
//             <div
//               onClick={() => setOptionsPopUp(false)}
//               className="rating-popup d-flex justify-content-center align-items-center"
//             >
//               <div
//                 className="flex-column gap-2 shadow-lg bg-white rounded"
//                 onClick={(e) => e.stopPropagation()} // Prevents the outer div from being triggered
//               >
//                 <span
//                   onClick={() => handleAddToFavClick()}
//                   className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
//                 >
//                   <FontAwesomeIcon
//                     style={{ color: "yellow", cursor: "pointer" }}
//                     icon={faStar}
//                   />
//                   <p>Add to favorites</p>
//                 </span>
//                 {is_rated ? (
//                   <span
//                     onClick={handleEditClick}
//                     className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
//                   >
//                     <FontAwesomeIcon icon={faPencil} />
//                     <p>Edit Your Rating</p>
//                   </span>
//                 ) : (
//                   <span
//                     onClick={handleAddRatingClick}
//                     className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
//                   >
//                     <FontAwesomeIcon icon={faPencil} />
//                     <p>Add Rating</p>
//                   </span>
//                 )}

//                 <span className="cursor-pointer d-flex w-100 gap-4 align-items-center p-2">
//                   <FontAwesomeIcon icon={faCircleInfo} />
//                   <p className="fs-6 fw-2">Not refundable!</p>
//                 </span>
//               </div>
//             </div>
//           )}

//           {addRatingPopUp && (
//             <div className="rating-popup d-flex justify-content-center align-items-center">
//               <div className="card p-4 shadow-lg bg-white rounded">
//                 <h5>Add Your Rating</h5>
//                 <div className="star-rating mb-3">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <FaStar
//                       key={star}
//                       className={`star ${
//                         selectedRating >= star ? "text-warning" : ""
//                       }`}
//                       onClick={() => handleRating(star)}
//                       style={{ cursor: "pointer", fontSize: "2rem" }}
//                     />
//                   ))}
//                 </div>
//                 <div className="mb-3">
//                   <textarea
//                     value={review}
//                     onChange={(e) => setReview(e.target.value)}
//                     placeholder="Add Your Review"
//                     className="form-control"
//                     rows={4}
//                   />
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <button
//                     className="btn btn-secondary"
//                     onClick={() => setAddRatingPopUp(false)}
//                   >
//                     Discard
//                   </button>
//                   <button
//                     className="btn btn-primary"
//                     onClick={handleReviewSubmit}
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {editRatingPopUp && (
//             <div className="rating-popup d-flex justify-content-center align-items-center">
//               <div className="card p-4 shadow-lg bg-white rounded">
//                 <h5>Add Your Rating</h5>
//                 <div className="star-rating mb-3">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <FaStar
//                       key={star}
//                       className={`star ${
//                         selectedRating >= star ? "text-warning" : ""
//                       }`}
//                       onClick={() => handleRating(star)}
//                       style={{ cursor: "pointer", fontSize: "2rem" }}
//                     />
//                   ))}
//                 </div>
//                 <div className="mb-3">
//                   <textarea
//                     value={review}
//                     onChange={(e) => setReview(e.target.value)}
//                     placeholder="Add Your Review"
//                     className="form-control"
//                     rows={4}
//                   />
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <button className="btn btn-danger" onClick={deleteRating}>
//                     Delete
//                   </button>
//                   <button
//                     className="btn btn-secondary"
//                     onClick={() => setEditRatingPopUp(false)}
//                   >
//                     Discard
//                   </button>
//                   <button className="btn btn-primary" onClick={updateRating}>
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div className="top-purchasedCourse">
//             <h4>Course Overview</h4>
//             <span
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 position: "relative",
//                 transition: "all 0.5s ease-in-out",
//               }}
//             >
//               <div
//                 className={`hover-div-purchased-course ${
//                   show ? "show" : isEnter && "hide"
//                 }`}
//                 style={{
//                   transition: "all 0.5s ease-in-out",
//                   width: "70%",
//                   height: "150%",
//                   position: "absolute",
//                   top: "-180%",
//                   left: "-10%",
//                   background: "white",
//                   // backgroundColor: 'white',
//                   border: "1px solid black",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   color: "black",
//                   flexDirection: "column",
//                 }}
//               >
//                 <p style={{ fontWeight: "700" }}>
//                   {courseData?.course?.lessons_completed} of{" "}
//                   {courseData?.course?.total_lessons} completed
//                 </p>
//                 <p style={{ fontWeight: "400", fontSize: "0.8vw" }}>
//                   Complete all lessons to get certificate
//                 </p>
//               </div>
//               <div
//                 style={{ transition: "all 0.5s ease-in-out" }}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 {/* {show && ( */}

//                 {/* )} */}
//                 <div
//                   style={{
//                     width: 22,
//                     height: 22,
//                     backgroundColor: "transparent",
//                   }}
//                 >
//                   <CircularProgressbar
//                     styles={buildStyles({
//                       textSize: "2rem",
//                       pathTransitionDuration: 0.5,
//                       pathColor: `#00000)`,
//                       textColor: "#fff",
//                       trailColor: "#fff",
//                     })}
//                     value={percentage}
//                     text={`${Math.floor(percentage)}%`}
//                   />
//                 </div>

//                 <h6>Your Progress</h6>
//               </div>
//               {/* <FontAwesomeIcon
//                 onClick={() => setOptionsPopUp(true)}
//                 icon={faEllipsisVertical}
//                 style={{ height: "100%", width: "2.5%", cursor: "pointer" }}
//               /> */}
//               {hearted ? (
//                 <FontAwesomeIcon
//                   onClick={handleFavrouite}
//                   id="heart-PurchasedCourses"
//                   icon={faHeart}
//                   style={{ zIndex: "10" }}
//                 />
//               ) : (
//                 <CiHeart
//                   style={{ zIndex: "10", color: "black" }}
//                   onClick={handleFavrouite}
//                   id="unHeart-PurchasedCourses"
//                 />
//               )}
//               {is_rated ? (
//                 <FontAwesomeIcon
//                   className="cursor-pointer"
//                   onClick={handleEditClick}
//                   icon={faPencil}
//                 />
//               ) : (
//                 <FontAwesomeIcon
//                   className="cursor-pointer"
//                   onClick={handleAddRatingClick}
//                   icon={faPlus}
//                 />
//               )}
//             </span>
//           </div>
//           <div className="content-container-purchasedCourse">
//             <div className="left-bottom-purchasedCourse">
//               <div className="video-container-purchasedCourse">
//                 {video_type === "youtube" ? (
//                   <ReactPlayer
//                     url={video_url}
//                     className="tumbnail-purchasedCourse"
//                     style={{ width: "100%" }}
//                     controls={true}
//                   />
//                 ) : (
//                   <video
//                     src={video_url}
//                     className="tumbnail-userCourseview"
//                     style={{ width: "100% !important" }}
//                     controls
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                 )}
//                 {/* <video 
//       src={video_url} 
//       controls 
//       muted 
//       loop 
//       poster={video_thumb}
//       preload="auto"
//     >
//       Your browser does not support the video tag.
//     </video> */}
//               </div>
//               <span>
//                 <h4 className="text-uppercase">
//                   {courseData?.course?.title} :
//                 </h4>
//                 <h6
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       courseData?.course?.description
//                         ?.split(" ")
//                         .slice(0, 9)
//                         .join(" ") + "...",
//                   }}
//                 ></h6>
//               </span>
//               <div
//                 className="videoCreator-purchasedCourse"
                
//                 onClick={() => {
//                   navigate(`/UserProfile/${courseData?.course?.expert_id}`);
//                 }}
//               >
//                 <img src={profile} alt="profile" />
//                 <h6 className="text-uppercase">{courseData?.course?.name}</h6>
//               </div>
//               <div className="buttons-purchasedCourse">
//                 <div className="buttons-holder">
//                   {
//                     <div
//                       className={
//                         buttonPick === "Overview"
//                           ? "button-triangle"
//                           : "no-button-triangle"
//                       }
//                     ></div>
//                   }
//                   <div
//                     onClick={handleButtonToggle}
//                     className={
//                       buttonPick === "Overview"
//                         ? "button-purchasedCourse"
//                         : "not-button-purchasedCourse"
//                     }
//                   >
//                     <h5>Overview</h5>
//                   </div>
//                 </div>
//                 <div className="buttons-holder">
//                   {
//                     <div
//                       className={
//                         buttonPick === "FAQ"
//                           ? "button-triangle"
//                           : "no-button-triangle"
//                       }
//                     ></div>
//                   }
//                   <div
//                     onClick={handleButtonToggle}
//                     className={
//                       buttonPick === "FAQ"
//                         ? "button-purchasedCourse"
//                         : "not-button-purchasedCourse"
//                     }
//                   >
//                     <h5>FAQ</h5>
//                   </div>
//                 </div>
//                 <div className="buttons-holder">
//                   {
//                     <div
//                       className={
//                         buttonPick === "Reviews"
//                           ? "button-triangle"
//                           : "no-button-triangle"
//                       }
//                     ></div>
//                   }
//                   <div
//                     onClick={handleButtonToggle}
//                     className={
//                       buttonPick === "Reviews"
//                         ? "button-purchasedCourse"
//                         : "not-button-purchasedCourse"
//                     }
//                   >
//                     <h5>Reviews</h5>
//                   </div>
//                 </div>
//                 <div className="line-purchasedCourse"></div>
//               </div>
//               <div className="course-details-purchasedCourse">
//                 {buttonPick === "Overview" && (
//                   <>
//                     <span>
//                       <h5>Rating:</h5>
//                       <h6>{courseData?.review?.averageRating} out of 5</h6>
//                     </span>

//                     <span>
//                       <h6>{courseData?.review?.totalReviews}</h6>
//                       <h5>Ratings</h5>
//                     </span>
//                     <span>
//                       <h5>{courseData?.course?.enrolled} Students</h5>
//                     </span>
//                     <span>
//                       <h6>{formatTime(courseData?.course?.total_duration)}</h6>
//                       <h5>Total</h5>
//                     </span>

//                     <div className="certificate-purchasedCourse">
//                       <h6>
//                         Get Jiujitsux Certificate by completing the entire
//                         course
//                       </h6>
//                       <div>
//                         <button
//                           className="signup-now  fw-lightBold fs-small mb-0 h-auto"
//                           onClick={() => handlePrint(courseData?.course?.id)}
//                         >
//                           Certificate
//                         </button>
//                       </div>
//                     </div>
//                     <div className="discription-purchasedCourse">
//                       <h5>Discription</h5>
//                       <h6
//                         dangerouslySetInnerHTML={{
//                           __html: courseData?.course?.description,
//                         }}
//                       ></h6>
//                     </div>
//                     <div
//                       style={{
//                         backgroundColor: "transparent",
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "1vh",
//                       }}
//                     >
//                       <h6 style={{ fontWeight: 500 }}>Expert</h6>
//                       <span style={{ display: "flex", gap: "1vw" }}>
//                         <img
//                           src={courseData?.course?.profile_picture || profile}
//                           alt="profile"
//                           style={{
//                             objectFit: "cover",
//                             height: "2.5vw",
//                             width: "2.5vw",
//                             borderRadius: "100%",
//                           }}
//                         />{" "}
//                         <h6 className="text-uppercase">
//                           {courseData?.course?.name}
//                         </h6>
//                       </span>
//                       <span style={{ display: "flex", gap: "0.5vw" }}>
//                         <div
//                           style={{
//                             backgroundColor: "#0C243C",
//                             padding: "0 2% 0.7% 2%",
//                             borderRadius: "0.5vw",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <img src={twitter} alt="" />
//                         </div>
//                         <div
//                           style={{
//                             backgroundColor: "#0C243C",
//                             padding: "0 2% 0.7% 2%",
//                             borderRadius: "0.5vw",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <img src={youtube} alt="" />
//                         </div>
//                         <div
//                           style={{
//                             backgroundColor: "#0C243C",
//                             padding: "0 2% 0.7% 2%",
//                             borderRadius: "0.5vw",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <img src={chain} alt="" />
//                         </div>
//                       </span>
//                       <div>
//                         <h6 style={{ marginTop: "1vh" }}>
//                           {courseData?.course?.bio || "No Bio Avaliable"}
//                         </h6>
//                       </div>
//                     </div>
//                   </>
//                 )}
//                 {buttonPick === "FAQ" && (
//                   <>
//                     {[0, 1, 2].map((index) => (
//                       <details
//                         key={index}
//                         open={!!openDetails[index]}
//                         onToggle={() => handleToggle(index)}
//                       >
//                         <summary>
//                           <FontAwesomeIcon
//                             icon={faAngleDown}
//                             className={
//                               openDetails[index] ? "up-icon" : "down-icon"
//                             }
//                           />
//                           How does the free trail work?
//                         </summary>
//                         <p>
//                           In order to get the course certificate please make
//                           sure you complete all the assignments
//                         </p>
//                       </details>
//                     ))}
//                   </>
//                 )}

//                 {buttonPick === "Reviews" && (
//                   <div
//                     className="w-100 position-relative"
//                     style={{ minHeight: "20vh" }}
//                   >
//                     {reviewsLoading ? (
//                       <l-grid
//                         id="reviews-loading"
//                         size="60"
//                         speed="1.5"
//                         color="black"
//                       ></l-grid>
//                     ) : (
//                       <>
//                         <h5 className="mb-2 fs-6">Reviews & Ratings:</h5>
//                         <div className="w-100">
//                           {courseData?.review?.userReviews?.length > 0 ? (
//                             courseData?.review?.userReviews.map(
//                               (review, index) => (
//                                 <div
//                                   className="d-flex gap-5 border-bottom pb-2 pt-2"
//                                   key={index}
//                                 >
//                                   <div className="w-30">
//                                     {review?.profile_picture ? (
//                                       <img
//                                         className="w-30 rounded-5"
//                                         loading="lazy"
//                                         src={review?.profile_picture}
//                                         alt="profile image"
//                                       />
//                                     ) : (
//                                       <FaUserCircle className="fs-1" />
//                                     )}
//                                     <h5
//                                       style={{
//                                         fontSize: "1rem",
//                                         fontWeight: "100",
//                                       }}
//                                       className=""
//                                     >
//                                       {review?.name || "No name available"}
//                                     </h5>
//                                   </div>
//                                   <div className="w-50">
//                                     <span>
//                                       {[...Array(5)].map((_, i) =>
//                                         i < review.rating ? (
//                                           <AiFillStar
//                                             style={{ color: "yellow" }}
//                                             key={i}
//                                             className="fs-5"
//                                           />
//                                         ) : (
//                                           <AiOutlineStar
//                                             key={i}
//                                             className="fs-5"
//                                           />
//                                         )
//                                       )}
//                                     </span>
//                                     <p className="w-100">
//                                       {review.comment || "No comment available"}
//                                     </p>
//                                   </div>
//                                   <p className="w-30 fs-6">
//                                     {review?.review_date
//                                       ? review?.review_date.split("T")[0]
//                                       : "No review date"}
//                                   </p>
//                                 </div>
//                               )
//                             )
//                           ) : (
//                             <p style={{ marginLeft: "2vw" }}>
//                               No reviews available!
//                             </p>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className=""></div>
//             </div>
//             <div
//               className={
//                 !videosResponsive
//                   ? "right-bottom-purchasedCourseClosed"
//                   : "right-bottom-purchasedCourse"
//               }
//             >
//               <span
//                 onClick={() => setVideosResponsive(!videosResponsive)}
//                 id="videoResponsiveContainer"
//               >
//                 {videosResponsive ? (
//                   <FontAwesomeIcon
//                     id="videosResponsiveIcon"
//                     icon={faChevronRight}
//                   />
//                 ) : (
//                   <FontAwesomeIcon
//                     id="videosResponsiveIcon"
//                     icon={faChevronLeft}
//                   />
//                 )}
//               </span>
//               <div className="heading-bottom-purchasedCourse">
//                 <h5>Course Content</h5>
//                 <h6>
//                   Lecture ({formatTime(courseData?.course?.total_duration)})
//                   Total ({courseData?.course?.total_lessons})
//                 </h6>
//               </div>

//               <div className="right-bottom-options">
//                 {courseData.length === 0 ? (
//                   <h5>No chapters found!</h5>
//                 ) : isLoading ? (
//                   <SyncLoader />
//                 ) : (
//                   courseData?.courseChapters?.chapters?.map(
//                     (chapter, chapterIndex) => (
//                       <details
//                         key={chapter?.chapter_id}
//                         open={
//                           (chapterIndex === 0 && true) ||
//                           openChapters[chapterIndex]
//                         }
//                         onToggle={() => handleLeftToggle(chapterIndex)}
//                       >
//                         <summary>
//                           <FontAwesomeIcon
//                             icon={faAngleDown}
//                             className={
//                               openChapters[chapterIndex]
//                                 ? "up-icon"
//                                 : "down-icon"
//                             }
//                           />

//                           <h5>
//                             Section {chapter?.chapter_no} |{" "}
//                             {chapter?.chapterTitle
//                               .split(" ")
//                               .slice(0, 3)
//                               .join(" ")}
//                           </h5>
//                           <h6>
//                             {chapter?.totalLessons} Videos |{" "}
//                             {formatTime(chapter?.totalDuration)}
//                           </h6>
//                         </summary>
//                         {chapter?.lessons.map((lesson) => (
//                           <div key={lesson?.lesson_id}>
//                             <input
//                               type="checkbox"
//                               defaultChecked={lesson?.completed === 1}
//                               onChange={(e) => {
//                                 if (e.target.checked) {
//                                   console.log(
//                                     chapter?.chapter_id,
//                                     lesson?.lesson_id
//                                   );
//                                   checkedLesson({
//                                     lesson_id: lesson?.lesson_id,
//                                   });
//                                 }
//                               }}
//                               disabled={lesson?.completed === 1}
//                             />
//                             <span
//                               onClick={() =>
//                                 handleVideoChange(
//                                   lesson?.video_url,
//                                   lesson?.thumbnail,
//                                   lesson?.lesson_id
//                                 )
//                               }
//                               style={{
//                                 cursor: "pointer",
//                                 color:
//                                   selectedLesson === lesson?.lesson_id && "red",
//                               }}
//                             >
//                               <h6
//                                 style={{
//                                   cursor: "pointer",
//                                   color:
//                                     selectedLesson === lesson?.lesson_id
//                                       ? "red"
//                                       : "black",
//                                 }}
//                               >
//                                 {lesson?.lessonTitle}
//                               </h6>
//                               <h6>1 Video | {formatTime(lesson?.duration)}</h6>
//                             </span>
//                           </div>
//                         ))}
//                       </details>
//                     )
//                   )
//                 )}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: "100%",
//                     padding: "2vh 0 2vh 0",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       background:
//                         "linear-gradient(92.27deg, #0C243C -1.15%, #7E8C9C 98.27%)",
//                       color: "white",
//                       width: "max-content",
//                       padding: "1vh 1vw 1vh 1vw",
//                       cursor: "pointer",
//                       borderRadius: "0.5vw",
//                     }}
//                   >
//                     <p>Load more content</p>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default UserPurchasedCourse;
