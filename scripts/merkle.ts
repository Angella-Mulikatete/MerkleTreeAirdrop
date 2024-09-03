import { ethers } from 'hardhat';
import fs from 'fs';
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";



interface AddressData {
  address: string;
  amount: number;
}


// Function to read addresses and amounts from CSV file
async function readFromCsv(): Promise<AddressData[]> {
  return new Promise((resolve, reject) => {
    fs.readFile('airdrop.csv', 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = data.split('\n');
      const headers = lines[0].split(',');
      const result: AddressData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (row.trim()) {
          const obj = Object.fromEntries(
            headers.map((header, index) => [header.trim(), row.split(',')[index].trim()])
          );

          const address = obj.address;
          const amount = parseInt(obj.amount, 10);

          result.push({ address, amount });
        }
      }

      resolve(result);
    });
  });
}

// Function to generate Merkle tree and proofs
async function generateProofs() {
//   console.log("Generating addresses...");
//   await generateAddresses();

  try {
    const leaves = await readFromCsv();

    // Get values for Merkle tree
    const values = leaves.map(leaf => [leaf.address, leaf.amount.toString()]);

    // Generate Merkle tree
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

    console.log('Merkle Root:', tree.root);

    const proofs: { [key: string]: string[] } = {};

    // Generate proofs for each address
    for (const [index, value] of tree.entries()) {
      const proof = tree.getProof(index);
      const address = value[0];
      proofs[address] = proof;
      console.log(`Proof for ${address}: ${JSON.stringify(proof)}`);
    }

    // Save the tree and proofs to JSON files
    fs.writeFileSync('tree.json', JSON.stringify(tree.dump(), null, 2), 'utf8');
    fs.writeFileSync('proofs.json', JSON.stringify(proofs, null, 2), 'utf8');

  } catch (error) {
    console.error("Error reading from CSV:", error);
  }
}

// Main execution
async function main() {
  try {
    console.log('Generating proofs...');
    await generateProofs();
    console.log('Proofs generated and saved to proofs.json');
  } catch (error) {
    console.error('Error generating proofs:', error);
  }
}

main().catch(console.error);
