var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');

// GET all roles
router.get('/', async function (req, res, next) {
  try {
    let result = await roleModel.find({
      isDeleted: false
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({
      isDeleted: false,
      _id: id
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// 4) GET all users by role id: /roles/:id/users
let userModel = require('../schemas/users');
router.get('/:id/users', async function (req, res, next) {
  try {
    let id = req.params.id;
    // Kiểm tra role có tồn tại không
    let role = await roleModel.findOne({
      isDeleted: false,
      _id: id
    });
    if (!role) {
      return res.status(404).send({ message: "ROLE NOT FOUND" });
    }
    // Lấy tất cả user có role là id
    let users = await userModel.find({
      isDeleted: false,
      role: id
    }).populate('role');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST create role
router.post('/', async function (req, res, next) {
  try {
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description
    });
    await newRole.save();
    res.send(newRole);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE soft delete role
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(id, {
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

module.exports = router;
