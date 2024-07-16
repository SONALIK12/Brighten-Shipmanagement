import React from "react";

import styles from "./InputControl.module.css";

function InputControl(props) {
  const { label, type, ...rest } = props; // Destructure the type prop

  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      {/* Use the type prop here */}
      <input type={type} {...rest} />
    </div>
  );
}
export default InputControl;
