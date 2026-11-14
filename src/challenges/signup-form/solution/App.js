import { useState } from "react";
import "./styles.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Please enter a valid email";
  if (values.password.length < 8 || !/\d/.test(values.password)) {
    errors.password = "Password must be at least 8 characters and include a number";
  }
  if (values.confirm !== values.password) errors.confirm = "Passwords do not match";
  return errors;
}

const FIELDS = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirm", label: "Confirm password", type: "password" },
];

export default function App() {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [submittedName, setSubmittedName] = useState(null);

  // Errors are derived from the current values, never stored.
  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmittedName(values.name.trim());
  };

  if (submittedName !== null) {
    return (
      <p className="success" data-testid="success-message">
        Welcome, {submittedName}!
      </p>
    );
  }

  return (
    <form className="form" data-testid="signup-form" onSubmit={handleSubmit} noValidate>
      <h1>Create account</h1>

      {FIELDS.map(({ name, label, type }) => {
        const showError = touched[name] && errors[name];
        return (
          <label key={name}>
            {label}
            <input
              data-testid={name + "-input"}
              name={name}
              type={type}
              value={values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={showError ? "true" : "false"}
            />
            {showError && (
              <span className="error" data-testid={name + "-error"}>
                {errors[name]}
              </span>
            )}
          </label>
        );
      })}

      <button data-testid="submit-button" type="submit" disabled={!isValid}>
        Sign up
      </button>
    </form>
  );
}
