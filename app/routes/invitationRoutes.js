const prisma = require("../prisma/client");
const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitationController");

router.post(
  "/",
  invitationController.validateInvitation,
  invitationController.createInvitation
);
router.put(
  "/:id",
  invitationController.validateInvitation,
  invitationController.updateInvitation
);
router.get("/", invitationController.getAllInvitations);
router.get("/:id", invitationController.getInvitation);
router.delete("/:id", invitationController.deleteInvitation);

router.get("/verify/:id", async (req, res) => {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { occasion: true },
    });
    if (invitation) {
      res.json({
        valid: true,
        name: invitation.name,
        occasion: invitation.occasion.title,
        date: invitation.occasion.date,
      });
    } else {
      res.status(404).json({ valid: false, error: "Invitation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
