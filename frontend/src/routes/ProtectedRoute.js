import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import RedirectModal from "../components/RedirectModal/RedirectModal";
import { useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };
  if (loading === false) {
    if (!isAuthenticated) {
      // return <Navigate to="/login" replace />;
      return <RedirectModal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      message="You need to be logged in to fully access information on this website."
    />
    }
    return children;
  }
};

export default ProtectedRoute;
