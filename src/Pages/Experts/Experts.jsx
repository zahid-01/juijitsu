import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import formatDate from "../../utils/formatDate";
import "./Experts.css";



const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const expertsUrl = `${BASE_URI}/api/v1/admin/expertsForAdmin`;

  const fetchExperts = async () => {
    try {
      const response = await axios.get(expertsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data.experts);
      setExperts(response.data?.data?.experts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(expertsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data.experts);
        setExperts(response.data?.data?.experts || []);
      } catch (err) {
        setError(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [expertsUrl, token]);

  const handleAction = async (user, action) => {
    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/admin/suspenduser/${user}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchExperts();
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

      <div className="tab-content px-3 py-3 custom-box rounded-top-0"  style={{backgroundColor:"white"}}>
        <div className="px-4 exp">

          {activeTab === "users" && 
          
          (error === "no experts found" ? (
            <>
              <div  className="no-courses-userCourses">
             <div>
             <h1>No Experts Found</h1>
            
             </div>
              </div>
            </>
          ) : (
            <div className="tab-pane active" style={{ overflowX: "auto" }}>
              <table className="table w-md-reverse-50 w-new">
                <thead>
                  <tr>
                    <th scope="col">
                      Name
                    
                    </th>
                    <th scope="col" className="text-center">
                      Total Courses
               
                    </th>
                    <th scope="col" className="text-center">
                      Joined On
                   
                    </th>
                    <th scope="col" className="text-center">
                      Status
                  
                    </th>
                    <th scope="col" className="text-center">
                      Balance
                    
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {experts.map((user, index) => {
                    const { text: statusText, color: statusColor } =
                      getStatusDetails(user.status);
                    return (
                      <tr key={index}>
                        <td className="align-middle fs-small py-2 text-capitalize">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={user.profile_picture}
                              alt={user.name}
                              style={{
                                width: "33px",
                                height: "33px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: "10px",
                              }}
                            />
                            {user.name}
                          </div>
                        </td>
                        <td className="text-center align-middle fs-small">
                          {user.total_courses}
                        </td>
                        <td className="text-center align-middle fs-small">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="text-center align-middle fs-small text-capitalize">
                          <span style={{ color: statusColor }}>
                            {statusText}
                          </span>
                        </td>
                        <td className="text-center align-middle fs-small">
                          ${user.payable_amount}
                        </td>
                        <td className="text-center align-middle">
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              handleAction(
                                user.id,
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
