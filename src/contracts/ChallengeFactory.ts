export const CHALLENGE_FACTORY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "challenge",
        "type": "address"
      }
    ],
    "name": "ChallengeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "codeHash",
        "type": "bytes32"
      }
    ],
    "name": "ChallengeImplementationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "challengeCode",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "challengeCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
        "name": "challenger",
        "type": "address"
      }
    ],
    "name": "challengerChallengeCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "challengerToChallenges",
    "outputs": [
      {
        "internalType": "contract BlogChallenge",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "challenges",
    "outputs": [
      {
        "internalType": "contract BlogChallenge",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cycle",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "numberOfCycles",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "penaltyToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "penaltyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxParticipants",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "freeMode",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "participatable",
        "type": "bool"
      }
    ],
    "name": "createChallenge",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cycle",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "numberOfCycles",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "penaltyToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "penaltyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxParticipants",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "freeMode",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "participatable",
        "type": "bool"
      }
    ],
    "name": "predictChallengeAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_newCode",
        "type": "bytes"
      }
    ],
    "name": "updateChallengeImplementation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
