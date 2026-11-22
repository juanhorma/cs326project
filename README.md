# Contributors

| Name            | GitHub Username  |
| --------------- | ---------------- |
| Juan Hormaechea | juanhorma        |
| Amita Vellal    | avellal20        |
| Jingpei Wu      | Gingpui-Ng       |
| Hope Roundcount | hroundcountUMASS |

# Working Agreement

- Team communication is done through a Discord server. Here, each teammate will notify others of their work prior to pushing to repository. Coordination will be done here as well.
  - Communication is the most important for teamwork. Check the Discord team channel every day. Reply the message which @you in 24h. If meet any issue/problem always speak up to let the teammates know.
- A pull request is "done" when two conditions are met: the first condition being that the tests concerning the change pass (if applicable), the second condition being that at least one other team member reviews the proposed changes and verifies them.
- We will divide work evenly and make sure each team member has assigned responsibilities for every sprint before we start working. Individual tasks should be completed at least one day before the sprint deadline to leave enough time for reviews and last minute fixes.
- If we disagree on an idea or implementation, we will discuss possible options as a team and try to reach a consensus together.

# Project Domain

The project will consist of a web application that allows scuba divers and free divers record and save details about their dives, such as date, total dive time, equipment used, decompression time (if applicable), maximum depth...

Divers of all kinds, no matter if they free dive, scuba dive, fresh water dive or ocean dive will benefit from this application, which addresses a problem that has to do with the need for divers to be able to quickly record and save all details about their dives on a frictionless and easily accessible platform, avoiding having to write down on paper or deal with formatting concerns on text editors.

This project domain satisfies the Computing for the Common Good objectives, as it proposes the use of technologies within the field of computing to solve a real, tangible problem people face around the world. This project is not for us, but rather for a real, specific group of people whose safety and comfort will be improved through the use of this app. A potential diver will no longer have to deal with physical copies that get lost or troublesome, hard-to-use software to keep a record of their dives. This app is what gives the diving community a specific, tailor-made tool to improve their experience.

# What this app is exactly and how to use it

This is a web application designed for divers to be able to log information about their dives and access this information quickly and easily. It features a simple UI, with forms designed to record and save all details about your latest dive as well as a log page to keep basic information on your diving buddies. It also provides general statistics about your diving journey.

Follow these steps to use it:

1. On your machine, open your terminal of choice, move into the directory of your dev container and run the command
   ```bash
   git clone https://github.com/juanhorma/cs326project.git
   ```
2. After clone, run the command
   ```bash
   cd cs326project
   ```
3. At this point, you should make sure you have npm installed before moving on to project dependencies. Follow these steps:
   - npm (acronym for Node Package Manager) is included with Node.js, which you can install from the official Node.js website, https://nodejs.org/en/download.
   - Select the long-term support (LTS) version for your operating system, and download.
   - Run the installer. Add Node.js to your system PATH if prompted.
   - Close and reopen your terminal.
   - Verify that npm is installed and functioning using:

   ```bash
   node --version
   ```

   and

   ```bash
   npm --version
   ```

   - You should get a version number for both of these if they installed correctly.

4. You should have npm installed now, and you should still be in your project directory. Run:
   ```bash
   npm install
   ```
   to install all the dependencies needed for this project. This includes Mongoose, which is used to connect the application to MongoDB.
5. Start MongoDB by running:

   ```bash
   dc-up mongo
   ```

6. Configure authentication by copying `.env.example` to `.env` and setting `MONGODB_URI` and `SESSION_SECRET`. Do not commit `.env` to GitHub.
7. Then run
   ```bash
   npm start
   ```
   to start the server.
8. Then open http://localhost:3000 in your browser.
9. Navigate to `/signup` to create an account, then `/login` to log in.
10. Once logged in, visit `/dives` to manage dives or `/buddies` to manage dive buddies. Click logout in the navigation bar to end your session.

Note: If you want to actual see the data at the database, you can open a new terminal, go to this director, run

```bash
   mongo-dev
```

The default go to devdb. Our database name is divelog. To see the database list, run

```bash
   show dbs
```

then run

```bash
   use divelog
```

To see the collection

```bash
   show collections
```

Find the data

```bash
   db.dives.find()
   db.buddies.find()
```

# Features

