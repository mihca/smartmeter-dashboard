import React, { useState } from 'react';
import { motion } from "framer-motion"

export default function FileUploader({title, importError, onFileUploaded}) {
  
  const [loading, setLoading] = useState(false);

  function handleUpload(event) {

    let uploadedFile = event.target.files[0];
    const reader = new FileReader();
    setLoading(true);
    
    reader.onload = (e) => {
      onFileUploaded(uploadedFile.name, e.target.result);
      setLoading(false);
    }
    
    reader.readAsText(uploadedFile);

  };

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

        {loading && (
          <p className='py-4'>Datei wird eingelesen...</p>
        )}

        {importError && (
          <p className='py-4'>Dateiformat unbekannt!</p>
        )}
      </div>
		</motion.div>
  );
};