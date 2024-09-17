import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import formatDate from "../../utils/formatDate";
import { LuArrowUpDown } from "react-icons/lu";
import { FaCalendar } from "react-icons/fa6";

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

      <div className="tab-content px-3 py-3 custom-box rounded-top-0">
        <div className="px-4">
          {activeTab === "users" && 
           
           (error === "no students found" ? (
            <>
              <div  className="no-courses-userCourses">
             <div>
             <h1>No Students Found</h1>
            
             </div>
              </div>
            </>
          ) :(
            <div className="tab-pane active" style={{ overflowX: "auto" }}>
              <table className="table w-md-reverse-50">
                <thead>
                  <tr>
                    <th scope="col">
                      Name
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Enrolled Courses
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Joined On
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Status
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
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
