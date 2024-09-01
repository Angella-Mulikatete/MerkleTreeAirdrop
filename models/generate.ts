import {ethers} from 'hardhat';
import * as fs from 'fs';

const NUM_ADDRESSES = 25;
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

    //write to the

    const writeToCsv = "address, amount\n" + addresses.map(e=>`${e.address}, ${e.amount}`).join("\n");
    fs.writeFileSync("airdrop.csv", writeToCsv, "utf8");
}

generateAddresses();

// async function generateAddress(): Promise<void> {
//     const addresses:addressData[] = [];

//     for(let i =0; i <NUM_ADDRESSES; i++){
//         const wallet =  ethers.Wallet.createRandom();
//         const address = wallet.address;
//         const amount = Math.floor(Math.random() * (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
//         addresses.push({address, amount});
//     }

//     //writing to csv file
//     const writeToCsv = "address, amount\n" + addresses.map(e => `${e.address}, ${e.amount}`).join("\n");
//     fs.writeFileSync("airdrop.csv", writeToCsv, "utf8");
//     console.log("CSV file created with dummy addresses and amounts!");

//     // for (let i = 0; i < NUM_ADDRESSES; i++) {
//     //     const amount = Math.floor(Math.random() * (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
//     //     const address = await ethers.provider.createAddress();
//     //     address.push({address, amount});
//     // }
// }