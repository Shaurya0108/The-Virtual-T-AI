import React from 'react';
import syllabusFile from "../assets/Syllabus.pdf";
class SyllabusRender extends React.Component {
    // pdfFile = 'C:/Users/Jesus/Desktop/CSProject_latest/CSProject/FrontEnd/src/assets/Syllabus.pdf';

  render() {
    return (
        <div>
            <iframe 
                src={syllabusFile} 
                width="100%" 
                height="100%"
                style={{ minHeight: '500px' }} // Minimum height, adjust as needed
                title="PDF"
            ></iframe>
        </div>
    );
  }
}

export default SyllabusRender;