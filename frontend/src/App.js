import React, { useState } from 'react';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [datos, setDatos] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [sucursal, setSucursal] = useState('');
  const [historial, setHistorial] = useState([]);

  const consultar = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cuenta/${cuenta}`);
      const json = await res.json();
      if (json.error) {
        setMensaje(json.error);
        setDatos(null);
      } else {
        setDatos(json);
        setMensaje('');
      }
    } catch (err) {
      console.error(err);
      setMensaje('Error al consultar la cuenta.');
    }
  };

  const realizarOperacion = async (tipo) => {
    if (!cuenta || !monto || !sucursal) {
      setMensaje('Debes ingresar cuenta, monto y seleccionar sucursal.');
      return;
    }

    const url = tipo === 'deposito' ? '/api/deposito' : '/api/retiro';
    try {
      const res = await fetch(`http://localhost:3000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuentaId: parseInt(cuenta),
          monto: parseFloat(monto),
          sucursal: sucursal || 'SucursalDesconocida'
        })
      });

      const data = await res.json();
      setMensaje(data.mensaje || data.error);
      consultar();
      consultarHistorial();
      
    } catch (err) {
      console.error(err);
      setMensaje('Error en la operación.');
    }
  };

  const consultarHistorial = async () => {
    if (!cuenta || isNaN(parseInt(cuenta))) {
      setMensaje('Ingresa un número de cuenta válido para ver historial.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/historial/${cuenta}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setMensaje(data.error || 'Error al obtener historial');
        return;
      }

      setHistorial(data);
      setMensaje('');
    } catch (err) {
      console.error(err);
      setMensaje('Error al obtener historial.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#4a90e2' }}>Banco Nexus</h1>

      <div style={{ marginBottom: '1em' }}>
        <input
          type="number"
          placeholder="Número de cuenta"
          value={cuenta}
          onChange={e => setCuenta(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '0.5em' }}
        />
        <button
          onClick={consultar}
          style={{ width: '100%', padding: '10px', backgroundColor: '#4a90e2', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Consultar cuenta
        </button>

        <button
          onClick={consultarHistorial}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '0.5em',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Ver historial detallado
        </button>

      </div>

      {datos && (
        <div style={{ background: '#f0f0f0', padding: '1em', borderRadius: '8px' }}>
          <p><strong>Nombre:</strong> {datos.nombre}</p>
          <p><strong>Saldo:</strong> ${datos.saldo.toFixed(2)}</p>
          <h4>Movimientos:</h4>
          <ul>
            {datos.transacciones.map((t, i) => (
              <li key={i}>
                {t.tipo} de ${t.monto} el {new Date(t.fecha).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {historial.length > 0 && (
        <div style={{ marginTop: '1em', backgroundColor: '#e8f0ff', padding: '1em', borderRadius: '8px' }}>
          <h4>Historial detallado</h4>
          <ul>
            {historial.map((t, i) => (
              <li key={i}>
                {t.tipo} de ${t.monto} en {t.sucursal || 'Sucursal desconocida'} - {new Date(t.fecha).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '2em' }}>
        <h3>Operaciones Bancarias</h3>

        <select
          onChange={e => setSucursal(e.target.value)}
          value={sucursal}
          style={{ width: '100%', padding: '8px', marginBottom: '0.5em' }}
        >
          <option value="">Selecciona sucursal</option>
          <option value="CDMX">CDMX</option>
          <option value="GDL">GDL</option>
          <option value="MTY">MTY</option>
        </select>

        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '0.5em' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => realizarOperacion('deposito')} style={{ flex: 1, padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>
            Depositar
          </button>
          <button onClick={() => realizarOperacion('retiro')} style={{ flex: 1, padding: '10px', backgroundColor: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>
            Retirar
          </button>
        </div>
      </div>

      {mensaje && (
        <p style={{ marginTop: '1em', color: mensaje.includes('error') || mensaje.includes('Error') ? 'red' : 'green' }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default App;
