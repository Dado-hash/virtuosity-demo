// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VirtuosityToken.sol";

/**
 * @title RewardsMarketplace
 * @dev Contratto per gestire l'acquisto di premi con VirtuosityToken
 */
contract RewardsMarketplace is Ownable, ReentrancyGuard {
    VirtuosityToken public virtuosityToken;
    
    // Struttura per rappresentare un premio
    struct Reward {
        uint256 id;
        string name;
        string description;
        uint256 tokenCost;
        uint256 totalAvailable;
        uint256 totalRedeemed;
        bool active;
        string category;
        string imageUrl;
        string provider;
    }
    
    // Struttura per rappresentare un riscatto
    struct Redemption {
        uint256 rewardId;
        address user;
        uint256 timestamp;
        string redemptionCode;
        bool fulfilled;
    }
    
    // Storage
    mapping(uint256 => Reward) public rewards;
    mapping(uint256 => Redemption) public redemptions;
    mapping(address => uint256[]) public userRedemptions;
    
    uint256 public nextRewardId = 1;
    uint256 public nextRedemptionId = 1;
    
    // Eventi
    event RewardAdded(uint256 indexed rewardId, string name, uint256 tokenCost);
    event RewardPurchased(
        uint256 indexed redemptionId,
        uint256 indexed rewardId, 
        address indexed user, 
        uint256 tokenCost,
        string redemptionCode
    );
    event RewardFulfilled(uint256 indexed redemptionId);
    event RewardUpdated(uint256 indexed rewardId);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        virtuosityToken = VirtuosityToken(_tokenAddress);
    }
    
    /**
     * @dev Aggiunge un nuovo premio al marketplace
     */
    function addReward(
        string memory name,
        string memory description,
        uint256 tokenCost,
        uint256 totalAvailable,
        string memory category,
        string memory imageUrl,
        string memory provider
    ) external onlyOwner {
        require(bytes(name).length > 0, "Nome premio non valido");
        require(tokenCost > 0, "Costo token deve essere maggiore di 0");
        
        rewards[nextRewardId] = Reward({
            id: nextRewardId,
            name: name,
            description: description,
            tokenCost: tokenCost,
            totalAvailable: totalAvailable,
            totalRedeemed: 0,
            active: true,
            category: category,
            imageUrl: imageUrl,
            provider: provider
        });
        
        emit RewardAdded(nextRewardId, name, tokenCost);
        nextRewardId++;
    }
    
    /**
     * @dev Acquista un premio utilizzando i token
     */
    function purchaseReward(uint256 rewardId) external nonReentrant {
        require(rewards[rewardId].active, "Premio non attivo");
        require(rewards[rewardId].totalRedeemed < rewards[rewardId].totalAvailable, "Premio esaurito");
        
        uint256 tokenCost = rewards[rewardId].tokenCost;
        require(virtuosityToken.balanceOf(msg.sender) >= tokenCost, "Token insufficienti");
        
        // Trasferisci i token dal compratore al contratto e bruciali
        virtuosityToken.transferFrom(msg.sender, address(this), tokenCost);
        virtuosityToken.burn(tokenCost);
        
        // Genera un codice di riscatto univoco
        string memory redemptionCode = generateRedemptionCode(nextRedemptionId, rewardId);
        
        // Crea il record di riscatto
        redemptions[nextRedemptionId] = Redemption({
            rewardId: rewardId,
            user: msg.sender,
            timestamp: block.timestamp,
            redemptionCode: redemptionCode,
            fulfilled: false
        });
        
        // Aggiorna le statistiche
        rewards[rewardId].totalRedeemed++;
        userRedemptions[msg.sender].push(nextRedemptionId);
        
        emit RewardPurchased(nextRedemptionId, rewardId, msg.sender, tokenCost, redemptionCode);
        nextRedemptionId++;
    }
    
    /**
     * @dev Segna un riscatto come completato
     */
    function fulfillRedemption(uint256 redemptionId) external onlyOwner {
        require(redemptions[redemptionId].user != address(0), "Riscatto non trovato");
        require(!redemptions[redemptionId].fulfilled, "Riscatto gia completato");
        
        redemptions[redemptionId].fulfilled = true;
        
        emit RewardFulfilled(redemptionId);
    }
    
    /**
     * @dev Aggiorna le proprietà di un premio esistente
     */
    function updateReward(
        uint256 rewardId,
        string memory name,
        string memory description,
        uint256 tokenCost,
        uint256 totalAvailable,
        bool active,
        string memory category,
        string memory imageUrl,
        string memory provider
    ) external onlyOwner {
        require(rewards[rewardId].id != 0, "Premio non esistente");
        
        rewards[rewardId].name = name;
        rewards[rewardId].description = description;
        rewards[rewardId].tokenCost = tokenCost;
        rewards[rewardId].totalAvailable = totalAvailable;
        rewards[rewardId].active = active;
        rewards[rewardId].category = category;
        rewards[rewardId].imageUrl = imageUrl;
        rewards[rewardId].provider = provider;
        
        emit RewardUpdated(rewardId);
    }
    
    /**
     * @dev Restituisce i dettagli di un premio
     */
    function getReward(uint256 rewardId) external view returns (Reward memory) {
        require(rewards[rewardId].id != 0, "Premio non esistente");
        return rewards[rewardId];
    }
    
    /**
     * @dev Restituisce il numero di premi riscattati da un utente
     */
    function getUserRedemptionCount(address user) external view returns (uint256) {
        return userRedemptions[user].length;
    }
    
    /**
     * @dev Restituisce una lista dei riscatti di un utente
     */
    function getUserRedemptions(address user, uint256 offset, uint256 limit) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] storage userRedemptionIds = userRedemptions[user];
        require(offset < userRedemptionIds.length, "Offset troppo grande");
        
        uint256 end = offset + limit;
        if (end > userRedemptionIds.length) {
            end = userRedemptionIds.length;
        }
        
        uint256[] memory result = new uint256[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = userRedemptionIds[i];
        }
        
        return result;
    }
    
    /**
     * @dev Genera un codice di riscatto univoco
     */
    function generateRedemptionCode(uint256 redemptionId, uint256 rewardId) 
        private 
        pure 
        returns (string memory) 
    {
        return string(abi.encodePacked("VRT-", uint2str(rewardId), "-", uint2str(redemptionId)));
    }
    
    /**
     * @dev Converte uint256 in stringa
     */
    function uint2str(uint256 _i) private pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    /**
     * @dev Permette al proprietario di ritirare eventuali token rimasti
     */
    function withdrawTokens() external onlyOwner {
        uint256 balance = virtuosityToken.balanceOf(address(this));
        if (balance > 0) {
            virtuosityToken.transfer(owner(), balance);
        }
    }
}