## Dive Logging

Go to '/dives'. Fill in the form at the top of the page (date, dive time in minutes and maximum depth in metres are required; location, equipment, decompression time and notes are optional) and click "Add dive entry". The browser sends a 'POST /dives' request with a JSON body. If the server accepts it, the dive is saved to MongoDB and appears in the list straight away, without a page reload. Click an entry to expand it and see the optional details. Saved dives are still there after the server is restarted.
If the input is invalid (for example a missing date or a dive time of 0) the server answers '400' with a message, nothing is saved, and the message is shown under the form. If the server cannot be reached, the page says so.

## Dive Buddies (second slice since we have four people)

Go to '/buddies' (also linked from the top of the dive log page). Enter a buddy's name (required), certification and email (both optional) and click "Add buddy". The browser sends 'POST /buddies'; the server validates, saves the buddy to MongoDB, and the new buddy is appended to the list without reloading. Rules enforced by the server: the name must be present and at most 100 characters, the email (if given) must look like an email address (ie be in email address format), and names must be unique (case-insensitive). Bad input gets a '400', a duplicate name gets a '409', and for both of these cases nothing is saved (and the message is shown under the form).

## Location Search

Users can search for existing dive logs on the /dives page using the Search Location form. Enter a location name and click Search. The form sends a GET request to /dives?location=xxx.
The server filters the saved dive logs by location and displays only the matching entries. The search is case-insensitive and supports partial matches. If no entries match, the page displays "No matching dives found."
Users can click Show all to clear the search and display all saved dive logs again.

# Sprint 3 Changes

## Tailwind restyle

All three pages (`/`, `/dives`, `/buddies`) are now styled with Tailwind CSS classes written in the EJS views. The hand-written `public/style.css` was deleted entirely; Tailwind's input file is `src/input.css`, and `npm run build:css` compiles it to `public/output.css` so that is what we are using and referencing in all files now.

The layout is responsive and changes shape and size. On phones, everything is in a vertical column. The title sits above the nav, the form is on top, the search buttons sit under the search box, dive and buddy cards stack, etc. On larger devices like computers, the form becomes a sticky sidebar on the left and the list fills the right column. The search box and its buttons line up in one row, each dive's summary shows date, time and depth across one row, and buddy cards show two per row.

Every form field ALSO now has a visible label. Also every page has a viewport meta tag so phones render at their real width.

Two client scripts changed so they keep working with the new styles. `public/buddies.js` gives buddies it adds to the page the same Tailwind classes as buddies the server renders, and `public/app.js` and `public/buddies.js` no longer set the error message's color inline, because that would override its Tailwind color, and I decided to go fully with Tailwind formatting for consistency.

### How to see it

1. Run `npm start` (builds the CSS first), or `npm run watch:css` in a second terminal while editing.
2. Open http://localhost:3000/dives at desktop width: you will know it is up to date if you see the form on the left, and the search and dive cards on the right.
3. In DevTools, you can sset the width to 375 px: everything stacks into one column with no sideways scrolling.
4. At both widths, add a dive, search by location, click Show all, and add a buddy on `/buddies`.
5. Run `node --experimental-vm-modules node_modules/jest/bin/jest.js __tests__/tailwind.test.js` to check the restyle.

## MongoDB Persistence

Dive log and dive buddies are now stored in MongoDB using Mongoose instead of JSON files. Both repositories support individual database operations (getAll, findById, create, updateById, and removeById). Routes such as `GET /dives`, `POST /dives`, `GET /buddies`, and `POST /buddies` now use MongoDB.

Mongo DB `_id` values are converted into string IDs through DTOs. The service layers were updated to work with the new repositories, and a new `GET /dives/:id` route and "View Dive" link were added to retrieve and display and individual dives JSON data using its MongoDB ID.

### How to Verify

1. Start MongoDB with `dc-up mongo`, then run npm start.
2. Visit /dives and /buddies, create records, and restart the server to confirm persistence.
3. Expand a dive entry and click "View Dive" to confirm that a separate page displays the correct dive's JSON data using its MongoDB ID.
4. Confirm that location search and existing form validation still work.
5. To see saved records directly in MongoDb, run `dev-db` in the terminal, then use `use divelog` and `show collections`. Run `db.dives.find()` ot `db.buddies.find()` to view stored records.

