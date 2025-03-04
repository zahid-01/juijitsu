// import { useEffect, useRef, useState } from "react";
// import Chart from "chart.js/auto";
// import { LuUsers2 } from "react-icons/lu";
// import { IoIosTimer } from "react-icons/io";
// import { FaAddressCard } from "react-icons/fa";
// import axios from "axios";
// import Card from "../../Components/Card/Card";
// import { BASE_URI } from "../../Config/url";
// import { ShimmerThumbnail } from "react-shimmer-effects"; // Importing ShimmerThumbnail

// export default function ExpertAnalytics() {
//   const revenueChartRef = useRef(null);
//   const enrollmentsChartRef = useRef(null);
//   const ratingsChartRef = useRef(null);
//   const [type, setType] = useState("week")
//   const [data, setData] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [loading, setIsLoading] = useState(false)


 
  
//   // useEffect(() => {
//   //   axios
//   //     .get(`${BASE_URI}/api/v1/expert/expertDashboard`, {
//   //       headers: {
//   //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //       },
//   //     })
//   //     .then((response) => {
//   //       setData(response.data.data);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error fetching data", error);
//   //     });
//   // }, []);

//   useEffect(() => {
//     setIsLoading(true)
//     const fetchUserData = axios.get(
//       `${BASE_URI}/api/v1/expert/expertDashboard`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     const fetchAnalyticsData = axios.get(
//       `${BASE_URI}/api/v1/expert/expertGraphs?type=${type}`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );


//     Promise.all([fetchUserData, fetchAnalyticsData])
//       .then(([userResponse, analyticsResponse]) => {

//         setData(userResponse.data.data);
//         setAnalyticsData(analyticsResponse.data.data); // Set analytics data
//       })
//       .catch((error) => {
//         console.error("Error fetching data", error);
//       }).finally(setIsLoading(false));
      
//   }, [type]);

//   useEffect(() => {
//     if (analyticsData && type === "week") {
     
//         const weeklyEnrollments = Array(7).fill(0);
//         const weeklyRevenue = Array(7).fill(0);
//         const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
//         // Populate weekly data
//         analyticsData.Enrolled.forEach((item) => {
//           const dayIndex = new Date(item.enrollment_date).getDay();
//           weeklyEnrollments[dayIndex] = item.daily_enrolled;
//         });
  
//         analyticsData.Revenue.forEach((item) => {
//           const dayIndex = new Date(item.payment_date).getDay();
//           weeklyRevenue[dayIndex] = parseFloat(item.daily_revenue);
//         });
  
//         const maxRevenue = Math.max(...weeklyRevenue, 0);
//         const maxEnrollments = Math.max(...weeklyEnrollments, 0);
  
//         const revenueData = {
//           labels: days,
//           datasets: [
//             {
//               label: "Revenue",
//               data: weeklyRevenue,
//               borderColor: "#000",
//               borderWidth: 2,
//               fill: false,
//             },
//           ],
//         };
  
//         const enrollmentsData = {
//           labels: days,
//           datasets: [
//             {
//               label: "Enrollments",
//               data: weeklyEnrollments,
//               borderColor: "#000",
//               borderWidth: 2,
//               fill: false,
//             },
//           ],
//         };
  
//         // Ratings data for doughnut chart
//         const ratingsData = {
//           labels: [
//             "5 Star Rating",
//             "4 Star Rating",
//             "3 Star Rating",
//             "2 Star Rating",
//             "1 Star Rating",
//           ],
//           datasets: [
//             {
//               data: [
//                 parseFloat(data.reviews[0]["5_stars"]),
//                 parseFloat(data.reviews[0]["4_stars"]),
//                 parseFloat(data.reviews[0]["3_stars"]),
//                 parseFloat(data.reviews[0]["2_stars"]),
//                 parseFloat(data.reviews[0]["1_stars"]),
//               ],
//               backgroundColor: [
//                 "#FFA500",
//                 "#FFFF00",
//                 "#00FFFF",
//                 "#FF00FF",
//                 "#FF4500",
//               ],
//               borderWidth: 0,
//             },
//           ],
//         };
  
//         const createChart = (chartRef, type, data, options) => {
//           if (chartRef && chartRef.current) {
//             if (chartRef.current.chartInstance) {
//               chartRef.current.chartInstance.destroy();
//             }
  
