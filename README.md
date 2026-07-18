# Draw-Together: Guided Hand-Over-Hand Mode

Built by the Idea-Engine incubate pipeline as a static, GitHub Pages-ready web app.

## What done means

- On load, the canvas displays a single faint cartoon-animal shape overlay and the first coaching-cue card is visible
- Dragging (mouse or touch) on the canvas draws a visible ink stroke over the overlay
- Clicking 'Done with this step' advances to the next card, and the visible step indicator increases by one
- A countdown timer visibly starts at 5:00 and decrements once per second while the session is active
- After the final step is completed, a single shared-completion checkmark and a 'You finished it together!' message appear
- When the countdown reaches 0:00 mid-session, the session ends and shows the completion/celebration state instead of continuing to accept step advances
- Clicking 'Start again' from the completion state clears the canvas, resets the timer to 5:00, and returns to the first coaching-cue card
- The page loads and a full session can be completed with no uncaught console errors

## Hosting

Serve this directory as static files (GitHub Pages or any static host). No build step required.
