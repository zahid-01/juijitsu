import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { BiSolidChevronRightSquare } from "react-icons/bi";
import { IoIosAddCircleOutline, IoMdNotifications } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { PiFolderUserFill } from "react-icons/pi";
import { BsBellFill, BsFillCartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import useFetch from "../../hooks/useFetch";

export const Navbar = ({ collapsed, search, setSearch, cartItemNumber }) => {
  const searchInputRef = useRef(null);
  const profileBarRef = useRef(null); // Reference for the profile-bar
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userType = localStorage.getItem("userType");
  const [experts, setExperts] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(null);

  const profileUrl = `${BASE_URI}/api/v1/users/profile`;
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data, refetch } = useFetch(profileUrl, fetchOptions);
  const { name, profile_picture } = data?.data[0] || [];

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
      setToken(localStorage.getItem("token"));
    };
    const intervalId = setInterval(handleStorageChange, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(
            `${BASE_URI}/api/v1/users/otherExperts`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const result = await response.json();
          if (result.status === "Success") {
            setExperts(result.data);
          }
        } catch (error) {
          toast.error("Error fetching experts");
        }
      };

      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${BASE_URI}/api/v1/users/profileCompletion`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((resp) => {
          // console.log(resp.data.data.profileCompletion);
          setProfileCompletion(parseInt(resp.data.data.profileCompletion, 10));
        });
    }
  }, [token]);

  const handleIconClick = () => {
    searchInputRef.current.focus();
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileBarRef.current &&
      !profileBarRef.current.contains(event.target) &&
      !event.target.closest(".profile-picture-container")
    ) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav
      className={`navbar navbar-expand-lg d-flex align-items-center ps-6 pe-5  ${
        token ? "justify-content-between" : "justify-content-center"
      } ${collapsed ? "collapsed" : ""}`}
    >
      <div className="d-flex gap-3 align-items-center w-75">
        <div className="search-input input-group w-75">
          <label
            className="input-group-text search-icon border-end-0"
            htmlFor="search"
            onClick={handleIconClick}
          >
            <CiSearch />
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search here..."
            aria-label="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={searchInputRef}
            className="navbar-input form-control border-start-0 ps-0"
          />
        </div>
        <CiFilter className="primary-color fs-2 ms-3 cursor-pointer" />
      </div>
      {/* {userType === "user" && ( */}
      {userType === "user" && (
        <div className="cart-container">
          <Link to="/userCart">
            <BsFillCartFill className="primary-color fs-2 ms-5 cursor-pointer" />
          </Link>
          {/* <div className="cart-badge">{cartItemNumber}</div>{" "} */}
        </div>
      )}


      {userType === "admin" && (

        <div className="cart-container">
          <Link to="/userCart">
            <BsBellFill className="primary-color fs-2 ms-5 cursor-pointer" />
          </Link>

          <div className="cart-badge">{cartItemNumber}</div>{" "}

        </div>
      )}

      {token && (
        <div onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          <div className="profile-picture-container">
          
            {profile_picture ? (
              <img
                src={profile_picture}
                alt="Profile"
                className="profile-picture"
                style={{ objectFit: "cover", height: "3rem", width: "3rem" }}
              />
            ) : (
              <FaUserCircle
                className="profile-picture text-secondary"
                style={{ fontSize: "3rem" }}
              />
            )}
          </div>
        </div>
      )}
      <div
        ref={profileBarRef} // Add the ref to the profile-bar
        className={`profile-bar rounded-4 text-black px-4 py-4 ${
          isProfileOpen ? "open" : ""
        }`}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <p className="mb-0 fs-small w-60 text-end text-secondary">
            Your Profile
          </p>
          <BiSolidChevronRightSquare
            className="primary-color fs-3 cursor-pointer"
            onClick={handleProfileClick}
          />
        </div>
        <main className="text-center">
          <div className="profile-picture-container">
            <div
              className="completion-bar"
              style={{
                background: `conic-gradient(#0c243c ${profileCompletion}%, #e0e0e0 ${profileCompletion}% 100%)`,
                width: "6rem",
                height: "6rem",
              }}
            ></div>
            {profile_picture ? (
              <img
                src={profile_picture}
                alt=""
                className="profile-picture mb-4"
                style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
              />
            ) : (
              <FaUserCircle
                className="profile-picture text-secondary"
                style={{ fontSize: "5rem" }}
              />
            )}
          </div>

          <h4 className="fw-lightBold mb-1 text-capitalize">
            Good Morning {name?.split(" ")[0]}
          </h4>
          <p
            className="text-center lightgray-color fs-small mb-3"
            style={{ lineHeight: "14.52px" }}
          >
            Continue your journey and Inspire many
          </p>
          <div className="d-flex align-items-center justify-content-between px-4">
            <p
              className="d-flex align-items-center justify-content-center rounded-circle border border-secondary mb-0"
              style={{ height: "3rem", width: "3rem" }}
            >
              <IoMdNotifications className="fs-4 primary-color" />
            </p>
            <p
              className="d-flex align-items-center justify-content-center rounded-circle border border-secondary mb-0"
              style={{ height: "3rem", width: "3rem" }}
            >
              <MdMessage className="fs-4 primary-color" />
            </p>
            <p
              className="d-flex align-items-center justify-content-center rounded-circle border border-secondary mb-0"
              style={{ height: "3rem", width: "3rem" }}
            >
              <PiFolderUserFill className="fs-4 primary-color" />
            </p>
          </div>
          <div style={{ height: "8rem" }}></div>
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="fw-lightBold mb-0">Other Experts</h4>
              <IoIosAddCircleOutline className="fs-2 text-secondary" />
            </div>
            <div className="mb-4">
              {experts.map((expert) => (
                <div
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                  key={expert.id}
                >
                  <div className="d-flex align-items-center gap-2">
                    {expert.profile_picture ? (
                      <img
                        src={expert.profile_picture}
                        alt=""
                        className="rounded-circle"
                        style={{
                          height: "2rem",
                          width: "2rem",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <FaUserCircle
                        className="fs-2"
                        style={{
                          height: "2rem",
                          width: "2rem",
                        }}
                      />
                    )}
                    <div>
                      <p className="mb-0 fw-lightBold text-start text-capitalize">
                        {expert.name}
                      </p>
                      {/* Optional: Display designation if you have it */}
                      {/* <p className="mb-0 fs-small text-start">{user.designation}</p> */}
                    </div>
                  </div>
                  <button
                    className="rounded-pill px-3 py-1 bg-custom-primary text-white fs-small"
                    // onClick={() => onFollow(user.id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
            {experts.length > 3 && (
              <button className="signup-now w-100 rounded-pill">See all</button>
            )}
          </div>
        </main>
      </div>
    </nav>
  );
};
