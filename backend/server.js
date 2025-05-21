const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/nexus_banca')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

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
  const cuentaId = parseInt(req.params.cuenta);
  const cuenta = await Cuenta.findById(cuentaId);
  if (!cuenta) return res.status(404).send('Cuenta no encontrada');

  const cliente = await Cliente.findById(cuenta.idCliente);
  const transacciones = await Transaccion.find({ idCuenta: cuentaId });

  res.json({
    nombre: cliente.nombre,
    saldo: cuenta.saldo,
    transacciones
  });
});

app.listen(3000, () => console.log('Servidor escuchando en puerto 3000'));