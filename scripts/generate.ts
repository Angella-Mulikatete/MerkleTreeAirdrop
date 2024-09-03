// import { ethers } from 'hardhat';
// import * as fs from 'fs';
// const keccak256 = require('keccak256');
// const { MerkleTree } = require('merkletreejs');
// import Web3 from 'web3';

// const web3 = new Web3();

// // const Web3 = require('web3');

// // const web3 = new Web3();

// // interface AddressData {
// //     address: string;
// //     amount: number;
// // }

// const NUM_ADDRESSES = 20;
// const MIN_AMOUNT = 150;
// const MAX_AMOUNT = 1000;

// interface addressData{
//     address: string;
//     amount: number;
// }

// async function generateAddresses(): Promise<void>{
//     const addresses:addressData[] = [];

//     for(let i = 0 ; i< NUM_ADDRESSES; i++){
//         const wallet = ethers.Wallet.createRandom();
//         const address = wallet.address;
//         const amount = Math.floor(Math.random()* (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
//         addresses.push({address, amount});
//     }

//     //write to the file
//     const writeToCsv = "address, amount\n" + addresses.map(e=>`${e.address}, ${e.amount}`).join("\n");
//     fs.writeFileSync("airdrop.csv", writeToCsv, "utf8");
// }

// // Reading from CSV and parsing data
// async function readFromCsv(): Promise<addressData[]> {
//     return new Promise((resolve, reject) => {
//         fs.readFile('airdrop.csv', 'utf8', (err, data) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }

//             const lines = data.split('\n');
//             const headers = lines[0].split(',');
//             const result: addressData[] = [];

//             for (let i = 1; i < lines.length; i++) {
//                 const row = lines[i];
//                 if (row.trim()) {
//                     const obj = Object.fromEntries(
//                         headers.map((header, index) => [header.trim(), row.split(',')[index].trim()])
//                     );

//                     const address = obj.address;
//                     const amount = parseInt(obj.amount, 10);

//                     result.push({ address, amount });
//                 }
//             }

//             resolve(result);
//         });
//     });
// }

// // Generating proofs for each address and amount
// async function generateProofs() {

//    console.log("Generating addresses...");
//    await generateAddresses();

//    try{
//     const balances = await readFromCsv();

//     const leafNodes = balances.map((balance) =>
//         keccak256(
//             Buffer.concat([
//                 Buffer.from(balance.address.replace('0x', ''), 'hex'),
//                 Buffer.from(web3.eth.abi.encodeParameter('uint256', balance.amount.toString()).replace('0x', ''), 'hex')
//             ])
//         )
//     );

//     const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

//     const root = merkleTree.getHexRoot();
//     console.log('Merkle Root:', root);

//     const proofs: { [key: string]: string[] } = {};

//     for (let i = 0; i < balances.length; i++) {
//         const balance = balances[i];
//         const leaf = leafNodes[i];
//         const proof = merkleTree.getProof(leaf).map((p: any) => '0x' + p.toString('hex'));
//         proofs[balance.address] = proof;
//         console.log(`Proof for ${balance.address}: ${proof}`);
//     }

//     // Write proofs to a JSON file
//     fs.writeFileSync('proofs.json', JSON.stringify(proofs, null, 2), 'utf8');
//    }catch (error) {
//         console.error("Error reading from CSV:", error);
//     }
// }

// // Main execution
// async function main() {
//     try {
//         console.log('Generating proofs...');
//         await generateProofs();
//         console.log('Proofs generated and saved to proofs.json');
//     } catch (error) {
//         console.error('Error generating proofs:', error);
//     }
// }

// main().catch(console.error);





// // import {ethers} from 'hardhat';
// // import * as fs from 'fs';
// // const keccak256 = require("keccak256");
// // const { MerkleTree } = require("merkletreejs");

// // const NUM_ADDRESSES = 20;
// // const MIN_AMOUNT = 150;
// // const MAX_AMOUNT = 1000;

// // interface addressData{
// //     address: string;
// //     amount: number;
// // }

// // async function generateAddresses(): Promise<void>{
// //     const addresses:addressData[] = [];

// //     for(let i = 0 ; i< NUM_ADDRESSES; i++){
// //         const wallet = ethers.Wallet.createRandom();
// //         const address = wallet.address;
// //         const amount = Math.floor(Math.random()* (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
// //         addresses.push({address, amount});
// //     }

// //     //write to the file
// //     const writeToCsv = "address, amount\n" + addresses.map(e=>`${e.address}, ${e.amount}`).join("\n");
// //     fs.writeFileSync("airdrop.csv", writeToCsv, "utf8");
// // }