//             chartRef.current.chartInstance = new Chart(chartRef.current, {
//               type,
//               data,
//               options,
//             });
//           }
//         };
  
//         createChart(revenueChartRef, "line", revenueData, {
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 stepSize: 200,
//                 callback: (value) => `$${value}`,
//               },
//               max: Math.ceil(maxRevenue / 200) * 200,
//             },
//           },
//         });
  
//         createChart(enrollmentsChartRef, "line", enrollmentsData, {
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 stepSize: 100,
//                 callback: (value) => value.toString(),
//               },
//               max: Math.ceil(maxEnrollments / 100) * 100,
//             },
//           },
//         });
  
//         // Ratings doughnut chart
//         createChart(ratingsChartRef, "doughnut", ratingsData, {
//           cutout: "80%",
//           plugins: {
//             legend: {
//               position: "left",
//               align: "start",
//               labels: {
//                 boxWidth: 12,
//                 padding: 10,
//                 font: {
//                   size: 12,
//                 },
//                 color: "#000",
//               },
//             },
//           },
//         });

      
//     }
//     if (analyticsData && type === "month") {

//       const monthlyEnrollments = Array(4).fill(0);
//       const monthlyRevenue = Array(4).fill(0);
//       const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    
//       // Helper function to get the week index within the month
//       const getWeekIndex = (dateString) => {
//         const date = new Date(dateString);
//         const day = date.getDate();
//         return Math.floor((day - 1) / 7); // Gives 0 for first week, 1 for second, etc.
//       };
    
//       // Populate weekly data
//       analyticsData?.Enrolled.forEach((item) => {
//         const weekIndex = getWeekIndex(item.week_start);
//         if (weekIndex >= 0 && weekIndex < 4) {
//           monthlyEnrollments[weekIndex] = item.weekly_enrolled;
//         }
//       });
    
//       analyticsData?.Revenue.forEach((item) => {
//         const weekIndex = getWeekIndex(item.week_start);
//         if (weekIndex >= 0 && weekIndex < 4) {
//           monthlyRevenue[weekIndex] = parseFloat(item.weekly_revenue);
//         }
//       });
    
//       const maxRevenue = Math.max(...monthlyRevenue, 0);
//       const maxEnrollments = Math.max(...monthlyEnrollments, 0);
    
//       const revenueData = {
//         labels: weeks,
//         datasets: [
//           {
//             label: "Revenue",
//             data: monthlyRevenue,
//             borderColor: "#000",
//             borderWidth: 2,
//             fill: false,
//           },
//         ],
//       };
    
//       const enrollmentsData = {
//         labels: weeks,
//         datasets: [
//           {
//             label: "Enrollments",
//             data: monthlyEnrollments,
//             borderColor: "#000",
//             borderWidth: 2,
//             fill: false,
//           },
//         ],
//       };
    
//       // Ratings data for doughnut chart
//       const ratingsData = {
//         labels: [
//           "5 Star Rating",
//           "4 Star Rating",
//           "3 Star Rating",
//           "2 Star Rating",
//           "1 Star Rating",
//         ],
//         datasets: [
//           {
//             data: [
//               parseFloat(data.reviews[0]["5_stars"]),
//               parseFloat(data.reviews[0]["4_stars"]),
//               parseFloat(data.reviews[0]["3_stars"]),
//               parseFloat(data.reviews[0]["2_stars"]),
//               parseFloat(data.reviews[0]["1_stars"]),
//             ],
//             backgroundColor: [
//               "#FFA500",
//               "#FFFF00",
//               "#00FFFF",
//               "#FF00FF",
//               "#FF4500",
//             ],
//             borderWidth: 0,
//           },
//         ],
//       };
    
//       const createChart = (chartRef, type, data, options) => {
//         if (chartRef && chartRef.current) {
//           if (chartRef.current.chartInstance) {
//             chartRef.current.chartInstance.destroy();
//           }
    
//           chartRef.current.chartInstance = new Chart(chartRef.current, {
//             type,
//             data,
//             options,
//           });
//         }
//       };
    
//       createChart(revenueChartRef, "line", revenueData, {
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               stepSize: 200,
//               callback: (value) => `$${value}`,
//             },
//             max: Math.ceil(maxRevenue / 200) * 200,
//           },
//         },
//       });
    
