import { useState, useEffect } from "react";
import learnImg from "../../assets/learnImg.avif";
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URI } from "../../Config/url";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { userCartActions } from "../../Store/cartSlice";
import { useDispatch } from "react-redux";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailVerify, setEmailVerify] = useState([]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const response = params.get("response");
    // console.log(response);
    if (response) {
      try {
        const parsedResponse = JSON.parse(decodeURIComponent(response));

        if (parsedResponse.token && parsedResponse.user) {
          localStorage.setItem("token", parsedResponse.token);
          localStorage.setItem("userType", parsedResponse.user.user_type);
          localStorage.setItem("user", JSON.stringify(parsedResponse.user));

          toast.success("Logged In Successfully!");
          console.log(parsedResponse.user);

          if (parsedResponse.user.user_type === "expert") {
            navigate("/courses");
          } else if (parsedResponse.user.user_type === "user") {
            navigate("/userCourses");
          } else if (parsedResponse.user.user_type === "admin") {
            navigate("/adminDashboard");
          }
        }
      } catch (error) {
        console.error("Failed to parse response", error);
        toast.error("Failed to process login response.");
      }
    }
  }, [location, navigate]);

  // localStorage.removeItem("token");
  // localStorage.removeItem("user");
  // localStorage.removeItem("userType");
  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
    if (event.target.checked) {
      localStorage.setItem("rememberMee", "rememberMee");
    } else {
      localStorage.removeItem("rememberMee");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URI}/api/v1/auth/google`;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   axios
  //     .post(`${BASE_URI}/api/v1/auth/login`, data)
  //     .then((resp) => {
  //       localStorage.setItem("user", JSON.stringify(resp.data.Data));
  //       localStorage.setItem("userType", resp.data.Data.user_type);
  //       localStorage.setItem("token", resp.data.token);

  //       setData({
  //         email: "",
  //         password: "",
  //       });
  //       axios({
  //         method: "GET",
  //         url: `${BASE_URI}/api/v1/cart`,
  //         headers: {
  //           Authorization: "Bearer " + resp.data.token,
  //         },
  //       }).then(
  //         (res) => {
  //           console.log(res.data.cart);
  //           dispatch(userCartActions.setCart(res.data.cart));
  //         },
  //         () => {}
  //       );
  //       toast.success("Logged In Successfully!");
  //       if (resp.data.Data.user_type === "expert") {
  //         // navigate("/courses");
  //         window.location.reload();
  //       } else if (resp.data.Data.user_type === "user") {
  //         // history.push("/courses");
  //         window.location.reload();
  //       } else if (resp.data.Data.user_type === "admin") {
  //         window.location.reload();
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err?.response?.data?.message);
  //       setIsLoading(false);
  //       toast.error(`Error: ${err?.response?.data?.message}`);
  //     });

  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BASE_URI}/api/v1/auth/login`, data)
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data.Data));
        localStorage.setItem("userType", resp.data.Data.user_type);
        localStorage.setItem("token", resp.data.token);

        setData({
          email: "",
          password: "",
        });
        axios({
          method: "GET",
          url: `${BASE_URI}/api/v1/cart`,
          headers: {
            Authorization: "Bearer " + resp.data.token,
          },
        }).then(
          (res) => {
            console.log(res.data.cart);
            dispatch(userCartActions.setCart(res.data.cart));
          },
          () => {}
        );
        toast.success("Logged In Successfully!");
        if (resp.data.Data.user_type === "expert") {
          window.location.reload();
        } else if (resp.data.Data.user_type === "user") {
          window.location.reload();
        } else if (resp.data.Data.user_type === "admin") {
          window.location.reload();
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
        setIsLoading(false);

        // Check for specific error message
        if (err?.response?.data?.message === "email is not verified yet") {
          setPopupMessage(
            "Your email is not verified yet. Please verify your email to proceed."
          );
          setShowPopup(true);
        } else {
          toast.error(`Error: ${err?.response?.data?.message}`);
        }
      });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const emailVerifyRequest = async () => {
    console.log(data.email);
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/auth/email/verifyEmail`,
        { email: data.email }
      );
      setEmailVerify(response.data?.data?.history || []);
    } catch (err) {
      console.log(err)
      // setError(err?.response?.data?.message);
    } finally {
      // setLoading(false);
    }
  };

  // if (localStorage.getItem("rememberMe")) {
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("userType") === "expert") {
      return <Navigate to="/courses" />;
    } else if (localStorage.getItem("userType") === "user") {
      return <Navigate to="/userCourses" />;
    } else if (localStorage.getItem("userType") === "admin") {
      return <Navigate to="/adminDashboard" />;
    }
  }

  return (
    <div className="container-fluid signin-container">
      <div className="row w-100 h-100">
        <div className="signup-image w-50">
          <img src={learnImg} alt="Image" className="img-fluid" />
          <div className="signUp-text">
            <h3 className="expertise mb-0">Share Your Expertise.</h3>
            <h3 className="expertise mb-4">
              Inspire Athletes. Transform Lives.
            </h3>
            <div className="join-team d-flex justify-content-center">
              <p className="w-75">
                Join our team of elite instructors and make a difference in the
                world of sports and athletics.
              </p>
            </div>
          </div>
        </div>
        <div className="signUp-form col-md-5 w-50 p-4">
          <div className="signup-start mt-0">
            <h2 className="mt-3">Sign In</h2>
            <p className="mb-4">Start your Inspiring journey now!</p>
          </div>
          <div className="signup-auth">
            <button
              type="button"
              className="bttns google-signup"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="googleIcon" />
              Sign In with Google
            </button>
            <button type="button" className="bttns">
              <FaApple className="appleIcon" />
              Sign In with Apple
            </button>
          </div>
          <div className="d-flex align-items-center py-4">
            <p
              className="mb-0"
              style={{
                height: "1px",
                backgroundColor: "#C9D1D5",
                width: "50%",
              }}
            ></p>{" "}
            <span className="fs-small px-2">OR</span>
            <p
              style={{
                height: "1px",
                backgroundColor: "#C9D1D5",
                width: "50%",
              }}
              className="mb-0"
            ></p>
          </div>
          <form action="signIn" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold fs-small">
                Email
              </label>
              <div className="input-group">
                <label htmlFor="email" className="input-group-text">
                  <MdOutlineEmail />
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control py-2-half-5"
                  placeholder="Enter Email"
                  aria-label="Email"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold fs-small">
                Password
              </label>
              <div className="input-group">
                <label htmlFor="password" className="input-group-text">
                  <IoKeyOutline />
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control border-end-0 py-2-half-5"
                  placeholder="Enter Password"
                  aria-label="Password"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-group-text border-start-0"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye className="neutral-color" />
                  ) : (
                    <FaEyeSlash className="neutral-color" />
                  )}
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="rememberMe"
                  className="form-check-label fs-small"
                >
                  Remember Me
                </label>
              </div>
              <Link
                to="/passwordRecovery"
                // onClick={handleForgotPasswordClick}
                className="accent-color"
              >
                Forgot Password?
              </Link>
            </div>
            <button className="signup-now w-100">
              {isLoading ? <PulseLoader size={8} color="white" /> : "Sign In"}
            </button>
          </form>
          <div className="text-center">
            <p className="fs-small">
              Don’t have account yet?
              <Link to="/signUp" className="login-link text-black fw-bold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Popup for unverified email */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box custom-popup">
            <p className="popUpMessage">{popupMessage}</p>
            <button onClick={closePopup} className="cancel-buttonn">
              Close
            </button>
            <button
              className="send-request-button"
              onClick={emailVerifyRequest}
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
