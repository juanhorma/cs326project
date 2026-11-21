import * as authService from "../services/authService.js";

const fromForm = (req) => Boolean(req.is("application/x-www-form-urlencoded"));

const startSession = async (req, userId) => {
  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  req.session.userId = userId;

  await new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

export const signup = async (req, res) => {
  const result = await authService.signup(req.body);

  if (!result.ok) {
    if (fromForm(req)) {
      return res.status(result.error.status).render("signup", {
        error: result.error.message,
        email: req.body.email || "",
      });
    }

    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }
  if (fromForm(req)) {
    await startSession(req, result.value.id);
    return res.redirect(303, "/");
  }

  res.status(201).json(result.value);
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);

  if (!result.ok) {
    if (fromForm(req)) {
      return res.status(result.error.status).render("login", {
        error: result.error.message,
        email: req.body.email || "",
      });
    }

    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }

  await startSession(req, result.value.id);

  if (fromForm(req)) {
    return res.redirect(303, "/");
  }

  res.status(200).json({ loggedIn: true });
};

export const logout = async (req, res) => {
  await new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  res.clearCookie("connect.sid");

  // redirect to login page after logout
  if (fromForm(req)) {
    return res.redirect(303, "/login");
  }
  res.status(200).send("");
};

export const me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Not logged in.",
    });
  }
  res.status(200).json(req.user);
};

export const signupPage = (req, res) => {
  res.render("signup", { error: null, email: "" });
};

export const loginPage = (req, res) => {
  res.render("login", { error: null, email: "" });
};
