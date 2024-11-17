import React, { useState } from 'react';
import { motion } from "framer-motion"
import { FileUpload } from 'primereact/fileupload';

export default function FileUploader({title, description, onFileUploaded}) {
  
  const [file, setFile] = useState(null);

  function handleUpload(event) {

    let uploadedFile = event.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUploaded(e.target.result);
    }
    reader.readAsArrayBuffer(uploadedFile);

  };

  return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>{ title }</h2>

			<div className='h-80'>
        <FileUpload 
          chooseLabel="Datei auswählen" 
          mode="basic" 
          accept=".csv" 
          customUpload 
          uploadHandler={ handleUpload }
          auto/>
        {file && (
          <p className="py-4">{ file.name }</p>
        )}
        <p className="py-2">{ description }</p>
      </div>
		</motion.div>
  );
};