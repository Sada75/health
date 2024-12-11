const main = async() => {
    const ProjectRegistry = await hre.ethers.getContractFactory("ProjectRegistry");
    const projectRegistry = await ProjectRegistry.deploy();

    // await projectRegistry.deployed();

    console.log("ProjectRegistry deployed to :", projectRegistry.address);

}

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

runMain();