//       createChart(enrollmentsChartRef, "line", enrollmentsData, {
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               stepSize: 100,
//               callback: (value) => value.toString(),
//             },
//             max: Math.ceil(maxEnrollments / 100) * 100,
//           },
//         },
//       });
    
//       // Ratings doughnut chart
//       createChart(ratingsChartRef, "doughnut", ratingsData, {
//         cutout: "80%",
//         plugins: {
//           legend: {
//             position: "left",
//             align: "start",
//             labels: {
//               boxWidth: 12,
//               padding: 10,
//               font: {
//                 size: 12,
//               },
//               color: "#000",
//             },
//           },
//         },
//       });
    
//     }

//     if (analyticsData && type === "year") {

//       const monthlyEnrollments = Array(12).fill(0); // For 12 months
//       const monthlyRevenue = Array(12).fill(0);
//       const months = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//       ];
    
//       // Helper function to get the month index
//       const getMonthIndex = (dateString) => {
//         const date = new Date(dateString);
//         return date.getMonth(); // Returns 0 for January, 11 for December
//       };
    
//       // Populate monthly data
//       analyticsData?.Enrolled.forEach((item) => {
//         const monthIndex = getMonthIndex(item.month_start);
//         if (monthIndex >= 0 && monthIndex < 12) {
//           monthlyEnrollments[monthIndex] = item.monthly_enrolled;
//         }
//       });
    
//       analyticsData?.Revenue.forEach((item) => {
//         const monthIndex = getMonthIndex(item.month_start);
//         if (monthIndex >= 0 && monthIndex < 12) {
//           monthlyRevenue[monthIndex] = parseFloat(item.monthly_revenue);
//         }
//       });
    
//       const maxRevenue = Math.max(...monthlyRevenue, 0);
//       const maxEnrollments = Math.max(...monthlyEnrollments, 0);
    
//       const revenueData = {
//         labels: months,
//         datasets: [
//           {
//             label: "Revenue",
//             data: monthlyRevenue,
//             borderColor: "#000",
//             borderWidth: 2,
//             fill: false,
//           },
//         ],
//       };
    
//       const enrollmentsData = {
//         labels: months,
//         datasets: [
//           {
//             label: "Enrollments",
//             data: monthlyEnrollments,
//             borderColor: "#000",
//             borderWidth: 2,
//             fill: false,
//           },
//         ],
//       };
    
//       // Ratings data for doughnut chart (you can keep this unchanged if ratings are still relevant)
    
//       const createChart = (chartRef, type, data, options) => {
//         if (chartRef && chartRef.current) {
//           if (chartRef.current.chartInstance) {
//             chartRef.current.chartInstance.destroy();
//           }
    
//           chartRef.current.chartInstance = new Chart(chartRef.current, {
//             type,
//             data,
//             options,
//           });
//         }
//       };
    
//       // Create line charts for revenue and enrollments
//       createChart(revenueChartRef, "line", revenueData, {
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               stepSize: 1000,
//               callback: (value) => `$${value}`,
//             },
//             max: Math.ceil(maxRevenue / 1000) * 1000,
//           },
//         },
//       });
    
//       createChart(enrollmentsChartRef, "line", enrollmentsData, {
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               stepSize: 10,
//               callback: (value) => value.toString(),
//             },
//             max: Math.ceil(maxEnrollments / 10) * 10,
//           },
//         },
//       });
    
      
    
//     }

//     if (analyticsData && type === "all time") {

//       const currentYear = new Date().getFullYear();
//       const startYear = currentYear - 3;  // 3 years before
//       const endYear = currentYear + 3;    // 3 years after
    
//       const yearlyEnrollments = Array(7).fill(0);  // Initialize array for 7 years (past 3, current, next 3)
//       const yearlyRevenue = Array(7).fill(0);
//       const years = Array.from({ length: 7 }, (_, i) => startYear + i);  // Create an array of years from startYear to endYear
    
//       // Populate yearly data
//       analyticsData?.Enrolled.forEach((item) => {
//         const year = item.year;
//         const yearIndex = years.indexOf(year);  // Find the year index in the 7-year range
//         if (yearIndex !== -1) {
//           yearlyEnrollments[yearIndex] = item.yearly_enrolled;  // Set the enrollments for the correct year
//         }
//       });
    
