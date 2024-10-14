import "./UserProfile.css";
import { useState, useEffect } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const getSocialLinks = (profile) => [
  {
    name: "Twitter",
    icon: "fab fa-twitter",
    url: `https://${profile?.twitter}`,
  },
  {
    name: "Youtube",
    icon: "fab fa-youtube",
    url: `https://${profile?.youtube}`,
  },
  { name: "Website", icon: "fas fa-globe", url: `https://${profile?.website}` },
];

export default function UserProfile() {
  const navigate = useNavigate();
  // const location = useLocation();
  const {id} = useParams()
  const expertId = id;
  // const course_id = location.state?.course_id;
  const [profile, setProfile] = useState(null);
  const [courseData, setCourse] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  // const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URI}/api/v1/expert/profile/${expertId}`
        );
        console.log(response.data.data);
        setProfile(response?.data?.data.expert); // Set profile data
        setCourse(response?.data?.data?.courses || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, [expertId]);

  return (
    <div
      className="wrapper-userCourseview position-relative"
      style={{ backgroundColor: "white" }}
    >
      <div className="px-4">
        <div className="container c-profile">
          <div className="profile-container">
            <div className="profile-image">
              <img
                alt="Profile picture of a person smiling"
                src={profile?.profile_picture}
              />
              <h6 className="expert-name">Juijitsu Expert</h6>
            </div>

            <div className="profile-info">
              <div className="profile-one" style={{ display: "flex" }}>
                <div className="name-info">
                  <h6>{profile?.name}</h6>
                  <p>{profile?.title}</p>
                  <div className="stats">
                    <p>Students: {profile?.total_students}</p>
                    <p>Reviews: {profile?.total_reviews}</p>
                  </div>
                </div>
                <div className="social">
                  <h6 className="social-heading">My Socials</h6>
                  <div className="socials">
                    {getSocialLinks(profile).map((social, index) => (
                      <a href={social.url} key={index}>
                        <i className={social.icon} /> {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="about">
                <h6>About me</h6>
                <p className="para-profile">{profile?.bio}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-userCourseview ">
          <h3>My courses</h3>
          <div className="cards-userProfileCourseview">
            {courseData?.length > 0 ? (
              courseData.map((course, index) => (
                <div
                  onClick={() =>
                    course?.is_purchased
                      ? navigate(`/userPurchasedCourses/${course?.id}`)
                      : course?.is_in_cart
                      ? navigate("/userCart")
                      : navigate(`/userCourses/userCourseView/${course?.id}`)
                  }
                  className="card-bottom-userCourseview c-btm"
                  key={index}
                >
                  <span>
                    <img
                      src={course?.thumbnail || "default-image-url"}
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
                      {loadingItems[course?.id] ? (
                        <PulseLoader size={8} color="white" />
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
        </div>
      </div>
    </div>
  );
}