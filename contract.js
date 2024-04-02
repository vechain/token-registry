const abis = require("./abis");
const { abi } = require("thor-devkit");
const axios = require("axios");

const contractCalls = [
  new abi.Function(abis.totalSupply).encode(),
  new abi.Function(abis.balanceOf).encode(
    "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa",
  ),
  new abi.Function(abis.allowance).encode(
    "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa",
    "0x435933c8064b4Ae76bE665428e0307eF2cCFBD68",
  ),
  new abi.Function(abis.decimals).encode(),
  new abi.Function(abis.name).encode(),
  new abi.Function(abis.symbol).encode(),
];

/**
 *
 * @param {string} address The contract address
 * @param {string} url The node url
 */
const verifyContract = async (address, url) => {
  try {
    const clauses = contractCalls.map((data) => ({
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

    if (resp.data.length !== contractCalls.length) {
      throw new Error("Invalid contract response");
    }
  } catch (error) {
    console.log(error);
    throw new Error("unable to verify contract methods");
  }
};

module.exports = {
  verifyContract,
};
