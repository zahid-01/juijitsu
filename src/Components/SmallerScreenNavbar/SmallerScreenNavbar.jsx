import { BsFillCartFill } from "react-icons/bs";
import { CiFilter, CiSearch } from "react-icons/ci";

export default function SmallerScreenNavbar() {
  return (
    <div className="d-flex align-items-center p-2">
      <h4 className="text w-100 gradient-text fw-bold">Jiujitsux</h4>
      <div className="d-flex align-items-center gap-3">
        <CiSearch className="primary-color fs-3  cursor-pointer" />
        <CiFilter className="primary-color fs-3  cursor-pointer" />
        <BsFillCartFill className="primary-color fs-3  cursor-pointer" />
      </div>
    </div>
  );
}
