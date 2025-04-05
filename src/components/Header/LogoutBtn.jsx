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
        className="inline-block px-6 py-2 text-lg duration-200 text-gray-200 font-medium hover:bg-teal-500 hover:text-black rounded-full"
        onClick={() => setShowDialog(true)}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>

      {showDialog && !isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-300 hover:text-white"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
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
