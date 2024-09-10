import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./UserPurchasedCourse.css";
import videoPlayer from "../../assets/videoPlayer.png";
import profile from "../../assets/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faStar,
  faEllipsisVertical,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { SyncLoader } from "react-spinners";
import { BsTwitterX } from "react-icons/bs";
import twitter from "../../assets/Vector.svg";
import youtube from "../../assets/Vector (1).svg";
import chain from "../../assets/Vector (2).svg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "ldrs/grid";
import axios from "axios";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import ReactPlayer from "react-player";
// import { bouncy } from "ldrs";

const UserPurchasedCourse = () => {
  const { id } = useParams();
  // console.log(id);
  const [buttonPick, setButtonPick] = useState("Overview");
  const [videosResponsive, setVideosResponsive] = useState(true);
  const [openDetails, setOpenDetails] = useState({});
  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [video_url, setVideo_url] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [show, setShow] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [video_type, setVideo_type] = useState("");
  const handleMouseEnter = () => {
    setShow(true);
    setIsEnter(true);
  };
  const handleMouseLeave = () => {
    setShow(false);
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

  const handleButtonToggle = async (event) => {
    const text = event.currentTarget.querySelector("h5").textContent;
    setButtonPick(text);

    if (text === "Reviews") {
      setReviewsLoading(true);
      try {
        const url = `${BASE_URI}/api/v1/reviews/totalReview/${id}`;
        const response = await axios({
          method: "GET",
          url,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        // const reviews = useMemo(() => response?.data?.data || [], [response?.data?.data]);
        setReviewData(response.data);
        console.log(reviewData.data);
        setReviewsLoading(false);
      } catch (error) {
        console.error(error);
        setReviewsLoading(false);
      }
    }
  };

  const handleLeftToggle = (chapterIndex) => {
    // console.log(chapterIndex);
    setOpenChapters((prevOpenChapters) => ({
      ...prevOpenChapters,
      [chapterIndex]: !prevOpenChapters[chapterIndex],
    }));
  };

  // const handleLeftToggle = (index) => {
  //   setOpenDetailsLeft((prevState) => ({
  //     ...prevState,
  //     [index]: !prevState[index],
  //   }));
  // };

  const url = `${BASE_URI}/api/v1/courses/usersCourseOverview/${id}`;
  const token = localStorage.getItem("token");

  const { data, isLoading, error, refetch } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  //  setData(data.data[0]);
  //  console.log(data);
  const courseData = useMemo(() => data?.data || [], [data]);
  console.log(courseData);

  const percentage =
    (courseData?.course?.lessons_completed /
      courseData?.course?.total_lessons) *
    100;
  // console.log(percentage);
  // const convertSecondsToMinutes = (totalSeconds) => {
  //   const minutes = Math.floor(totalSeconds / 60);
  //   const seconds = totalSeconds % 60;
  //   return `${minutes}m ${seconds}s`;
  // };

  useEffect(() => {
    // setShow(false)
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
    // console.log(video_thumb);
  }, [courseData]);

  // console.log(courseData);

  const handleVideoChange = (video_url, video_thumb, lesson_id) => {
    setVideo_url(video_url);
    setVideo_thumb(video_thumb);
    setSelectedLesson(lesson_id);
    // refetch();
  };
  // console.log(show)

  return (
    <>
      {/* {error2?.response?.data?.message === "No courses found" ? (
        <h1>No courses found</h1> */}
      {/* ) : */}
      {isLoading ? (
        <l-grid
          id="spinner-usercourseview"
          size="60"
          speed="1.5"
          color="black"
        ></l-grid>
      ) : (
        <div className="wrapper-purchasedCourse">
          <div className="top-purchasedCourse">
            <h4>Course Overview</h4>

            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                transition: "all 0.5s ease-in-out",
              }}
            >
              <div
                className={`hover-div-purchased-course ${
                  show ? "show" : isEnter && "hide"
                }`}
                style={{
                  transition: "all 0.5s ease-in-out",
                  width: "70%",
                  height: "150%",
                  position: "absolute",
                  top: "-180%",
                  left: "-10%",
                  background: "white",
                  // backgroundColor: 'white',
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "black",

                  flexDirection: "column",
                }}
              >
                <p style={{ fontWeight: "700" }}>
                  {courseData?.course?.lessons_completed} of{" "}
                  {courseData?.course?.total_lessons} completed
                </p>
                <p style={{ fontWeight: "400", fontSize: "0.8vw" }}>
                  Complete all lessons to get certificate
                </p>
              </div>
              <div
                style={{ transition: "all 0.5s ease-in-out" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* {show && ( */}

                {/* )} */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: "transparent",
                  }}
                >
                  <CircularProgressbar
                    value={percentage}
                    strokeWidth={50}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      pathColor: "#112940",

                      backgroundColor: "white",
                      trailColor: "white",
                    })}
                  />
                </div>

                <h6>Your Progress</h6>
              </div>
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                style={{ height: "100%", width: "2.5%" }}
              />
            </span>
          </div>
          <div className="content-container-purchasedCourse">
            <div className="left-bottom-purchasedCourse">
              <div className="video-container-purchasedCourse" >
                {video_type === "youtube" ? (
                  <ReactPlayer  
                    url={video_url }
                    className="tumbnail-userCourseview"
                 
                    style={{ width: '100% !important', }}
                    controls={true}
                  />
                ) : (
                  <video
                    src={video_url}
                    className="tumbnail-userCourseview"
                    
                    style={{ width: '100% !important' }}
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {/* <video 
      src={video_url} 
      controls 
      muted 
      loop 
      poster={video_thumb}
      preload="auto"
    >
      Your browser does not support the video tag.
    </video> */}
              </div>
              <span>
                <h4 className="text-uppercase">
                  {courseData?.course?.title} :
                </h4>
                <h6
                  dangerouslySetInnerHTML={{
                    __html:
                      courseData?.course?.description
                        ?.split(" ")
                        .slice(0, 9)
                        .join(" ") + "...",
                  }}
                ></h6>
              </span>
              <div className="videoCreator-purchasedCourse">
                <img src={profile} alt="profile" />
                <h6 className="text-uppercase">{courseData?.course?.name}</h6>
              </div>
              <div className="buttons-purchasedCourse">
                <div className="buttons-holder">
                  {
                    <div
                      className={
                        buttonPick === "Overview"
                          ? "button-triangle"
                          : "no-button-triangle"
                      }
                    ></div>
                  }
                  <div
                    onClick={handleButtonToggle}
                    className={
                      buttonPick === "Overview"
                        ? "button-purchasedCourse"
                        : "not-button-purchasedCourse"
                    }
                  >
                    <h5>Overview</h5>
                  </div>
                </div>
                <div className="buttons-holder">
                  {
                    <div
                      className={
                        buttonPick === "FAQ"
                          ? "button-triangle"
                          : "no-button-triangle"
                      }
                    ></div>
                  }
                  <div
                    onClick={handleButtonToggle}
                    className={
                      buttonPick === "FAQ"
                        ? "button-purchasedCourse"
                        : "not-button-purchasedCourse"
                    }
                  >
                    <h5>FAQ</h5>
                  </div>
                </div>
                <div className="buttons-holder">
                  {
                    <div
                      className={
                        buttonPick === "Reviews"
                          ? "button-triangle"
                          : "no-button-triangle"
                      }
                    ></div>
                  }
                  <div
                    onClick={handleButtonToggle}
                    className={
                      buttonPick === "Reviews"
                        ? "button-purchasedCourse"
                        : "not-button-purchasedCourse"
                    }
                  >
                    <h5>Reviews</h5>
                  </div>
                </div>
                <div className="line-purchasedCourse"></div>
              </div>
              <div className="course-details-purchasedCourse">
                {buttonPick === "Overview" && (
                  <>
                    <span>
                      <h5>Rating:</h5>
                      <h6>{courseData?.review?.averageRating} out of 5</h6>
                    </span>

                    <span>
                      <h6>{courseData?.review?.totalReviews}</h6>
                      <h5>Ratings</h5>
                    </span>
                    <span>
                      <h5>{courseData?.course?.enrolled} Students</h5>
                    </span>
                    <span>
                      <h6>{formatTime(courseData?.course?.total_duration)}</h6>
                      <h5>Total</h5>
                    </span>

                    <div className="certificate-purchasedCourse">
                      <h6>
                        Get Jiujitsux Certificate by completing the entire
                        course
                      </h6>
                      <div>
                        <h6>Certificate</h6>
                      </div>
                    </div>
                    <div className="discription-purchasedCourse">
                      <h5>Discription</h5>
                      <h6
                        dangerouslySetInnerHTML={{
                          __html: courseData?.course?.description,
                        }}
                      ></h6>
                    </div>
                    <div
                      style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1vh",
                      }}
                    >
                      <h6 style={{ fontWeight: 500 }}>Expert</h6>
                      <span style={{ display: "flex", gap: "1vw" }}>
                        <img
                          src={courseData?.course?.profile_picture || profile}
                          alt="profile"
                          style={{ width: "7%", borderRadius: "50%" }}
                        />{" "}
                        <h6 className="text-uppercase">
                          {courseData?.course?.name}
                        </h6>
                      </span>
                      <span style={{ display: "flex", gap: "0.5vw" }}>
                        <div
                          style={{
                            backgroundColor: "#0C243C",
                            padding: "0 2% 0.7% 2%",
                            borderRadius: "0.5vw",
                            cursor: "pointer",
                          }}
                        >
                          <img src={twitter} alt="" />
                        </div>
                        <div
                          style={{
                            backgroundColor: "#0C243C",
                            padding: "0 2% 0.7% 2%",
                            borderRadius: "0.5vw",
                            cursor: "pointer",
                          }}
                        >
                          <img src={youtube} alt="" />
                        </div>
                        <div
                          style={{
                            backgroundColor: "#0C243C",
                            padding: "0 2% 0.7% 2%",
                            borderRadius: "0.5vw",
                            cursor: "pointer",
                          }}
                        >
                          <img src={chain} alt="" />
                        </div>
                      </span>
                      <div>
                        <h6 style={{ marginTop: "1vh" }}>
                          {courseData?.course?.bio || "No Bio Avaliable"}
                        </h6>
                      </div>
                    </div>
                  </>
                )}
                {buttonPick === "FAQ" && (
                  <>
                    {[0, 1, 2].map((index) => (
                      <details
                        key={index}
                        open={!!openDetails[index]}
                        onToggle={() => handleToggle(index)}
                      >
                        <summary>
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className={
                              openDetails[index] ? "up-icon" : "down-icon"
                            }
                          />
                          How does the free trail work?
                        </summary>
                        <p>
                          In order to get the course certificate please make
                          sure you complete all the assignments
                        </p>
                      </details>
                    ))}
                  </>
                )}

                {buttonPick === "Reviews" && (
                  <div className="ratings-purchasedCourse">
                    {reviewsLoading ? (
                      <l-grid
                        id="reviews-loading"
                        size="60"
                        speed="1.5"
                        color="black"
                      ></l-grid>
                    ) : (
                      <>
                        <div className="left-ratings-purchasedCourse">
                          <h6>Average Reviews</h6>
                          <h5>{reviewData?.data?.averageRating}</h5>
                          <span>
                            <FontAwesomeIcon
                              icon={faStar}
                              className="staricon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="staricon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="staricon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="staricon"
                            />
                          </span>
                          <h6>Ratings</h6>
                        </div>
                        <div className="right-ratings-purchasedCourse">
                          <h6>Detailed Ratings</h6>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[1]}%</h6>
                            <span>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                            </span>
                            <div>
                              <div
                                style={{
                                  width: `${reviewData?.data?.ratingPercentages[1]}%`,
                                }}
                                className="fifty-rating-purchasedCourse"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[2]}%</h6>
                            <span>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                            </span>
                            <div>
                              <div
                                style={{
                                  width: `${reviewData?.data?.ratingPercentages[2]}%`,
                                }}
                                className="fourty-rating-purchasedCourse"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[3]}%</h6>
                            <span>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                            </span>
                            <div>
                              <div
                                style={{
                                  width: `${reviewData?.data?.ratingPercentages[3]}%`,
                                }}
                                className="thirty-rating-purchasedCourse"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[4]}%</h6>
                            <span>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                            </span>
                            <div>
                              <div
                                style={{
                                  width: `${reviewData?.data?.ratingPercentages[4]}%`,
                                }}
                                className="twenty-rating-purchasedCourse"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[5]}%</h6>
                            <span>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="staricon"
                              />
                            </span>
                            <div>
                              <div
                                style={{
                                  width: `${reviewData?.data?.ratingPercentages[5]}%`,
                                }}
                                className="ten-rating-purchasedCourse"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className=""></div>
            </div>
            <div
              className={
                !videosResponsive
                  ? "right-bottom-purchasedCourseClosed"
                  : "right-bottom-purchasedCourse"
              }
            >
              <span
                onClick={() => setVideosResponsive(!videosResponsive)}
                id="videoResponsiveContainer"
              >
                {videosResponsive ? (
                  <FontAwesomeIcon
                    id="videosResponsiveIcon"
                    icon={faChevronRight}
                  />
                ) : (
                  <FontAwesomeIcon
                    id="videosResponsiveIcon"
                    icon={faChevronLeft}
                  />
                )}
              </span>
              <div className="heading-bottom-purchasedCourse">
                <h5>Course Content</h5>
                <h6>
                  Lecture ({formatTime(courseData?.course?.total_duration)})
                  Total ({courseData?.course?.total_lessons})
                </h6>
              </div>

              <div className="right-bottom-options">
                {courseData.length === 0 ? (
                  <h5>No chapters found!</h5>
                ) : isLoading ? (
                  <SyncLoader />
                ) : (
                  courseData?.courseChapters?.chapters?.map(
                    (chapter, chapterIndex) => (
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

                          <h5>
                            Section {chapter?.chapter_no} |{" "}
                            {chapter?.chapterTitle
                              .split(" ")
                              .slice(0, 3)
                              .join(" ")}
                          </h5>
                          <h6>
                            {chapter?.totalLessons} Videos |{" "}
                            {formatTime(chapter?.totalDuration)}
                          </h6>
                        </summary>
                        {chapter?.lessons.map((lesson) => (
                          <div key={lesson?.lesson_id}>
                            <input type="checkbox" />
                            <span
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
                              <h6
                                style={{
                                  cursor: "pointer",
                                  color:
                                    selectedLesson === lesson?.lesson_id
                                      ? "red"
                                      : "black",
                                }}
                              >
                                {lesson?.lessonTitle}
                              </h6>
                              <h6>1 Video | {formatTime(lesson?.duration)}</h6>
                            </span>
                          </div>
                        ))}
                      </details>
                    )
                  )
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    padding: "2vh 0 2vh 0",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background:
                        "linear-gradient(92.27deg, #0C243C -1.15%, #7E8C9C 98.27%)",
                      color: "white",
                      width: "max-content",
                      padding: "1vh 1vw 1vh 1vw",
                      cursor: "pointer",
                      borderRadius: "0.5vw",
                    }}
                  >
                    <p>Load more content</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default UserPurchasedCourse;
