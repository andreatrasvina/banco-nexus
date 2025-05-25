const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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
  sucursal: String,
  fecha: Date
}));

//GET server.js cuenta
app.get('/api/cuenta/:cuenta', async (req, res) => {
  try {
    const cuentaId = parseInt(req.params.cuenta);
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });

    const cliente = await Cliente.findById(cuenta.idCliente);
    const transacciones = await Transaccion.find({ idCuenta: cuentaId });

    res.json({
      nombre: cliente?.nombre ?? "Desconocido",
      saldo: cuenta.saldo,
      transacciones
    });
  } catch (err) {
    console.error('Error en /api/cuenta:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

//POST Realizar deposito
app.post('/api/deposito', async (req, res) => {
  const { cuentaId, monto } = req.body;

  try {
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });

    cuenta.saldo += monto;
    await cuenta.save();

    await Transaccion.create({
      idCuenta: cuentaId,
      tipo: 'deposito',
      monto,
      sucursal: req.body.sucursal || 'SucursalDesconocida',
      fecha: new Date()
    });

    res.json({ mensaje: 'Depósito exitoso', nuevoSaldo: cuenta.saldo });
  } catch (err) {
    console.error('Error en /api/deposito:', err);
    res.status(500).json({ error: 'Error al realizar el depósito' });
  }
});

//POST Realizar retiro
app.post('/api/retiro', async (req, res) => {
  const { cuentaId, monto } = req.body;

  try {
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });

    if (cuenta.saldo < monto) {
      return res.status(400).json({ error: 'Fondos insuficientes' });
    }

    cuenta.saldo -= monto;
    await cuenta.save();

    await Transaccion.create({
      idCuenta: cuentaId,
      tipo: 'retiro',
      monto,
      sucursal: req.body.sucursal || 'SucursalDesconocida',
      fecha: new Date()
    });

    res.json({ mensaje: 'Retiro exitoso', nuevoSaldo: cuenta.saldo });
  } catch (err) {
    console.error('Error en /api/retiro:', err);
    res.status(500).json({ error: 'Error al realizar el retiro' });
  }
});

//GET Historial
app.get('/api/historial/:cuenta', async (req, res) => {
  try {
    const cuentaId = parseInt(req.params.cuenta);
    const historial = await Transaccion.find({ idCuenta: cuentaId });
    res.json(historial);
  } catch (err) {
    console.error('Error en /api/historial:', err);
    res.status(500).json({ error: 'Error consultando historial' });
  }
});

app.listen(3000, () => {
  console.log('Backend escuchando en http://localhost:3000');
});
