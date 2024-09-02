import {ethers} from 'hardhat';
import * as fs from 'fs';
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const NUM_ADDRESSES = 20;
const MIN_AMOUNT = 150;
const MAX_AMOUNT = 1000;

interface addressData{
    address: string;
    amount: number;
}

async function generateAddresses(): Promise<void>{
    const addresses:addressData[] = [];

    for(let i = 0 ; i< NUM_ADDRESSES; i++){
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const amount = Math.floor(Math.random()* (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
        addresses.push({address, amount});
    }

    //write to the file
    const writeToCsv = "address, amount\n" + addresses.map(e=>`${e.address}, ${e.amount}`).join("\n");
    fs.writeFileSync("airdrop.csv", writeToCsv, "utf8");
}



//reading from the file
async function readFromCsv(): Promise<Buffer[]>{
    return new Promise((resolve, reject) => {
        fs.readFile("airdrop.csv", "utf8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            const lines = data.split('\n');
            const headers = lines[0].split(',');
            const result: Buffer[] = [];

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i];
                if (row.trim()) {
                    const obj = Object.fromEntries(
                        headers.map((header, index) => [header, row.split(',')[index]])
                    );

                    const address = obj.address;
                    const amount = parseInt(obj.amount, 10);

                    // Create a buffer for each address and amount pair
                    const buffer = Buffer.from(address + amount.toString());
                    result.push(buffer);

                }
            }

            resolve(result);
        });
    });
}

// Main execution
async function main() {
    console.log("Generating addresses...");
    await generateAddresses();
    console.log("Addresses generated and saved to airdrop.csv");

    console.log("\nReading addresses from CSV...");
    try {
        const addresses = await readFromCsv();
        console.log(`Found ${addresses.length} addresses in the CSV`);
        console.log(JSON.stringify(addresses.slice(0, 5), null, 2)); // Print first 5 addresses

        // Create a Merkle Tree from the addresses and print the root hash
        const leaves = await readFromCsv();
        const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

        const root = merkleTree.getHexRoot();
        console.log("Merkle Root:", root);
    } catch (error) {
        console.error("Error reading from CSV:", error);
    }
}

main().catch(console.error);

