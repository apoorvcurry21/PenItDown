import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double clicks
    setIsLoggingOut(true);
    setShowDialog(false);
    
    try {
      // First update Redux state to trigger UI updates
      dispatch(logout());
      // Then perform actual logout
      await authService.logout();
      // Navigate after state is cleared
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Restore state if logout fails
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className="inline-block px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-teal-400"
        onClick={() => setShowDialog(true)}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>

      {showDialog && !isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-800 mt-[30vh] animate-fade-down animate-duration-200">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium bg-teal-500 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LogoutBtn;
