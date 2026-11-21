const message = "You must be logged in to do that.";

export const requireLogin = (req, res, next) => {
  if (!req.user) {
    // redirect htmx requests to the login page
    if (req.get("HX-Request") === "true") {
      res.set("HX-Redirect", "/login");
      res.status(401).send(message);
      return;
    }

    // redirect regular form submissions
    if (
      req.is("application/x-www-form-urlencoded") ||
      req.accepts(["json", "html"]) === "html"
    ) {
      res.redirect(303, "/login");
      return;
    }

    // return 401 for unauthenticated requests
    res.status(401).json({ error: message });
    return;
  }

  next();
};
