import React, { useState } from 'react';

export default function SingleFileUploader () {
  const [file, setFile] = useState(null);

  function handleFileChange (e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  async function handleUpload () {
    // We will fill this out later
  };

  return (
    <>
      <div className="input-group">
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
            <li>Content: {file.content} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button 
          onClick={handleUpload}
          className="submit"
        >Upload a file</button>
      )}
    </>
  );
};