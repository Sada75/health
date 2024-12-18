import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import fetchReadme from "../utils/githubAPI"; // Import fetchReadme function
import ProjectRegistryABI from "../abi/ProjectRegistry.json"; // Replace with the correct path to your ABI file

const VoterPage = () => {
  const [projects, setProjects] = useState([]); // Store project list
  const [readmeContents, setReadmeContents] = useState({}); // Store README contents for projects
  const [userCredits, setUserCredits] = useState(100); // Track remaining credits for the user
  const [userVotes, setUserVotes] = useState({}); // Track votes per user per project
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [voteInputs, setVoteInputs] = useState({}); // Store vote input for each project

  // Inline styles for the page
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f7f9fc",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
    projectCard: {
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    projectTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#007bff",
    },
    projectInfo: {
      margin: "10px 0",
      fontSize: "14px",
      color: "#555",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
    },
    input: {
      width: "80px",
      padding: "5px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginRight: "10px",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "4px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
    disabledButton: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    credits: {
      marginTop: "10px",
      fontWeight: "bold",
      color: "#ff5733",
    },
    readme: {
      marginTop: "10px",
      padding: "10px",
      backgroundColor: "#f1f1f1",
      borderRadius: "5px",
      overflowX: "auto",
      fontFamily: "monospace",
    },
  };

  // Initialize the contract instance
  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractAddress = "0xceDE3455718E1ac3152dFf01f92c5384B3d1f391"; // Replace with your contract address
        const contractInstance = new ethers.Contract(
          contractAddress,
          ProjectRegistryABI,
          signer
        );
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    };

    initializeContract();
  }, []);

  // Fetch all projects on load
  useEffect(() => {
    if (!contract) return;

    const fetchData = async () => {
      try {
        // Fetch all projects
        const allProjects = await contract.getAllProjects();
        const projectList = allProjects.map((project) => ({
          name: project.projectName,
          github: project.githubLink,
          youtube: project.youtubeLink,
          credits: project.credits.toString(),
          owner: project.owner, // Get the owner address from the struct
        }));
        setProjects(projectList);

        // Fetch README content for each project
        const readmePromises = projectList.map((project) =>
          fetchReadme(project.github)
        );
        const readmes = await Promise.all(readmePromises);
        const readmeMap = projectList.reduce((acc, project, index) => {
          acc[project.name] = readmes[index] || "README not available.";
          return acc;
        }, {});
        setReadmeContents(readmeMap);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [contract]);

  // Handle voting for a project
  const voteForProject = async (projectIndex) => {
    const project = projects[projectIndex];
    const votes = userVotes[project.name] || 0;
    const newVotes = votes + 1;
    const quadraticCredits = Math.pow(newVotes, 2);

    // Check if the user has enough credits left
    if (quadraticCredits > userCredits) {
      alert("You don't have enough credits to vote!");
      return;
    }

    // Update local state for user votes and credits
    setUserVotes({
      ...userVotes,
      [project.name]: newVotes,
    });
    setUserCredits(userCredits - quadraticCredits);

    const totalCredits = parseInt(project.credits) + quadraticCredits;

    try {
      // Call the updateCredits function with the project owner's address
      const tx = await contract.updateCredits(project.owner, totalCredits);
      await tx.wait();
      alert("Credits updated successfully!");
    } catch (err) {
      console.error("Error updating credits:", err);
      alert("Transaction failed: " + err.message);
    }
  };

  // Handle vote input change
  const handleVoteInputChange = (index, value) => {
    setVoteInputs({
      ...voteInputs,
      [index]: value,
    });
  };

  if (loading) return <div style={styles.header}>Loading projects...</div>;

  if (projects.length === 0)
    return <div style={styles.header}>No projects available!</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Project Registry</h1>
      <p style={styles.credits}>Remaining Credits: {userCredits}</p>

      {/* Render projects dynamically */}
      {projects.map((project, index) => (
        <div key={index} style={styles.projectCard}>
          <h2 style={styles.projectTitle}>{project.name}</h2>
          <p style={styles.projectInfo}>
            GitHub:{" "}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {project.github}
            </a>
          </p>
          <p style={styles.projectInfo}>
            YouTube:{" "}
            <a
              href={project.youtube}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {project.youtube}
            </a>
          </p>
          <p style={styles.projectInfo}>Credits: {project.credits}</p>

          {/* Display the README content */}
          <div style={styles.readme}>
            <h3>README Content:</h3>
            <pre>{readmeContents[project.name]}</pre>
          </div>

          {/* Input for number of votes for each project */}
          <input
            type="number"
            value={voteInputs[index] || 0}
            onChange={(e) => handleVoteInputChange(index, Number(e.target.value))}
            style={styles.input}
            min="1"
            max={userCredits}
            placeholder="Votes"
          />
          <button
            onClick={() => voteForProject(index)}
            style={
              userCredits <= 0 || voteInputs[index] <= 0
                ? { ...styles.button, ...styles.disabledButton }
                : styles.button
            }
            disabled={userCredits <= 0 || voteInputs[index] <= 0}
          >
            Vote
          </button>
        </div>
      ))}

      {userCredits <= 0 && (
        <p style={styles.credits}>You have used all your credits!</p>
      )}
    </div>
  );
};

export default VoterPage;