//       analyticsData?.Revenue.forEach((item) => {
//         const year = item.year;
//         const yearIndex = years.indexOf(year);  // Find the year index in the 7-year range
//         if (yearIndex !== -1) {
//           yearlyRevenue[yearIndex] = parseFloat(item.yearly_revenue);  // Set the revenue for the correct year
//         }
//       });
    
//       const maxRevenue = Math.max(...yearlyRevenue, 0);
//       const maxEnrollments = Math.max(...yearlyEnrollments, 0);
    
//       const revenueData = {
//         labels: years,
//         datasets: [
//           {
//             label: "Revenue",
//             data: yearlyRevenue,
//             borderColor: "#000",
//             borderWidth: 2,
//             fill: false,
//           },
//         ],
//       };
    
//       const enrollmentsData = {
//         labels: years,
//         datasets: [
//           {
//             label: "Enrollments",
//             data: yearlyEnrollments,
//             borderColor: "#000",
//             borderWidth: 2,
//             fill: false,
//           },
//         ],
//       };
    
//       // Ratings data for doughnut chart (if applicable)
    
//       const createChart = (chartRef, type, data, options) => {
//         if (chartRef && chartRef.current) {
//           if (chartRef.current.chartInstance) {
//             chartRef.current.chartInstance.destroy();
//           }
    
//           chartRef.current.chartInstance = new Chart(chartRef.current, {
//             type,
//             data,
//             options,
//           });
//         }
//       };
    
//       // Create line charts for revenue and enrollments
//       createChart(revenueChartRef, "line", revenueData, {
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               stepSize: 1000,
//               callback: (value) => `$${value}`,
//             },
//             max: Math.ceil(maxRevenue / 1000) * 1000,
//           },
//         },
//       });
    
//       createChart(enrollmentsChartRef, "line", enrollmentsData, {
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               stepSize: 10,
//               callback: (value) => value.toString(),
//             },
//             max: Math.ceil(maxEnrollments / 10) * 10,
//           },
//         },
//       });
    
//       if (analyticsData && type === "month") {

//         const monthlyEnrollments = Array(5).fill(0); // Now accommodating 5 weeks
//         const monthlyRevenue = Array(5).fill(0);
//         const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]; // Added "Week 5"
      
//         // Helper function to get the week index within the month
//         const getWeekIndex = (dateString) => {
//           const date = new Date(dateString);
//           const day = date.getDate();
          
//           // Calculate week index (0 for Week 1, 4 for Week 5)
//           return Math.floor((day - 1) / 7); // Gives 0 for first week, 1 for second, etc.
//         };
      
//         // Populate weekly data
//         analyticsData?.Enrolled.forEach((item) => {
//           const weekIndex = getWeekIndex(item.week_start);
//           if (weekIndex >= 0 && weekIndex < 5) { // Now handling 5 weeks
//             monthlyEnrollments[weekIndex] = item.weekly_enrolled;
//           }
//         });
      
//         analyticsData?.Revenue.forEach((item) => {
//           const weekIndex = getWeekIndex(item.week_start);
//           if (weekIndex >= 0 && weekIndex < 5) { // Now handling 5 weeks
//             monthlyRevenue[weekIndex] = parseFloat(item.weekly_revenue);
//           }
//         });
      
//         const maxRevenue = Math.max(...monthlyRevenue, 0);
//         const maxEnrollments = Math.max(...monthlyEnrollments, 0);
      
//         const revenueData = {
//           labels: weeks, // Now showing 5 weeks
//           datasets: [
//             {
//               label: "Revenue",
//               data: monthlyRevenue,
//               borderColor: "#000",
//               borderWidth: 2,
//               fill: false,
//             },
//           ],
//         };
      
//         const enrollmentsData = {
//           labels: weeks, // Now showing 5 weeks
//           datasets: [
//             {
//               label: "Enrollments",
//               data: monthlyEnrollments,
//               borderColor: "#000",
//               borderWidth: 2,
//               fill: false,
//             },
//           ],
//         };
      
