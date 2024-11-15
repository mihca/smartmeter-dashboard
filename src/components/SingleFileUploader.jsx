import React, { useState } from 'react';
import { motion } from "framer-motion"

export default function SingleFileUploader() {
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

  return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Sales Overview</h2>

			<div className='h-80'>
      <input id="file" type="file" onChange={handleFileChange} />
          {file && (
            <section>
              File details:
              <ul>
                <li>Name: {file.name}</li>
                <li>Type: {file.type}</li>
                <li>Size: {file.size} bytes</li>
                <li>Content: {file.target}</li>
              </ul>
            </section>
          )}
          {file && (
            <button
              onClick={handleUpload}
              className="submit"
            >Upload a file</button>
          )}
          {fileContent && (
            <pre>{fileContent}</pre>
          )}
			</div>
		</motion.div>
  );
};