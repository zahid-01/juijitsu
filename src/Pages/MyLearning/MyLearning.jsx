import { useEffect, useMemo, useState } from "react";
import "./MyLearning.css";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FaStar } from "react-icons/fa"; // For star icons
import axios from "axios";
import toast from "react-hot-toast";



const ShimmerCard = () => (
  <div className="card-bottom-userCourses shimmer-card-usercourses shimmer-learning">
    <div className="shimmer-content-usercourses short"></div>
    <div className="shimmer-content-usercourses long"></div>
    <div className="shimmer-content-usercourses medium"></div>
    <div className="shimmer-content-usercourses long"></div>
  </div>
);

const Card = ({
  id,
  category,
  expert,
  title,
  tags,
  thumbnail,
  onClick,
  completed,
  ispurchased,
  rating,
  setRating,
  iscarted,
  addtocart,
  price,
  discountedPrice
}) => {
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents the click event from bubbling up
    addtocart(id); // Calls the addtocart function with the course ID
  };
  
 
  
  return (
    <div
  className="card-bottom-myLearning"
  onClick={() =>
    onClick(
      iscarted ? "carted" : (ispurchased ? "purchased" : "normal"),
      id
    )
  }
>

      <span>
        <img src={thumbnail} alt="Course" />
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
      <h4 style={{ fontSize: 15 }}>{title}</h4>

      <div className="bottom-card-usermyLearning">
        {ispurchased ? (
          <>
            <span>
              <span style={{ width: `${completed}%` }}></span>
            </span>
            <div>
              <p>{completed}% complete</p>
              {rating ? (
                <div style={{ display: "flex" }}>
                  <h6>{rating} ⭐,</h6>
                  <h6>Your Rating</h6>
                </div>
              ) : (
                <p onClick={(e) => setRating(e, id)}>Add rating</p>
              )}
            </div>
          </>
        ) : (
          <div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <h6 style={{ fontSize: "0.8rem", textDecoration: "line-through" }}>${price}</h6>
              <h6 style={{ fontSize: '1rem', fontWeight: "500" }}>${discountedPrice}</h6>
            </div>
            <div
              style={{
                background: 'linear-gradient(94.41deg, #0C243C 0%, #7E8C9C 100%)',
                borderRadius: "0.2rem",
                padding: '0.3rem 0.5rem',
                color: "white",
                cursor: "pointer"
              }}
              onClick={handleAddToCart}
            >
              {ispurchased ? <h6>Purchased</h6> : <h6>Go to course</h6>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const RatingPopup = ({ ratingID, onSubmit, onClose }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");

  const handleRating = (value) => {
    setSelectedRating(value);
  };

  const handleReview = (e) => {
    setReview(e.target.value);
    // console.log(review)
  };

  const handleSubmit = () => {
    onSubmit(selectedRating, review);
  };

  return (
    <div className="rating-popup d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg bg-white rounded">
        <h5>Add Your Rating</h5>
        <div className="star-rating mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`star ${selectedRating >= star ? "text-warning" : ""}`}
              onClick={() => handleRating(star)}
              style={{ cursor: "pointer", fontSize: "2rem" }}
            />
          ))}
        </div>
        <div className="mb-3">
          <textarea
            value={review}
            onChange={handleReview}
            placeholder="Add Your Review"
            className="form-control"
            rows={4}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={onClose}>
            Discard
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const MyLearning = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("");
  const [ratingPopUp, setRatingPopUp] = useState(false);
  const [ratingID, setRatingID] = useState(null);

  const url = `${BASE_URI}/api/v1/users/myLearning?status=${activeTab}`;
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const coursesData = useMemo(() => data?.data || [], [data]);
console.log(coursesData)
  const handleNavigate = (status,id) => {
console.log(status)
if(status === 'normal'){
  navigate(`/userCourses/userCourseView/${id}`);
}
if(status === 'carted'){
  navigate(`/userCart`)
}
if(status === 'purchased'){
    navigate(`/userPurchasedCourses/${id}`)

  };

};

  const setRating = (e, id) => {
    e.stopPropagation();
    setRatingPopUp(true);
    setRatingID(id);
  };

  const addtocart = async(id) =>{
    // cartLoading(true);
    try{
      const response = await axios.post(
        `${BASE_URI}/api/v1/cart`,
        { course_id: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      refetch()
      toast.success("Course added to cart successfully")
    }catch(err){
      console.log(err)
      toast.error(err)
    }
    console.log("Course added to cart:", id);
  }

  const handleSubmitRating = (rating,review) => {
    // Here, you'd send the rating to the server via an API call
    try{
      axios({
        method: 'POST',
        url: `${BASE_URI}/api/v1/reviews`,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          courseId: ratingID,
          rating: rating,
          comment: review
        }
      })
      refetch()
      toast.success("Rating submitted successfully")
    }catch(err){
      console.log(err)
      toast.error(err)
    }
    console.log("Rating submitted:", rating, review ,"for course ID:", ratingID);
    setRatingPopUp(false);
    setRatingID(null);
  };

  const handleClosePopup = () => {
    setRatingPopUp(false);
    setRatingID(null);
  };

  return (
    <>
      
        <div className="wrapper-myLearning">
          <header className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-3.5 custom-box">
            <h3 className="pb-5">My Learning</h3>
            <div style={{overflowX:'scroll',scrollbarWidth:"none"}} className="d-flex gap-5 px-4">
              {/* Tab headers */}
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-2 pb-2 fw-light cursor-pointer ${
                  activeTab === "" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("")}
              >
                Purchased Courses
              </h5>
              {/* <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "ongoing" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("ongoing")}
              >
                In - Progress
              </h5> */}
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "favourite" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("favourite")}
              >
                Wish List
              </h5>
              {/* <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "completed" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </h5> */}
            </div>
          </header>

          <div className="bottom-myLearning">
          {isLoading ? (
        Array.from({ length: 12 }).map((_, idx) => (
          <ShimmerCard key={idx} />
        ))
      ) : (
            error?.response?.data?.message === "No courses found" ? (
              <div className="no-courses-myLearning">
                <div>
                <h1 className="fs-2">No Courses Purchased Yet!</h1>
                <h5>Purchase a course and join the world of athletes!</h5>
                <Link to="/userCourses" className="text-decoration-none text-white">
                  <FontAwesomeIcon icon={faSquarePlus} className="add-icon-courses" />
                </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Rating Pop-up */}
                {ratingPopUp && (
                  <RatingPopup
                    ratingID={ratingID}
                    onSubmit={handleSubmitRating}
                    onClose={handleClosePopup}
                  />
                )}

                {/* Map courses */}
                {coursesData?.course?.map((course) => (
                  <Card
                    key={course.id}
                    id={course.id}
                    category={course.category}
                    expert={course.name}
                    completed={course.completion_percentage}
                    title={course.title}
                    tags={course.tags}
                    thumbnail={course.thumbnail}
                    onClick={handleNavigate}
                    ispurchased={course.is_purchased}
                    rating={course.user_rating}
                    setRating={setRating}
                    iscarted={course.in_cart}
                    addtocart={addtocart}
                    price={course.price}
                    discountedPrice={course.discounted_price}
                  />
                ))}
              </>
            )
            )}
          </div>
        </div>
      
    </>
  );
};

export default MyLearning;
