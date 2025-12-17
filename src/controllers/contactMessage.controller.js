import ContactMessage from "../models/contactMessage.model.js";

/**
 * USER – create message
 */
export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const data = await ContactMessage.create({
      name,
      email,
      message,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * ADMIN – list
 */
export const getAllMessages = async (req, res) => {
  const data = await ContactMessage.findAll({
    order: [["created_at", "DESC"]],
  });

  res.json({ success: true, data });
};

/**
 * ADMIN – detail
 */
export const getMessageById = async (req, res) => {
  const data = await ContactMessage.findByPk(req.params.id);
  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};

/**
 * ADMIN – mark read
 */
export const markRead = async (req, res) => {
  const msg = await ContactMessage.findByPk(req.params.id);
  if (!msg) return res.status(404).json({ success: false });

  await msg.update({ status: "read" });

  res.json({ success: true });
};

/**
 * ADMIN – reply
 */
export const replyMessage = async (req, res) => {
  const { reply } = req.body;
  const msg = await ContactMessage.findByPk(req.params.id);

  if (!msg) return res.status(404).json({ success: false });

  await msg.update({
    reply,
    status: "replied",
    replied_at: new Date(),
  });

  res.json({ success: true });
};

/**
 * ADMIN – delete
 */
export const deleteMessage = async (req, res) => {
  const msg = await ContactMessage.findByPk(req.params.id);
  if (!msg) return res.status(404).json({ success: false });

  await msg.destroy();
  res.json({ success: true });
};
