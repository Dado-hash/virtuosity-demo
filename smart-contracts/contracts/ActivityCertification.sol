// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VirtuosityToken.sol";

/**
 * @title ActivityCertification
 * @dev Contratto per certificare attività sostenibili e distribuire token
 */
contract ActivityCertification is Ownable, ReentrancyGuard {
    VirtuosityToken public virtuosityToken;
    
    // Struttura per rappresentare un'attività certificata
    struct CertifiedActivity {
        string activityId;      // ID dell'attività dal database
        address user;           // Utente che ha fatto l'attività
        uint256 tokensEarned;   // Token guadagnati
        uint256 co2Saved;       // CO2 risparmiata (in grammi)
        uint256 timestamp;      // Timestamp della certificazione
        string activityType;    // Tipo di attività (walking, cycling, etc.)
        string description;     // Descrizione dell'attività
        bool certified;         // Se l'attività è stata certificata
    }
    
    // Mappatura da activityId a attività certificata
    mapping(string => CertifiedActivity) public certifiedActivities;
    
    // Mappatura da utente a lista di ID attività certificate
    mapping(address => string[]) public userActivities;
    
    // Tasso di conversione: 1 token = 1000 grammi di CO2 risparmiata
    uint256 public constant CO2_TO_TOKEN_RATE = 1000;
    
    // Eventi
    event ActivityCertified(
        string indexed activityId,
        address indexed user,
        uint256 tokensEarned,
        uint256 co2Saved,
        string activityType
    );
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        virtuosityToken = VirtuosityToken(_tokenAddress);
    }
    
    /**
     * @dev Certifica un'attività e distribuisce token all'utente
     * @param activityId ID univoco dell'attività dal database
     * @param user Indirizzo dell'utente
     * @param co2SavedGrams CO2 risparmiata in grammi
     * @param activityType Tipo di attività
     * @param description Descrizione dell'attività
     */
    function certifyActivity(
        string memory activityId,
        address user,
        uint256 co2SavedGrams,
        string memory activityType,
        string memory description
    ) external onlyOwner nonReentrant {
        require(bytes(activityId).length > 0, "Activity ID non valido");
        require(user != address(0), "Indirizzo utente non valido");
        require(co2SavedGrams > 0, "CO2 saved deve essere maggiore di 0");
        require(!certifiedActivities[activityId].certified, "Attivita gia certificata");
        
        // Calcola i token da assegnare in base alla CO2 risparmiata
        uint256 tokensToMint = calculateTokensFromCO2(co2SavedGrams);
        
        // Crea la struttura dell'attività certificata
        certifiedActivities[activityId] = CertifiedActivity({
            activityId: activityId,
            user: user,
            tokensEarned: tokensToMint,
            co2Saved: co2SavedGrams,
            timestamp: block.timestamp,
            activityType: activityType,
            description: description,
            certified: true
        });
        
        // Aggiungi l'attività alla lista dell'utente
        userActivities[user].push(activityId);
        
        // Minta i token per l'utente
        virtuosityToken.mintForActivity(user, tokensToMint, activityId, co2SavedGrams);
        
        emit ActivityCertified(activityId, user, tokensToMint, co2SavedGrams, activityType);
    }
    
    /**
     * @dev Calcola i token da assegnare in base alla CO2 risparmiata
     * Formula: tokensToMint = co2SavedGrams / CO2_TO_TOKEN_RATE
     * Minimo 1 token per incentivare anche piccole attività
     */
    function calculateTokensFromCO2(uint256 co2SavedGrams) public pure returns (uint256) {
        uint256 tokens = co2SavedGrams / CO2_TO_TOKEN_RATE;
        // Assicurati che l'utente riceva almeno 1 token
        return tokens > 0 ? tokens : 1;
    }
    
    /**
     * @dev Restituisce i dettagli di un'attività certificata
     */
    function getActivityDetails(string memory activityId) 
        external 
        view 
        returns (CertifiedActivity memory) 
    {
        require(certifiedActivities[activityId].certified, "Attivita non certificata");
        return certifiedActivities[activityId];
    }
    
    /**
     * @dev Restituisce il numero di attività certificate da un utente
     */
    function getUserActivityCount(address user) external view returns (uint256) {
        return userActivities[user].length;
    }
    
    /**
     * @dev Restituisce una lista delle attività certificate da un utente
     */
    function getUserActivities(address user, uint256 offset, uint256 limit) 
        external 
        view 
        returns (string[] memory) 
    {
        string[] storage activities = userActivities[user];
        require(offset < activities.length, "Offset troppo grande");
        
        uint256 end = offset + limit;
        if (end > activities.length) {
            end = activities.length;
        }
        
        string[] memory result = new string[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = activities[i];
        }
        
        return result;
    }
    
    /**
     * @dev Verifica se un'attività è già stata certificata
     */
    function isActivityCertified(string memory activityId) external view returns (bool) {
        return certifiedActivities[activityId].certified;
    }
}