# Character Counter

Build a tiny "post composer" with a character limit of **50**, like a short status update box.

## Requirements

1. Show a `<textarea>` for the post. It starts empty.
2. Show how many characters are **left**: `50 - text.length`. Count every character, spaces included.
   - The number can go **negative** when the text is too long (e.g. `-3`).
3. Style the counter based on what's left:
   - `warning` class when there are **10 or fewer** characters left (and not negative).
   - `error` class when the number is **negative**.
   - Neither class otherwise.
4. The **Post** button is **disabled** when:
   - the text is empty or only spaces, **or**
   - the text is over the limit.
5. Clicking **Post** adds the **trimmed** text to the list of posts (**newest first**) and clears the textarea.

> 💡 Only the textarea text and the list of posts need to be state. The remaining count, the counter class and the disabled state can all be calculated while rendering.

## Required `data-testid`s

| Element | `data-testid` |
|---|---|
| Textarea | `post-input` |
| Remaining counter | `remaining` |
| Post button | `post-button` |
| Each post (`<li>`) | `post` |

## Example

| Text length | `remaining` shows | Class | Post button |
|---|---|---|---|
| 0 | `50` | – | disabled |
| 12 | `38` | – | enabled |
| 45 | `5` | `warning` | enabled |
| 53 | `-3` | `error` | disabled |

## Notes
- Edit `App.js`. The tests render `<App />`.
- The tests are hidden. You will see each test's name and whether it passed.
