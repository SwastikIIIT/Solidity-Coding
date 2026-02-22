import { network } from "hardhat";
const { ethers } = await network.connect();

async function main(){
    const [deployKarneWala]=await ethers.getSigners();
    console.log('Deployer adddress:',deployKarneWala.address);

    const pehleBalance=await ethers.provider.getBalance(deployKarneWala.address);
    const Token=await ethers.getContractFactory('Token');
    const token=await Token.connect(deployKarneWala).deploy();
    await token.waitForDeployment();
    const baadKaBalance=await ethers.provider.getBalance(deployKarneWala.address);

    console.log("Gas fees paid:",ethers.formatEther(pehleBalance-baadKaBalance));
    console.log("Contract:",token);
    console.log("Transaction Hash:",token.deploymentTransaction()?.hash)
    console.log('Token contract:',await token.getAddress());
}

main()
.then(()=>{
    console.log("Deploy scipts chal gaya bhai");
    process.exit(0);
})
.catch((err)=>{
    console.log(err);
    process.exit(1);
})