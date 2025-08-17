
async function main() {
  // fetch contract
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  //fetch Account
  const account=await ethers.getSigners();

  //deploy Cap Token Contract
  const Cap = await Token.deploy("Cap Token", "CAP", 1000000);
  await Cap.deployed();
   console.log(`CAP Contract address: ${Cap.address}`)

  //deploy mETH  Token Contract
  const mETH = await Token.deploy('mETH', 'mETH', 1000000);
  await mETH.deployed();
 console.log(`mETH Contract address: ${mETH.address}`)

  //deploy mETH  Token Contract
  const mDAI =await Token.deploy("mDAI","mDAI",1000000);
  await mDAI.deployed();
  console.log(`mDAI Contract address: ${mDAI.address}`)
  
  //deploy Exchange Contract
  const exchange=await Exchange.deploy(account[0].address,10);
  await exchange.deployed(); 
   console.log(`Exchange Contract address: ${exchange.address}`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
