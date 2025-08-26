// SpinnerWrapper.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './SpinnerWrapper.css'; // Ensure you have the CSS for the spinner

const SpinnerWrapper = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger loading on route change
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 100); // spinner shows until UI stabilizes (adjust as needed)

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading ? (
                   
                          
        <span className="loader"></span>


      ) : (
        children
      )}
    </>
  );
};

export default SpinnerWrapper;