## HTMX interaction

Before the location search use the traditional GET form which reload the whole page. After implement the HTMX(hx-get), update only the dive log list without the full page reload. The divesCOntroller detects the request from HTMX and will render EJS partial(dive-list.ejs). Also can click the Show all which also use HTMX to restore all dive log without reloading.

### How to Verify

1. Visit /dives. Enter a location and click search.
2. The page won't reload and unchanged, only the dive list update.
3. Click Show All to restore all records and clear the search input.
4. ALso can press F12 open the Developer Tools -> Network to verify that the request is from HTMX

## Testing

### What changed

Full jest test suite for both dives and buddies routers added to `__tests__` directory.
Every service layer function used by controllers is tested on both failure and success scenarios.

### How to see it

Run `npm test`, all 21 tests should pass. Jest runs every test case within the `__tests__` directory.

# Sprint 4 Changes

## Accessibility Audit Fixes

### What changed

- After form submission within the /dives route, focus was move to the newly created entry.
- After form submission within the /buddies route, focus was returned to the first input field of the form.
- Wrapped page content in home page, dives and buddies routes in a dark scrim over the background to ensure minimum contrast ratio of 4.5:1
- Lightened placeholder text color across all form inputs to meet contrast requirements
- Update the location search form to move focus to the 'search all' button after submission

### How to see it

Use the keyboard to tab through the form in /dives and /buddies, filling in each required field. Then, click enter on keyboard to submit the form, the focus should now lie on the new dive log if located in the /dives route, or on the first form field if located in the /buddies route.

Open developer tools, move to the accessibility tab, on issues select contrast. If there are contrast issues, those will be shown indicating the element in question. Otherwise, no issues will be shown.

Use the keyboard to tab over to the search location form within the dives route. Click on search, the focus should automatically move to search all.

### Changes unrelated to accessibility

- Added a maximum date constraint to the dives creation form input element to prevent logging dives in the future.
- Added a validation rule to divesService to prevent creating a new dive with a date in the future with respect to the user's timezone.
## Session-Based Authentication

DiveLog now supports user authentication, allowing users to sign up, log in, and logout throughout the browser. Passwords are securely hashed using bcrypt, while `express-session` manages user sessions and `connect-mongo` stores them in MongoDB. This allows users to stay logged in across requests and server restarts while their sessions remain valid. User authentication routes, controllers, service, repository, and middleware were added to manage login sessions and identify the currently logged in user. User roles (member and admin) were also created, and the navigation section was updated to display the user's login status and an option to logout.

### How to verify:

1. Start MongoDB with dc-up mongo, then run npm start.
2. Visit /signup and create a new account using an email and password.
3. Navigate to /login and log in with the newly created account. Confirm that the navigation bar displays the logged-in user and logout option.
4. Refresh the page and navigate between /dives and /buddies to confirm that the user remains logged in.
5. Log out using the navigation bar and confirm that the login and signup options reappear.
6. Log in again, restart the server, and refresh the browser to verify that the MongoDB-backed session remains valid.
7. To inspect stored sessions, open MongoDB using `mongo-dev`, run `use divelog`, and use show collections to locate the session collection (typically sessions).

# System Diagram

