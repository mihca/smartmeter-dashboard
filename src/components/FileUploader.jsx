import React, { useState } from 'react';
import { motion } from "framer-motion"

export default function FileUploader({title, description, pdr, onFileUploaded}) {
  
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
          color="primary"
          radius="sm" 
          mode="basic" 
          accept=".csv" 
          type="file"
          customUpload 
          onChange={ handleUpload }/>

        {loading && (
          <p className='py-4'>Lade..</p>
        )}
        {pdr.fileName && (
          <p className="py-4">{ pdr.fileName }</p>
        )}
      </div>
		</motion.div>
  );
};