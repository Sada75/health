import React, { useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractAddress = "0xeb86baf5a0cfcd4cbd68e2eb1703ae34adba853e"; // Replace with your deployed contract address
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_doctor",
        "type": "address"
      }
    ],
    "name": "allowDoctorAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "PatientDetailsUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_age",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_medicalRecordsLink",
        "type": "string"
      }
    ],
    "name": "setPatientDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    // View function to get accessible patients
    // ...
  },
  {
    // View function to get patient details
    // ...
  }
];

const VoterPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [medicalRecordsLink, setMedicalRecordsLink] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // Function to connect to MetaMask using BrowserProvider
  const connectToMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      notifyError("MetaMask is not installed!");
      return null;
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      return provider.getSigner();
    } catch (error) {
      notifyError("Failed to connect to MetaMask!");
      console.error(error);
    }
  };

  // Function to set patient details
  const handleSetPatientDetails = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.setPatientDetails(name, age, city, medicalRecordsLink);
      await tx.wait();
      notifySuccess("Patient details set successfully!");
    } catch (error) {
      notifyError("Failed to set patient details!");
      console.error(error);
    }
  };

  // Function to allow doctor access
  const handleAllowDoctorAccess = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.allowDoctorAccess(doctorAddress);
      await tx.wait();
      notifySuccess("Doctor access granted!");
    } catch (error) {
      notifyError("Failed to grant doctor access!");
      console.error(error);
    }
  };

  // Function to get patient details
  const handleGetPatientDetails = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const details = await contract.getPatientDetails();
      setPatientDetails({
        name: details[0],
        age: details[1].toString(),
        city: details[2],
        medicalRecordsLink: details[3],
        allowedDoctors: details[4],
      });
      notifySuccess("Patient details fetched successfully!");
    } catch (error) {
      notifyError("Failed to fetch patient details!");
      console.error(error);
    }
  };

  return (
    <div className="patient-portal">
      <h1>Patient Portal</h1>
      
      {/* Set Patient Details */}
      <div>
        <h2>Set Your Details</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Medical Records Link"
          value={medicalRecordsLink}
          onChange={(e) => setMedicalRecordsLink(e.target.value)}
        />
        <button onClick={handleSetPatientDetails}>Submit Details</button>
      </div>

      {/* Allow Doctor Access */}
      <div>
        <h2>Grant Access to Doctor</h2>
        <input
          type="text"
          placeholder="Doctor's MetaMask Address"
          value={doctorAddress}
          onChange={(e) => setDoctorAddress(e.target.value)}
        />
        <button onClick={handleAllowDoctorAccess}>Grant Access</button>
      </div>

      {/* Get Patient Details */}
      <div>
        <h2>View Your Details</h2>
        <button onClick={handleGetPatientDetails}>Fetch Details</button>
        {patientDetails && (
          <div>
            <p><strong>Name:</strong> {patientDetails.name}</p>
            <p><strong>Age:</strong> {patientDetails.age}</p>
            <p><strong>City:</strong> {patientDetails.city}</p>
            <p><strong>Medical Records Link:</strong> {patientDetails.medicalRecordsLink}</p>
            <p><strong>Allowed Doctors:</strong> {patientDetails.allowedDoctors.join(", ")}</p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default VoterPage;
