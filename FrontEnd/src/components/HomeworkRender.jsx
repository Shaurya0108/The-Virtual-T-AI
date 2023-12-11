import React from 'react';
import HomeworkFile from "../assets/Homework.pdf";
class HomeworkRender extends React.Component {
    // pdfFile = 'C:/Users/Jesus/Desktop/CSProject_latest/CSProject/FrontEnd/src/assets/Syllabus.pdf';

  render() {
    return (
        <div>
            <iframe 
                src={HomeworkFile} 
                width="100%" 
                height="100%"
                style={{ minHeight: '500px' }} // Minimum height, adjust as needed
                title="PDF"
            ></iframe>
        </div>
    );
  }
}

export default HomeworkRender;