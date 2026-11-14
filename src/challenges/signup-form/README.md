# Signup Form Validation

Build a signup form that validates each field and shows helpful error messages, but **only after the user has visited that field**.

## Fields and rules

| Field | `data-testid` | Rule | Error message (exact text) |
|---|---|---|---|
| Name | `name-input` | Required (after trimming) | `Name is required` |
| Email | `email-input` | Must look like an email: `something@something.something` | `Please enter a valid email` |
| Password | `password-input` (`type="password"`) | At least 8 characters **and** at least one digit | `Password must be at least 8 characters and include a number` |
| Confirm password | `confirm-input` (`type="password"`) | Must equal the password | `Passwords do not match` |

## Requirements

1. All inputs are **controlled** (their `value` comes from React state).
2. A field's error is shown only after the field is **touched**, meaning it lost focus (`onBlur`) at least once.
   - When the page first loads, **no** error messages are shown.
   - Once a field is touched, its error updates live while the user types, and disappears as soon as the value is valid.
   - When no error is shown, the error element must **not be in the DOM**.
3. Error elements use the `data-testid`s `name-error`, `email-error`, `password-error` and `confirm-error`.
4. The submit button (`submit-button`) is **disabled** until every field is valid.
5. The form element has `data-testid="signup-form"`. When it is submitted:
   - prevent the default browser submit,
   - replace the form with a success message (`data-testid="success-message"`) that reads `Welcome, <name>!` (name trimmed).

## Example

```
Focus Name, then leave it empty and blur  → "Name is required"
Type "Ada"                                → error disappears
Email "ada@"  + blur                      → "Please enter a valid email"
Password "abc" + blur                     → password error
Password "abcdefg1", confirm "abcdefg2"   → "Passwords do not match"
Everything valid                          → Submit enabled → "Welcome, Ada!"
```
