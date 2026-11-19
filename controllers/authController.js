import * as authService from "../services/authService.js";

export const signup = async (req, res) => {
  const result = await authService.signup(req.body);

  if (!result.ok) {
    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }

  res.status(201).json(result.value);
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);

  if (!result.ok) {
    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }

  // create new session after successful login
  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  req.session.userId = result.value.id;

  await new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

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
