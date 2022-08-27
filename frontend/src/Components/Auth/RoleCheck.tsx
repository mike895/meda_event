// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { selectUser } from "../../features/userSlice";

// const AdminOnly = () => {
//   const location = useLocation();
//   const { user, loading } = useSelector(selectUser);
//   let navigate = useNavigate();
//   useEffect(() => {
//     if (loading == true) return;
//     else if (!user) navigate("/unauthorized", { replace: true,state:{ from: location} });
//     // else if (!isInRole(session.user, auth.roles)) //! RoleCheck to be done later
//     //   router.push(auth.unauthorized);
//   }, [user, loading]);
//   if (user) return <Outlet />;
//   return <h1>Some Loading Anim</h1>;
// };
// export default AdminOnly;

import { Spin } from "antd";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUser } from "../../features/userSlice";

const RoleCheck = ({role}:{role:string}) => {
  const location = useLocation();
  const { user, loading } = useSelector(selectUser);

  return (
    <>
      {console.log(user,"asdfghj",loading)}
      {loading ? (
        <Spin size="default" />
      ) : (user && user.role === role) ? (
        <Outlet />
      ) : (
        <Navigate to="/unauthorized" replace state={{ from: location }} />
      )}
    </>
  );
};
export default RoleCheck;