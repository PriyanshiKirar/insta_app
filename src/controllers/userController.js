import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import * as userService from "../services/userService.js";

export const createUserController = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  const { username, email, password } = req.body;
  try {
    const user = await userService.createUser({
      username,
      email,
      password,
    });
    const token = user.gerateToken();
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

export const loginUserController = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userService.loginUser({ email, password });
    const token = user.gerateToken();
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).send("loginerror", error.message);
  }
};
