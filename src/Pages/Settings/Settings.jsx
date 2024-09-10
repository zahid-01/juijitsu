import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import Modal from "../../Components/Modal/Modal";
import { BASE_URI } from "../../Config/url";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("accountSecurity");
  const [image, setImage] = useState(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [finalDelete, setFinalDelete] = useState(false);
  const [isModalPasswordChange, setIsModalPasswordChange] = useState(false);
  const [isModalEmailChange, setIsModalEmailChange] = useState(false);
  const [updatePasswordData, setUpdatePasswordData] = useState({
    password: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    users: {
      name: "",
    },
  });
  const inputRef = useRef(null);

  const token = localStorage.getItem("token");
  const profileUrl = `${BASE_URI}/api/v1/users/profile`;
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data, refetch } = useFetch(profileUrl, fetchOptions);
  const { email, password, name, profile_picture } = data?.data[0] || [];

  const handlePasswordUpdateAction = () => {
    axios
      .patch(
        `${BASE_URI}/api/v1/auth/updatePassword`,
        updatePasswordData,
        fetchOptions
      )
      .then((resp) => {
        console.log(resp.data);
        toast.success(resp.data.message);
        setUpdatePasswordData({
          password: "",
          newPassword: "",
          passwordConfirm: "",
        });
        setIsModalPasswordChange(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const handleUpdateProfilePicture = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append(
      "profile_picture",
      profilePicture ? profilePicture : profile_picture
    );
    formData.append("name", userData?.users?.name);
    console.log(formData);
    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      toast.success(
        response.data.message
          ? response.data.message
          : "Profile updated successfully"
      );

      setProfilePicture("");
      setImage(null);
      setIsReadOnly(true);

      refetch();
    } catch (err) {
      setIsLoading(false);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating the profile"
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const closeModalDelete = () => {
    setIsModalDelete(false);
  };

  const closeModalPasswordChange = () => {
    setIsModalPasswordChange(false);
  };

  const closeModalEmailChange = () => {
    setIsModalEmailChange(false);
  };

  const handleNextAction = () => {
    setIsModalDelete(false);
    setFinalDelete(true);
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
  };

  const handleEditNameClick = () => {
    setIsReadOnly(false);
    inputRef.current.focus();
  };

  const handleUpdatePasswordChange = (e) => {
    const { name, value } = e.target;
    setUpdatePasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // console.log(profilePicture);

  return (
    <div className="w-100">
      <header
        className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-0 custom-box"
        style={{ overflowX: "auto" }}
      >
        <div style={{ width: "37rem" }}>
          <h3 className="pb-5">Settings</h3>
          <div className="d-flex gap-5 px-4">
            <h5
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "accountSecurity" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("accountSecurity")}
            >
              Account Security
            </h5>
            <h5
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "editProfile" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </h5>
            <h5
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "closeAccount" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("closeAccount")}
            >
              Close Account
            </h5>
          </div>
        </div>
      </header>
      <div className="tab-content px-3 py-4 custom-box rounded-top-0">
        <div className="px-4">
          {activeTab === "accountSecurity" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              <form>
                <div className="form-group w-md-50 mb-4">
                  <label
                    htmlFor="email"
                    className="mb-1"
                    style={{ fontSize: "20px" }}
                  >
                    Email
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control py-3"
                      id="email"
                      placeholder="Enter email"
                      value={email ? email : ""}
                      readOnly
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={() => setIsModalEmailChange(true)}
                      >
                        <FaPen />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group w-md-50">
                  <label
                    htmlFor="password"
                    className="mb-1"
                    style={{ fontSize: "20px" }}
                  >
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control py-3"
                      id="password"
                      value={password ? password : ""}
                      placeholder="Enter password"
                      readOnly
                    />
                    <div className="input-group-append ">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={() => setIsModalPasswordChange(true)}
                      >
                        <FaPen />
                      </span>
                    </div>
                  </div>
                </div>
              </form>
              <Modal
                show={isModalEmailChange}
                onClose={closeModalEmailChange}
                heading="Change Email"
                // handleClickAction={handleNextAction}
              >
                <input
                  type="email"
                  className=" py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  placeholder="Enter email"
                />
                <input
                  type="password"
                  className=" py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  placeholder="Enter password"
                />
                <p
                  className="mb-4"
                  style={{ fontSize: "13px", fontWeight: "300" }}
                >
                  For security reason any saved card information will be deleted
                  if you change email.
                </p>
                <div className="d-flex align-items-center justify-content-end">
                  <button className="signup-now py-1 px-3 fw-lightBold mb-0 h-auto">
                    Save
                  </button>
                </div>
              </Modal>

              <Modal
                show={isModalPasswordChange}
                onClose={closeModalPasswordChange}
                heading="Change Password"
                // handleClickAction={handleNextAction}
              >
                <input
                  type="password"
                  className=" py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  name="password"
                  value={updatePasswordData.password}
                  placeholder="Enter current password"
                  onChange={handleUpdatePasswordChange}
                />
                <input
                  type="password"
                  className=" py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  name="newPassword"
                  value={updatePasswordData.newPassword}
                  placeholder="Enter current New password"
                  onChange={handleUpdatePasswordChange}
                />
                <input
                  type="password"
                  className=" py-2 px-3 mb-4 w-100 border border-2 rounded-3"
                  name="passwordConfirm"
                  value={updatePasswordData.passwordConfirm}
                  placeholder="Confirm New password"
                  onChange={handleUpdatePasswordChange}
                />
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    className="signup-now py-1 px-3 fw-lightBold mb-0 h-auto"
                    onClick={handlePasswordUpdateAction}
                  >
                    Save
                  </button>
                </div>
              </Modal>
            </div>
          )}
          {activeTab === "editProfile" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              <form>
                <div className="form-group w-md-50 mb-4">
                  <label
                    htmlFor="name"
                    className="mb-1"
                    style={{ fontSize: "20px" }}
                  >
                    Full Name
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control py-3"
                      id="name"
                      value={isReadOnly ? name : userData.users.name}
                      placeholder="Enter name"
                      readOnly={isReadOnly}
                      ref={inputRef}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          users: { ...userData.users, name: e.target.value },
                        })
                      }
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditNameClick}
                      >
                        <FaPen />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group w-md-50 mb-5">
                  <label
                    htmlFor="image"
                    className="mb-1"
                    style={{ fontSize: "20px" }}
                  >
                    Profile Photo
                  </label>
                  <div className="text-center mb-3">
                    {image ? (
                      <div className="w-75 border rounded-3">
                        <img
                          src={image}
                          alt="Preview"
                          className="img-thumbnail object-fit-contain"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                    ) : (
                      <div className="w-75 border rounded-3">
                        <img
                          src={profile_picture}
                          alt="img"
                          className="img-thumbnail object-fit-contain"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control py-3"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer fw-light"
                        // onClick={handleUpdateProfilePicture}
                      >
                        Upload Image
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="signup-now py-2 px-4 fw-lightBold mb-0 h-auto"
                  onClick={handleUpdateProfilePicture}
                >
                  {isLoading ? <PulseLoader size={8} color="white" /> : "Save"}
                </button>
              </form>
            </div>
          )}
          {activeTab === "closeAccount" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              <div
                className="pb-5 d-flex flex-column align-items-start justify-content-between w-md-50 h-100"
                style={{ minHeight: "23rem" }}
              >
                <p>
                  If you close your account, you will be unsubscribed from all
                  of your courses and will lose access to your account and data
                  associated with your account forever, even if you choose to
                  create a new account using the same email address in the
                  future.
                </p>
                <button
                  className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                  onClick={() => setIsModalDelete(true)}
                >
                  Close Account
                </button>
              </div>

              <Modal
                show={isModalDelete}
                onClose={closeModalDelete}
                btnName="Close Account"
                heading="Close Account?"
                handleClickAction={handleNextAction}
              >
                <div className="form-group text-start">
                  <label
                    htmlFor="formBasicPassword"
                    className="mb-2 fw-light fs-small"
                  >
                    Are you sure you want to delete your account?
                  </label>
                  <input
                    type="password"
                    className="form-control py-3"
                    id="formBasicPassword"
                    placeholder="Enter your password"
                  />
                </div>
              </Modal>

              <Modal show={finalDelete} path="/" btnName="Continue">
                Your account has been successfully deleted!
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
