
async function main(){
  // fetch contract
  const Token=await ethers.getContractFactory("Token");

  //deploy Contract
  const token=await Token.deploy();
  await token.deployed();
  console.log(token.address);

  const name=await token.name();
  console.log(name);
  
}

 main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
