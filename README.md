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

4. You should have npm installed now, and you should still be in your project directory.  Run: 
   ```bash
   npm install
   ```
   to install all the dependencies needed for this project.
5. Then run
   ```bash
   npm start
   ```
   to start the server.
6. Then open http://localhost:3000 in your browser.
