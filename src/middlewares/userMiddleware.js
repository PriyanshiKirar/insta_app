import { body } from "express-validator";
import redis from "../services/redisService.js";
import userModel from "../models/userModel.js";
export const registerMiddleware = [
  body("username")
    .isString()
    .withMessage("username must be a String")
    .isLength({ min: 3, max: 15 })
    .withMessage("username must be bitween 3 or 15 charancter")
    .custom((value) => value === value.toLowerCase()),
  body("email").isEmail().withMessage("Email must be a valid email"),
  body("password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 5 })
    .withMessage("password must be 5 charanter"),
];

export const loginUserMidlleware = [
  body("email").isEmail().withMessage("Email must be a valid email"),
  body("password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 5 })
    .withMessage("password must be 5 charanter"),
];

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized vv" });
    } 

      //  for check token is blacklist or not 
      const  isTokenBlaclisted=await redis.get(`blaclist:${token}`)
      if(isTokenBlaclisted){
       return res.status(401).json({message:"Unautherised blaclisted"})
      }

    const decoded = userModel.verifyToken(token);
    let user = await redis.get(`user:${decoded._id}`);
    //    agr redis m data ni mila to mongodb pe janyege niche bli line mongodb p ja ry h
    if(user){
      user=JSON.parse(user)
    }
    if (!user) {
      // is line s user mongodb m mil je h fir redis m save kr lenege
      user = await userModel.findById(decoded._id);

    //   ab yaha redis m user ko save kr diya h
      if (user) {
        delete user._doc.password;
        await redis.set(`user:${decoded._id}`, JSON.stringify(user));
      } else{
        return res.status(401).json({ message: "Unauthorized aa" });

      }
    }

    req.user=user;
    req.tokenData={token,...decoded};
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
};
