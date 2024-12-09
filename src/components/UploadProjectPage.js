import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadProjectPage.css';

const UploadProjectPage = () => {
  // State to hold form data
  const [projectName, setProjectName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [projectExplanation, setProjectExplanation] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');

  // useNavigate hook to navigate back to HomePage
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation for links (GitHub and YouTube)
    const isGithubValid = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(githubLink);
    const isYoutubeValid = youtubeLink ? /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+$/.test(youtubeLink) : true;

    if (!isGithubValid || !isYoutubeValid) {
      alert("Please provide valid GitHub and YouTube links.");
      return;
    }

    // Here, you can handle saving the data to a server or local storage
    console.log("Project Data Submitted:", { projectName, githubLink, projectExplanation, youtubeLink });

    // After submission, navigate back to the homepage
    navigate('/');
  };

  return (
    <div className="upload-project-page">
      <h2>Upload Your Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="githubLink">GitHub Link:</label>
          <input
            type="url"
            id="githubLink"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="projectExplanation">Project Explanation:</label>
          <textarea
            id="projectExplanation"
            value={projectExplanation}
            onChange={(e) => setProjectExplanation(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="youtubeLink">YouTube Link (Project Demo):</label>
          <input
            type="url"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Submit Project</button>
        </div>
      </form>
    </div>
  );
};

export default UploadProjectPage;
