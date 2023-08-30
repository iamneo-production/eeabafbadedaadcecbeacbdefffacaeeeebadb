import React, { useState } from 'react';

function UrlValidator() {
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('GET');
  
  const validateUrl = (event) => {
    event.preventDefault();
    const domain =event.target[0].value;
    const path = event.target[1].value;
    const body= event.target[3].value;
    
    const domainRegex = /^([a-z0-9-]+\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      setMessage('Invalid URL! Please recheck your URL');
      return;
    }
    let formattedPath = '';
    if (path) {
      formattedPath = '/' + path.replace(' ', '/');
    }
    let url = `${domain}${formattedPath}`;

    if (['GET'].includes(method) && !body) {
      setMessage(url);
      return;
    }
    
    if (['DELETE'].includes(method) && !body) {
      setMessage(url);
      return;
    }

    if (['POST', 'PUT'].includes(method) && !isValidJson(body)) {
      setMessage('Error in the Body');
      return;
    }
    if (!isValidJson(body)) {
      setMessage('Error in the Body of the Query Params');
      return;
    }

    if (method === 'GET' && body) {
      const queryParams = new URLSearchParams(JSON.parse(body));
      url = `${url}?${queryParams.toString()}`;
    }

    setMessage(url);
  };

  const isValidJson = (json) => {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }
  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  return (
    <div>
    <form data-testid="submit" onSubmit={validateUrl}>
      <div>
        <label name="domain">Domain:</label>
        <input
          type="text"
          data-testid="domain"
          
        />
      </div>
      <div>
        <label name="path">Path</label>
        <input
          type="text"
          data-testid="path"
        />
      </div>
      <div>
        <label name="method">Method:</label>
        <select data-testid="method"  value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div>
        <label name="body">Body:</label>
        <textarea data-testid="body" disabled={method === 'DELETE'} />
      </div>
    
      <button type="submit">Validate</button>
      </form>
    <div data-testid="message">{message}</div>
    </div>
  );
}

export default UrlValidator;