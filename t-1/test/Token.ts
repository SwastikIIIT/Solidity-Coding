// Mocha-framework  Chai-library
import { expect } from "chai";
import { Signer } from "ethers";
import { network } from "hardhat";
import { describe } from "node:test";
import { Token } from "../types/ethers-contracts/Token.js";

const { ethers } = await network.connect();

type signer=Signer & {address: string};
describe('Token Contract Testing',function(){
    let Token;
    let token:Token;
    let owner:signer;
    let add1:signer;
    let add2:signer;
    let addrs:signer[];

    beforeEach(async function(){
        [owner,add1,add2,...addrs]=await ethers.getSigners();
        Token=await ethers.getContractFactory('Token');
        token=await Token.deploy();
    })

    describe('Deployment',async function(){
       it('Owner shi set hua hai',async function(){
          const addressOwner=await token.owner();
          expect(addressOwner).to.equal(owner.address);
       }),
       it('Bhai paisa poora gaya na owner pe',async function(){
         const paisaAbhi=await token.balanceof(owner.address);
         const totalPaisa=await token.totalSupply();
         expect(paisaAbhi).to.equal(totalPaisa);
       })
    }),
    describe("Transactions",async function(){
        it('Transer accounts me shi se ho rha hai',async function(){
            // Owner se transfer no address mentioned
            await token.transfer(add1,50);
            const balanceAdd1=await token.balanceof(add1.address);
            expect(balanceAdd1).to.equal(50);

            // Transer 10 from add1 to add2
            await token.connect(add1).transfer(add2,10);
            const balanceAdd2=await token.balance(add2.address);
            expect(balanceAdd2).to.equal(10);
        }),
        it("Sender ke paas enough tokens nhi hain",async function(){
            const iniOwnerBalance=await token.balanceof(owner.address); // 50000n
            console.log("Initial Balance:",iniOwnerBalance);
            await expect(token.connect(add1).transfer(owner.address,1)).to.be.revertedWith('Itna paise nhi hai'); // add1-0

            expect(await token.balanceof(owner.address)).to.equal(iniOwnerBalance);
        }),
        it('Balance properly update ho rhe hain?',async function(){
            const iniOwnerBalance=await token.balanceof(owner.address);
            await token.transfer(add1.address,5);
            await token.transfer(add2.address,10);
            const finalOwnerBalance=await token.balanceof(owner.address);
            expect(finalOwnerBalance).to.equal(iniOwnerBalance-15n);


            const balanceAdd1=await token.balanceof(add1.address);
            expect(balanceAdd1).to.equal(5);

            const balanceAdd2=await token.balanceof(add2.address);
            expect(balanceAdd2).to.equal(10);
        })
    })
})
// it('Contract banane par balance sender ka shi se aaye',async function(){
//     const [owner]=await ethers.getSigners();
//     console.log("Signer:",owner);
//     const Token=await ethers.getContractFactory('Token');  // contract ka instance
//     const token=await Token.deploy(); // deploy the contract
//     const senderKaPaisa=await token.balanceof(owner.address);
//     console.log("Sender ka paisa:",senderKaPaisa," Address:",owner.address);
//     const totalPaisa=await token.totalSupply();

//     const paisaBacha=await ethers.provider.getBalance(owner.address);
//     console.log("Paisa kitna hai:",ethers.formatEther(paisaBacha));

//     expect(senderKaPaisa).to.equal(totalPaisa);

// }),

// it('Paisa transfer shi se ho rha hai ki nhi',async function() {
//     const [owner,add1,add2]=await ethers.getSigners();
//     console.log("Owner:",owner.address);
//     console.log("Addres 1:",add1.address);
//     console.log("Addres 2:",add2.address);

//     const Token=await ethers.getContractFactory('Token'); // instance of contract
//     const token=await Token.deploy(); // deploy token contract
//     //Transfer 50 SWT from owner to add1
//     await token.transfer(add1.address,50);
//     const balanceAdd1=await token.balanceof(add1.address);
//     expect(balanceAdd1).to.equal(50);

//     //Transer 20 SWT from owner to add2
//     await token.transfer(add2.address,20);
//     const balanceAdd2=await token.balanceof(add2.address);
//     expect(balanceAdd2).to.equal(20);

//     //Transfer 10 SWT from add1 to add2
//     await token.connect(add1).transfer(add2.address,10);
//     const kitnaPahuncha=await token.balanceof(add2.address);
//     expect(kitnaPahuncha).to.equal(20+10);
// })