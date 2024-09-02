// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "./IERC20.sol";

contract merkleAirdrop{

    address immutable tokenAddress;
    bytes32 immutable merkleRoot;

    constructor(address _tokenAddress, bytes32 _merkleRoot){
        require(_tokenAddress != address(0),"invalid address");
        require(_merkleRoot != bytes32(0),"invalid merkle root");

        tokenAddress = _tokenAddress;
        merkleRoot = _merkleRoot;
    }

    mapping(address => bool) public isClaimed;

    function claim(uint256 amount, address account, bytes32[] calldata merkleProof) external {
        require(!isClaimed[account], "Already claimed");

        bytes32 node = keccak256(abi.encodePacked(amount, account));
        bool isVerified = MerkleProof.verifyCalldata(merkleProof, merkleRoot, node);
        
        require(isVerified, "Verification failed");

        isClaimed[account] = true;

        require(IERC20(tokenAddress).transfer(account, amount), "Transfer failed");
    }
}