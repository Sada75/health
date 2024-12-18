const fetchReadme = async (repoUrl) => {
    try {
      // Extract the repo owner and name from the GitHub URL
      const [, owner, repo] = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  
      // Use the GitHub API to fetch the README file in raw format
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3.raw", // Fetch raw content
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch README file");
      }
  
      const readmeContent = await response.text();
      return readmeContent;
    } catch (error) {
      console.error("Error fetching README:", error);
      return null;
    }
  };
  
  export default fetchReadme;
  