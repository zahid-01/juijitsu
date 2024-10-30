// import { BsFillCartFill } from "react-icons/bs";
// import { CiFilter, CiSearch } from "react-icons/ci";

// export default function SmallerScreenNavbar() {

//   const handleExpertToggle =()=>{
//     const userType = localStorage.getItem("userType");
//     const oldUserType = localStorage.getItem("oldUserType");
//     if(userType === "expert" ){
//       localStorage.setItem("userType", "user");
//       setUserType("Expert");
//       localStorage.setItem("oldUserType", userType);
//       window.location.reload();
//       toast.success("You have been toggled as user");
//     }
//     else if(oldUserType === "expert" && userType === "user"){
//       localStorage.setItem("userType", "expert");
//       localStorage.removeItem("oldUserType");
//       setUserType("Student");
//       window.location.reload();
//       toast.success(`You are now an expert`);
//     }
//     else{
//       toast.error("You are not eligible for this feature")
//     }
//   }

  
//   return (
//     <div className="d-flex align-items-center p-2">
//       <h4 className="text w-100 gradient-text fw-bold">Jiux</h4>
//       <div className="d-flex align-items-center gap-3">
//         <CiSearch className="primary-color fs-3  cursor-pointer" />
//         <CiFilter className="primary-color fs-3  cursor-pointer" />
//         <BsFillCartFill className="primary-color fs-3  cursor-pointer" />
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import "../Navbar/Navbar.css";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { BiSolidChevronRightSquare } from "react-icons/bi";
import { IoIosAddCircleOutline, IoMdNotifications } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { PiFolderUserFill } from "react-icons/pi";
import { BsBellFill, BsFillCartFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";

export default function SmallerScreenNavbar({ collapsed, search, setSearch, cartItemNumber }){
  const location = useLocation()
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const profileBarRef = useRef(null); // Reference for the profile-bar
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const role = localStorage.getItem("userType");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userType = localStorage.getItem("userType");
  const [searchBox, setSearchBox]= useState(false)
  const [signUpAs , setSignUpAs] = useState('')
  const oldUserType = localStorage.getItem("oldUserType");
  const [experts, setExperts] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [UserType, setUserType] = useState("Expert")
  const profileUrl = `${BASE_URI}/api/v1/users/profile`;
  

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const notifications = useSelector((state) => state.payouts.notifications);
  useSelector((state) => state.cart);

  const { data, refetch } = useFetch(profileUrl, fetchOptions);
  const { name, profile_picture } = data?.data[0] || [];

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setUser(JSON.parse(localStorage.getItem("user")));
  //     setToken(localStorage.getItem("token"));
  //   };
  //   const intervalId = setInterval(handleStorageChange, 1000);
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    if (location.pathname === "/signUp") {
      setSignUpAs("Expert");
    } 
    else if (location.pathname === "/ExpertSignUp") {
      setSignUpAs("User");
    } 
    else {
      setSignUpAs("");
    }
  
    if (location.pathname === "/userCourses") {
      setSearchBox(true);
    } else {
      setSearchBox(false);
    }
  
    
  }, [location]);

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

  const handleExpertToggle =()=>{
    const userType = localStorage.getItem("userType");
    const oldUserType = localStorage.getItem("oldUserType");
    if(userType === "expert" ){
      localStorage.setItem("userType", "user");
      setUserType("Expert");
      localStorage.setItem("oldUserType", userType);
      window.location.reload();
      toast.success("You have been toggled as user");
    }
    else if(oldUserType === "expert" && userType === "user"){
      localStorage.setItem("userType", "expert");
      localStorage.removeItem("oldUserType");
      setUserType("Student");
      window.location.reload();
      toast.success(`You are now an expert`);
    }
    else{
      toast.error("You are not eligible for this feature")
    }
  }

  return (
    <nav
    
      className={`navbar navbar-expand-lg d-flex align-items-center ps-3 pe-4 ${(userType === "user" || !token) && "user-navbar"}  ${
        token ? "justify-content-between" : "justify-content-center"
      } ${collapsed ? "collapsed" : ""}`}
    >
     <h4 className="text gradient-text fw-bold">MY JIU JITSU</h4>
     {!token && 
     <div className="d-flex gap-3 align-items-center">
        
     <div style={{marginLeft:`${!token ? "0.7rem" : 0}`}} className="search-input input-group">
       {searchBox &&<>
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
       /></>}
        {
              (signUpAs === "User" || signUpAs === "Expert") && 
              <span onClick={signUpAs === 'User' ? () => navigate("/signUp") : () => navigate("/ExpertSignUp")} style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem", textAlign:"center", whiteSpace:"nowrap"}} classname="text-black">SignUp As {signUpAs}</span>
//               <button onClick={signUpAs === 'User' ? () => navigate("/signUp") : () => navigate("/ExpertSignUp")}
//               style={{marginLeft:"50%"}} class="mt-3 learn-more-user">
//   <span class="circle" aria-hidden="true">
//   <span class="icon arrow"></span>
//   </span>
//   <span class="button-text">SignUp As {signUpAs}</span>
// </button>
            }
     </div>
     
   </div>
     }
      {(userType === "user") && (
        <div className="d-flex gap-3 align-items-center">
        
          <div className="search-input input-group">
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
          {/* <CiFilter className="primary-color fs-2 ms-3 cursor-pointer" /> */}
          {
            oldUserType === "expert" &&
          
  <span style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem", textAlign:"center", whiteSpace:"nowrap"}} onClick={handleExpertToggle} classname="text-black">Go {UserType}</span>

          }
          <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/>
        </div>
      )}
      {/* {userType === "user" && ( */}
      {/* {userType === "user" && ( */}
{/* //         <div className="cart-container"> */}
           {/* //           <Link to="/userCart">
// //             <BsFillCartFill className="primary-color fs-2 ms-5 cursor-pointer" />
// //           </Link> */}
{/* //           <Cart /> */}

        {/* <div className="cart-badge">{cartItemNumber}</div>{" "} */}
{/* //         </div> */}
<></>
      {/* )} */}

      {userType === "admin" && (
        <div className="cart-container admin-cart-container flex gap-4 align-items-center" >
          <Link to="/transactions">
            <BsBellFill className="primary-color fs-4 ms-5 cursor-pointer" />
          </Link>
          <div className="cart-badge">{notifications}</div>{" "}
          <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/>
        </div>
      )}


      {userType === "expert" && (
       <div className="flex gap-3 align-items-center justify-content-center">

{/* <button class="learn-more" >
  <span class="circle" aria-hidden="true">
  <span class="icon arrow"></span>
  </span> */}
  <span style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem"}} onClick={handleExpertToggle} classname="text-black">Go Student</span>
  <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
  <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/>
{/* </button> */}
       
       
       
       </div>

        
      )}
      {/* {token && (
        <div onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          <div className="profile-picture-container">
            {profile_picture ? (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
             
              <img
                src={profile_picture}
                alt="Profile"
                className="profile-picture"
                style={{ objectFit: "cover", height: "3rem", width: "3rem" }} 
              />
       
              

              </>
              
            ) : (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
              <FaUserCircle
                className="profile-picture text-secondary"
                style={{ fontSize: "3rem" }}
              />
              </>
            )}
          </div>
        </div>
      )} */}

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
            {profile_picture ? (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
             
              <img
                src={profile_picture}
                alt="Profile"
                className="profile-picture"
                style={{ objectFit: "cover", height: "5rem", width: "5rem" }} 
              />
       
              

              </>
              
            ) : (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
              <FaUserCircle
                className="profile-picture text-secondary"
                style={{ fontSize: "3rem" }}
              />
              </>
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
          {/* <div className="d-flex align-items-center justify-content-between px-4">
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
          </div> */}
          <div style={{ height: "8rem" }}></div>

          {/* other experts */}
          {token && role === "expert" && (
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
                <button className="signup-now w-100 rounded-pill">
                  See all
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </nav>
  );
};
