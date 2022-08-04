const User = require("../models/user");

exports.addBalance = async (req, res) => {

  const existingWalletBalance = parseFloat(
    (await User.findOne({ walletAddress: req.body.walletAddress }))
      .walletBalance
  );

  const newWalletBalance = existingWalletBalance + req.body.updateBalance;

  if (newWalletBalance >= 0) {
    await User.findOneAndUpdate(
      { walletAddress: req.body.walletAddress },
      { $set: { walletBalance: newWalletBalance } }
    );
    res.json({
      updatedBalance: newWalletBalance,
    });
  } else {
    res.status(400).json({
      message: "Something gone wrong!",
    });
  }
};
exports.widBalance = async (req, res) => {

  const existingWalletBalance = parseInt(
    (await User.findOne({ walletAddress: req.body.walletAddress }))
      .walletBalance
  );

  const newWalletBalance = existingWalletBalance - req.body.updateBalance;

  if (newWalletBalance >= 0) {
    await User.findOneAndUpdate(
      { walletAddress: req.body.walletAddress },
      { $set: { walletBalance: newWalletBalance } }
    );
    res.json({
      updatedBalance: newWalletBalance,
    });
  } else {
    res.status(400).json({
      message: "Something gone wrong!",
    });
  }
};

exports.doubleOrNothing = async (req, res) => {
  console.log(req.body);

  const existingWalletBalance = parseInt(
    (await User.findOne({ walletAddress: req.body.walletAddress }))
      .walletBalance
  );


  const num = Math.floor(Math.random() * 4);
  const digAmount = req.body.digAmount;
  if (existingWalletBalance < digAmount) {

  } else {


    if (num == 1) {
      const newWalletBalance = existingWalletBalance + digAmount * 2;
      if (newWalletBalance >= 0) {
        await User.findOneAndUpdate(
          { walletAddress: req.body.walletAddress },
          { $set: { walletBalance: newWalletBalance } }
        );
        res.json({
          updatedBalance: newWalletBalance,
        });
      }
    } else {
      const newWalletBalance = existingWalletBalance - digAmount;
      if (newWalletBalance >= 0) {
        await User.findOneAndUpdate(
          { walletAddress: req.body.walletAddress },
          { $set: { walletBalance: newWalletBalance } }
        );
        res.json({
          updatedBalance: newWalletBalance,
        });
      }
    }
  }
};