//         // Ratings data for doughnut chart
//         const ratingsData = {
//           labels: [
//             "5 Star Rating",
//             "4 Star Rating",
//             "3 Star Rating",
//             "2 Star Rating",
//             "1 Star Rating",
//           ],
//           datasets: [
//             {
//               data: [
//                 parseFloat(data.reviews[0]["5_stars"]),
//                 parseFloat(data.reviews[0]["4_stars"]),
//                 parseFloat(data.reviews[0]["3_stars"]),
//                 parseFloat(data.reviews[0]["2_stars"]),
//                 parseFloat(data.reviews[0]["1_stars"]),
//               ],
//               backgroundColor: [
//                 "#FFA500",
//                 "#FFFF00",
//                 "#00FFFF",
//                 "#FF00FF",
//                 "#FF4500",
//               ],
//               borderWidth: 0,
//             },
//           ],
//         };
      
//         const createChart = (chartRef, type, data, options) => {
//           if (chartRef && chartRef.current) {
//             if (chartRef.current.chartInstance) {
//               chartRef.current.chartInstance.destroy();
//             }
      
//             chartRef.current.chartInstance = new Chart(chartRef.current, {
//               type,
//               data,
//               options,
//             });
//           }
//         };
      
//         createChart(revenueChartRef, "line", revenueData, {
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 stepSize: 200,
//                 callback: (value) => `$${value}`,
//               },
//               max: Math.ceil(maxRevenue / 200) * 200,
//             },
//           },
//         });
      
//         createChart(enrollmentsChartRef, "line", enrollmentsData, {
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 stepSize: 100,
//                 callback: (value) => value.toString(),
//               },
//               max: Math.ceil(maxEnrollments / 100) * 100,
//             },
//           },
//         });
      
//         // Ratings doughnut chart
//         createChart(ratingsChartRef, "doughnut", ratingsData, {
//           cutout: "80%",
//           plugins: {
//             legend: {
//               position: "left",
//               align: "start",
//               labels: {
//                 boxWidth: 12,
//                 padding: 10,
//                 font: {
//                   size: 12,
//                 },
//                 color: "#000",
//               },
//             },
//           },
//         });
      
//       }
      
      
    
//     }
    
    
    
//   }, [analyticsData]);

//   // if (!data || !analyticsData) {
//   //   return (
//   //     <div className="container-fluid p-3">
//   //       <div className="row mb-5">
//   //         <div className="col-12">
//   //           <ShimmerThumbnail height={30} rounded />
//   //         </div>
//   //       </div>

//   //       <div className="row mt-3 mb-5">
//   //         <div className="col-md-3">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //         <div className="col-md-3">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //         <div className="col-md-3">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //         <div className="col-md-3">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //       </div>
//   //       <div className="row mt-3 mb-5">
//   //         <div className="col-md-6">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //         <div className="col-md-6">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //       </div>
//   //       <div className="row mt-3 mb-5">
//   //         <div className="col-md-6">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //         <div className="col-md-6">
//   //           <ShimmerThumbnail height={250} rounded />
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="wrapper-expertDashboard container-fluid p-3">
//       <div className="row mb-5">
//         <div className="col-12">
//           <h3 className="text-capitalize">Good Morning, {user.name} 🌻</h3>
//         </div>
//       </div>
//       <div className="row mt-3 mb-5">
//         <div className="col-md-3 pb-4">
//           <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
//             <div className="px-3">
//               <div className="d-flex align-items-center justify-content-between mb-5">
//                 <h5 className="fw-lightBold"> Total Students</h5>
//                 <LuUsers2 className="fs-2" />
//               </div>
//               <div className="d-flex align-items-center justify-content-between">
//                 <h2 className="text-center mb-0 fw-lightBold">
//                   {data?.enrolls?.total_students}
//                 </h2>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3 pb-4">
//           <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
//             <div className="px-3">
//               <div className="d-flex align-items-center justify-content-between mb-5">
//                 <h5 className="fw-lightBold">This month earnings</h5>
//                 <IoIosTimer className="fs-2" />
//               </div>
//               <div className="d-flex align-items-center justify-content-between">
//                 <h2 className="text-center mb-0 fw-lightBold">
//                   {data?.enrolls?.current_month_revenue}
//                 </h2>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3 pb-4">
//           <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
//             <div className="px-3">
//               <div className="d-flex align-items-center justify-content-between mb-5">
//                 <h5 className="fw-lightBold">New Enrollments</h5>
//                 <FaAddressCard className="fs-2" />
//               </div>
//               <div className="d-flex align-items-center justify-content-between">
//                 <h2 className="text-center mb-0 fw-lightBold">
//                   {data?.enrolls?.today_enrolled}
//                 </h2>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3 pb-4">
//           <div className="custom-box border-0 bg-gradient-custom-div py-3 h-100">
//             <div className="px-3">
//               <div className="d-flex align-items-center justify-content-between mb-5">
//                 <h5 className="fw-lightBold">Total Revenue</h5>
//                 <h3>💰</h3>
//               </div>
//               <div className="d-flex align-items-center justify-content-between">
//                 <h2 className="text-center mb-0 fw-lightBold">
//                   {data?.enrolls?.total_revenue}
//                 </h2>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-2 mb-5 position-relative">
//   <div>
//     <select 
//       // style={{ marginLeft: "1%" }} 
//       className="mb-2 rounded"
//       value={type} // This binds the select element to the state
//       onChange={(e) => setType(e.target.value)} // Handle change here
//     >
//       <option value="week">Week</option>
//       <option value="month">Month</option>
//       <option value="year">Year</option>
//       <option value="all time">All Time</option>
//     </select>
//   </div>

