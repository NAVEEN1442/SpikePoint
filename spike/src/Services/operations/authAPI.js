import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { endpoint } from "../apis";
import { setLoading, setToken ,setUser,clearAuth} from "../../slices/authSlice";


const {
    SIGNUP_API,
    LOGIN_API,
    OTP_API,
    VERIFY_OTP_API,
    RESEND_OTP_API,
    FORGOT_PASSWORD_API,
    RESET_PASSWORD_API,
    CHANGE_PASSWORD_API,
    GET_ME,
    LOGOUT_API,
    IS_AUTH

} = endpoint;

// Send OTP to email
export function sendotp(fullName, userName, phoneNumber, email, password, confirmPassword, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));
    
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Validate password match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      // Validate password strength (optional)
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      const response = await apiConnector("POST", OTP_API, { email });
      
      console.log("OTP API Response:", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send OTP");
      }
      
      toast.success("OTP sent successfully. Check your email");
     
      
      // Navigate to verify code page with form data
      navigate("/verify-code", {
        state: {
          fullName,
          userName,
          phoneNumber,
          email,
          password,
          confirmPassword,
        },
      });
    } catch (error) {
      console.error("Send OTP Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Verify OTP and complete signup
export function verifyAndSignup(fullName, userName, phoneNumber, email, password, confirmPassword, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Verifying OTP and creating account...");
    dispatch(setLoading(true));
    
    try {
      // Validate OTP
      if (!otp || otp.length < 4) {
        throw new Error("Please enter a valid OTP");
      }
      
      const response = await apiConnector("POST", SIGNUP_API, {
        fullName,
        userName,
        phoneNumber,
        email,
        password,
        confirmPassword,
        otp,
      });
      
      console.log("Signup API Response:", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Signup failed");
      }
      
      toast.success("Account created successfully! Please login.");
      
      navigate("/login");
    } catch (error) {
      console.error("Verify and Signup Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Signup failed";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function logIn(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));

    try {
      if (!email || !password) throw new Error("Please enter both email and password");

      const response = await apiConnector("POST", LOGIN_API, { email, password });

      console.log("Login API Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      toast.success("Login successful!");

      // ✅ Only save user data in Redux
      dispatch(setUser(response.data.user));
      dispatch(setToken(true)); // we just store a boolean "authenticated"

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Signup function (alternative approach - direct signup without OTP)
export function signUp(fullName, userName, phoneNumber, email, password, confirmPassword, otp, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating account...");
        dispatch(setLoading(true));
        
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                fullName,
                userName,
                phoneNumber,
                email,
                password,
                confirmPassword,
                otp,
            });
            
            console.log("Signup API Response:", response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || "Signup failed");
            }
            
            toast.success("Account created successfully!");
          
            navigate("/login");
        } catch (error) {
            console.error("Signup Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Signup failed";
            toast.error(errorMessage);
            // Don't navigate back to signup on error - let user retry
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

// Logout function


export function logout(navigate) {
  console.log("User logged out successfully");
  return async (dispatch) => {
    console.log("User logged out successfully");
    try {
      // Call backend logout route (clears cookie)
      await apiConnector("POST", LOGOUT_API);

      console.log("User logged out successfully");

      // Clear Redux
      dispatch(setToken(null));
      dispatch(setUser(null));

      console.log("User logged out successfully");

      toast.success("Logged out successfully!");
      if (navigate) navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };
}


export const checkAuth = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // Step 1: check lightweight auth
    const authRes = await apiConnector("GET", IS_AUTH);

    console.log("isAuth response:", authRes.data);

    if (authRes.data?.isAuthenticated) {
      // Step 2: fetch full user only if authenticated
      const res = await apiConnector("GET", GET_ME);
      if (res.data?.user) {
        dispatch(setUser(res.data.user));
      } else {
        dispatch(clearAuth());
      }
    } else {
      dispatch(clearAuth());
    }
  } catch (err) {
    console.error("checkAuth failed:", err);
    dispatch(clearAuth());
  } finally {
    dispatch(setLoading(false));
  }
};