/**
 * Mali JR. — Servidor Cloud (Railway)
 */
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

// Datos en memoria (Railway no tiene disco persistente en el plan gratis)
// Los datos se recargan desde el teléfono al abrir la app
let store = { pedidos: [], updatedAt: null };

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(__dirname));

// La app del teléfono envía sus pedidos
app.post("/sync", (req, res) => {
  const { pedidos } = req.body;
  if (!Array.isArray(pedidos)) {
    return res.status(400).json({ ok: false, error: "Formato inválido" });
  }
  store = { pedidos, updatedAt: new Date().toISOString() };
  console.log(`[Sync] ${pedidos.length} pedidos recibidos`);
  res.json({ ok: true, total: pedidos.length });
});

// La tablet pide los datos
app.get("/data", (req, res) => {
  res.json(store);
});

// Health check para Railway
app.get("/health", (req, res) => {
  res.json({ ok: true, pedidos: store.pedidos.length, updatedAt: store.updatedAt });
});

// Redirigir raíz al display
app.get("/", (req, res) => {
  res.redirect("/display.html");
});

app.listen(PORT, () => {
  console.log(`Mali JR. Display corriendo en puerto ${PORT}`);
});
