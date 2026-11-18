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
  // TODO: remember which item is open (only one at a time)
  // TODO: only render the answer of the open item
  // TODO: set aria-expanded on each header button
  // TODO: add a "Collapse all" button

  return (
    <div className="faq">
      <h1>FAQ</h1>
      {FAQS.map((faq) => (
        <div key={faq.id} className="item">
          <button className="header" data-testid="accordion-header">
            {faq.question}
          </button>
          <div className="panel" data-testid="accordion-panel">
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
