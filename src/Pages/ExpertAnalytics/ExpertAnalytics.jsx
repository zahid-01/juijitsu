import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { LuUsers2 } from "react-icons/lu";
import { IoIosTimer } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";
import axios from "axios";
import Card from "../../Components/Card/Card";
import { BASE_URI } from "../../Config/url";
import { ShimmerThumbnail } from "react-shimmer-effects"; // Importing ShimmerThumbnail

export default function ExpertAnalytics() {
  const revenueChartRef = useRef(null);
  const enrollmentsChartRef = useRef(null);
  const ratingsChartRef = useRef(null);

  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [analyticsData, setAnalyticsData] = useState(null);

  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URI}/api/v1/expert/expertDashboard`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((response) => {
  //       setData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data", error);
  //     });
  // }, []);

  useEffect(() => {
    const fetchUserData = axios.get(
      `${BASE_URI}/api/v1/expert/expertDashboard`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const fetchAnalyticsData = axios.get(
      `${BASE_URI}/api/v1/expert/expertGraphs?type=week`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    Promise.all([fetchUserData, fetchAnalyticsData])
      .then(([userResponse, analyticsResponse]) => {
        setData(userResponse.data.data);
        setAnalyticsData(analyticsResponse.data.data); // Set analytics data
        console.log(userResponse.data.data, analyticsResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  useEffect(() => {
    if (analyticsData) {
      const weeklyEnrollments = Array(7).fill(0);
      const weeklyRevenue = Array(7).fill(0);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // Populate weekly data
      analyticsData.Enrolled.forEach((item) => {
        const dayIndex = new Date(item.enrollment_date).getDay();
        weeklyEnrollments[dayIndex] = item.daily_enrolled;
      });

      analyticsData.Revenue.forEach((item) => {
        const dayIndex = new Date(item.payment_date).getDay();
        weeklyRevenue[dayIndex] = parseFloat(item.daily_revenue);
      });

      const maxRevenue = Math.max(...weeklyRevenue, 0);
      const maxEnrollments = Math.max(...weeklyEnrollments, 0);

      const revenueData = {
        labels: days,
        datasets: [
          {
            label: "Revenue",
            data: weeklyRevenue,
            borderColor: "#000",
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      const enrollmentsData = {
        labels: days,
        datasets: [
          {
            label: "Enrollments",
            data: weeklyEnrollments,
            borderColor: "#000",
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      // Ratings data for doughnut chart
      const ratingsData = {
        labels: [
          "5 Star Rating",
          "4 Star Rating",
          "3 Star Rating",
          "2 Star Rating",
          "1 Star Rating",
        ],
        datasets: [
          {
            data: [
              parseFloat(data.reviews[0]["5_stars"]),
              parseFloat(data.reviews[0]["4_stars"]),
              parseFloat(data.reviews[0]["3_stars"]),
              parseFloat(data.reviews[0]["2_stars"]),
              parseFloat(data.reviews[0]["1_stars"]),
            ],
            backgroundColor: [
              "#FFA500",
              "#FFFF00",
              "#00FFFF",
              "#FF00FF",
              "#FF4500",
            ],
            borderWidth: 0,
          },
        ],
      };

      const createChart = (chartRef, type, data, options) => {
        if (chartRef && chartRef.current) {
          if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
          }

          chartRef.current.chartInstance = new Chart(chartRef.current, {
            type,
            data,
            options,
          });
        }
      };

      createChart(revenueChartRef, "line", revenueData, {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 200,
              callback: (value) => `$${value}`,
            },
            max: Math.ceil(maxRevenue / 200) * 200,
          },
        },
      });

      createChart(enrollmentsChartRef, "line", enrollmentsData, {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 100,
              callback: (value) => value.toString(),
            },
            max: Math.ceil(maxEnrollments / 100) * 100,
          },
        },
      });

      // Ratings doughnut chart
      createChart(ratingsChartRef, "doughnut", ratingsData, {
        cutout: "80%",
        plugins: {
          legend: {
            position: "left",
            align: "start",
            labels: {
              boxWidth: 12,
              padding: 10,
              font: {
                size: 12,
              },
              color: "#000",
            },
          },
        },
      });
    }
  }, [analyticsData]);

  if (!data) {
    return (
      <div className="container-fluid p-3">
        <div className="row mb-5">
          <div className="col-12">
            <ShimmerThumbnail height={30} rounded />
          </div>
        </div>
        <div className="row mt-3 mb-5">
          <div className="col-md-3">
            <ShimmerThumbnail height={250} rounded />
          </div>
          <div className="col-md-3">
            <ShimmerThumbnail height={250} rounded />
          </div>
          <div className="col-md-3">
            <ShimmerThumbnail height={250} rounded />
          </div>
          <div className="col-md-3">
            <ShimmerThumbnail height={250} rounded />
          </div>
        </div>
        <div className="row mt-3 mb-5">
          <div className="col-md-6">
            <ShimmerThumbnail height={250} rounded />
          </div>
          <div className="col-md-6">
            <ShimmerThumbnail height={250} rounded />
          </div>
        </div>
        <div className="row mt-3 mb-5">
          <div className="col-md-6">
            <ShimmerThumbnail height={250} rounded />
          </div>
          <div className="col-md-6">
            <ShimmerThumbnail height={250} rounded />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      <div className="row mb-5">
        <div className="col-12">
          <h3 className="text-capitalize">Good Morning, {user.name} 🌻</h3>
        </div>
      </div>
      <div className="row mt-3 mb-5">
        <div className="col-md-3 pb-4">
          <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
            <div className="px-3">
              <div className="d-flex align-items-center justify-content-between mb-5">
                <h5 className="fw-lightBold"> Total Students</h5>
                <LuUsers2 className="fs-2" />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="text-center mb-0 fw-lightBold">
                  {data?.enrolls?.total_students}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 pb-4">
          <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
            <div className="px-3">
              <div className="d-flex align-items-center justify-content-between mb-5">
                <h5 className="fw-lightBold">This month earnings</h5>
                <IoIosTimer className="fs-2" />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="text-center mb-0 fw-lightBold">
                  {data?.enrolls?.current_month_revenue}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 pb-4">
          <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
            <div className="px-3">
              <div className="d-flex align-items-center justify-content-between mb-5">
                <h5 className="fw-lightBold">New Enrollments</h5>
                <FaAddressCard className="fs-2" />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="text-center mb-0 fw-lightBold">
                  {data?.enrolls?.today_enrolled}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 pb-4">
          <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
            <div className="px-3">
              <div className="d-flex align-items-center justify-content-between mb-5">
                <h5 className="fw-lightBold">Total Revenue</h5>
                <h3>💰</h3>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="text-center mb-0 fw-lightBold">
                  {data?.enrolls?.total_revenue}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-5">
        <div className="col-md-6 pb-4">
          <div className="card custom-box">
            <div className="card-body">
              <h5 className="card-title fw-normal">Revenue</h5>
              <canvas ref={revenueChartRef} height="200"></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card custom-box">
            <div className="card-body">
              <h5 className="card-title fw-normal">New Enrollments</h5>
              <canvas ref={enrollmentsChartRef} height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-5">
        <div className="col-md-6 pb-4">
          <div className="card custom-box">
            <div className="card-body">
              <h5 className="card-title">Courses in Demand</h5>
              <ul className="list-group d-flex flex-row flex-wrap">
                {data?.coursesInDemand?.map((course, index) => (
                  <li
                    key={course.id}
                    className="list-group-item border-0 text-capitalize"
                  >
                    {index + 1}. {course.title} (Enrolled: {course.enrolled})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center justify-content-center">
            <div style={{ height: "20rem", width: "20rem" }}>
              <h5 className="mb-3">Ratings Overview</h5>
              <canvas
                ref={ratingsChartRef}
                className="text-center w-100 h-100"
              ></canvas>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
