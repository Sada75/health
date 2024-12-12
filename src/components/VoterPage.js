import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { ethers } from "ethers";
import ProjectRegistryABI from "../abi/ProjectRegistry.json";

const VoterPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current project index
  const [userCredits, setUserCredits] = useState(100); // Track remaining credits for the user
  const [userVotes, setUserVotes] = useState({}); // Track votes per user per project
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [voteInput, setVoteInput] = useState(0); // Store user input for votes

  // Initialize the contract instance
  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
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

      // Move to the next project
      if (currentIndex + 1 < projects.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("All projects have been voted on!");
      }
    } catch (err) {
      console.error("Error updating credits:", err);
      alert("Transaction failed: " + err.message);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  if (currentIndex >= projects.length)
    return <div>All projects have been displayed!</div>;

  // Display current project details
  const currentProject = projects[currentIndex];

  return (
    <div>
      <h1>Project Registry</h1>
      <p>Remaining Credits: {userCredits}</p>
      <div key={currentIndex}>
        <h2>{currentProject.name}</h2>
        <p>
          GitHub:{" "}
          <a
            href={currentProject.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentProject.github}
          </a>
        </p>
        <p>
          YouTube:{" "}
          <a
            href={currentProject.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentProject.youtube}
          </a>
        </p>
        <p>Credits: {currentProject.credits}</p>

        {/* Input for number of votes */}
        <input
          type="number"
          value={voteInput}
          onChange={(e) => setVoteInput(Number(e.target.value))}
          min="1"
          max={userCredits}
          placeholder="Enter number of votes"
        />
        <button
          onClick={() => voteForProject(currentIndex)}
          disabled={userCredits <= 0 || voteInput <= 0}
        >
          Vote
        </button>
      </div>

      {userCredits <= 0 && <p>You have used all your credits!</p>}
    </div>
  );
};

export default VoterPage;
