import "./AdminReview.css"
import { GoArrowDown } from "react-icons/go";
export default function AdminReview() {
  //
  const courses = [
    {
      id: 1,
      image:
        "https://storage.googleapis.com/a1aa/image/hJWKYi2tOP5UF5PEThOjKN7N1IbrZcyefKPmC6k7xapiv9iTA.jpg",
      title: "Learn UI / UX, from beginner to Pro",
      author: "Basit Bashir",
      price: "$121.5",
    },
    {
      id: 2,
      image:
        "https://storage.googleapis.com/a1aa/image/hJWKYi2tOP5UF5PEThOjKN7N1IbrZcyefKPmC6k7xapiv9iTA.jpg",
      title: "Learn UI / UX, from beginner to Pro",
      author: "Basit Bashir",
      price: "$121.5",
    },
    {
      id: 3,
      image:
        "https://storage.googleapis.com/a1aa/image/hJWKYi2tOP5UF5PEThOjKN7N1IbrZcyefKPmC6k7xapiv9iTA.jpg",
      title: "Learn UI / UX, from beginner to Pro",
      author: "Basit Bashir",
      price: "$121.5",
    },
  ];
  return (
    <div className="w-100">
      <header
        className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-0 custom-box"
        style={{ overflowX: "auto" }}
      >
        <div style={{ width: "37rem" }}>
          <h3 className="pb-5">Review Courses</h3>
         
        </div>
      </header>
      <div
        className="tab-content px-3 py-4 custom-box rounded-top-0"
        style={{ background: "white" }}
      >
       
       
          <div className="tab-pane active" style={{ minHeight: "25rem" }}>
            <div className="container-courseRequest">
              <div className="header-courseRequest ">
                <label htmlFor="courseRequest"  className="courseRequest" style={{ fontWeight: "600" }}>
                  To Approve  <GoArrowDown />
                </label>
              </div>
              {courses.map((course) => (
                <div className="course-req" key={course.id}>
                  <img src={course.image} />
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p>{course.author}</p>
                    <span>{course.price}</span>
                  </div>
                  <div className="course-actions">
                    <button className="overview">Overview</button>
                    <button className="approve">Approve</button>
                    <button className="decline">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      
      </div>
    </div>
  );
}