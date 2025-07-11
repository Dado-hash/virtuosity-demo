const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Virtuosity contracts to Polygon Amoy...");
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "POL");
  
  if (balance < hre.ethers.parseEther("0.01")) {
    console.warn("⚠️  Warning: Low balance. You might need more POL for deployment.");
  }

  // 1. Deploy VirtuosityToken
  console.log("\n📄 Deploying VirtuosityToken...");
  const VirtuosityToken = await hre.ethers.getContractFactory("VirtuosityToken");
  const virtuosityToken = await VirtuosityToken.deploy();
  await virtuosityToken.waitForDeployment();
  
  const tokenAddress = await virtuosityToken.getAddress();
  console.log("✅ VirtuosityToken deployed to:", tokenAddress);

  // 2. Deploy ActivityCertification
  console.log("\n📄 Deploying ActivityCertification...");
  const ActivityCertification = await hre.ethers.getContractFactory("ActivityCertification");
  const activityCertification = await ActivityCertification.deploy(tokenAddress);
  await activityCertification.waitForDeployment();
  
  const certificationAddress = await activityCertification.getAddress();
  console.log("✅ ActivityCertification deployed to:", certificationAddress);

  // 3. Deploy RewardsMarketplace
  console.log("\n📄 Deploying RewardsMarketplace...");
  const RewardsMarketplace = await hre.ethers.getContractFactory("RewardsMarketplace");
  const rewardsMarketplace = await RewardsMarketplace.deploy(tokenAddress);
  await rewardsMarketplace.waitForDeployment();
  
  const marketplaceAddress = await rewardsMarketplace.getAddress();
  console.log("✅ RewardsMarketplace deployed to:", marketplaceAddress);

  // 4. Set ActivityCertification contract in VirtuosityToken
  console.log("\n🔗 Setting up contract permissions...");
  await virtuosityToken.setActivityCertificationContract(certificationAddress);
  console.log("✅ ActivityCertification contract set in VirtuosityToken");

  // 5. Add some sample rewards to the marketplace
  console.log("\n🎁 Adding sample rewards...");
  
  const sampleRewards = [
    {
      name: "Pianta per Casa",
      description: "Pianta verde per la tua casa",
      tokenCost: hre.ethers.parseEther("30"), // 30 VRT
      totalAvailable: 200,
      category: "ambiente",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
      provider: "Green Garden"
    },
    {
      name: "Buono Amazon €5",
      description: "Buono sconto Amazon del valore di €5",
      tokenCost: hre.ethers.parseEther("50"), // 50 VRT
      totalAvailable: 100,
      category: "shopping",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      provider: "Amazon"
    },
    {
      name: "Biglietto Cinema",
      description: "Biglietto per film al cinema",
      tokenCost: hre.ethers.parseEther("75"), // 75 VRT
      totalAvailable: 50,
      category: "intrattenimento",
      imageUrl: "https://images.unsplash.com/photo-1489599735734-79b4f82e1926",
      provider: "Cinema Partner"
    },
    {
      name: "Buono Carburante €10",
      description: "Buono carburante del valore di €10",
      tokenCost: hre.ethers.parseEther("100"), // 100 VRT
      totalAvailable: 25,
      category: "trasporti",
      imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
      provider: "Fuel Partner"
    },
    {
      name: "Abbonamento Bike Sharing",
      description: "30 giorni di bike sharing illimitato",
      tokenCost: hre.ethers.parseEther("120"), // 120 VRT
      totalAvailable: 15,
      category: "trasporti",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      provider: "Mobike"
    },
    {
      name: "Corso Online Sostenibilità",
      description: "Accesso a corso online sulla sostenibilità",
      tokenCost: hre.ethers.parseEther("150"), // 150 VRT
      totalAvailable: 30,
      category: "educazione",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      provider: "EcoLearning"
    }
  ];

  for (let i = 0; i < sampleRewards.length; i++) {
    const reward = sampleRewards[i];
    await rewardsMarketplace.addReward(
      reward.name,
      reward.description,
      reward.tokenCost,
      reward.totalAvailable,
      reward.category,
      reward.imageUrl,
      reward.provider
    );
    console.log(`✅ Added reward: ${reward.name}`);
  }

  // 6. Print summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("VirtuosityToken:", tokenAddress);
  console.log("ActivityCertification:", certificationAddress);
  console.log("RewardsMarketplace:", marketplaceAddress);
  
  console.log("\n🔍 Verification commands:");
  console.log(`npx hardhat verify --network polygonAmoy ${tokenAddress}`);
  console.log(`npx hardhat verify --network polygonAmoy ${certificationAddress} ${tokenAddress}`);
  console.log(`npx hardhat verify --network polygonAmoy ${marketplaceAddress} ${tokenAddress}`);
  
  console.log("\n📝 Environment variables to add to your .env:");
  console.log(`VITE_VIRTUOSITY_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`VITE_ACTIVITY_CERTIFICATION_ADDRESS=${certificationAddress}`);
  console.log(`VITE_REWARDS_MARKETPLACE_ADDRESS=${marketplaceAddress}`);

  // 7. Save addresses to a file for easy access
  const fs = require('fs');
  const deploymentInfo = {
    network: "polygonAmoy",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      VirtuosityToken: tokenAddress,
      ActivityCertification: certificationAddress,
      RewardsMarketplace: marketplaceAddress
    }
  };
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });