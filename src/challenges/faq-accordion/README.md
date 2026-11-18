# FAQ Accordion

Build an accordion for a list of frequently asked questions. Only **one** answer can be open at a time.

The questions are already in `App.js` in the `FAQS` array.

## Requirements

1. Render one item per FAQ. Each item has a **header button** that shows the question.
2. All answers are **closed** when the page loads.
   - A closed answer must **not be rendered** at all (don't just hide it with CSS).
3. Clicking a closed question **opens** its answer.
4. Clicking the open question again **closes** it.
5. Only **one** answer can be open. Opening another question closes the one that was open.
6. Each header button has `aria-expanded="true"` when its answer is open and `aria-expanded="false"` when it is closed.
7. A **Collapse all** button closes the open answer. It is **disabled** when nothing is open.

> 💡 You don't need one boolean per item. A single piece of state holding the *id* of the open item (or `null`) is enough.

## Required `data-testid`s

| Element | `data-testid` |
|---|---|
| Each header button | `accordion-header` |
| The open answer | `accordion-panel` |
| Collapse all button | `collapse-all` |

## Example

```
(start)                 → no answers shown, Collapse all disabled
click question 1        → answer 1 shown
click question 2        → answer 2 shown, answer 1 closed
click question 2        → no answers shown
```

## Notes
- Edit `App.js`. The tests render `<App />`.
- Keep the `FAQS` array as it is. The tests check its questions and answers.
