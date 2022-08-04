const User = require("../models/User");
const jwt = require("jsonwebtoken")

const {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} = require("@solana/web3.js");


exports.authenticateUser = async (req, res) => {
  console.log(req.body.walletAddress);
  if (req.body.walletAddress !== null) {
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
  }
};


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
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const key = require("../keypair/id.json");

  const fromKeypair = Keypair.fromSecretKey(
    Uint8Array.from(key)
  );
  const toKeypair = new PublicKey(req.body.walletAddress);

  const existingWalletBalance = parseInt(
    (await User.findOne({ walletAddress: req.body.walletAddress }))
      .walletBalance
  );

  const newWalletBalance = existingWalletBalance - req.body.updateBalance  ;

  if (newWalletBalance >= 0) {
    await User.findOneAndUpdate(
      { walletAddress: req.body.walletAddress },
      { $set: { walletBalance: newWalletBalance } }
    );

    console.log(toKeypair);
    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toKeypair,
        lamports: LAMPORTS_PER_SOL * req.body.updateBalance,
      })
    );

    // console.log(transferTransaction);
    
    await sendAndConfirmTransaction(connection, transferTransaction, [fromKeypair]);
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
    res.json({
      updatedBalance: existingWalletBalance,
      status: 0
    });
  } else {
    if (num == 2) {
      const newWalletBalance = existingWalletBalance + digAmount;
      if (newWalletBalance >= 0) {
        await User.findOneAndUpdate(
          { walletAddress: req.body.walletAddress },
          { $set: { walletBalance: newWalletBalance } }
        );
        res.json({
          updatedBalance: newWalletBalance,
          status: 1
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
          status: 0
        });
      }
    }
  }
};