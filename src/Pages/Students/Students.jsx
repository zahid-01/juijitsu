import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import formatDate from "../../utils/formatDate";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [experts, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const studentsUrl = `${BASE_URI}/api/v1/admin/usersForAdmin`;
  const fetchStudents = async () => {
    try {
      const response = await axios.get(studentsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data.users);
      setStudents(response.data?.data?.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(studentsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data.users);
        setStudents(response.data?.data?.users || []);
      } catch (err) {
        setError(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [studentsUrl, token]);

  const handleAction = async (student, action) => {
    // Handle suspend or activate action
    // console.log(`${action} user:`, student);
    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/admin/suspenduser/${student}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to map status values and return style
  const getStatusDetails = (status) => {
    switch (status) {
      case 1:
        return { text: "Active", color: "green" };
      case 0:
        return { text: "Suspended", color: "red" };
      default:
        return { text: "Unknown", color: "gray" };
    }
  };
  const getRandomColor = () => {
    const colors = [
      "#2C3E50", // Dark Blue-Gray
      "#8E44AD", // Deep Purple
      "#2980B9", // Soft Blue
      "#16A085", // Teal
      "#27AE60", // Green
      "#F39C12", // Muted Orange
      "#D35400", // Burnt Orange
      "#C0392B", // Deep Red
      "#BDC3C7", // Light Gray
      "#7F8C8D", // Slate Gray
      "#34495E", // Steel Blue
      "#E67E22", // Warm Orange
      "#9B59B6", // Purple
      "#1ABC9C", // Aquamarine
      "#3498DB", // Light Blue
      "#95A5A6", // Cool Gray
      "#E74C3C", // Muted Red
      "#F1C40F", // Soft Yellow
      "#AAB7B8", // Soft Silver
      "#5D6D7E", // Dark Slate Blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-100">
      <div
        style={{
          marginBottom: "4vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="upper-text">
          <span>
            Welcome Back, <strong>Basit Bashir</strong>
          </span>
          <p style={{ fontWeight: "lighter" }}>Track & manage your platform</p>
        </div>
        {/* <div
          className="upper-date"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaCalendar style={{ marginRight: "8px" }} />
          Sep 4, 2024
        </div> */}
      </div>

      <div
        className="tab-content px-3 py-3 custom-box rounded-top-0"
        style={{ backgroundColor: "white" }}
      >
        <div className="px-4 exp">
          {activeTab === "users" &&
            (error === "no students found" ? (
              <>
                <div className="no-courses-userCourses">
                  <div>
                    <h1>No Students Found</h1>
                  </div>
                </div>
              </>
            ) : (
              <div className="tab-pane active" style={{ overflowX: "auto" }}>
                <table className="table w-md-reverse-50 w-new">
                  <thead>
                    <tr>
                      <th scope="col ">Name</th>
                      <th scope="col" className="text-center">
                        Enrolled Courses
                      </th>
                      <th scope="col" className="text-center">
                        Joined On
                      </th>
                      <th scope="col" className="text-center">
                        Status
                      </th>

                      <th scope="col" className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {experts.map((student, index) => {
                      const { text: statusText, color: statusColor } =
                        getStatusDetails(student.status);
                      return (
                        <tr key={index}>
                          <td className="align-middle fs-small py-2 text-capitalize">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {student.profile_picture ? (
                                <img
                                  src={student.profile_picture}
                                  alt={student.name}
                                  style={{
                                    width: "33px",
                                    height: "33px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "33px",
                                    height: "33px",
                                    borderRadius: "50%",
                                    backgroundColor: getRandomColor(), // Random background color
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "10px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#fff",
                                  }}
                                >
                                  {student.name.charAt(0).toUpperCase()}{" "}
                                  {/* Display the first initial */}
                                </div>
                              )}
                              {student.name}
                            </div>
                          </td>
                          <td className="text-center align-middle fs-small">
                            {student.total_courses}
                          </td>
                          <td className="text-center align-middle fs-small">
                            {formatDate(student.created_at)}
                          </td>
                          <td className="text-center align-middle fs-small text-capitalize">
                            <span style={{ color: statusColor }}>
                              {statusText}
                            </span>
                          </td>

                          <td className="text-center align-middle">
                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                handleAction(
                                  student.id,
                                  statusText === "Active" ? 0 : 1
                                )
                              }
                            >
                              {statusText === "Active" ? "Suspend" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
