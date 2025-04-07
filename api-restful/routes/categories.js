const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/categories.json");

// Leer datos del archivo JSON
const getData = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Guardar datos en el archivo JSON
const saveData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// Obtener todas las categorías
router.get("/", (req, res) => {
  const categories = getData();
  res.json(categories);
});

// Obtener una categoría por ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const categories = getData();
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return res.status(404).json({ mensaje: "Categoría no encontrada" });
  }

  res.json(category);
});

// Crear una nueva categoría
router.post("/", (req, res) => {
  const { nombre } = req.body;
  const categories = getData();

  const newCategory = {
    id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
    nombre,
  };

  categories.push(newCategory);
  saveData(categories);

  res.status(201).json({ mensaje: "Categoría creada", categoria: newCategory });
});

// Actualizar una categoría por ID
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre } = req.body;
  const categories = getData();
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return res.status(404).json({ mensaje: "Categoría no encontrada" });
  }

  category.nombre = nombre || category.nombre;
  saveData(categories);

  res.json({ mensaje: "Categoría actualizada", categoria: category });
});

// Eliminar una categoría por ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const categories = getData();
  const filteredCategories = categories.filter((c) => c.id !== id);

  if (categories.length === filteredCategories.length) {
    return res.status(404).json({ mensaje: "Categoría no encontrada" });
  }

  saveData(filteredCategories);
  res.json({ mensaje: "Categoría eliminada" });
});

module.exports = router;