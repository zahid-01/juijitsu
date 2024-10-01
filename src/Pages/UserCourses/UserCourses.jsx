import { useEffect, useMemo, useState } from "react";
import "./UserCourses.css";
import cardImage from "../../assets/coursesCard.png";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader, SyncLoader } from "react-spinners";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "ldrs/grid";
import "ldrs/bouncy";
import { useDispatch } from "react-redux";
import { userCartActions } from "../../Store/cartSlice";

const ShimmerCard = () => (
  <div className="card-bottom-userCourses shimmer-card-usercourses">
    <div className="shimmer-content-usercourses short"></div>
    <div className="shimmer-content-usercourses long"></div>

    <div className="shimmer-content-usercourses medium"></div>
    <div className="shimmer-content-usercourses long"></div>
  </div>
);

const Card = ({
  id,
  category,
  description,
  expert,
  price,
  discount,
  tags,
  thumbnail,
  onClick,
  onAddToCart,
  carted,
  purchase,
  handleCarted,
  handlePurchase,
  title,
  heartedAPI,
  navigate,
  token,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hearted, setHearted] = useState(heartedAPI);
  const location = useLocation();

  // const handleAddToCart = async (e) => {
  //   e.stopPropagation();
  //   setIsLoading(true);
  //   await onAddToCart(id, setIsLoading);
  // };

  const handleFavrouite = async (e) => {
    e.stopPropagation();
    if (!token) {
      navigate("/");
    }
    try {
      setHearted(!hearted);
      await axios({
        method: "post",
        url: `${BASE_URI}/api/v1/courses/favouriteCourse/${id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to add to favorites");
    }
  };

  return (
    <div
      className="card-bottom-userCourses"
      onClick={() => {
        if (purchase) {
          onClick(id, "Purchased");
        } else if (carted) {
          onClick(id, "carted");
        } else {
          onClick(id);
        }
      }}
    >
      <span>
        {hearted ? (
          <FontAwesomeIcon
            onClick={handleFavrouite}
            id="heart-userCourses"
            icon={faHeart}
          />
        ) : (
          <CiHeart onClick={handleFavrouite} id="unHeart-userCourses" />
        )}

        <img
          loading="lazy"
          src={thumbnail}
          alt="Course image"
          style={{ objectFit: "cover" }}
        />
      </span>

      <div className="middle-sec-card-userCourses">
        <div className="addCourse-card-userCourses">
          <h6>{category}</h6>
        </div>
        <div className="pricing-card-userCourses">
          <h5>{tags?.split(" ").slice(0, 2).join(" ") + "..."}</h5>
        </div>
      </div>
      <p>{expert}</p>
      <h5 style={{ fontWeight: "600" }}>{title}</h5>
      <div className="bottom-card-useruserCourses">
        <span>
          <h5>{`$${price}`}</h5>
          <h5>{`$${(price * (1 - discount / 100)).toFixed(2)}`}</h5>
        </span>
        <div
          onClick={() => {
            navigate("/userCourses/userCourseView");
            navigate(location.pathname);
          }}
        >
          {purchase ? (
            <h6>Purchased!</h6>
          ) : (
            <h6>
              {isLoading ? (
                <l-bouncy size="30" speed="1.5" color="white"></l-bouncy>
              ) : (
                "Go To Courses"
              )}
            </h6>
          )}
        </div>
      </div>
    </div>
  );
};

const UserCourses = ({ search }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [initialCategory, setInitialCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const url2 = `${BASE_URI}/api/v1/category/`;
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
    refetch: refetch2,
  } = useFetch(url2, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const categories = useMemo(() => data2?.data || [], [data2]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory("All"); // Set to "All" by default
      refetch();
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  const url = `${BASE_URI}/api/v1/courses/userDashboard/courses?search=${search}${
    selectedCategory && selectedCategory !== "All"
      ? `&category=${selectedCategory}`
      : ""
  }`;

  console.log(url);

  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const coursesData = useMemo(() => data?.data || [], [data]);
  console.log(coursesData)

  // const handleNavigate = (id, status) => {
  //   if (!status) {
  //     navigate(`/userCourses/userCourseView/${id}`);
  //   } else if (status === "Purchased") {
  //     navigate(`/userPurchasedCourses/${id}`);
  //   } else if (status === "carted") {
  //     navigate(`/userPurchasedCourses/${id}`);
  //   }
  // };
  const handleNavigate = (id, status) => {
    console.log("Navigating with ID:", id, "Status:", status);
    if (!status) {
      navigate(`/userCourses/userCourseView/${id}`);
    } else if (status === "Purchased") {
      navigate(`/userPurchasedCourses/${id}`);
    }
  };

  const handleCart = async (id, setIsLoading) => {
    if (!token) {
      setIsLoading(false);
      navigate(`/`);
      return toast.error(`Error: Please Login First!`);
    }

    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/cart`,
        { course_id: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setIsLoading(false);
      toast.success(`${response.data.message}`);
      navigate(`/userPurchasedCourses/${id}`);
    } catch (err) {
      setIsLoading(false);
      toast.error(`Error: ${err?.response?.data?.message}`);
    }
  };

  const handlePurchase = (id) => {
    navigate(`/userPurchasedCourses/${id}`);
  };

  // const handleCarted = () => {
  //   navigate(`/userPurchasedCourses/`);
  // };

  return (
    <>
      {isLoading2 ? (
        <l-grid
          id="spinner-usercourseview"
          size="60"
          speed="1.5"
          color="black"
        ></l-grid>
      ) : (
        <div className="wrapper-userCourses w-100">
          <div className="bg-gradient-custom-div px-3 rounded">
            <div className="top-userCourses">
              <h4>Courses</h4>
            </div>

            <div className="categories-userCourses">
              {["All", ...categories.map((category) => category.name)].map(
                (category, index) => (
                  <div
                    key={index}
                    className={
                      selectedCategory === category ||
                      (category === "All" && selectedCategory === "")
                        ? "button-categories-userCourses border-bottom border-4"
                        : "not-button-categories-userCourses"
                    }
                    onClick={() => handleCategoryClick(category)}
                  >
                    <h4>{category}</h4>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bottom-userCourses">
            {error?.response?.data?.message === "No courses found" ? (
              <div className="no-courses-userCourses">
                <div>
                  <h1>No Courses found with this category</h1>
                  <h5>
                    select the different category and join the world of
                    athletes!
                  </h5>
                </div>
              </div>
            ) : isLoading ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <ShimmerCard key={idx} />
              ))
            ) : (
              coursesData.map((course) => (
                <Card
                  key={course.id}
                  id={course.id}
                  category={course.category}
                  title={course.title}
                  description={course.description}
                  expert={course.expert}
                  price={course.price}
                  discount={course.discount}
                  tags={course.tags}
                  thumbnail={course.thumbnail}
                  onClick={handleNavigate}
                  onAddToCart={handleCart}
                  purchase={course.is_purchased}
                  carted={course.in_cart}
                  heartedAPI={course.is_favourite}
                  navigate={navigate}
                  token={token}
                />
              ))
            )}
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default UserCourses;
