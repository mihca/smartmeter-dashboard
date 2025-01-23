import React, { useState } from 'react';
import { Button } from "@heroui/button";
import { motion } from "framer-motion"

export default function FileUploader({title, importError, onFileUploaded, demoFile}) {
  
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState(null);

  function handleUpload(event) {

    let uploadedFile = event.target.files[0];
    const reader = new FileReader();
    setLoading(true);
    
    reader.onload = (e) => {
      setFilename(uploadedFile.name);
      onFileUploaded(uploadedFile.name, e.target.result);
      setLoading(false);
    }
    
    reader.readAsText(uploadedFile);

  };

  function handleDemoUpload() {
    fetch(`${demoFile}`)
      .then(response => response.text())
      .then(data => {
        setFilename(demoFile);
        onFileUploaded(demoFile, data);
      });
  }

  return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>{ title }</h2>

			<div className='h-20'>
        <input 
          className='bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition duration-200 w-auto'
          accept=".csv;.xls" 
          type="file"
          onChange={ handleUpload }/>

        { demoFile && (
          <button
						className='px-3 py-2 mx-6 rounded bg-blue-600 hover:bg-gray-700 transition duration-200'
						onClick={handleDemoUpload}
					>
						Lade Demo-Datei
					</button>
        )}

        {loading && (
          <p className='py-4'>Datei wird eingelesen...</p>
        )}
        
        {filename && (
          <p className='py-4'>{filename}</p>
        )}

        {importError && (
          <p className='py-4'>Dateiformat unbekannt!</p>
        )}
      </div>
		</motion.div>
  );
};