```text
Browser
   [Note Pages are EJS rendered by the server and styled by public/output.css (Tailwind).]
   - views/homepage.ejs, views/dives.ejs, views/buddies.ejs, views/partials/*.ejs
   - public/app.js      sends the dive form as JSON
   - public/buddies.js  sends the buddy form as JSON, adds the new buddy card to the page
   - htmx (loaded on dives.ejs) runs the location search and "Show all" w/o a page reload
   |
   |-- GET  /                      -> homepage.ejs (HTML page)
   |-- GET  /stats                 -> plain text
   |-- GET  /dives                 -> dives.ejs (HTML page)
   |-- GET  /dives?location=xxx    (htmx, HX-Request: true)
   |                               -> partials/dive-list.ejs (HTML fragment swapped into #dives)
   |-- POST /dives                 (app.js)      -> JSON
   |-- GET  /dives/:id             ("View dive") -> JSON
   |-- GET  /buddies               -> buddies.ejs (HTML page)
   |-- POST /buddies               (buddies.js)  -> JSON
   |-- GET  /output.css, /app.js, /buddies.js, /background.jpg (static files from public/)
   |
   v
server.js
   - Connects to MongoDB with mongoose.connect
   - Middleware: static files from public/, JSON bodies, form data
   - Mounts /dives and /buddies routers, then a 404 handler and the error-handling middleware
   |
   v
Routes                          asyncHandler.js
   - routes/dives.js     ---->  wraps every controller so a rejected promise
   - routes/buddies.js          goes to the error-handling middleware
   |
   v
Controllers
   - divesController.js    htmx request -> render the partial, otherwise the full page;
                           checks /dives/:id with divesRepository.isValidId
   - buddiesController.js
   - Turn service results into HTTP responses (render EJS or send JSON)
   |
   v
Services                                  Jest tests (__tests__/)
   - divesService.js    <-------------    - divesService.test.js
   - buddiesService.js  <-------------    - buddiesService.test.js
   - Validation and business rules          call the services directly
   - Format records with DTOs
     (dtos/diveDto.js, dtos/buddyDto.js)
                                          - tailwind.test.js renders the views to check
                                            the restyle (no server, no database)
   |
   v
Repositories  < - - - - - - - - - - - - - (tests replace repositories with
   - divesRepository.js                    jest.unstable_mockModule, so they
   - buddiesRepository.js                  never reach MongoDB)
   - getAll, findById, create, updateById, removeById (one record at a time)
   |
   v
MongoDB
   - dives collection
   - buddies collection

Response back to the browser:
   GET  (normal)  -> controller renders a full EJS page -> HTML
   GET  (htmx)    -> controller renders partials/dive-list.ejs -> HTML fragment, only #dives changes
   POST           -> controller returns JSON -> app.js / buddies.js updates the page

CSS build :
   src/input.css --(Tailwind CLI)--> public/output.css
```

Errors: a service returns { ok: false, error: { status, message } } and the controller sends it as JSON (400, 409). Anything thrown or rejected in an async> handler goes through asyncHandler to the error-handling middleware at the end of server.js, which responds with JSON instead of crashing the server. In the browser, fetchJSON() checks response.ok and shows the error under the form.

# Design Decisions

## Juan

### sprint 2

I took Amita's work on the POST functionality and added GET functionality
by including logic within app.js that takes a form's input contents, and within its submit handler,
after making the POST request, dynammically constructs a new list entry and adds it to the DOM.
The alternative would have been to have the form naturally reload the page with a redirect, where the server builds
and hydrates the html once more and sends it back to the client. I didn't go down this path as it is slower and results
in a user experience that is not as smooth as the first option.

### sprint 3

One design decision I made in this sprint was using the 'experimental' jest unstable mock module to mock ESM imports.
This allowed me to mock the repository functions in order to test the business logic without actually spinning up a
mongodb instance. The alternative to this would have been to test all service functions with the database running, which would
have caused havoc when trying to do cleanup later, or in cases where the database is down, testing is impossible. Mocking the
repository modules isolates testing from the database and therefore doesn't rely on it, making maintenance trustworthy at all times.

### sprint 4

Three design decisions I made:

- Moving focus to the newly created dive entry after form submission
- Moving focus to the first input field of the buddies creation form after submission
- Moving focus to the 'search all' button upon initiating a location search for dives.

A credible alternative to the last decision:

- Moving focus to the first or last dive entry present in the updated list after a search

Why the shipped version is better:

- It doesn't assume which dive in the filtered list the user wants to see. Instead, it places the tab location one click away from moving into the first entry of the list. Otherwise, the user can just press enter to return to the full list of dives.

The alternative would have made possible false assumptions on the user's intention by placing focus on a dive they may not be interested in, making a decision that belongs to them. Also, additional logic would have had to be placed to handle the case where the filtered list is empty as no dives match a location so focus doesn't get lost.

## Amita

### Sprint 2

One design decision I made was to validate the dive entry fields in the service layer rather than directly in the controller. The alternative option here would have been to check whether the required fields were provided inside the POST controller before saving the entry. I chose to put the validation in the service layer because it separates the business logic from handling HTTP requests and responses. This also will make validation easier to reuse if we add other ways to create or update dive entries in the future without having to repeat the same checks in multiple controllers.

