import userModel from "../models/userModel.js";

export const createUser = async ({ username, email, password }) => {
  // console.log(username, email, password, "Service");

  if (!username || !email || !password) {
    throw new Error("All fleds must be required [username ,email,password]");
  }
  const isUserexitsSlready = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserexitsSlready) {
    throw new Error("user already exits");
  }
  const hashedPassword = await userModel.hashPassword(password);
  const user = new userModel({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  delete user._doc.password;
  return user;
};
export const loginUser = async ({ email, password }) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  delete user._doc.password;
  return user;
};