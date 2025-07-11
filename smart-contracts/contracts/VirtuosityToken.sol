// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VirtuosityToken
 * @dev ERC20 token per il sistema di ricompense Virtuosity
 * I token vengono mintati quando le attività sostenibili vengono certificate
 */
contract VirtuosityToken is ERC20, Ownable {
    // Indirizzo del contratto ActivityCertification autorizzato a mintare
    address public activityCertificationContract;
    
    // Evento emesso quando viene mintato un token per una certificazione
    event TokensMintedForActivity(
        address indexed user,
        uint256 amount,
        string activityId,
        uint256 co2Saved
    );
    
    constructor() ERC20("Virtuosity Token", "VRT") Ownable(msg.sender) {}
    
    /**
     * @dev Imposta l'indirizzo del contratto ActivityCertification
     * Solo il proprietario può chiamare questa funzione
     */
    function setActivityCertificationContract(address _contract) external onlyOwner {
        activityCertificationContract = _contract;
    }
    
    /**
     * @dev Minta token per un utente quando certifica un'attività
     * Solo il contratto ActivityCertification può chiamare questa funzione
     */
    function mintForActivity(
        address to,
        uint256 amount,
        string memory activityId,
        uint256 co2Saved
    ) external {
        require(
            msg.sender == activityCertificationContract,
            "Solo il contratto ActivityCertification puo mintare"
        );
        require(to != address(0), "Indirizzo non valido");
        require(amount > 0, "Amount deve essere maggiore di 0");
        
        // Converti amount in wei (18 decimali)
        uint256 amountInWei = amount * 10**decimals();
        
        _mint(to, amountInWei);
        
        emit TokensMintedForActivity(to, amountInWei, activityId, co2Saved);
    }
    
    /**
     * @dev Brucia token (utile per acquisti nel marketplace)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Restituisce il bilancio di un utente in formato leggibile (con 18 decimali)
     */
    function balanceOfUser(address user) external view returns (uint256) {
        return balanceOf(user);
    }
}