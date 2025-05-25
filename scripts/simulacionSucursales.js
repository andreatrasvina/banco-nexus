const axios = require('axios');

const URL = 'http://localhost:3000/api/deposito';
const cuentaId = 200; //primero ej

const sucursales = ['CDMX', 'GDL', 'MTY'];

async function realizarDepositosDesdeSucursal(sucursal, cantidadOperaciones) {
  const operaciones = [];

  for (let i = 0; i < cantidadOperaciones; i++) {
    operaciones.push(axios.post(URL, {
      cuentaId,
      monto: 100,
      sucursal
    }));
  }

  try {
    await Promise.all(operaciones);
    console.log(`${sucursal}: ${cantidadOperaciones} depósitos realizados.`);
  } catch (err) {
    console.error(`${sucursal} tuvo un error:`, err.message);
  }
}

async function simularSucursales() {
  const tareas = sucursales.map(sucursal => realizarDepositosDesdeSucursal(sucursal, 5));

  await Promise.all(tareas);
  console.log('Simulación concurrente terminada.');
}

simularSucursales();
