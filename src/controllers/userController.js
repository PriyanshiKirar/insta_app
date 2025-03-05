import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import * as userService from "../services/userService.js";
import redis from '../services/redisService.js'
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
  if (!error.isEmpty()) {
    // Fixed missing parentheses in isEmpty()
    return res.status(400).json({ error: error.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userService.loginUser({ email, password });
    const token = user.gerateToken();

    return res.status(200).cookie("token", token).json({ user, token });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "loginerror", message: error.message }); // Fixed catch block
  }
};

export const logoutController = async (req, res) => {
  res.send("logout");
  // console.log(req.tokenData);

const timeRemaingForToken=req.tokenData.exp * 1000 - Date.now();


  await redis.set(`blaclist:${req.tokenData.token}`,true,"EX",Math.floor(timeRemaingForToken / 1000))
  // isse sare token aaa je h or kab create huye ttl ki help s hm bo blaclist toekn ko reids insghit s hata skte h
};
