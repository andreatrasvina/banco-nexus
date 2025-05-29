const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27018,localhost:27019,localhost:27020/nexus_banca?replicaSet=rsBanco';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('nexus_banca');

    const clientes = db.collection('clientes');
    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    await clientes.deleteMany({});
    await cuentas.deleteMany({});
    await transacciones.deleteMany({});

    const clientesData = [
      { _id: 1, nombre: 'Andrea Lucero', curp: 'LUTA030907MBSCRNA6' },
      { _id: 2, nombre: 'Alan Martin', curp: 'AUMA031209HBSGZLA3' },
      { _id: 3, nombre: 'Miguel Angel', curp: 'LAOM030604HDFZRGA4' },
      { _id: 4, nombre: 'Hazael Flores', curp: 'FOHA000101HDFLZL01' },
      { _id: 5, nombre: 'Marcos Inacio', curp: 'INMA000202HNTCRR02' },
      { _id: 6, nombre: 'Carlos Campa', curp: 'CACA000303HDFRMP03' },
      { _id: 7, nombre: 'Pedro Vargas', curp: 'VAPE000404HDGGLS04' },
      { _id: 8, nombre: 'Abraham Zumaya', curp: 'ZUAB000505HDFMLM05' },
      { _id: 9, nombre: 'Francisco Alcantar', curp: 'ALFR000606HDFPGM06' },
      { _id: 10, nombre: 'Emiliano Mendoza', curp: 'MEEM000707HDFRNL07' },
      { _id: 11, nombre: 'Ricardo Gayrazar', curp: 'GARI000808HDFYRT08' },
      { _id: 12, nombre: 'Agustin Iturbide', curp: 'ITAG000909HDFAZN09' },
      { _id: 13, nombre: 'Manual Palafox', curp: 'PAMA001010HDFZVX10' },
      { _id: 14, nombre: 'Emma Ibarra', curp: 'IAEM001111MDFGRL11' },
      { _id: 15, nombre: 'Perla Richi', curp: 'RIPE001212MDFMCL12' },
      { _id: 16, nombre: 'Alejandro Leyva', curp: 'LEAL010101HDFNRD13' }
    ];

    await clientes.insertMany(clientesData);

    const cuentasData = clientesData.map((cliente, index) => ({
      _id: 200 + index,
      idCliente: cliente._id,
      saldo: Math.floor(Math.random() * 15000 + 5000) 
    }));

    await cuentas.insertMany(cuentasData);

    const transaccionesData = cuentasData.map(cuenta => ({
      idCuenta: cuenta._id,
      tipo: 'deposito',
      monto: cuenta.saldo,
      sucursal: 'CDMX',
      fecha: new Date()
    }));

    await transacciones.insertMany(transaccionesData);

    console.log('Clientes, cuentas y transacciones insertados correctamente.');
  } catch (error) {
    console.error('Error insertando los datos:', error);
  } finally {
    await client.close();
  }
}

run();