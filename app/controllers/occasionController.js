const prisma = require("../prisma/client");
const { body, validationResult } = require("express-validator");
const whatsappService = require("../services/whatsappService");

exports.createOccasion = async (req, res) => {
  try {
    const occasion = await prisma.occasion.create({
      data: req.body,
    });
    res.json(occasion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOccasions = async (req, res) => {
  try {
    const occasions = await prisma.occasion.findMany();
    res.json(occasions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOccasion = async (req, res) => {
  try {
    const occasion = await prisma.occasion.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { invitations: true },
    });
    if (occasion) {
      res.json(occasion);
    } else {
      res.status(404).json({ error: "Occasion not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOccasion = async (req, res) => {
  try {
    const occasion = await prisma.occasion.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(occasion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOccasion = async (req, res) => {
  try {
    await prisma.occasion.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Occasion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.validateOccasion = [
  body("title").notEmpty().withMessage("Title is required"),
  body("date").isISO8601().toDate().withMessage("Valid date is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.sendWhatsAppInvitations = async (req, res) => {
  const { id } = req.params;
  try {
    const occasion = await prisma.occasion.findUnique({
      where: { id: parseInt(id) },
      include: { invitations: true },
    });

    if (!occasion) {
      return res.status(404).json({ error: "Occasion not found" });
    }

    if (!occasion.sendWhatsAppNotifications) {
      return res.status(400).json({
        error: "WhatsApp notifications not enabled for this occasion",
      });
    }

    for (const invitation of occasion.invitations) {
      if (invitation.phoneNumber) {
        const message = `You're invited to ${occasion.title} on ${occasion.date}. Location: ${occasion.location}`;
        await whatsappService.sendWhatsAppMessage(
          invitation.phoneNumber,
          message
        );
      }
    }

    res.json({ message: "WhatsApp invitations sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendWhatsAppReminder = async (req, res) => {
  const { id } = req.params;
  try {
    const occasion = await prisma.occasion.findUnique({
      where: { id: parseInt(id) },
      include: { invitations: true },
    });

    if (!occasion) {
      return res.status(404).json({ error: "Occasion not found" });
    }

    if (!occasion.sendWhatsAppNotifications) {
      return res.status(400).json({
        error: "WhatsApp notifications not enabled for this occasion",
      });
    }

    for (const invitation of occasion.invitations) {
      if (invitation.phoneNumber && invitation.status === "ACCEPTED") {
        const message = `Reminder: ${occasion.title} is coming up on ${occasion.date}. We look forward to seeing you!`;
        await whatsappService.sendWhatsAppMessage(
          invitation.phoneNumber,
          message
        );
      }
    }

    res.json({ message: "WhatsApp reminders sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addGuestsToInvitation = async (req, res) => {
  const { occasionId, invitationId } = req.params;
  const { guests } = req.body;
  const userId = req.userId;

  try {
    // Check if the user is the owner of the occasion
    const occasion = await prisma.occasion.findUnique({
      where: { id: parseInt(occasionId) },
    });

    if (occasion.ownerId !== userId) {
      return res
        .status(403)
        .json({ error: "Only the occasion owner can add guests" });
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id: parseInt(invitationId) },
      data: {
        additionalGuests: {
          increment: guests.length,
        },
        guests: {
          create: guests.map((guest) => ({
            name: guest.name,
            qrCode: generateQRCode(`guest:${guest.name}`),
          })),
        },
      },
      include: {
        guests: true,
      },
    });

    res.json(updatedInvitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
