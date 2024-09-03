const express = require("express");
const router = express.Router();
const occasionController = require("../controllers/occasionController");
const authMiddleware = require("../middleware/auth");

router.post(
  "/",
  occasionController.validateOccasion,
  occasionController.createOccasion
);
router.put(
  "/:id",
  occasionController.validateOccasion,
  occasionController.updateOccasion
);
router.get("/", occasionController.getAllOccasions);
router.get("/:id", occasionController.getOccasion);
router.delete("/:id", occasionController.deleteOccasion);

router.post(
  "/:id/send-invitations",
  authMiddleware,
  occasionController.sendWhatsAppInvitations
);
router.post(
  "/:id/send-reminders",
  authMiddleware,
  occasionController.sendWhatsAppReminder
);

module.exports = router;
