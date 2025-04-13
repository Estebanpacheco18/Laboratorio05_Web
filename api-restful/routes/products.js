const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/data.json");

// Obtener todos los productos con paginación (GET)
router.get("/", (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Valores predeterminados: page=1, limit=5
  const productos = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // Convertir page y limit a números
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Calcular el índice inicial y final
  // Se vera que productos se van a mostrar en la respuesta
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;

  // Obtener los productos paginados
  const paginatedProducts = productos.slice(startIndex, endIndex);

  // Responder con los productos paginados y metadatos
  res.json({
    currentPage: pageNumber,
    totalPages: Math.ceil(productos.length / limitNumber),
    totalProducts: productos.length,
    products: paginatedProducts,
  });
});

// Obtener un producto por ID (GET)
router.get("/:id", (req, res) => {
  const productos = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  producto ? res.json(producto) : res.status(404).json({ mensaje: "Producto no encontrado" });
});

// Crear un nuevo producto (POST)
router.post("/", (req, res) => {
  const productos = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const nuevoProducto = { id: productos.length + 1, ...req.body };
  productos.push(nuevoProducto);
  fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
  res.status(201).json(nuevoProducto);
});

// Actualizar un producto (PUT)
router.put("/:id", (req, res) => {
  const productos = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const index = productos.findIndex(p => p.id === parseInt(req.params.id));

  if (index !== -1) {
    productos[index] = { ...productos[index], ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
    res.json(productos[index]);
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

// Eliminar un producto (DELETE)
router.delete("/:id", (req, res) => {
  let productos = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const productosFiltrados = productos.filter(p => p.id !== parseInt(req.params.id));

  if (productos.length !== productosFiltrados.length) {
    fs.writeFileSync(dataPath, JSON.stringify(productosFiltrados, null, 2));
    res.json({ mensaje: "Producto eliminado" });
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

module.exports = router;