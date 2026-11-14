import { useState } from "react";
import "./styles.css";

export default function App() {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: show the success message
  };

  // TODO: track which fields were touched (onBlur)
  // TODO: validate each field and show its error message
  // TODO: disable the submit button until the form is valid

  return (
    <form className="form" data-testid="signup-form" onSubmit={handleSubmit}>
      <h1>Create account</h1>

      <label>
        Name
        <input data-testid="name-input" name="name" value={values.name} onChange={handleChange} />
      </label>

      <label>
        Email
        <input data-testid="email-input" name="email" value={values.email} onChange={handleChange} />
      </label>

      <label>
        Password
        <input
          data-testid="password-input"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
        />
      </label>

      <label>
        Confirm password
        <input
          data-testid="confirm-input"
          name="confirm"
          type="password"
          value={values.confirm}
          onChange={handleChange}
        />
      </label>

      <button data-testid="submit-button" type="submit">
        Sign up
      </button>
    </form>
  );
}