//   <div className="row">
//     <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-3">
//       <div className="card w-100 custom-box">
//         <div className="card-body">
//           <h5 className="card-title fw-normal">Revenue</h5>
//           <canvas ref={revenueChartRef} height="200"></canvas>
//         </div>
//       </div>
//     </div>

//     <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-3">
//       <div className="card w-100 custom-box">
//         <div className="card-body">
//           <h5 className="card-title fw-normal">New Enrollments</h5>
//           <canvas ref={enrollmentsChartRef} height="200"></canvas>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//       <div className="row mt-3 mb-5">
        
//         <div className="row">
//         <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-3">
//           <div className="card w-100 custom-box">
//             <div className="card-body">
//               <h5 className="card-title">Courses in Demand</h5>
//               <ul className="list-group d-flex flex-row flex-wrap">
//                 {data?.coursesInDemand?.map((course, index) => (
//                   <li
//                     key={course.id}
//                     className="list-group-item border-0 text-capitalize"
//                   >
//                     {index + 1}. {course.title} (Enrolled: {course.enrolled})
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="d-flex align-items-center justify-content-center">
//             <div style={{ height: "20rem", width: "20rem" }}>
//               <h5 className="mb-3">Ratings Overview</h5>
//               <canvas
//                 ref={ratingsChartRef}
//                 className="text-center w-100 h-100"
//               ></canvas>{" "}
//             </div>
//           </div>
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useRef, useEffect } from "react";

import { LuUsers2 } from "react-icons/lu";
import { IoIosTimer } from "react-icons/io";
import { TiBusinessCard } from "react-icons/ti";
import Chart from "chart.js/auto";
import { TbMoneybag } from "react-icons/tb";

