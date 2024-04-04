const totalSupply = {
  constant: true,
  inputs: [],
  name: "totalSupply",
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

const balanceOf = {
  constant: true,
  inputs: [
    {
      name: "_owner",
      type: "address",
    },
  ],
  name: "balanceOf",
  outputs: [
    {
      name: "balance",
      type: "uint256",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

const allowance = {
  constant: true,
  inputs: [
    {
      name: "_owner",
      type: "address",
    },
    {
      name: "_spender",
      type: "address",
    },
  ],
  name: "allowance",
  outputs: [
    {
      name: "remaining",
      type: "uint256",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

const decimals = {
  constant: true,
  inputs: [],
  name: "decimals",
  outputs: [
    {
      name: "",
      type: "uint8",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

const name = {
  constant: true,
  inputs: [],
  name: "name",
  outputs: [
    {
      name: "",
      type: "string",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

const symbol = {
  constant: true,
  inputs: [],
  name: "symbol",
  outputs: [
    {
      name: "",
      type: "string",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

const transfer = {
  constant: false,
  inputs: [
    {
      name: "_to",
      type: "address",
    },
    {
      name: "_value",
      type: "uint256",
    },
  ],
  name: "transfer",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};

const transferFrom = {
  constant: false,
  inputs: [
    {
      name: "_from",
      type: "address",
    },
    {
      name: "_to",
      type: "address",
    },
    {
      name: "_value",
      type: "uint256",
    },
  ],
  name: "transferFrom",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};

const approve = {
  constant: false,
  inputs: [
    {
      name: "_spender",
      type: "address",
    },
    {
      name: "_value",
      type: "uint256",
    },
  ],
  name: "approve",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};

const abis = {
  totalSupply,
  balanceOf,
  allowance,
  decimals,
  name,
  symbol,
  transfer,
  transferFrom,
  approve,
};

module.exports = abis;
