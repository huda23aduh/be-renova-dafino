import Brand from "../models/brand.model.js";

export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    const brand = await Brand.create({ name });

    res.json({ message: "Brand created", brand });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      where: { deleted_at: null }
    });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    await Brand.update(
      { deleted_at: new Date() },
      { where: { id } }
    );

    res.json({ message: "Soft deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
