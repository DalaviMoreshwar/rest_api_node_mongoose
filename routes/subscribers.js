const express = require("express");

const router = express.Router();
const Subscriber = require("../models/subscribers");

// Getting all
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.send(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message }); // 500 : error on server
  }
});

// Getting one
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
    subscribedDate: req.body.subscribedDate
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber); // 201 : successfully created an object
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 : bad user input
  }
});

// Updating one
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "Deleted Subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middelware
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" }); // 404 : could not find something
    }
  } catch (err) {
    return res.status(500).json({ message: err.message }); // 500 : server error
  }

  res.subscriber = subscriber;
  next();
}

module.exports = router;
