const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Importar rutas
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");

// Usar las rutas
app.use("/productos", productRoutes);
app.use("/categorias", categoryRoutes);

// Mensaje de prueba en la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});