// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract ProjectRegistry {
    // Struct to store project details
    struct Project {
        string projectName;
        string githubLink;
        string youtubeLink;
        uint credits;
    }

    // Mapping to associate a user address with their project
    mapping(address => Project) public projects;

    // Array to store all user addresses
    address[] public userAddresses;

    // Event to notify when a project is registered
    event ProjectRegistered(
        address indexed user,
        string projectName,
        string githubLink,
        string youtubeLink
    );

    // Event to notify when credits are updated for a project
    event CreditsUpdated(address indexed user, uint newCreditCount);

    // Function to register or update a project
    function registerProject(
        string calldata _projectName,
        string calldata _githubLink,
        string calldata _youtubeLink
    ) external {
        require(bytes(_projectName).length > 0, "Project name is required");
        require(bytes(_githubLink).length > 0, "GitHub link is required");
        require(bytes(_youtubeLink).length > 0, "YouTube link is required");

        if (bytes(projects[msg.sender].projectName).length == 0) {
            userAddresses.push(msg.sender);
        }

        projects[msg.sender] = Project({
            projectName: _projectName,
            githubLink: _githubLink,
            youtubeLink: _youtubeLink,
            credits: 0
        });

        emit ProjectRegistered(msg.sender, _projectName, _githubLink, _youtubeLink);
    }

    // Function to update credits for a project
    function updateCredits(address _user, uint _credits) external {
        require(bytes(projects[_user].projectName).length > 0, "No project found for the user");
        projects[_user].credits = _credits;
        emit CreditsUpdated(_user, _credits);
    }

    // Function to fetch projects for given user addresses
    function getProjects(address[] calldata users) external view returns (Project[] memory) {
        uint length = users.length;
        Project[] memory result = new Project[](length);
        for (uint index = 0; index < length; index++) {
            result[index] = projects[users[index]];
        }
        return result;
    }

    // Function to fetch all projects
    function getAllProjects() external view returns (Project[] memory) {
        uint length = userAddresses.length;
        Project[] memory result = new Project[](length);
        for (uint index = 0; index < length; index++) {
            result[index] = projects[userAddresses[index]];
        }
        return result;
    }
}
