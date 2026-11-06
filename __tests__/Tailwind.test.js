import { describe, test, expect } from "@jest/globals";
import ejs from "ejs";
import { readFileSync } from "node:fs";
import path from "node:path";
 
const root = path.resolve(".");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const render = (view, data) =>
  ejs.renderFile(path.join(root, "views", view), data);
 
const sampleDive = {
  id: "665f1c2a9b1e8a3d4c5b6a71",
  date: "2026-08-14",
  diveTime: 52,
  maxDepth: 18.5,
  location: "Azores",
  equipment: "",
  decompressionTime: 3,
  notes: "",
};
const sampleBuddy = {
  id: "1",
  name: "Juan",
  certification: "PADI Open Water",
  email: "juan@example.com",
};
 
// Render each page once with sample data.
const pages = async () => ({
  "homepage.ejs": await render("homepage.ejs", {}),
  "dives.ejs": await render("dives.ejs", { dives: [sampleDive] }),
  "buddies.ejs": await render("buddies.ejs", { buddies: [sampleBuddy] }),
});
 
describe("Tailwind build setup", () => {
  test("src/input.css imports Tailwind", () => {
    expect(read("src/input.css")).toContain('@import "tailwindcss"');
  });
 
  test("package.json builds the CSS, and npm start builds it first", () => {
    const { scripts } = JSON.parse(read("package.json"));
 
    expect(scripts["build:css"]).toMatch(
      /tailwindcss -i \.\/src\/input\.css -o \.\/public\/output\.css/,
    );
    expect(scripts.prestart).toBe("npm run build:css");
  });
 
  test("the generated output.css is not committed", () => {
    expect(read(".gitignore")).toMatch(/^public\/output\.css$/m);
  });
});
 
describe("every page uses Tailwind instead of the old stylesheet", () => {
  test.each(["homepage.ejs", "dives.ejs", "buddies.ejs"])(
    "%s links output.css, has a viewport tag, and has no style.css or inline styles",
    async (view) => {
      const html = (await pages())[view];
 
      expect(html).toContain('<link rel="stylesheet" href="/output.css"');
      expect(html).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1"',
      );
      expect(html).not.toContain("style.css");
      expect(html).not.toMatch(/style="/);
    },
  );
});
 
describe("responsive layout", () => {
  test.each(["dives.ejs", "buddies.ejs"])(
    "%s stacks on a phone and uses two columns from md: up",
    async (view) => {
      const html = (await pages())[view];
      const main = html.match(/<main class="([^"]*)"/)[1].split(" ");
 
      expect(main).toContain("grid");
      expect(main).toContain("md:grid-cols-[20rem_minmax(0,1fr)]");
      expect(main.some((c) => /^grid-cols-/.test(c))).toBe(false);
    },
  );
 
  test("the content is centered and capped in width on desktop", async () => {
    for (const html of Object.values(await pages())) {
      expect(html).toMatch(/class="mx-auto max-w-6xl/);
    }
  });
});
 
describe("restyled controls", () => {
  test("no button has rounded corners", async () => {
    const search = await render("partials/search-location-form.ejs", {});
    const all = [...Object.values(await pages()), search].join("\n");
    const buttons = all.match(/<button[\s\S]*?>/g);
 
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    for (const button of buttons) {
      expect(button).not.toMatch(/\brounded/);
    }
  });
 
  test("every dive form field has a visible label", async () => {
    const html = (await pages())["dives.ejs"];
    const form = html.match(/<form id="dive-entry"[\s\S]*?<\/form>/)[0];
 
    expect(form.match(/<input/g)).toHaveLength(7);
    expect(form.match(/<label/g)).toHaveLength(7);
  });
 
  test("the error message is styled with Tailwind, not set white by the client scripts", async () => {
    expect((await pages())["dives.ejs"]).toMatch(
      /id="form-error"[^>]*class="[^"]*text-rose-300/,
    );
    expect(read("public/app.js")).not.toContain("style.color");
    expect(read("public/buddies.js")).not.toContain("style.color");
  });
});
 
describe("buddy cards added by buddies.js match the server-rendered ones", () => {
  const jsClasses = read("public/buddies.js")
    .match(/className\s*=\s*"([^"]+)"/g)
    .map((line) => line.match(/"([^"]+)"/)[1]);
 
  test("the <li> card classes are identical", async () => {
    const html = (await pages())["buddies.ejs"];
    const ejsCard = html.match(/<li class="(buddy-item[^"]*)"/)[1];
 
    expect(jsClasses).toContain(ejsCard);
  });
 
  test("the name and detail line classes are identical", async () => {
    const html = (await pages())["buddies.ejs"];
    const ejsName = html.match(/<h3 class="([^"]*)">Juan/)[1];
    const ejsDetail = html.match(/<p class="([^"]*)">Certification:/)[1];
 
    expect(jsClasses).toContain(ejsName);
    expect(jsClasses).toContain(ejsDetail);
  });
});
 
describe("markup is balanced", () => {
  const count = (html, re) => (html.match(re) || []).length;
 
  test.each([
    ["partials/search-location-form.ejs", {}],
    ["partials/dive-list.ejs", { dives: [sampleDive] }],
    ["dives.ejs", { dives: [sampleDive] }],
    ["buddies.ejs", { buddies: [sampleBuddy] }],
    ["homepage.ejs", {}],
  ])("%s closes every <div> and <section> it opens", async (view, data) => {
    const html = await render(view, data);
 
    expect(count(html, /<div[\s>]/g)).toBe(count(html, /<\/div>/g));
    expect(count(html, /<section[\s>]/g)).toBe(count(html, /<\/section>/g));
  });
});