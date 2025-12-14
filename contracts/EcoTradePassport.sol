// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Simplified VIP180 interface
interface VIP180 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

// Minimal VIP181 (NFT) base
contract VIP181 {
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _owners;
    uint256 private _totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }

    function _mint(address to, uint256 tokenId) internal {
        _owners[tokenId] = to;
        _totalSupply += 1;
        emit Transfer(address(0), to, tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory uri) public {
        require(_owners[tokenId] != address(0), "Not minted");
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }
}

contract EcoTradePassport is VIP181 {
    VIP180 public ecoT;
    uint256 public constant MINT_FEE = 100 * 10**18; // 100 EcoT

    event PassportMinted(address indexed owner, uint256 indexed tokenId, string product, string batch);

    constructor(address _ecoTAddress) {
        ecoT = VIP180(_ecoTAddress);
    }

    function mintPassport(
        address to,
        string memory product,
        string memory batch,
        string memory certType
    ) external {
        require(ecoT.transferFrom(msg.sender, address(this), MINT_FEE), "Insufficient EcoT");
        uint256 tokenId = totalSupply() + 1;
        _mint(to, tokenId);
        string memory json = string(abi.encodePacked(
            '{"name":"', product,
            ' - Green Passport","description":"Batch: ', batch,
            ' | Certified: ', certType,
            '","image":"https://raw.githubusercontent.com/Cosmos369-art/EcoTrade/master/logo.png"}'
        ));
        setTokenURI(tokenId, json);
        emit PassportMinted(to, tokenId, product, batch);
    }
}
