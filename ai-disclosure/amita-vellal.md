# Sprint 0

- I used ChatGPT to clarify the workflow of committing again after updating a file.

# Sprint 1

- I did not use AI for this sprint.

# Sprint 2

- I used ChatGPT to ask about basic EJS syntax for the initial version of the dive log rendering, specifically about how to display a field for each entry of a form. I used an EJS loop to iterate through the entries and display each entry along with its fields.

# Sprint 3

- I used ChatGPT to ask about the length of ids in MongoDB which I used for testing. It said that the ids are 12 bytes or a 24 character hexadecimal string, and I used that to write a test for the GET /dives/:id route. I also showed it my updated dives repository code, and it caught a syntax error where I missed brackets around the diveTime values in the schema (line 7 of divesRepository.js).

# Sprint 4

- I used ChatGPT to ask about how to set up environment variables for session-based authentication. It suggested creating a .env.example file to document required variables and then a separate .env file for actual credentials to ensure they wouldn’t be committed to GitHub.
- I also asked about express-session and connect-mongo and how to manage user sessions and store them in MongoDB. It recommended that I use req.session.regenerate to help prevent session fixation attacks.
- I also consulted with AI for EJS syntax when editing navigate.ejs, specifically to display signup, login, and logout controls.
