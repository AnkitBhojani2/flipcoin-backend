exports.authenticateUser = async (req, res) => {
  const user = await User.findOne({ walletAddress: req.body.walletAddress });
  if (!user) {
    try {
      let user = await new User(req.body).save();
      const token = jwt.sign(
        { walletAddress: user.walletAddress },
        process.env.SECRET
      );

      res.cookie("token", token, { expireIn: "1h" });
      const { _id, walletAddress, walletBalance } = user;

      return res.json({
        token,
        user: { _id, walletAddress, walletBalance },
      });
    } catch (error) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
  }

  const token = jwt.sign(
    { walletAddress: user.walletAddress },
    process.env.SECRET
  );

  res.cookie("token", token, { expireIn: "1h" });
  const { _id, walletAddress, walletBalance } = user;

  return res.json({ token, user: { _id, walletAddress, walletBalance } });
};
// const User = require("../models/user");
// var jwt = require("jsonwebtoken");
// var expressJwt = require("express-jwt");

// exports.authenticateUser = (req, res) => {
//   User.findOne({ walletAddress: req.body.walletAddress }, (err, user) => {
//     if (err || !user) {
//       let user = new User(req.body);
//       user.save((err, user) => {
//         if (err) {
//           return res.status(400).json({
//             err: "NOT able to save user in DB",
//           });
//         } else {
//           const token = jwt.sign(
//             { walletAddress: user.walletAddress },
//             process.env.SECRET
//           );

//           res.cookie("token", token, { expireIn: "1h" });
//           const { _id, walletAddress, walletBalance } = user;

//           return res.json({
//             token,
//             user: { _id, walletAddress, walletBalance },
//           });
//         }
//       });
//     }

//     const token = jwt.sign(
//       { walletAddress: user.walletAddress },
//       process.env.SECRET
//     );

//     res.cookie("token", token, { expireIn: "1h" });
//     const { _id, walletAddress, walletBalance } = user;

//     return res.json({ token, user: { _id, walletAddress, walletBalance } });
//   });
// };
