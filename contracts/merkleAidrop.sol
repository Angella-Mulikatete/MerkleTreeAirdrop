// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "./IERC20.sol";

contract merkleAirdrop{

    bytes32 immutable merkleRoot;
    address immutable tokenAddress;
    address owner;
    uint256 totalTokensClaimed;


    constructor(address _tokenAddress, bytes32 _merkleRoot){
        require(_tokenAddress != address(0),"invalid address");
        require(_merkleRoot != bytes32(0),"invalid merkle root");

        tokenAddress = _tokenAddress;
        merkleRoot = _merkleRoot;
        owner = msg.sender;
    }

    mapping(address => bool) public isClaimed;
    event claimSuccessful(address indexed account, uint256 indexed amount);
    event merkleRootUpdated(bytes32 indexed merkleRoot);

    modifier onlyOwner {
        require(owner == msg.sender, "You are Not the owner");
        _;
    }

  function claim(uint256 amount,  bytes32[] calldata merkleProof) external{
        require(!isClaimed[msg.sender], "Already claimed");

        // bytes32 node = keccak256(abi.encodePacked(account, amount));
        bytes32 node = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));

        bool isValidProof = MerkleProof.verify(merkleProof, merkleRoot, node);

       require(isValidProof, "Merkle proof is invalid");

       isClaimed[msg.sender] = true;

       IERC20(tokenAddress).transfer(msg.sender, amount);
            
    }

    //updating merkel root

    function updateMerkleRoot(bytes32 newMerkleRoot) external onlyOwner{
        require(newMerkleRoot != bytes32(0),"invalid merkle root");
        merkleRoot == newMerkleRoot;
        emit merkleRootUpdated(newMerkleRoot);
    }

    //withdrawing the remaining balances
    function withdrawBalance() external onlyOwner{
       uint256 balance =  IERC20(tokenAddress).balanceOf(address(this));
       require(IERC20(tokenAddress).transfer(msg.sender, balance), "Transfer failed");
    }
}