// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectRegistry {
    // Struct to store project details
    struct Project {
        string projectName;
        string githubLink;
        string youtubeLink;
        uint votes;
    }

    // Mapping to associate a user address with their project
    mapping(address => Project) public projects;

    // Event to notify when a project is registered
    event ProjectRegistered(
        address indexed user,
        string projectName,
        string githubLink,
        string youtubeLink
    );

    // Function to register or update a project
    function registerProject(
        string memory _projectName,
        string memory _githubLink,
        string memory _youtubeLink
    ) public {
        // Ensure the user provides valid inputs
        require(bytes(_projectName).length > 0, "Project name is required");
        require(bytes(_githubLink).length > 0, "GitHub link is required");
        require(bytes(_youtubeLink).length > 0, "YouTube link is required");

        // Save the project details for the user
        projects[msg.sender] = Project({
            projectName: _projectName,
            githubLink: _githubLink,
            youtubeLink: _youtubeLink,
            votes: 0
        });

        // Emit the event
        emit ProjectRegistered(msg.sender, _projectName, _githubLink, _youtubeLink);
    }

    // Function to vote for a user's project
    function voteForProject(address _user) public {
        // Ensure the user being voted for has registered a project
        require(bytes(projects[_user].projectName).length > 0, "No project found for the user");

        // Increment the vote count
        projects[_user].votes += 1;
    }

    // Function to fetch project details for a user
    function getProject(address _user)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint
        )
    {
        Project memory project = projects[_user];
        return (project.projectName, project.githubLink, project.youtubeLink, project.votes);
    }
}
