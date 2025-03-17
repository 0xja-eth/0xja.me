export const BLOG_CHALLENGE_ABI = [
  {
    "inputs": [],
    "name": "DEPOSIT_MULTIPLIER",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SUCCEED_RATE",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "approveAmount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "challenger",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkSuccess",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentChallenge",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256","name": "startTime","type": "uint256"},
          {"internalType": "uint256","name": "cycle","type": "uint256"},
          {"internalType": "uint256","name": "numberOfCycles","type": "uint256"},
          {"internalType": "address","name": "challenger","type": "address"},
          {"internalType": "address[]","name": "participants","type": "address[]"},
          {"internalType": "uint256","name": "maxParticipants","type": "uint256"},
          {"internalType": "address","name": "penaltyToken","type": "address"},
          {"internalType": "uint256","name": "penaltyAmount","type": "uint256"},
          {"internalType": "uint256","name": "deposit","type": "uint256"},
          {"internalType": "string[][]","name": "blogSubmissions","type": "string[][]"},
          {"internalType": "uint8","name": "noBalanceCount","type": "uint8"},
          {"internalType": "uint256","name": "lastUpdatedCycle","type": "uint256"},
          {"internalType": "bool","name": "started","type": "bool"}
        ],
        "internalType": "struct BlogChallenge.Challenge",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentCycle",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentDeposit",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositAmount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositPenalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isChallengerApproved",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "participate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "participants",
    "outputs": [{"internalType": "address[]","name": "","type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256","name": "_startTime","type": "uint256"},
      {"internalType": "uint256","name": "_cycle","type": "uint256"},
      {"internalType": "uint256","name": "_numberOfCycles","type": "uint256"},
      {"internalType": "address","name": "_challenger","type": "address"},
      {"internalType": "address[]","name": "_participants","type": "address[]"},
      {"internalType": "uint256","name": "_maxParticipants","type": "uint256"},
      {"internalType": "address","name": "_penaltyToken","type": "address"},
      {"internalType": "uint256","name": "_penaltyAmount","type": "uint256"}
    ],
    "name": "setChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string","name": "blogUrl","type": "string"}],
    "name": "submitBlog",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "updateCycle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
