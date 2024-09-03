const prisma = require("../prisma/client");
const QRCode = require("qrcode");
const { generateQRCode } = require("../utils/qrCodeGenerator");
const { body, validationResult } = require("express-validator");

exports.getAllInvitations = async (req, res) => {
  try {
    const invitations = await prisma.invitation.findMany();
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInvitation = async (req, res) => {
  try {
    await prisma.invitation.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Invitation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.validateInvitation = [
  body("occasionId")
    .isInt({ min: 1 })
    .withMessage("Valid occasion ID is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.createInvitation = async (req, res) => {
  const { occasionId, inviteeId, additionalGuests, guests } = req.body;
  try {
    const invitation = await prisma.invitation.create({
      data: {
        occasionId,
        inviteeId,
        additionalGuests,
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
    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInvitation = async (req, res) => {
  const { id } = req.params;
  const { status, additionalGuests, guests } = req.body;
  try {
    const updatedInvitation = await prisma.invitation.update({
      where: { id: parseInt(id) },
      data: {
        status,
        additionalGuests,
        guests: {
          deleteMany: {},
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

exports.getInvitation = async (req, res) => {
  const { id } = req.params;
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: parseInt(id) },
      include: {
        occasion: true,
        invitee: true,
        guests: true,
      },
    });
    if (invitation) {
      res.json(invitation);
    } else {
      res.status(404).json({ error: "Invitation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
