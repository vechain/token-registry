const abis = require("./abis");
const { abi, address } = require("thor-devkit");
const axios = require("axios");

const totalSupplyAbi = new abi.Function(abis.totalSupply);
const balanceOfAbi = new abi.Function(abis.balanceOf);
const allowanceAbi = new abi.Function(abis.allowance);
const decimalsAbi = new abi.Function(abis.decimals);
const nameAbi = new abi.Function(abis.name);
const symbolAbi = new abi.Function(abis.symbol);

const verifyCalls = [
  balanceOfAbi.encode("0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa"),
  allowanceAbi.encode(
    "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa",
    "0x435933c8064b4Ae76bE665428e0307eF2cCFBD68",
  ),
];


const verifyContract = async (address, url) => {
  try {
    const clauses = verifyCalls.map((data) => ({
      to: address,
      data,
      value: "0x0",
    }));

    const resp = await axios.post(`${url}/accounts/*`, {
      clauses,
    });

    if (resp.data.some((r) => r.reverted)) {
      throw new Error("Some contract calls reverted");
    }

    if (resp.data.length !== verifyCalls.length) {
      throw new Error("Invalid contract response");
    }
  } catch (error) {
    console.log(error);
    throw new Error("unable to verify contract methods");
  }
};

const contractDetailsClauses = [
  totalSupplyAbi.encode(),
  decimalsAbi.encode(),
  nameAbi.encode(),
  symbolAbi.encode(),
];

const getContractDetails = async (address, url) => {
  const clauses = contractDetailsClauses.map((data) => ({
    to: address,
    data,
    value: "0x0",
  }));

  const resp = await axios.post(`${url}/accounts/*`, {
    clauses,
  });

  if (resp.data.some((r) => r.reverted)) {
    throw new Error("Some contract calls reverted");
  }

  if (resp.data.length !== contractDetailsClauses.length) {
    throw new Error("Invalid contract response");
  }

  const totalSupply = totalSupplyAbi.decode(resp.data[0].data);
  const decimals = decimalsAbi.decode(resp.data[1].data);
  const name = nameAbi.decode(resp.data[2].data);
  const symbol = symbolAbi.decode(resp.data[3].data);

  return {
    totalSupply: totalSupply["0"],
    decimals: parseInt(decimals["0"]),
    name: name["0"],
    symbol: symbol["0"],
  };
};

module.exports = {
  verifyContract,
  getContractDetails,
};
