import { useState } from "react";
import "./styles.css";

const LIMIT = 50;

export default function App() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  const remaining = LIMIT - text.length;
  const isBlank = text.trim() === "";
  const isOver = remaining < 0;

  let counterClass = "remaining";
  if (isOver) counterClass += " error";
  else if (remaining <= 10) counterClass += " warning";

  const handlePost = () => {
    if (isBlank || isOver) return;
    setPosts((prev) => [{ id: Date.now() + Math.random(), text: text.trim() }, ...prev]);
    setText("");
  };

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
        <span className={counterClass} data-testid="remaining">
          {remaining}
        </span>
        <button
          data-testid="post-button"
          disabled={isBlank || isOver}
          onClick={handlePost}
        >
          Post
        </button>
      </div>

      <ul className="posts">
        {posts.map((post) => (
          <li key={post.id} data-testid="post">
            {post.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
