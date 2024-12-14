import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ProjectRegistryABI from "../abi/ProjectRegistry.json"; // Replace with the correct path to your ABI file

const VoterPage = () => {
  const [projects, setProjects] = useState([]); // Store project list
  const [userCredits, setUserCredits] = useState(100); // Track remaining credits for the user
  const [userVotes, setUserVotes] = useState({}); // Track votes per user per project
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [voteInputs, setVoteInputs] = useState({}); // Store vote input for each project

  // Initialize the contract instance
  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractAddress = "0x17DEB58730b1A881AA03ACaA3bc99221be39ff9f"; // Replace with your contract address
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

  if (loading) return <div>Loading projects...</div>;

  if (projects.length === 0) return <div>No projects available!</div>;

  return (
    <div>
      <h1>Project Registry</h1>
      <p>Total Projects: {projects.length}</p> {/* Added project count */}
      <p>Remaining Credits: {userCredits}</p>

      {/* Render projects dynamically */}
      {projects.map((project, index) => (
        <div
          key={index}
          style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}
        >
          <h2>{project.name}</h2>
          <p>
            GitHub: {" "}
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              {project.github}
            </a>
          </p>
          <p>
            YouTube: {" "}
            <a href={project.youtube} target="_blank" rel="noopener noreferrer">
              {project.youtube}
            </a>
          </p>
          <p>Credits: {project.credits}</p>

          {/* Input for number of votes for each project */}
          <input
            type="number"
            value={voteInputs[index] || 0}
            onChange={(e) => handleVoteInputChange(index, Number(e.target.value))}
            min="1"
            max={userCredits}
            placeholder="Enter number of votes"
          />
          <button
            onClick={() => voteForProject(index)}
            disabled={userCredits <= 0 || voteInputs[index] <= 0}
          >
            Vote
          </button>
        </div>
      ))}

      {userCredits <= 0 && <p>You have used all your credits!</p>}
    </div>
  );
};

export default VoterPage;
