import { useState } from "react";
import "./styles.css";

export const FAQS = [
  {
    id: "what",
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces.",
  },
  {
    id: "state",
    question: "What is state?",
    answer: "Data that a component remembers between renders.",
  },
  {
    id: "props",
    question: "What are props?",
    answer: "Inputs that a parent component passes to a child component.",
  },
];

export default function App() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className="faq">
      <h1>FAQ</h1>
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className={isOpen ? "item open" : "item"}>
            <button
              className="header"
              data-testid="accordion-header"
              aria-expanded={isOpen}
              onClick={() => toggle(faq.id)}
            >
              {faq.question}
            </button>
            {isOpen && (
              <div className="panel" data-testid="accordion-panel">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}

      <button
        className="collapse"
        data-testid="collapse-all"
        disabled={openId === null}
        onClick={() => setOpenId(null)}
      >
        Collapse all
      </button>
    </div>
  );
}
