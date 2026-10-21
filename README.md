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

This is a web application designed for divers to be able to log information about their dives and access this information quickly and easily. It features a simple UI, with forms designed to record and save all details about your latest dive. It also provides general statistics about your diving journey.

Follow these steps to use it:

1. On your machine, open your terminal of choice in the directory in which you want the repo, and run the command
   '''bash
   git clone https://github.com/juanhorma/cs326project.git
   '''
2. After clone, run the command
   '''bash
   cd cs326project
   '''
3. At this point, you should make sure you have npm installed before moving on to project dependencies. Follow these steps:
   - npm (acronym for Node Package Manager) is included with Node.js, which you can install from the official Node.js website, https://nodejs.org/en/download.
   - Select the long-term support (LTS) version for your operating system, and download.
   - Run the installer. Add Node.js to your system PATH if prompted.
   - Close and reopen your terminal.
   - Verify that npm is installed and functioning using:

   '''bash
   node --version
   '''

   and

   '''bash
   npm --version
   '''

   - You should get a version number for both of these if they installed correctly.

4. You should have npm installed now, and you should still be in your project directory. Run:
   '''bash
   npm install
   '''
   to install all the dependencies needed for this project.
5. Then run
   '''bash
   npm start
   '''
   to start the server.
6. Then open http://localhost:3000/dives in your browser (the dive log). Dive buddies are at http://localhost:3000/buddies.

# Features

## Dive Logging

Go to '/dives'. Fill in the form at the top of the page (date, dive time in minutes and maximum depth in metres are required; location, equipment, decompression time and notes are optional) and click "Add dive entry". The browser sends a 'POST /dives' request with a JSON body. If the server accepts it, the dive is saved to 'dives.json' and appears in the list straight away, without a page reload. Click an entry to expand it and see the optional details. Saved dives are still there after the server is restarted.
If the input is invalid (for example a missing date or a dive time of 0) the server answers '400' with a message, nothing is saved, and the message is shown under the form. If the server cannot be reached, the page says so.

## Dive Buddies (second slice since we have four people)

Go to '/buddies' (also linked from the top of the dive log page). Enter a buddy's name (required), certification and email (both optional) and click "Add buddy". The browser sends 'POST /buddies'; the server validates, saves the buddy to 'buddies.json', and the new buddy is appended to the list without reloading. Rules enforced by the server: the name must be present and at most 100 characters, the email (if given) must look like an email address (ie be in email address format), and names must be unique (case-insensitive). Bad input gets a '400', a duplicate name gets a '409', and for both of these cases nothing is saved (and the message is shown under the form).

## Location Search

Users can search for existing dive logs on the /dives page using the Search Location form. Enter a location name and click Search. The form sends a GET request to /dives?location=xxx.
The server filters the saved dive logs by location and displays only the matching entries. The search is case-insensitive and supports partial matches. If no entries match, the page displays "No matching dives found."
Users can click Show all to clear the search and display all saved dive logs again.

# System Diagram
```text
Browser
   |
   |-- GET /dives?location=xxx --> dives.ejs (HTML)
   |-- POST /dives (public/app.js sends JSON)
   |-- GET /buddies
   |-- POST /buddies (requires browser submit handler)
   |
   v
server.js
   - Middleware (static files, JSON, form data)
   - Mounts /dives and /buddies routers
   |
   v
Routes
   - dives.js
   - buddies.js
   |
   v
Controllers
   - divesController.js
   - buddiesController.js
   - Read requests and send HTTP responses
   |
   v
Services
   - divesService.js
   - buddiesService.js
   - Validation and business rules
   - Uses DTOs to format data
   |
   v
Repositories
   - divesRepository.js
   - buddiesRepository.js
   - Reads saved data
   - Write when creating data
   |
   v
Storage
   - dives.json
   - buddies.json

Response back to the browser:
   GET  -> Controller renders EJS -> HTML page
   POST -> Controller returns JSON -> Browser JavaScript
           updates the displayed list
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

## Amita

### Sprint 2

One design decision I made was to validate the dive entry fields in the service layer rather than directly in the controller. The alternative option here would have been to check whether the required fields were provided inside the POST controller before saving the entry. I chose to put the validation in the service layer because it separates the business logic from handling HTTP requests and responses. This also will make validation easier to reuse if we add other ways to create or update dive entries in the future without having to repeat the same checks in multiple controllers.


## Jingpei

### Sprint 2

I took Juan's work on the GET functionality and added the search inside by implementing the filter in the service layer and using the GET query parameters (dives?location=xxx). The alternative option here would be filtering in the client side using JavaScript in app.js to filter the existing dive logs loaded in the browser. The advantage of the server side filtering is fit the existing structure, easier to implement and allow the user easily bookmark or share URLs. If we do the client side filtering, the logic in the app.js is more complex and additional JavaScript logic to manage and update. However, the tradeoff is each search requires a new request and reloads the page, the client side filtering could update the result immediately without reload the page.

## Hope
### Sprint 2
For the dive buddies slice I gave buddies their own route, controller, service, repository and JSON file (see buddies.json) instead of adding them as a nested list inside dives.json and extending the dives service. The alternative would have been less code, since one file and one repository would already exist, and a dive could point directly at its buddies. I chose the separate slice because each repository then can live independently of the other one; my goal was that changing what a buddy looks like, or later moving buddies to MongoDB, cannot break how dives are read or written, and a buddy can be added or validated without first loading every dive. The alternative would have made divesService responsible for two unrelated sets of rules (dive validation and buddy name uniqueness) and made every buddy save a rewrite of the whole dive log. The downside of my choice is some duplicated code (we have two near-identical repositories and fetch helpers) and no link yet between a dive and its buddies, which I accept for the scope of this sprint.
