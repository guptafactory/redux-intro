import { useSelector } from "react-redux";

function Customer() {
  const fullName = useSelector((state) => state.customer.fullName);
  return <h2>👋 Welcome, {fullName}</h2>;
}

export default Customer;
