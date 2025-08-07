import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { endpoint } from "../apis";
import { setLoading, setToken ,setUser} from "../../slices/authSlice";


const {
    SIGNUP_API,
    LOGIN_API,
    OTP_API,
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

// Login function
export function logIn(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Logging in...");
        dispatch(setLoading(true));

        try {
            // Validate inputs
            if (!email || !password) {
                throw new Error("Please enter both email and password");
            }
            
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
            });
            
            console.log("Login API Response:", response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || "Login failed");
            }
            
            toast.success("Login successful!");
            
            // Store token
            dispatch(setToken(response.data.token));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            
            
            console.log('going to dashboard')
            navigate("/"); // Navigate to home page after login
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


// Logout function - make sure it clears Redux state
export function logout(navigate) {
  return async (dispatch) => {
    try {
      // Clear Redux state FIRST
      dispatch(setToken(null));
      dispatch(setUser(null));
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
      toast.success("Logged out successfully!");
      
      // Optional: Make API call to logout on server
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      
    
      
      // Navigate after clearing state
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
  };
}

// Check if user is authenticated
export function checkAuth() {
    return (dispatch) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                dispatch(setToken(JSON.parse(token)));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Check Auth Error:", error);
            localStorage.removeItem("token");
            return false;
        }
    };
}