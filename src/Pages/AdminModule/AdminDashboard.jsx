import { useState, useEffect, useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaCalendar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import axios from "axios";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [data, setData] = useState({});
  const [courseCompletion, setCourseCompletion] = useState({});
  const [mostBoughtCourses, setMostBoughtCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const token = localStorage.getItem("token");
  // console.log(token);
  // const url = `${BASE_URI}/api/v1/admin/adminDashboard?from=2024-09-1&to=2024-09-6`;
  // const { adminData, error, refetch, isLoading } = useFetch(url, {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  // });
  // console.log(token)
  // console.log(adminData)
  // // console.log(data.data);
  // // // const coursesData = data;
  // const coursesData = useMemo(() => adminData?.data || [], [adminData]);

  function getCurrentWeekDates() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday is 0, Monday is 1, etc.
    const startOfWeek = new Date(now); // Create a copy of the current date
    const endOfWeek = new Date(now);

    // Adjust to the start of the week (Monday)
    startOfWeek.setDate(now.getDate() - (dayOfWeek - 1));

    // Adjust to the end of the week (Sunday)
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const from = format(startOfWeek, "yyyy-MM-dd");
    const to = format(endOfWeek, "yyyy-MM-dd");

    return { from, to };
  }

  // Usage
  const { from, to } = getCurrentWeekDates();
  // console.log(`From: ${from}, To: ${to}`);

  // You can now use this in your API call
  // const url = `${BASE_URI}/api/v1/admin/adminDashboard?from=${from}&to=${to}`;

  const fetchDashboard = async () => {
    const reqData = formatWeekRange();
    console.log(reqData);
    const adminData = await axios({
      method: "GET",
      url: `${BASE_URI}/api/v1/admin/adminDashboard?from=${from}&to=${to}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log(adminData)
    setData({
      TotalStudents: {
        value: adminData?.data?.data?.enrolls?.total_students,
        percentage: 6.23,
        icon: "fas fa-graduation-cap",
        type: "increase",
      },
      TotalCourses: {
        value: adminData?.data?.data?.enrolls?.total_courses,
        percentage: 6.23,
        icon: "fas fa-book",
        type: "increase",
      },
      TotalExperts: {
        value: adminData?.data?.data?.enrolls?.total_experts,
        percentage: 6.23,
        icon: "fas fa-user-tie",
        type: "decrease",
      },
      TotalRevenue: {
        value: adminData?.data?.data?.enrolls?.total_revenue,
        percentage: 6.23,
        icon: "fas fa-money-bill-wave",
        type: "increase",
      },
      TotalCommission: {
        value: Math.floor(adminData?.data?.data?.enrolls?.total_commission),
        percentage: 6.23,
        icon: "fas fa-money-bill-wave",
        type: "increase",
      },
    });
    setCourseCompletion({
      completed: adminData?.data?.data?.total_users?.certified_user,
      incomplete: adminData?.data?.data?.total_users?.uncertified_users,
    });

    const colors = ["#82CA9D", "#00AEEF", "#88929D", "#A4A7AD"];
    setMostBoughtCourses(
      adminData?.data?.data?.coursesInDemand
        ?.slice(0, 4)
        .map((course, index) => ({
          name: course.title,
          value: course.enrolled,
          color: colors[index],
        }))
    );
  };
  const fetchGraphDashboard = async () => {
    const adminGraphData = await axios({
      method: "GET",
      url: `${BASE_URI}/api/v1/admin/adminDashboardGraphs?from=${from}&to=${to}&type=week`,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log(adminGraphData?.data?.data?.Enrolled[0]?.monthly_enrolled)
    setEnrollments([
      {
        day: "Mon",
        value: adminGraphData?.data?.data?.Enrolled[0]?.daily_enrolled,
      },
      {
        day: "Tue",
        value: adminGraphData?.data?.data?.Enrolled[1]?.daily_enrolled,
      },
      {
        day: "Wed",
        value: adminGraphData?.data?.data?.Enrolled[2]?.daily_enrolled,
      },
      {
        day: "Thu",
        value: adminGraphData?.data?.data?.Enrolled[3]?.daily_enrolled,
      },
      {
        day: "Fri",
        value: adminGraphData?.data?.data?.Enrolled[4]?.daily_enrolled,
      },
      {
        day: "Sat",
        value: adminGraphData?.data?.data?.Enrolled[5]?.daily_enrolled,
      },
      {
        day: "Sun",
        value: adminGraphData?.data?.data?.Enrolled[6]?.daily_enrolled,
      },
    ]);
    setRevenue([
      {
        day: "Mon",
        value: adminGraphData?.data?.data?.Revenue[0]?.daily_revenue,
      },
      {
        day: "Tue",
        value: adminGraphData?.data?.data?.Revenue[1]?.daily_revenue,
      },
      {
        day: "Wed",
        value: adminGraphData?.data?.data?.Revenue[2]?.daily_revenue,
      },
      {
        day: "Thu",
        value: adminGraphData?.data?.data?.Revenue[3]?.daily_revenue,
      },
      {
        day: "Fri",
        value: adminGraphData?.data?.data?.Revenue[4]?.daily_revenue,
      },
      {
        day: "Sat",
        value: adminGraphData?.data?.data?.Revenue[5]?.daily_revenue,
      },
      {
        day: "Sun",
        value: adminGraphData?.data?.data?.Revenue[6]?.daily_revenue,
      },
    ]);
    // console.log( adminGraphData?.data?.data?.Enrolled[0]?.daily_enrolled)
  };

  useEffect(() => {
    fetchDashboard();
    fetchGraphDashboard();
  }, []);

  // Enrollment and revenue chart data
  const enrollmentData = {
    labels: enrollments.map((e) => e.day),
    datasets: [
      {
        label: "Enrollments",
        data: enrollments.map((e) => e.value),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const [startDate, setStartDate] = useState(new Date());

  const handleWeekChange = (date) => {
    const startOfWeek = date;
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6
    );
    setStartDate(startOfWeek);
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    return `${format(startDate, "MMM-d")} - ${format(endOfWeek, "MMM-d")}`;
  };

  const revenueData = {
    labels: revenue.map((r) => r.day),
    datasets: [
      {
        label: "Revenue",
        data: revenue.map((r) => r.value),
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Course completion doughnut data
  const courseCompletionData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [courseCompletion.completed, courseCompletion.incomplete],
        backgroundColor: ["#00AEEF", "#F7464A"],
        cutout: "80%",
      },
    ],
  };

  // Most bought courses doughnut data
  const mostBoughtCoursesData = {
    labels: mostBoughtCourses.map((course) => course.name),
    datasets: [
      {
        data: mostBoughtCourses.map((course) => course.value),
        backgroundColor: mostBoughtCourses.map((course) => course.color),
        cutout: "80%",
      },
    ],
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between w-100 mb-5">
        <div>
          <h3>Welcome Back, Basit</h3>
          <p>Track & Manage your Platform</p>
        </div>
        {/* <div className="d-flex align-items-center gap-3 border shadow-sm rounded-3 px-3 py-2"> */}
        {/* <FaCalendar className="fs-4" /> */}

        {/* <DatePicker
            selected={startDate}
            onChange={handleWeekChange}
            dateFormat="MM/yyyy"
            showWeekNumbers
            showPopperArrow={false}
            customInput={<FaCalendar className="fs-4" />}
            highlightDates
            calendarStartDay={0}
          /> */}
        {/* <h5 className="fw-normal">{formatWeekRange()}</h5> */}
        {/* </div> */}
      </div>
      <div className="row">
        {Object.keys(data).map((key) => (
          <div key={key} className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title text-center">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i
                    className={`fas fa-lg ${data[key].icon} me-2`}
                    style={{ color: "#007bff" }}
                  ></i>
                  <h2 className="card-text me-2">{data[key].value}</h2>
                  <span
                    className={`text-${
                      data[key].type === "increase" ? "success" : "danger"
                    }`}
                  >
                    {data[key].percentage}%
                    <i
                      className={`fas fa-${
                        data[key].type === "increase"
                          ? "arrow-up"
                          : "arrow-down"
                      }`}
                      style={{ fontSize: "0.8rem" }}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">New Enrollments</h5>
              <Line data={enrollmentData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">Revenue</h5>
              <Line data={revenueData} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="  mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">Course Completion Rate</h5>
              <div className="d-flex align-items-center justify-content-center">
                <div style={{ width: "25rem", height: "25rem" }}>
                  <Doughnut data={courseCompletionData} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">Most Bought Courses</h5>
              <div className="d-flex align-items-center justify-content-center">
                <div style={{ width: "25rem", height: "25rem" }}>
                  <Doughnut data={mostBoughtCoursesData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
