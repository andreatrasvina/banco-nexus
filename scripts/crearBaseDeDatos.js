const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('nexus_banca');

    const clientes = db.collection('clientes');
    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    // Limpia las colecciones antes de insertar
    await clientes.deleteMany({});
    await cuentas.deleteMany({});
    await transacciones.deleteMany({});

    // Insertar clientes
    await clientes.insertMany([ 
        { _id: 1, nombre: 'Andrea Lucero', curp: 'LUTA030907MBSCRNA6' },
        { _id: 2, nombre: 'Alan Martin', curp: 'AUMA031209HBSGZLA3' },
        { _id: 3, nombre: 'Miguel Angel', curp: 'LAOM030604HDFZRGA4' }
    ]);

    // Insertar cuentas
    await cuentas.insertMany([
      { _id: 101, idCliente: 1, saldo: 5000 },
      { _id: 102, idCliente: 2, saldo: 8000 }
    ]);

    // Insertar transacciones
    await transacciones.insertMany([
      { idCuenta: 101, tipo: 'deposito', monto: 1000, fecha: new Date() },
      { idCuenta: 101, tipo: 'retiro', monto: 500, fecha: new Date() },
      { idCuenta: 102, tipo: 'deposito', monto: 3000, fecha: new Date() }
    ]);

    console.log('Clientes, cuentas y transacciones insertados correctamente.');
  } catch (error) {
    console.error('Error insertando los datos:', error);
  } finally {
    await client.close();
  }
}

run();
