const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Virtuosity Contracts", function () {
  let virtuosityToken;
  let activityCertification;
  let rewardsMarketplace;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy VirtuosityToken
    const VirtuosityToken = await ethers.getContractFactory("VirtuosityToken");
    virtuosityToken = await VirtuosityToken.deploy();
    await virtuosityToken.waitForDeployment();

    // Deploy ActivityCertification
    const ActivityCertification = await ethers.getContractFactory("ActivityCertification");
    activityCertification = await ActivityCertification.deploy(await virtuosityToken.getAddress());
    await activityCertification.waitForDeployment();

    // Deploy RewardsMarketplace
    const RewardsMarketplace = await ethers.getContractFactory("RewardsMarketplace");
    rewardsMarketplace = await RewardsMarketplace.deploy(await virtuosityToken.getAddress());
    await rewardsMarketplace.waitForDeployment();

    // Set ActivityCertification contract in VirtuosityToken
    await virtuosityToken.setActivityCertificationContract(await activityCertification.getAddress());
  });

  describe("VirtuosityToken", function () {
    it("Should have correct name and symbol", async function () {
      expect(await virtuosityToken.name()).to.equal("Virtuosity Token");
      expect(await virtuosityToken.symbol()).to.equal("VRT");
    });

    it("Should set activity certification contract", async function () {
      expect(await virtuosityToken.activityCertificationContract())
        .to.equal(await activityCertification.getAddress());
    });

    it("Should mint tokens only from activity certification contract", async function () {
      // Should fail when called directly
      await expect(
        virtuosityToken.mintForActivity(user1.address, ethers.parseEther("10"), "test-activity", 1000)
      ).to.be.revertedWith("Solo il contratto ActivityCertification puo mintare");
    });
  });

  describe("ActivityCertification", function () {
    it("Should certify activity and mint tokens", async function () {
      const activityId = "activity-123";
      const co2Saved = 2000; // 2000 grams = 2 tokens
      
      // Certify activity
      await activityCertification.certifyActivity(
        activityId,
        user1.address,
        co2Saved,
        "walking",
        "30 minute walk"
      );

      // Check if activity is certified
      expect(await activityCertification.isActivityCertified(activityId)).to.be.true;

      // Check token balance
      const expectedTokens = Math.max(1, Math.floor(co2Saved / 1000));
      expect(await virtuosityToken.balanceOf(user1.address))
        .to.equal(ethers.parseEther(expectedTokens.toString()));

      // Check activity details
      const activity = await activityCertification.getActivityDetails(activityId);
      expect(activity.user).to.equal(user1.address);
      expect(activity.activityType).to.equal("walking");
      expect(activity.co2Saved).to.equal(co2Saved);
    });

    it("Should calculate tokens correctly from CO2", async function () {
      expect(await activityCertification.calculateTokensFromCO2(500)).to.equal(1); // Minimum 1 token
      expect(await activityCertification.calculateTokensFromCO2(1000)).to.equal(1);
      expect(await activityCertification.calculateTokensFromCO2(2500)).to.equal(2);
      expect(await activityCertification.calculateTokensFromCO2(5000)).to.equal(5);
    });

    it("Should not certify same activity twice", async function () {
      const activityId = "activity-123";
      
      // First certification should work
      await activityCertification.certifyActivity(
        activityId,
        user1.address,
        1000,
        "walking",
        "Walk"
      );

      // Second certification should fail
      await expect(
        activityCertification.certifyActivity(
          activityId,
          user1.address,
          1000,
          "walking",
          "Walk"
        )
      ).to.be.revertedWith("Attivita gia certificata");
    });

    it("Should track user activities", async function () {
      // Certify multiple activities for user1
      await activityCertification.certifyActivity("act1", user1.address, 1000, "walking", "Walk 1");
      await activityCertification.certifyActivity("act2", user1.address, 2000, "cycling", "Cycle 1");
      
      // Check activity count
      expect(await activityCertification.getUserActivityCount(user1.address)).to.equal(2);
      
      // Get user activities
      const activities = await activityCertification.getUserActivities(user1.address, 0, 10);
      expect(activities.length).to.equal(2);
      expect(activities[0]).to.equal("act1");
      expect(activities[1]).to.equal("act2");
    });
  });

  describe("RewardsMarketplace", function () {
    beforeEach(async function () {
      // Add a sample reward
      await rewardsMarketplace.addReward(
        "Test Reward",
        "A test reward",
        ethers.parseEther("50"), // 50 VRT
        100, // total available
        "test",
        "test-image-url",
        "test-provider"
      );
    });

    it("Should add rewards correctly", async function () {
      const reward = await rewardsMarketplace.getReward(1);
      expect(reward.name).to.equal("Test Reward");
      expect(reward.tokenCost).to.equal(ethers.parseEther("50"));
      expect(reward.totalAvailable).to.equal(100);
      expect(reward.active).to.be.true;
    });

    it("Should allow users to purchase rewards", async function () {
      // First, user needs tokens
      await activityCertification.certifyActivity(
        "activity-for-tokens",
        user1.address,
        50000, // 50 tokens
        "walking",
        "Long walk"
      );

      // Check user has tokens
      const userBalance = await virtuosityToken.balanceOf(user1.address);
      expect(userBalance).to.equal(ethers.parseEther("50"));

      // User needs to approve marketplace to spend tokens
      await virtuosityToken.connect(user1).approve(
        await rewardsMarketplace.getAddress(),
        ethers.parseEther("50")
      );

      // Purchase reward
      await rewardsMarketplace.connect(user1).purchaseReward(1);

      // Check user balance decreased (tokens were burned)
      expect(await virtuosityToken.balanceOf(user1.address)).to.equal(0);

      // Check redemption was created
      expect(await rewardsMarketplace.getUserRedemptionCount(user1.address)).to.equal(1);

      // Check reward stats updated
      const reward = await rewardsMarketplace.getReward(1);
      expect(reward.totalRedeemed).to.equal(1);
    });

    it("Should prevent purchase with insufficient tokens", async function () {
      // User has no tokens
      await expect(
        rewardsMarketplace.connect(user1).purchaseReward(1)
      ).to.be.revertedWith("Token insufficienti");
    });

    it("Should generate unique redemption codes", async function () {
      // Give user tokens
      await activityCertification.certifyActivity(
        "activity-1",
        user1.address,
        50000,
        "walking",
        "Walk"
      );
      
      await activityCertification.certifyActivity(
        "activity-2",
        user2.address,
        50000,
        "walking",
        "Walk"
      );

      // Approve and purchase
      await virtuosityToken.connect(user1).approve(
        await rewardsMarketplace.getAddress(),
        ethers.parseEther("50")
      );
      await rewardsMarketplace.connect(user1).purchaseReward(1);

      await virtuosityToken.connect(user2).approve(
        await rewardsMarketplace.getAddress(),
        ethers.parseEther("50")
      );
      await rewardsMarketplace.connect(user2).purchaseReward(1);

      // Check redemptions have different codes
      const redemption1 = await rewardsMarketplace.redemptions(1);
      const redemption2 = await rewardsMarketplace.redemptions(2);
      
      expect(redemption1.redemptionCode).to.not.equal(redemption2.redemptionCode);
      expect(redemption1.user).to.equal(user1.address);
      expect(redemption2.user).to.equal(user2.address);
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full user journey", async function () {
      // 1. Add rewards to marketplace
      await rewardsMarketplace.addReward(
        "Eco Plant",
        "A beautiful plant for your home",
        ethers.parseEther("30"),
        50,
        "environment",
        "plant.jpg",
        "Green Garden"
      );

      // 2. User performs activities and gets them certified
      await activityCertification.certifyActivity(
        "walk-1",
        user1.address,
        15000, // 15 tokens
        "walking",
        "Morning walk"
      );
      
      await activityCertification.certifyActivity(
        "bike-1",
        user1.address,
        20000, // 20 tokens
        "cycling",
        "Bike to work"
      );

      // 3. Check user has 35 tokens
      expect(await virtuosityToken.balanceOf(user1.address)).to.equal(ethers.parseEther("35"));

      // 4. User purchases reward
      await virtuosityToken.connect(user1).approve(
        await rewardsMarketplace.getAddress(),
        ethers.parseEther("30")
      );
      
      await rewardsMarketplace.connect(user1).purchaseReward(1);

      // 5. Check final state
      expect(await virtuosityToken.balanceOf(user1.address)).to.equal(ethers.parseEther("5")); // 35-30 = 5
      expect(await rewardsMarketplace.getUserRedemptionCount(user1.address)).to.equal(1);
      
      const redemption = await rewardsMarketplace.redemptions(1);
      expect(redemption.user).to.equal(user1.address);
      expect(redemption.fulfilled).to.be.false;

      // 6. Owner fulfills redemption
      await rewardsMarketplace.fulfillRedemption(1);
      const fulfilledRedemption = await rewardsMarketplace.redemptions(1);
      expect(fulfilledRedemption.fulfilled).to.be.true;
    });
  });
});