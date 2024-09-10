import { useMemo, useState, useEffect } from "react";
import "./CourseView.css";
import videoPlayer from "../../assets/videoPlayer.png";
import profile from "../../assets/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { SyncLoader } from "react-spinners";
import "ldrs/grid";
import axios from "axios";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import { FaChevronRight } from "react-icons/fa";
import ReactPlayer from "react-player";

const CourseView = ({ setEditCourse, setCourseId }) => {
  const { id } = useParams();
  console.log(id);
  const [buttonPick, setButtonPick] = useState("Overview");
  const [openDetails, setOpenDetails] = useState({});

  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [video_url, setVideo_url] = useState("");
  const [video_type, setVideo_type] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [videosResponsive, setVideosResponsive] = useState(true);
  const navigate = useNavigate();

  const profile_picture = localStorage.getItem("profile_picture");

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

  const handleToggle = (index) => {
    setOpenDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
    // console.log()
  };
  const handleLeftToggle = (chapterIndex) => {
    console.log(chapterIndex);
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

  const url = `${BASE_URI}/api/v1/courses/courseOverview/${id}`;
  const token = localStorage.getItem("token");
  const { data, isLoading, error, refetch } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  //  setData(data.data[0]);
  //  console.log(data);
  const courseData = useMemo(() => data?.data?.chapters || [], [data]);

  const url2 = `${BASE_URI}/api/v1/courses/${id}`;
  // const token2 = localStorage.getItem("token");
  const {
    data: data2,
    isLoading2,
    error: error2,
    refetch2,
  } = useFetch(url2, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  // console.log(data2)

  const courseData2 = useMemo(() => data2?.data || [], [data2]);
  //   console.log(courseData[0]?.lessons[0]?.video_url);

  useEffect(() => {
    setVideo_url(courseData[0]?.lessons[0]?.video_url);
    setVideo_type(courseData[0]?.lessons[0]?.video_type);
    setVideo_thumb(courseData[0]?.lessons[0]?.thumbnail);
    setSelectedLesson(courseData[0]?.lessons[0]?.lesson_id);
    // console.log(video_url);
  }, [courseData]);

  const handleVideoChange = (video_url, video_thumb, lesson_id) => {
    setVideo_url(video_url);
    setVideo_thumb(video_thumb);
    setSelectedLesson(lesson_id);
    // refetch();
  };

  const handleEditCourse = () => {
    setEditCourse(true);
    setCourseId(id);
    navigate(`/courses/addLesson/${id}`);
  };
  return (
    <>
      {error2?.response?.data?.message === "No courses found" ? (
        <h1>No courses found</h1>
      ) : isLoading2 || isLoading ? (
        <l-grid
          id="spinner-usercourseview"
          size="60"
          speed="1.5"
          color="black"
        ></l-grid>
      ) : (
        <div className="wrapper-courseview">
          <div className="top-courseview">
            <h4>Course Overview</h4>
            <div>
              <h6 onClick={handleEditCourse}>Edit Course</h6>
            </div>
          </div>
          <div className="bottom-courseview">
            <div className="left-bottom-courseview" >
              <div className="video-container-purchasedCourse" >
                {video_type === "youtube" ? (
                  <ReactPlayer
                    url={video_url}
                    className="tumbnail-userCourseview"  
                    style={{ width: '100%', height: '0' }}
                    controls={true}
                  />
                ) : (
                  <video
                    src={video_url}
                    className="tumbnail-userCourseview" 
                    style={{ width: '100%', height: 'auto' }}
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
                <h5 className="text-uppercase">{courseData2[0]?.title} :</h5>
                <h6
                  dangerouslySetInnerHTML={{
                    __html:
                      courseData2[0]?.description
                        ?.split(" ")
                        .slice(0, 11)
                        .join(" ") + "...",
                  }}
                ></h6>
              </span>
              <div className="videoCreator-courseview">
                <img src={profile_picture || profile} alt="profile" />
                <h6 className="text-uppercase">{courseData2[0]?.name}</h6>
              </div>
              <div className="buttons-courseview">
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
                        ? "button-courseview"
                        : "not-button-courseview"
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
                        ? "button-courseview"
                        : "not-button-courseview"
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
                        ? "button-courseview"
                        : "not-button-courseview"
                    }
                  >
                    <h5>Reviews</h5>
                  </div>
                </div>
                <div className="line-courseview"></div>
              </div>
              <div className="course-details-courseview">
                {buttonPick === "Overview" && (
                  <>
                    <h5>Course Title:</h5>
                    <h6>{courseData2[0]?.title}</h6>
                    <h5>Course Duration:</h5>
                    <h6>{formatTime(courseData2[0]?.total_duration)}</h6>
                    <h5>Course Description:</h5>
                    <h6
                      dangerouslySetInnerHTML={{
                        __html: courseData2[0]?.description,
                      }}
                    ></h6>
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
                  <div className="ratings-courseview">
                    {reviewsLoading ? (
                      <l-grid
                        id="reviews-loading"
                        size="60"
                        speed="1.5"
                        color="black"
                      ></l-grid>
                    ) : (
                      <>
                        <div className="left-ratings-courseview">
                          <h6>Average Reviews</h6>
                          <h5>{reviewData?.data?.averageRating}</h5>
                          <span>
                            {[
                              ...Array(
                                Math.floor(reviewData?.data?.averageRating)
                              ),
                            ].map((_, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className="staricon"
                              />
                            ))}
                          </span>
                          <h6>Ratings</h6>
                        </div>
                        <div className="right-ratings-courseview">
                          <h6>Detailed Ratings</h6>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[5]}%</h6>
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
                                  width: `${reviewData?.data?.ratingPercentages[5]}%`,
                                }}
                                className="fifty-rating-courseview"
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
                                className="fourty-rating-courseview"
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
                                className="thirty-rating-courseview"
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
                            </span>
                            <div>
                              <div
                                style={{
                                  width: `${reviewData?.data?.ratingPercentages[2]}%`,
                                }}
                                className="twenty-rating-courseview"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <h6>{reviewData?.data?.ratingPercentages[1]}%</h6>
                            <span>
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
                                className="ten-rating-courseview"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className={
                !videosResponsive
                  ? "right-bottom-courseviewClosed"
                  : "right-bottom-courseview"
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

              <div className="heading-bottom-courseview">
                <h5>Course Content</h5>
                <h6>
                  Lecture ({courseData2[0]?.total_lesson}) Total (
                  {formatTime(courseData2[0]?.total_duration)})
                </h6>
              </div>

              <div className="right-bottom-options-courseView">
                {courseData.length === 0 ? (
                  <h5>No chapters found!</h5>
                ) : isLoading ? (
                  <SyncLoader />
                ) : (
                  courseData.map((chapter, chapterIndex) => (
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
                            openChapters[chapterIndex] ? "up-icon" : "down-icon"
                          }
                        />
                        <h5>
                          Section {chapter?.chapter_no} |{" "}
                          {chapter?.chapterTitle
                            ?.split(" ")
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
                  ))
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    padding: "2vh 0 1vh 0",
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
export default CourseView;
