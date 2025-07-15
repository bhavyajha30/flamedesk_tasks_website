import Challenge from "../models/challengeModel.js";

// Utility
function getDaysPassed(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

// Cron-compatible function
export async function checkAndFailChallenges() {
  try {
    const challenges = await Challenge.find({
      isActive: true,
      isFailed: false,
    });

    for (let challenge of challenges) {
      const daysPassed = getDaysPassed(challenge.startedOn);
      

      if (challenge.count < daysPassed) {
        challenge.isFailed = true;  
        await challenge.save()
      } 
    
    }

    console.log("✅ Challenge status updated successfully.");
  } catch (err) {
    console.error("❌ Error in challenge check:", err.message);
  }
}

// Reset Challenges 
async function resetChallenges() {
  try {
    const challenges = await Challenge.find({
      isActive: true,
      isFailed: false,
    });

    for (let challenge of challenges) {
      const daysPassed = getDaysPassed(challenge.startedOn);
      

      if (challenge.count === daysPassed) {
        challenge.doneToday = false;  
        await challenge.save();
      }
    
    }

    console.log("✅ Challenge task resetted successfully.");
  } catch (err) {
    console.error("❌ Error in challenge check:", err.message);
  }
}

resetChallenges();


// CRUD routes below...
export async function createChallenge(req, res) {
  const { title, image } = req.body;

  try {
    const challenge = new Challenge({
      title,
      startedOn: new Date(),
      day: 0,
      count: 0,
      image,
      isActive: false,
      ownerId: req.user.id,
    });

    const saved = await challenge.save();
    res.status(201).json({ success: true, challenge: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getChallenges(req, res) {
  try {
    const challenges = await Challenge.find({ ownerId: req.user.id }).sort({
      startedOn: -1,
    });

    res.json({ success: true, challenges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getChallengeById(req, res) {
  try {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge Not Found" });
    }

    res.json({ success: true, message: challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateChallenge(req, res) {
  const data = req.body;

  try {
    const updated = await Challenge.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(400)
        .json({ success: false, message: "Task not found or not yours" });
    }

    res.json({ success: true, message: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function deleteChallenge(req, res) {
  try {
    const deleted = await Challenge.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!deleted) {
      return res
        .status(400)
        .json({ success: false, message: "Task not found or not yours" });
    }

    res.json({ success: true, message: deleted });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
