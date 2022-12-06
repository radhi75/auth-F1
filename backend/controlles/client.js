const client = require("../models/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Register = async (req, res) => {
  const { email, motpasse } = req.body;
  try {
    const found = await client.findOne({ email });
    if (found) {
      res.status(400).send({ erros: [{ msg: "client already exist" }] });
    }
    const clients = new client(req.body);
    // hash motpasse bcrypt

    const salt = 10;
    const hashmotpasse = bcrypt.hashSync(motpasse, salt);
    clients.motpasse = hashmotpasse;
    //jwt
    const payload = { id: clients._id };
    const token = jwt.sign(payload, process.env.secretorkey);
    await clients.save();
    res.status(200).send({ msg: "client added", clients, token });
  } catch (error) {
    res.status(500).send({ msg: "could not add client" });
  }
};

// exports.Login = async (req, res) => {
//   const { email, motpasse } = req.body;
//   try {
//     const clients = await client.findOne({ email });
//     if (!clients) {
//       return res.status(400).send({ erros: [{ msg: "client do not exist" }] });
//     }
//     // déhash motpasse bcrypt
//     const match = await bcrypt.compare(motpasse, clients.motpasse);
//     if (!match) {
//       return res.status(400).send({ erros: [{ msg: "motpasse incorrect" }] });
//     }
//     const payload = { id: clients._id };
//     const token = jwt.sign(payload, process.env.secretorkey);
//     res.status(200).send({ msg: "welcome", clients, token });
//   } catch (error) {
//     res.status(500).send({ msg: "could not login" });
//   }
// };
exports.Login = async (req, res) => {
  const { email, motpasse } = req.body;
  try {
    const clients = await client.findOne({ email });
    if (!clients) {
      return res.status(400).send({ errors: [{ msg: "client not found" }] });
    }
    const match = await bcrypt.compare(motpasse, clients.motpasse);
    if (!match) {
      return res.status(400).send({ errors: [{ msg: "client not found" }] });
    }
    const payload = { id: clients._id };
    const token = jwt.sign(payload, process.env.secretOrKey);
    res.status(200).send({ msg: "login", clients, token });
  } catch (error) {
    res.status(500).send({ errors: [{ msg: "could not login" }] });
  }
};
