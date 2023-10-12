import { useState } from 'react';

const ApiTest = () => {
  const [data, setData] = useState('');

  const fetchData = async () => {
    fetch('/api/outings/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <>
      <h1>Api Tester</h1>

      <button onClick={fetchData}>Get Data</button>

      <pre>{JSON.stringify(data)}</pre>

      {/* Make a fetch request to your Api, which should just return a little bit of data. */}

      {/* The backend should return a list of outings, that's all. */}
      {/* Any manipulations should just be made on the backend, so you don't need to worry. */}
    </>
  );
};

export default ApiTest;