const Dashboard = () => {
  const [type, setType] = useState("week");
  const revenueChartRef = useRef(null);
  const enrollmentsChartRef = useRef(null);
  const ratingsChartRef = useRef(null);

  const user = { name: "John Doe" };
  const data = {
    enrolls: {
      total_students: 1200,
      current_month_revenue: "$15,000",
      today_enrolled: 30,
      total_revenue: "$200,000",
    },
    coursesInDemand: [
      { id: 1, title: "React for Beginners", enrolled: 300 },
      { id: 2, title: "Advanced Node.js", enrolled: 250 },
      { id: 3, title: "Python Data Science", enrolled: 220 },
    ],
    ratings: [5, 4, 3, 2, 1],
  };

  useEffect(() => {
    // Common chart configuration
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 10, bottom: 0, left: 0, right: 0 } },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } } },
        y: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } } }
      }
    };

    // Revenue Chart (existing)
    if (revenueChartRef.current) {
      new Chart(revenueChartRef.current, {
        type: "line",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [{
            label: "Revenue",
            data: [5000, 7000, 8000, 15000],
            borderColor: "#F90815",
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          }],
        },
        options: chartOptions
      });
    }

    // Enrollments Chart (updated)
    if (enrollmentsChartRef.current) {
      new Chart(enrollmentsChartRef.current, {
        type: "bar",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [{
            label: "Enrollments",
            data: [100, 200, 150, 300],
            backgroundColor: "#F90815",
            borderWidth: 0,
            borderRadius: 4,
            barThickness: 30,
          }],
        },
        options: {
          ...chartOptions,
          plugins: {
            legend: { display: false },
          },
          scales: {
            ...chartOptions.scales,
            y: { ...chartOptions.scales.y, beginAtZero: true }
          }
        }
      });
    }

    // Ratings Chart (updated)
    if (ratingsChartRef.current) {
      new Chart(ratingsChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
          datasets: [{
            data: [50, 30, 10, 5, 5],
            backgroundColor: ["#000000", "#F90815", "#8B0000", "#FF4500", "#FFA500"],
            borderWidth: 0,
            hoverOffset: 8,
          }],
        },
        options: {
          // ...chartOptions,
          cutout: "70%",
          plugins: {
            legend: {
              position: "top",
              labels: { color: "#666", font: { size: 12 }, usePointStyle: true }
            }
          }
        }
      });
    }
  }, []);

  return (
    <div className="container-fluid p-3">
      <div className="row mb-3">
        <div className="col-12 w-100 app-white py-2">
          <h3 className="text-capitalize fs-5 d-flex  gap-2">Good Morning<h6 className="app-text-white app-black p-1 px-2 rounded-1" style={{ width:"max-content"}}>{user.name}</h6></h3>
        </div>
      </div>
      <div className="row mt-1 mb-1">
  {["Total Students", "Earnings", "New Enrollments", "Total Revenue"].map((title, index) => (
    <div className="col-6 px-1 col-md-3 pb-2" key={index}>
    <div className="custom-box border-0 app-white px-3 py-3 h-100 d-flex flex-column align-items-center justify-content-between text-center gap-2">
      
      {/* Icon Section */}
      <div className="p-2 px-3 w-50 rounded-pill border border-2 d-flex justify-content-center align-items-center" style={{ minHeight: "65px"}}>
        {index === 0 ? <LuUsers2 className="fs-1 app-text-black" /> :
         index === 1 ? <IoIosTimer className="fs-1 app-text-black" /> :
         index === 2 ? <TiBusinessCard className="fs-1 app-text-black" /> :
         <h3 className="fs-1 app-text-black"><TbMoneybag /></h3>}
      </div>
  
      {/* Title Section */}
      <h5 className="fw-normal fs-6 flex-grow-1 text-truncate">{title}</h5>
  
      {/* Value Section */}
      <h2 className="mb-0 fs-4 fw-lightBold">
        {index === 0 ? data.enrolls.total_students :
         index === 1 ? data.enrolls.current_month_revenue :
         index === 2 ? data.enrolls.today_enrolled :
         data.enrolls.total_revenue}
      </h2>
  
    </div>
  </div>
  
  ))}
</div>
      <div className=" mb-1">

      <div
  style={{
    zIndex: "100",
    width: "max-content",
    justifySelf: "start",
    position: "sticky",
    top: "-0.3%",
  }}
  className="w-100 mb-2 gap-3 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white d-flex gap-2"
>
  {["week", "month", "year", "all time"].map((btnType) => (
    <h4
      key={btnType}
      style={{ cursor: "pointer" }}
      className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${
        type === btnType ? "app-black app-text-white border-black" : "border border-1 text-secondary"
      }`}
      onClick={() => setType(btnType)}
    >
      {btnType.charAt(0).toUpperCase() + btnType.slice(1)}
    </h4>
  ))}
</div>

        <div className="row">
          <div className="col-md-6 d-flex align-items-center justify-content-center mb-3">
            <div className="card p-0 w-100 custom-box">
              <div className="card-body " style={{ maxHeight: "300px" , paddingBottom:"50px"}}>
                <h5 style={{width:"max-content"}} className="card-title p-1 rounded-1 fs-6 fw-normal app-black app-text-white ">Revenue</h5>
                <canvas ref={revenueChartRef} height="200"></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-0">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px", paddingBottom: "50px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                New Enrollments
              </h5>
              <canvas ref={enrollmentsChartRef} height="200"></canvas>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-5">
      <div className="col-md-6 mb-3">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                Courses in Demand
              </h5>
              <ul className="list-group mt-1">
            {data.coursesInDemand.map((course, index) => (
              <li key={course.id} className="list-group-item ps-0 border-0">
                {index + 1}. {course.title} (Enrolled: {course.enrolled})
              </li>
            ))}
          </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px", paddingBottom: "50px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                Ratings Overview
              </h5>
              <div className="d-flex justify-content-center" style={{ height: "200px" }}>
                <canvas ref={ratingsChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

