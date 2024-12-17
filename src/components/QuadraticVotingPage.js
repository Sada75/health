// src/components/QuadraticVotingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for navigation

const QuadraticVotingPage = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Function to navigate to the homepage
  const goToHomePage = () => {
    navigate('/HomePage');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>What is Quadratic Voting?</h1>
      <p>
        Quadratic Voting (QV) is a voting system that allows individuals to allocate votes based on the strength of their preferences. 
        It is designed to reflect the intensity of voters' feelings, not just the number of people who support a particular option.
      </p>
      
      <h2>How does it work?</h2>
      <p>
        In Quadratic Voting, each voter is given a certain number of credits or "votes." 
        The more votes you want to cast on a single issue, the more costly it becomes. 
        The cost is determined by the square of the number of votes you wish to cast.
      </p>
      
      <h3>Example:</h3>
      <p>
        If you want to cast 1 vote, it costs you 1 credit. 
        If you want to cast 2 votes, it will cost you 4 credits (2^2). 
        3 votes will cost 9 credits (3^2), and so on.
      </p>
      
      <p>
        This method helps to prevent individuals or groups from overwhelming the voting system with many votes, ensuring that each vote is a more thoughtful and meaningful expression of preference.
      </p>

      <button 
        onClick={goToHomePage}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginTop: '20px'
        }}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default QuadraticVotingPage;
