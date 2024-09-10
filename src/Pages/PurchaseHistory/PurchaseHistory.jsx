import { useMemo, useState } from "react";
import { BASE_URI } from "../../Config/url";
import useFetch from "../../hooks/useFetch";
import formatDate from "../../utils/formatDate";

const PurchaseHistory = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const token = localStorage.getItem("token");
  const historyUrl = `${BASE_URI}/api/v1/users/orderHistory`;

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data } = useFetch(historyUrl, fetchOptions);
  const orders = useMemo(() => data?.data?.orders || [], [data]);

  const handlePrint = (order) => {
    const printContent = `
      <div>
        <h3>Order Receipt</h3>
        <p><strong>Course Name:</strong> ${order.title}</p>
        <p><strong>Date:</strong> ${formatDate(order.payment_date)}</p>
        <p><strong>Transaction ID:</strong> ${order.transaction_id}</p>
        <p><strong>Price:</strong> ${order.discounted_price}</p>
        <p><strong>Payment Type:</strong> ${order.payment_type}</p>
      </div>
    `;
    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="w-100">
      <header className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-0 custom-box">
        <h3 className="pb-5">Purchase History</h3>
        <div className="d-flex gap-5 px-4">
          <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "courses" ? "border-bottom border-4" : ""
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </h5>
          <h5
            className={`text-white px-3 pb-2 fw-light cursor-pointer ${
              activeTab === "refund" ? "border-bottom border-4" : ""
            }`}
            onClick={() => setActiveTab("refund")}
          >
            Refund
          </h5>
        </div>
      </header>
      <div className="tab-content px-3 py-4 custom-box rounded-top-0">
        <div className="px-4">
          {activeTab === "courses" && (
            <div className="tab-pane active" style={{ overflowX: "auto" }}>
              <table className="table w-md-reverse-50">
                <thead>
                  <tr>
                    <th scope="col">Course Name</th>
                    <th scope="col" className="text-center ">
                      Date
                    </th>
                    <th scope="col" className="text-center">
                      Transaction ID
                    </th>
                    <th scope="col" className="text-center">
                      Price
                    </th>
                    <th scope="col" className="text-center">
                      Payment Type
                    </th>
                    <th scope="col" className="text-center">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td className="align-middle fs-small py-3 text-capitalize">
                        {order.title}
                      </td>
                      <td className="text-center align-middle fs-small">
                        {formatDate(order.payment_date)}
                      </td>
                      <td className="text-center align-middle fs-small">
                        {order.transaction_id}
                      </td>
                      <td className="text-center align-middle fs-small">
                        ${order.discounted_price}
                      </td>
                      <td className="text-center align-middle fs-small text-capitalize">
                        {order.payment_type}
                      </td>
                      <td className="text-center align-middle">
                        <div className="d-flex align-items-center justify-content-center">
                          <button
                            className="signup-now py-1 px-3 fw-lightBold fs-small mb-0 h-auto"
                            onClick={() => handlePrint(order)}
                          >
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "refund" && (
            <div className="tab-pane active">
              <div
                className="d-flex flex-column align-items-center justify-content-center gap-4"
                style={{ minHeight: "25rem" }}
              >
                <h3>You don’t have any refunds </h3>
                <h5 className="fw-light">
                  Any refunds will be processed to the original mode of payment
                </h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
