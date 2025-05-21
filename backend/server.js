const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/nexus_banca')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const Cuenta = mongoose.model('Cuenta', new mongoose.Schema({
  _id: Number,
  idCliente: Number,
  saldo: Number
}));

const Cliente = mongoose.model('Cliente', new mongoose.Schema({
  _id: Number,
  nombre: String,
  curp: String
}));

const Transaccion = mongoose.model('Transaccion', new mongoose.Schema({
  idCuenta: Number,
  tipo: String,
  monto: Number,
  fecha: Date
}));

app.get('/api/cuenta/:cuenta', async (req, res) => {
  try {
    const cuentaId = parseInt(req.params.cuenta);
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) return res.status(404).send('Cuenta no encontrada');

    const cliente = await Cliente.findById(cuenta.idCliente);
    const transacciones = await Transaccion.find({ idCuenta: cuentaId });

    res.json({
      nombre: cliente?.nombre ?? "Desconocido",
      saldo: cuenta.saldo,
      transacciones
    });
  } catch (err) {
    console.error('Error en /api/cuenta:', err);
    res.status(500).send('Error interno en el servidor');
  }
});

app.listen(3000, () => {
  console.log('Backend escuchando en http://localhost:3000');
});