// // //reading from the file
// // async function readFromCsv(): Promise<Buffer[]>{
// //     return new Promise((resolve, reject) => {
// //         fs.readFile("airdrop.csv", "utf8", (err, data) => {
// //             if (err) {
// //                 reject(err);
// //                 return;
// //             }

// //             const lines = data.split('\n');
// //             const headers = lines[0].split(',');
// //             const result: Buffer[] = [];

// //             for (let i = 1; i < lines.length; i++) {
// //                 const row = lines[i];
// //                 if (row.trim()) {
// //                     const obj = Object.fromEntries(
// //                         headers.map((header, index) => [header, row.split(',')[index]])
// //                     );

// //                     const address = obj.address;
// //                     const amount = parseInt(obj.amount, 10);

// //                     // Create a buffer for each address and amount pair
// //                     const buffer = Buffer.from(address + amount.toString());
// //                     result.push(buffer);

// //                 }
// //             }

// //             resolve(result);
// //         });
// //     });
// // }

// // //Finding index of a leaf
// // async function findLeafIndex(address : string): Promise<number> {
// //     const leaves = await readFromCsv();

// //     for(let i = 0; i < leaves.length; i++) {
// //         if(leaves[i].toString() === address){
// //             return i;
// //         }
// //     }
// //     return -1;
// // }

// // // async function generateMerkleProof(address: string): Promise<string> {
// // //     const leaves = await readFromCsv()

// // //     const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true } );
// // //     const leafIndex = await findLeafIndex(address);

// // //     if(leafIndex === -1){
// // //         throw new Error('Address not found in the Merkle tree');
// // //     }

// // //     const proof = [];
// // //     let currentHash = keccak256(address);
// // //     let currentIndex = leafIndex;

// // //     while(currentIndex != 0){
// // //         const ParentIndex = (currentIndex - 1)/2;
// // //         const leftChilIndex = 2 * ParentIndex + 1;
// // //         const rightChildIndex = 2 * ParentIndex + 2;

// // //         const parentHash = merkleTree.getPair(leftChilIndex, rightChildIndex);
// // //         proof.push(parentHash);

// // //         if (leftChilIndex === currentIndex) {
// // //             currentHash = keccak256(currentHash, parentHash);
// // //         } else {
// // //             currentHash = keccak256(parentHash, currentHash);
// // //         }

// // //         currentIndex = ParentIndex;
// // //     }

// // //     proof.push(currentHash);

// // //     return proof.map(h => '0x' + h.toString('hex')).join(',');
// // // }

// // // async function generateMerkleProof(address: string, amount: number, merkleTree: any): Promise<string[]> {
// // //     const addressBuffer = Buffer.from(address.slice(2), 'hex');
// // //     const amountBuffer = Buffer.from(amount.toString());
// // //     const leaf = keccak256(Buffer.concat([addressBuffer, amountBuffer]));
    
// // //     const proof = merkleTree.getProof(leaf);
// // //     console.log(`Proof for ${address}: ${proof}`);
// // //     return proof.map((p: any) => '0x' + p.toString('hex'));
              
// // // }

// // // Main execution
// // async function main() {
// //     console.log("Generating addresses");
// //     await generateAddresses();
// //     try {
// //         const addresses = await readFromCsv();

// //         console.log(`Found ${addresses.length} addresses in the CSV`);
// //         console.log(JSON.stringify(addresses.slice(0, 5), null, 2));

// //         // Create a Merkle Tree from the addresses and print the root hash
// //         const leaves = await readFromCsv();
// //         const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

// //         const root = merkleTree.getHexRoot();
// //         console.log("Merkle Root:", root);

// //         // Finding index of a specific address
// //         //  fs.readFile("airdrop.csv", "utf8", async (err, data) => {
// //         //     if (err) throw err;
// //         //     const lines = data.split('\n');
// //         //     for (let i = 1; i < lines.length; i++) {
// //         //         const row = lines[i];
// //         //         if (row.trim()) {
// //         //             const [address, amount] = row.split(',').map(item => item.trim());
// //         //             const proof = await generateMerkleProof(address, parseInt(amount, 10), merkleTree);
// //         //             console.log(`Proof for ${address}: ${proof}`);
// //         //         }
// //         //     }
// //         // });



// //     } catch (error) {
// //         console.error("Error reading from CSV:", error);
// //     }
// // }

// // main().catch(console.error);


