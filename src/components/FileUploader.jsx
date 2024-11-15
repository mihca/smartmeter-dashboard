import React, { useState, useRef } from 'react';
import { motion } from "framer-motion"
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

export default function SingleFileUploader({title, description}) {
  const toast = useRef(null);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileContent("");
      const reader = new FileReader();
      reader.onload = (file) => {
        setFileContent(file.target.result);
      }
      reader.readAsText(file);
      }
  };

  function handleUpload() {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    }
    reader.readAsText(file);
  };

  function onUpload (e) {
    setFile(e.target.files[0]);
    toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
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
        <Toast ref={toast}></Toast>
        <FileUpload 
          chooseLabel="Datei auswählen" 
          mode="basic" 
          name="demo[]" 
          uploadHandler={ handleUpload }
          accept="csv/*" 
          maxFileSize={1000000} 
          onUpload={onUpload} 
          auto/>
        <p className="">{ file }</p>
        <p className="">{ description }</p>
			</div>
		</motion.div>
  );
};