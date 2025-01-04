import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Replace these with your contract's details
const contractAddress = "0xeb86baf5a0cfcd4cbd68e2eb1703ae34adba853e";
const PatientDoctorPortalABI = [
  // Your ABI here
];

const DoctorPortal = () => {
  const [account, setAccount] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to connect to MetaMask
  const connectToMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      notifyError('MetaMask is not installed!');
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      return provider.getSigner();
    } catch (error) {
      notifyError('Failed to connect to MetaMask!');
      console.error(error);
    }
  };

  // Fetch accessible patients for the doctor
  const fetchAccessiblePatients = async () => {
    setLoading(true);

    const signer = await connectToMetaMask();
    if (!signer) {
      setLoading(false);
      return;
    }

    const contract = new ethers.Contract(contractAddress, PatientDoctorPortalABI, signer);

    try {
      const accessiblePatients = await contract.getAccessiblePatients();
      setPatients(accessiblePatients);
      notifySuccess('Patient data loaded successfully!');
    } catch (error) {
      notifyError('Failed to fetch patients!');
      console.error(error);
    }

    setLoading(false);
  };

  // Helper functions for notifications
  const notifyError = (message) => {
    alert(`Error: ${message}`);
  };

  const notifySuccess = (message) => {
    alert(`Success: ${message}`);
  };

  useEffect(() => {
    fetchAccessiblePatients();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Doctor Portal</h1>
        <p style={styles.accountInfo}>
          Connected Account: {account || "Not connected"}
        </p>
        <button onClick={connectToMetaMask} style={styles.button}>Connect to MetaMask</button>
      </header>

      {loading ? (
        <p style={styles.loadingText}>Loading patient data...</p>
      ) : patients.length > 0 ? (
        <div style={styles.patientList}>
          <h2 style={styles.patientListTitle}>Patients Who Granted Access</h2>
          <ul>
            {patients.map((patient, index) => (
              <li key={index} style={styles.patientItem}>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>City:</strong> {patient.city}</p>
                <p>
                  <strong>Medical Records:</strong>
                  <a href={patient.medicalRecordsLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    View Records
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No patients have granted access yet.</p>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    backgroundColor: '#0044cc',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0',
  },
  accountInfo: {
    fontSize: '1.2rem',
    margin: '10px 0',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  buttonHover: {
    backgroundColor: '#ff5722',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#888',
  },
  patientList: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  patientListTitle: {
    fontSize: '1.8rem',
    marginBottom: '15px',
    textAlign: 'center',
    color: '#333',
  },
  patientItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  link: {
    color: '#0044cc',
    textDecoration: 'none',
  },
};

export default DoctorPortal;
