import React, { useState } from 'react';
import { motion } from "framer-motion"
import { FileUpload } from 'primereact/fileupload';

export default function FileUploader({title, description, pdr, onFileUploaded}) {
  
  function handleUpload(event) {

    let uploadedFile = event.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUploaded(uploadedFile.name, e.target.result);
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

			<div className='h-10'>
        {!pdr.fileName && (
        <FileUpload 
          chooseLabel="Datei auswählen" 
          mode="basic" 
          accept=".csv" 
          customUpload 
          uploadHandler={ handleUpload }
          auto/>
        )}
        {pdr.fileName && (
          <p className="py-4">{ pdr.fileName }</p>
        )}
      </div>
		</motion.div>
  );
};