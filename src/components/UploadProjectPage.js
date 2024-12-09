import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'; // Import ethers.js
import '../styles/UploadProjectPage.css';

const UploadProjectPage = () => {
  const [projectName, setProjectName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [projectExplanation, setProjectExplanation] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');

  const navigate = useNavigate();

  // Set up your contract ABI and address (after deploying the contract)
  const contractAddress = "0xc333b05e362fa894641e423d462a3553d8f66928"; // Replace with your deployed contract address
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "projectName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "githubLink",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "youtubeLink",
          "type": "string"
        }
      ],
      "name": "ProjectRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newVoteCount",
          "type": "uint256"
        }
      ],
      "name": "ProjectVoted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_projectName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_githubLink",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_youtubeLink",
          "type": "string"
        }
      ],
      "name": "registerProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "voteForProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getProject",
      "outputs": [
        {
          "internalType": "string",
          "name": "projectName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "githubLink",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "youtubeLink",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "votes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "projects",
      "outputs": [
        {
          "internalType": "string",
          "name": "projectName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "githubLink",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "youtubeLink",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "votes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Connect to MetaMask
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum); // Connect to the browser's Ethereum provider
      const signer = await provider.getSigner(); // Get the signer (user's wallet)
      const contract = new ethers.Contract(contractAddress, contractABI, signer); // Connect to the contract

      try {
        // Call the registerProject function on the smart contract with the input values
        const tx = await contract.registerProject(projectName, githubLink, youtubeLink);

        // Wait for transaction to be mined
        await tx.wait();

        alert('Project registered successfully!');

        // Navigate back to the homepage
        navigate('/');
      } catch (error) {
        console.error('Error registering project:', error);
        alert('Error registering project.');
      }
    } else {
      alert('Please install MetaMask!');
    }
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
