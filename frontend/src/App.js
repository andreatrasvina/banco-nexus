import React, { useState } from 'react';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);

  const consultar = async () => {
    const res = await fetch(`http://localhost:3000/api/cuenta/${cuenta}`);
    const json = await res.json();
    setDatos(json);
  };

  return (
    <div>
      <h1>Banco Nexus</h1>
      <input placeholder="Número de cuenta" onChange={e => setCuenta(e.target.value)} />
      <button onClick={consultar}>Consultar</button>
      {datos && (
        <div>
          <p><strong>Nombre:</strong> {datos.nombre}</p>
          <p><strong>Saldo:</strong> ${datos.saldo}</p>
          <ul>
            {datos.transacciones.map((t, i) => (
              <li key={i}>{t.tipo} de ${t.monto} el {new Date(t.fecha).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
