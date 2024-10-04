import axios from "axios";
import "./AdminReview.css"
import { GoArrowDown } from "react-icons/go";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import { useNavigate } from "react-router-dom";

export default function AdminReview() {
  const [Approvals, setApprovals] = useState();
  const navigate = useNavigate()



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

const token = localStorage.getItem('token');

const getApproval = async()=>{
  console.log("again");
  try{
    const response = await axios({
      method: 'GET',
      url: `${BASE_URI}/api/v1/admin/approveCourse`,
      headers: {
        Authorization: "Bearer " + token,
      }
    })
        setApprovals(response?.data?.data)
        console.log(response?.data?.data)
        console.log(Approvals)

  }
  catch(error){
    toast.error(error?.response?.data?.message)
  }
}

 useEffect(()=>{
  getApproval()
 },[]);

 

 async function aproveRequest(is_approved,request_id){
  console.log(is_approved,request_id )
  try{
    const response = await axios({
      method: 'PATCH',
      url: `${BASE_URI}/api/v1/admin/approveCourse/${request_id}`,
      data:{
        "is_approved":is_approved
      },
      headers: {
        Authorization: "Bearer " + token,
      },
      
    })
        toast.success(response?.data?.message)
        getApproval()
 }
 catch(err){
  toast.error(err?.response?.data?.message)
 }
}

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
              {Approvals?.map((Approvals) => (
                <div className="course-req" key={Approvals?.course_id}>
                  <img src={Approvals?.thumbnail} />
                  <div className="course-details">
                    <h3>{Approvals?.title}</h3>
                    <p>{Approvals?.expert}</p>
                    <span>{Approvals?.price}</span>
                  </div>
                  <div className="course-actions">
                    <button onClick={()=> navigate(`/courses/courseView/${Approvals?.course_id}`)} className="overview">Overview</button>
                    <button onClick={()=>aproveRequest(1,Approvals?.request_id)} className="approve">Approve</button>
                    <button onClick={()=>aproveRequest(0,Approvals?.request_id)} className="decline">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      
      </div>
    </div>
  );
}