### Sprint 3

A design decision I made was to use the existing DTOs and update them to convert MongoDB's `_id` values into string id values for dives and buddies. An alternative option here would have been to pass MongoDB's `_id` values directly through the repositories, services, and controllers to the frontend which would be ok for some smaller applications. The DTO approach felt like the better choice here because now DiveLog can consistently reference dives and buddies using just an id field without exposing any MongoDB specific details throughout other parts of the application. Now the new `GET /dives/:id` route and "View Dive" link can use a consistent ID format to retrieve individual dive records, whereas otherwise, the controllers and views would need to handle MongoDB's `_id` structure directly, requiring additional changes and making future database changes more difficult.

### Sprint 4

For Sprint 4, I chose to implement authentication using `express-session` with `connect-mongo` to manage user sessions and store them in MongoDB. This allows DiveLog to maintain login sessions across requests and server restarts. An alternative would’ve been to use Express’s default in-memory mechanism which would have been much easier to set up and wouldn’t require connecting session storage to MongoDB. Since DiveLog already uses MongoDB to store dives and buddies, using the same database for sessions was the more practical choice and allows for users to stay logged in even after the server restarts. The main tradeoff of doing this was that `connect-mongo` requires additional configuration and a working MongoDB connection. However choosing in-memory sessions would mean that all active sessions are lost whenever the server restarts, forcing users to log in again every time.

## Jingpei

### Sprint 2

I took Juan's work on the GET functionality and added the search inside by implementing the filter in the service layer and using the GET query parameters (dives?location=xxx). The alternative option here would be filtering in the client side using JavaScript in app.js to filter the existing dive logs loaded in the browser. The advantage of the server side filtering is fit the existing structure, easier to implement and allow the user easily bookmark or share URLs. If we do the client side filtering, the logic in the app.js is more complex and additional JavaScript logic to manage and update. However, the tradeoff is each search requires a new request and reloads the page, the client side filtering could update the result immediately without reload the page.

### Sprint 3

I decide to use HTMX to implement the location search and show all. HTMX replaces the traditional HTML GET Form which I implemented in Spring 2. The alternative option would keep using the previous one. The reason I switch to HTMX is the location search only needs the matched dive log and the other elements can remain unchanged, so there is no need to reload the whole page. The cost of continuing to use the HTML GET Form will reload the whole page for each search which will reload the content which no need to change.

## Hope

### Sprint 2

For the dive buddies slice I gave buddies their own route, controller, service, repository and JSON file (see buddies.json) instead of adding them as a nested list inside dives.json and extending the dives service. The alternative would have been less code, since one file and one repository would already exist, and a dive could point directly at its buddies. I chose the separate slice because each repository then can live independently of the other one; my goal was that changing what a buddy looks like, or later moving buddies to MongoDB, cannot break how dives are read or written, and a buddy can be added or validated without first loading every dive. The alternative would have made divesService responsible for two unrelated sets of rules (dive validation and buddy name uniqueness) and made every buddy save a rewrite of the whole dive log. The downside of my choice is some duplicated code (we have two near-identical repositories and fetch helpers) and no link yet between a dive and its buddies, which I accept for the scope of this sprint.

### Sprint 3

For the responsive layout on the Dive Log and Dive Buddies pages, I used a CSS grid that puts the form in a fixed-width sidebar next to the list from the `md:` breakpoint up (`md:grid-cols-[20rem_minmax(0,1fr)]`) and stacks them in one column on phones. The other alternative option was to keep the Sprint 2 layout, with the form on top and the list underneath at every width, and just center it with a max width. That would have needed fewer classes and no breakpoint logic. I chose the sidebar because on a desktop the stacked layout pushes the dive list below seven form fields, so you scroll past the form every time you want to see your dives, while side by side you can add a dive and watch the list update without leaving the form (the sidebar is also `md:sticky`, so it stays in view on a long list). The downside of my choice was extra work and one bug that I accidentally created. There was an extra closing div, and with two columns, every opening and closing tag has to be in the right column, and a stray `</div>` in the search form pushed the dive list out of the right column until Amita spotted it. Because of that I added a test that checks every view closes the tags it opens. The stacked alternative would have avoided that risk but wasted most of a 1280 px screen.
