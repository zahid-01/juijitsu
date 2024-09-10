import React, { useEffect, useMemo, useState } from "react";

import "./UserCart.css";
import itemThumb from ".././../assets/usercartimage.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faArrowRight,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import cardImage from "../../assets/coursesCard.png";
import { BASE_URI } from "../../Config/url";
import useFetch from "../../hooks/useFetch";
// import { SyncLoader, PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PubCwDq08j41MMz9w7CFKlaPOPT4YlfciU9GCgXcxBmve17go3ryZQKVBcQJ3pzW86Z1mDb1bLTnkXFiTZKBu8O00CGdw624j"
);

import { Link, useNavigate } from "react-router-dom";
// import Loader from "../../Components/Loader/Loader";
import "ldrs/bouncy";
import "ldrs/grid";

const UserCart = () => {
  const [loadingItems, setLoadingItems] = useState({});
  const [removeLoading, setremoveLoading] = useState({});
  const navigate = useNavigate();

  const url = `${BASE_URI}/api/v1/cart`;
  const token = localStorage.getItem("token");
  const { data, isLoading, error, refetch } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const APIdata = useMemo(() => data?.data || [data], [data]);
  const cartItems = APIdata[0];
  // console.log((error && error) || (cartItems && cartItems));

  const handleCart = async (id, e) => {
    e.stopPropagation();
    setLoadingItems((prev) => ({ ...prev, [id]: true }));
    try {
      console.log(id);
      const response = await axios.post(
        `${BASE_URI}/api/v1/cart`,
        { course_id: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success(`${response.data.message}`);
      refetch();
    } catch (err) {
      toast.error(`Error: ${err?.response?.data?.message}`);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRemoveCart = async (id, e) => {
    e.stopPropagation();
    setremoveLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await axios.delete(`${BASE_URI}/api/v1/cart/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(`${response.data.message}`);
      refetch();
    } catch (err) {
      toast.error(`Error: ${err?.response?.data?.message}`);
    } finally {
      setremoveLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const checkoutHandler = async () => {
    try {
      const stripe = await stripePromise;
      // Fetch the session from your backend
      // const session = await axios(`http://localhost:3000/api/v1/payment`);
      const session = await axios(`${BASE_URI}/api/v1/payment`, {
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

  if (!token) {
    return <navigate to="/" />;
  }

  return (
    <>
      {isLoading ? (
        // Default values shown
        <l-grid
          id="spinner-usercourseview"
          size="60"
          speed="1.5"
          color="black"
        ></l-grid>
      ) : (
        <div className="wrapper-usercart">
          {cartItems?.cart?.length === 0 ||
          error?.response?.data?.message === "Nothing in cart" ? (
            <div className="no-courses-courses">
              <div>
                <h1>No Course found in Cart</h1>
                <h5>
                  started by adding your first course in your cart and join the
                  courses of athletes around the world!
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
            <>
              <div className="top-usercart">
                <h3>Shopping Cart</h3>
              </div>
              <div className="mid-usercart">
                <div className="mid-left-usercart">
                  {cartItems?.cart?.map((item, index) => (
                    <div
                      style={{ cursor: "pointer" }}
                      key={index}
                      className="mid-left-cards-usercart"
                      onClick={() =>
                        navigate(
                          `/userCourses/userCourseView/${item.course_id}`
                        )
                      }
                    >
                      <div className="mid-left-left-usercart">
                        <img
                          loading="lazy"
                          src={item.thumbnail || cardImage}
                          alt="thumbnail"
                        />
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={(e) => handleRemoveCart(item?.id, e)}
                        >
                          {removeLoading[item?.id] ? (
                            <l-bouncy
                              size="20"
                              speed="1.2"
                              color="white"
                            ></l-bouncy>
                          ) : (
                            <p>Remove</p>
                          )}
                        </div>
                      </div>
                      <div className="mid-left-mid-usercart">
                        <h5>
                          {item?.title?.split(" ").slice(0, 3).join(" ") +
                            "..."}
                        </h5>
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              item?.description
                                ?.split(" ")
                                .slice(0, 7)
                                .join(" ") + "...",
                          }}
                        ></p>
                        <p>
                          {item?.totalRviews} reviews ({item?.rating})
                        </p>
                      </div>
                      <div className="mid-left-right-usercart">
                        <h6>
                          {" "}
                          ${item?.discounted_price}
                          <FontAwesomeIcon
                            icon={faTag}
                            className="tag-usercart"
                          />
                        </h6>
                        <span>
                          <p>${item?.price}</p>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mid-right-usercart">
                  <div className="mid-right-top-usercart">
                    <h5>Total:</h5>
                    <span>
                      <h6>${cartItems?.totalPrice}</h6>
                      <h6>$15.99</h6>
                    </span>
                    <div>
                      <p onClick={checkoutHandler} className="cursor-pointer">
                        Checkout
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </p>
                    </div>
                  </div>
                  <div className="mid-right-bottom-usercart">
                    <p>Promotions</p>
                    <div>
                      <p>WELCOME50</p>
                      <p>is applied</p>
                    </div>
                    <span>
                      <input type="text" placeholder="Enter Coupon" />
                      <span>
                        <p>Apply</p>
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bottom-usercart">
                <h5>You may also like:</h5>
                <div className="cards-usercart">
                  {cartItems?.expertCourses?.length === 0 ? (
                    <div className="no-courses-userCourses">
                      <div>
                        <h1 style={{ marginLeft: "35%" }}>
                          No More Courses Avalible
                        </h1>
                        <h5>More courses will be available soon ...</h5>
                        {/* <Link
                    to="/userCourses"
                    className="text-decoration-none text-white"
                  >
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      className="add-icon-courses"
                    />
                  </Link> */}
                      </div>
                    </div>
                  ) : (
                    cartItems?.expertCourses?.map((items, index) => (
                      <div
                        onClick={() => {
                          if (!items?.is_purchased) {
                            navigate(
                              `/userCourses/userCourseView/${items?.id}`
                            );
                          } else if (items?.is_purchased) {
                            navigate(`/userPurchasedCourses/${items?.id}`);
                          }
                        }}
                        className="card-bottom-usercart"
                        key={index}
                      >
                        <span>
                          <img
                            loading="lazy"
                            src={items?.thumbnail || cardImage}
                            alt="Course image"
                          />
                        </span>

                        <div className="middle-sec-card-usercart">
                          <div className="addCourse-card-usercart">
                            <h6 className="text-uppercase">
                              {items?.category}
                            </h6>
                          </div>
                          <div className="pricing-card-usercart">
                            <h5>Tag1 Tag2 Tag3</h5>
                          </div>
                        </div>
                        <p className="text-uppercase">{items?.name}</p>
                        <h5 className="text-uppercase">
                          {items?.title?.split(" ").slice(0, 3).join(" ")}
                        </h5>
                        <h4
                          dangerouslySetInnerHTML={{
                            __html:
                              items?.description
                                ?.split(" ")
                                .slice(0, 7)
                                .join(" ") + "...",
                          }}
                        ></h4>
                        <div className="bottom-card-userusercart">
                          <span>
                            <h5>${items?.price}</h5>
                            <h5>${items?.discount}</h5>
                          </span>
                          <div
                            onClick={(e) =>
                              !items?.is_purchased && handleCart(items?.id, e)
                            }
                          >
                            {loadingItems[items?.id] ? ( // Default values shown
                              <l-bouncy
                                size="35"
                                speed="1.2"
                                color="white"
                              ></l-bouncy>
                            ) : items?.is_purchased ? (
                              <h6>Purchased!</h6>
                            ) : (
                              <h6>Add to Cart</h6>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default UserCart;
