import { RiBookFill, RiHome4Fill, RiMessage2Fill } from "react-icons/ri";

export default function SmallerScreenSidebar() {
  return (
    <div className="bg-gradient-custom-div px-1  d-flex align-items-center justify-content-around position-fixed w-100">
      <div className="d-flex flex-column align-items-center py-1 px-2 fw-light bg-white text-black rounded-4">
        <RiHome4Fill className="fs-5 d-block" />
        Home
      </div>
      <div className="d-flex flex-column align-items-center py-1 fw-light">
        <RiBookFill className="fs-5 d-block" />
        My Learning
      </div>
      <div className="d-flex flex-column align-items-center py-1 fw-light">
        <RiMessage2Fill className="fs-5 d-block" />
        Messages
      </div>
    </div>
  );
}
