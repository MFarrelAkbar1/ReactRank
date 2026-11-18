import { useState } from "react";
import "./styles.css";

const LIMIT = 50;

export default function App() {
  const [text, setText] = useState("");

  // TODO: show the characters LEFT (LIMIT - length), not the length
  // TODO: add "warning" / "error" classes to the counter
  // TODO: disable the Post button when the text is blank or over the limit
  // TODO: keep a list of posts (newest first) and clear the textarea after posting

  return (
    <div className="composer">
      <h1>New Post</h1>
      <textarea
        data-testid="post-input"
        rows={3}
        placeholder="What's happening?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="footer">
        <span className="remaining" data-testid="remaining">
          {text.length}
        </span>
        <button data-testid="post-button">Post</button>
      </div>

      <ul className="posts"></ul>
    </div>
  );
}
