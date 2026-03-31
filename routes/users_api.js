var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// 1) GET all users (không bị xoá mềm)
router.get('/', async function (req, res, next) {
  try {
    let result = await userModel.find({
      isDeleted: false
    }).populate('role');
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 1) GET user by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({
      isDeleted: false,
      _id: id
    }).populate('role');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// 1) POST create user
router.post('/', async function (req, res, next) {
  try {
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// 1) PUT update user
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true }
    ).populate('role');
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// 1) DELETE soft delete user (xoá mềm)
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(id, {
      isDeleted: true
    }, {
      new: true
    });
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// 2) POST /enable - truyền email và username, nếu đúng thì status = true
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: "email va username khong duoc rong" });
    }
    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });
    if (!user) {
      return res.status(404).send({ message: "Thong tin khong dung" });
    }
    user.status = true;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 3) POST /disable - truyền email và username, nếu đúng thì status = false
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: "email va username khong duoc rong" });
    }
    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });
    if (!user) {
      return res.status(404).send({ message: "Thong tin khong dung" });
    }
    user.status = false;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
