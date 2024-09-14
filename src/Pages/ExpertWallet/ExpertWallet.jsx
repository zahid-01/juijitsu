import { useState, useEffect } from "react";
import axios from "axios";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { BASE_URI } from "../../Config/url";
import formatDate from "../../utils/formatDate";

export default function ExpertWallet() {
  const [activeTab, setActiveTab] = useState("activity");
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const response = await axios.get(
          `${BASE_URI}/api/v1/expert/expertWallet`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setWalletData(response.data.data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="w-100">
        <header className="py-3">
          <ShimmerThumbnail width={200} height={30} />
          <ShimmerThumbnail
            width={150}
            height={20}
            style={{ marginTop: "10px" }}
          />
        </header>
        <main className="custom-box py-5">
          <div className="d-flex align-items-center justify-content-between px-5 pb-3">
            <div>
              <ShimmerThumbnail
                width={200}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <ShimmerThumbnail
                width={150}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <ShimmerThumbnail width={100} height={20} />
            </div>
            <div className="bg-gradient-custom-div text-center p-2 w-25 rounded-custom py-3">
              <ShimmerThumbnail
                width={200}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <ShimmerThumbnail width={150} height={30} />
              <ShimmerThumbnail
                width={100}
                height={30}
                style={{ marginTop: "10px" }}
              />
            </div>
          </div>
          <div className="d-flex gap-5 px-4 border-bottom">
            <ShimmerThumbnail
              width={100}
              height={20}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div className="tab-pane active">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7">
                    <ShimmerThumbnail width="100%" height={20} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  if (!walletData) {
    return <div>No data available</div>;
  }

  const { lastWithdrawal, orders, payable_amount } = walletData;
  const recentPayout = lastWithdrawal[0]?.total_withdrawn_amount || "$0.00";
  const accountBalance = `$${payable_amount}`;

  return (
    <div className="w-100">
      <header className="py-3">
        <h3 className="fw-bold">
          Welcome back, <span className="text-capitalize">{user.name}</span>
        </h3>
      </header>
      <main className="custom-box py-5">
        <div className="d-sm-flex align-items-center justify-content-between px-5 pb-3">
          <div className="text-center">
            <h5 className="mb-3">
              Account type:{" "}
              <span className="fw-normal text-capitalize">
                {user.user_type}
              </span>
            </h5>
            <h5 className="mb-3">
              Status: <span className="fw-normal">Verified</span>
            </h5>
            <h5 className="mb-3">
              Recent Payout: <span className="fw-normal">{recentPayout}</span>
            </h5>
          </div>
          <div className="bg-gradient-custom-div text-center p-2 w-md-25 rounded-custom py-3">
            <h5 className="mb-4 fw-light">Account Balance</h5>
            <div className="mb-4 d-flex align-items-center justify-content-between">
              <h2>💰</h2>
              <h5>{accountBalance}</h5>
              <h2>💰</h2>
            </div>
            <button className="bg-transparent text-white border-white rounded fw-light p-2">
              Withdraw money
            </button>
          </div>
        </div>
        <div className="d-flex gap-5 px-4 border-bottom">
          <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "activity"
                ? "border-bottom border-4 bg-gradient-custom-div pt-2 rounded-top"
                : ""
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </h5>
        </div>
        {activeTab === "activity" && (
          <div className="tab-pane active" style={{ overflowX: "auto" }}>
            <table className="table w-md-reverse-50">
              <thead>
                <tr>
                  <th scope="col" className="py-3">
                    Serial No.
                  </th>
                  <th scope="col" className="text-center py-3">
                    Date
                  </th>
                  <th scope="col" className="text-center py-3">
                    Type
                  </th>
                  <th scope="col" className="text-center py-3">
                    Payment Status
                  </th>
                  <th scope="col" className="text-center py-3">
                    Amount
                  </th>
                  <th scope="col" className="text-center py-3">
                    Service Charges
                  </th>
                  <th scope="col" className="text-center py-3">
                    Payable
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td className="align-middle fs-small py-3 ps-4">
                      {index + 1}.
                    </td>
                    <td className="text-center align-middle fs-small">
                      {formatDate(order.payment_date)}
                    </td>
                    <td className="text-center align-middle fs-small text-capitalize">
                      {order.payment_type}
                    </td>
                    <td className="text-center align-middle fs-small text-capitalize">
                      {order.payment_status}
                    </td>
                    <td className="text-center align-middle fs-small">
                      ${order.amount}
                    </td>
                    <td className="text-center align-middle fs-small">
                      ${order.service_charges}
                    </td>
                    <td className="text-center align-middle fs-small">
                      ${order.payable_amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
