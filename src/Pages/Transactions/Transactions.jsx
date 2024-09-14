import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import { LuArrowUpDown } from "react-icons/lu";
import { FaCalendar } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import "./Transactions.css";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  const token = localStorage.getItem("token");

  const transactionsUrl = `${BASE_URI}/api/v1/admin/adminPayHistory`;
  const payoutRequestsUrl = `${BASE_URI}/api/v1/admin/payoutRequest`; // New URL for payout requests
  const getCommissionUrl = `${BASE_URI}/api/v1/admin/commission`;

  const [transactions, setTransactions] = useState([]);

  const [payoutRequests, setPayoutRequests] = useState([]); // New state for payout requests

  const [editCommission, setEditCommission] = useState({
    id: "",
    commission: "",
  });
  const [originalCommission, setOriginalCommission] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const editCommissionUrl = `${BASE_URI}/api/v1/admin/commission/${editCommission.id}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(transactionsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data?.data?.history || []);
        // console.log(response.data?.data?.history); // Log the data to check structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPayoutRequests = async () => {
      // New function to fetch payout requests
      try {
        const response = await axios.get(payoutRequestsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayoutRequests(response.data?.data || []);
        console.log(response.data.data);
        // console.log(payoutRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchEditCommission = async () => {
      try {
        const response = await axios.get(getCommissionUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const commissionData = response.data.commission || {};
        console.log(response);
        setEditCommission(commissionData);
        setOriginalCommission(commissionData.commission || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "transactions") {
      fetchTransactions();
    } else if (activeTab === "payoutRequests") {
      // Fetch payout requests when the tab is active
      fetchPayoutRequests();
    } else if (activeTab === "editCommission") {
      // Fetch payout requests when the tab is active
      fetchEditCommission();
    }
  }, [activeTab, transactionsUrl, payoutRequestsUrl, editCommissionUrl, token]);

  const handleAction = (expert, action) => {
    console.log(`${action} expert:`, expert);
  };

  const handlesave = async () => {
    console.log(editCommission);
    try {
      const response = await axios.patch(
        editCommissionUrl,
        {
          commission: editCommission.commission,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOriginalCommission(editCommission.commission);
      // setEditCommission(response.data || []);
      setIsEditable(false);

      console.log(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = () => {
    setIsEditable(true);
  };
  const handleDiscard = () => {
    setEditCommission((prev) => ({
      ...prev,
      commission: originalCommission,
    }));
    setIsEditable(false);
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
      <header className="header-container p-3 pb-0 rounded-bottom-0 custom-box">
        <div className="d-flex gap-5 px-4">
          {[
            // "payExperts",
            "transactions",
            "payoutRequests", // New tab for payout requests
            "editCommission",
          ].map((tab) => (
            <h5
              key={tab}
              className={`tab-item px-3 pb-3 py-1 fw-light cursor-pointer ${
                activeTab === tab ? "active-tab" : "inactive-tab"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab
                .replace(/([A-Z])/g, " $1")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </h5>
          ))}
        </div>
      </header>

      <div className="tab-content px-3 py-1 custom-box rounded-top-0">
        <div className="px-4">
          {/* Transactions */}
          {activeTab === "transactions" && (
            <div className="tab-pane active" style={{ overflowX: "auto" }}>
              <table className="table w-md-reverse-50">
                <thead>
                  <tr>
                    <th scope="col">
                      Name
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Price
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Transaction Id
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Transaction Date
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((user, index) => (
                    <tr key={index}>
                      <td className="align-middle fs-small py-2 text-capitalize">
                        <div style={{ display: "flex", alignItems: "center" }}>
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
                        {user.withdrawal_amount}
                      </td>
                      <td className="text-center align-middle fs-small">
                        {user.transaction_id}
                      </td>
                      <td className="text-center align-middle fs-small">
                        {new Date(user.withdrawal_date).toLocaleDateString()}
                      </td>
                      <td className="text-center align-middle fs-small">
                        <span
                          style={{
                            color:
                              user.withdrawal_status.toLowerCase() === "success"
                                ? "green"
                                : user.withdrawal_status.toLowerCase() ===
                                  "failed"
                                ? "red"
                                : "black",
                          }}
                        >
                          {user.withdrawal_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payout Requests */}
          {activeTab === "payoutRequests" && (
            <div className="tab-pane active" style={{ overflowX: "auto" }}>
              <table className="table w-md-reverse-50">
                <thead>
                  <tr>
                    <th scope="col">
                      Name
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Amount Requested
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Requested On
                      <LuArrowUpDown style={{ marginLeft: "8px" }} />
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payoutRequests.map((request, index) => (
                    <tr key={index}>
                      <td className="align-middle fs-small py-2 text-capitalize">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={request.profile_picture}
                            alt={request.name}
                            style={{
                              width: "33px",
                              height: "33px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: "10px",
                            }}
                          />
                          {request.name}
                        </div>
                      </td>
                      <td className="text-center align-middle fs-small">
                        ${request.amount}
                      </td>
                      <td className="text-center align-middle fs-small">
                        {request.created_at}
                      </td>
                      <td className="text-center align-middle fs-small">
                        <button
                          className="btn"
                          style={{
                            background:
                              "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                            color: "white",
                          }}
                          onClick={() => handleAction(request, "Pay Now")}
                        >
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit commisson  */}
          {activeTab === "editCommission" && (
            <div className="tab-pane active">
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="commission" className="form-label">
                    <strong>Commission Rate</strong>
                  </label>
                  <div className="input-part" style={{ display: "flex" }}>
                    <input
                      style={{
                        width: "60vh",
                        border: "1px solid #3a4e6f", // Blue border with a width of 2px
                      }}
                      type="text"
                      placeholder="Enter Percentage"
                      id="commission"
                      className="form-control"
                      value={editCommission.commission || ""} // Access the commission property inside the commission object
                      onChange={(e) =>
                        setEditCommission((prev) => ({
                          ...prev,
                          commission: e.target.value,
                        }))
                      }
                      disabled={!isEditable}
                    />
                    <div className="col-12 button-group">
                      {isEditable ? (
                        <>
                          <button
                            className="btn"
                            style={{
                              background:
                                "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                              color: "white",
                            }}
                            onClick={handlesave}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary ms-2"
                            style={{
                              background: "white",
                              color: "black",
                              border: "white",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                            onClick={handleDiscard}
                          >
                            Discard
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-secondary ms-2 input-group-text h-100  px-4 bg-light-custom cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                            color: "white",
                            border: "white",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={handleEdit}
                        >
                          <FaPen />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
