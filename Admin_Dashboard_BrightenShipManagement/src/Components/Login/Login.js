import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"; 

import InputControl from "./InputControl/InputControl";
import { auth } from "../../pages/firebaseConfig";

import styles from "./Login.module.css";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");
  
    setSubmitButtonDisabled(true);
  
    // Use signInWithEmailAndPassword to sign in the user
    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(() => {
        console.log("Login successful");
        setSubmitButtonDisabled(false);
        // If the login is successful, call the onLoginSuccess function to update the login state in the parent component
        onLoginSuccess();
        navigate("/pages/resume"); // Navigate to the homepage or any other desired page
      })
      .catch((err) => {
        console.error("Login error:", err);
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Login</h1>

        <InputControl
          label="Email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
          placeholder="Enter email address"
        />
        <InputControl
          label="Password"
          type={showPassword ? "text" : "password"} // Toggle password visibility based on state
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))
          }
          placeholder="Enter Password"
          // Add icon and onClick to toggle password visibility
          suffix={
            <EyeInvisibleOutlined
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          }
        />


       

        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button disabled={submitButtonDisabled} onClick={handleSubmission}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
