// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RealEstateOracle is Ownable, ReentrancyGuard {
    struct PropertyRound {
        uint256 roundID;
        uint256 price;
        uint256 timestamp;
    }

    struct PendingUpdate {
        uint256 price;
        uint256 approvals;
        address[] approvedVerifiers;
        mapping(address => bool) hasApproved;
    }

    mapping(uint256 => mapping(uint256 => PropertyRound)) public propertyRounds;
    mapping(uint256 => uint256) public latestRoundID;
    mapping(address => bool) public verifiers;
    mapping(uint256 => PendingUpdate) public pendingUpdates;
    mapping(address => uint256) public verifierRewards;

    uint256 public rewardPerUpdate = 0.00005 ether;
    uint256 public minVerifiers = 3;
    uint256 public totalFeesCollected;

    event PropertyUpdated(uint256 propertyId, uint256 roundID, uint256 price, uint256 timestamp);
    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);
    event RewardsClaimed(address verifier, uint256 amount);
    event UpdateProposed(uint256 propertyId, uint256 price, address proposer);
    event UpdateApproved(uint256 propertyId, uint256 price, uint256 approvals);
    event MinVerifiersUpdated(uint256 newMinVerifiers);

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not an authorized verifier");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) payable {}

    function addVerifier(address _verifier) external onlyOwner {
        require(!verifiers[_verifier], "Already a verifier");
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) external onlyOwner {
        require(_verifier != owner(), "Cannot remove contract owner as verifier");
        require(verifiers[_verifier], "Not a verifier");
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    function proposeUpdate(uint256 _propertyId, uint256 _price) external onlyVerifier {
        PendingUpdate storage update = pendingUpdates[_propertyId];

        require(!update.hasApproved[msg.sender], "You already approved this update");

        if (update.approvals == 0) {
            update.price = _price;
        }

        require(update.price == _price, "Conflicting price proposals");

        update.hasApproved[msg.sender] = true;
        update.approvals++;
        update.approvedVerifiers.push(msg.sender);

        emit UpdateApproved(_propertyId, _price, update.approvals);

        if (update.approvals >= minVerifiers) {
            finalizeUpdate(_propertyId);
        }
    }

    function finalizeUpdate(uint256 _propertyId) internal {
        PendingUpdate storage update = pendingUpdates[_propertyId];

        uint256 newRoundID = latestRoundID[_propertyId] + 1;

        propertyRounds[_propertyId][newRoundID] = PropertyRound({
            roundID: newRoundID,
            price: update.price,
            timestamp: block.timestamp
        });

        latestRoundID[_propertyId] = newRoundID;

        for (uint256 i = 0; i < update.approvedVerifiers.length; i++) {
            address verifier = update.approvedVerifiers[i];
            verifierRewards[verifier] += rewardPerUpdate;
        }

        delete pendingUpdates[_propertyId];

        emit PropertyUpdated(_propertyId, newRoundID, update.price, block.timestamp);
    }

    function getLatestPropertyPrice(uint256 _propertyId) external view returns (uint256 price, uint256 timestamp, uint256 roundID) {
        uint256 round = latestRoundID[_propertyId];
        require(round > 0, "No price history found");

        PropertyRound memory latest = propertyRounds[_propertyId][round];
        return (latest.price, latest.timestamp, latest.roundID);
    }

    function getPropertyByRound(uint256 _propertyId, uint256 _roundID) external view returns (uint256 price, uint256 timestamp) {
        require(_roundID <= latestRoundID[_propertyId], "Invalid round ID");

        PropertyRound memory data = propertyRounds[_propertyId][_roundID];
        return (data.price, data.timestamp);
    }

    function claimRewards() external nonReentrant {
        uint256 amount = verifierRewards[msg.sender];
        require(amount > 0, "No rewards to claim");

        verifierRewards[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RewardsClaimed(msg.sender, amount);
    }

    function withdrawFees(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "Insufficient funds");
        totalFeesCollected -= amount;
        payable(owner()).transfer(amount);
    }

    function setMinVerifiers(uint256 _minVerifiers) external onlyOwner {
        require(_minVerifiers > 0, "Must require at least 1 verifier");
        minVerifiers = _minVerifiers;
        emit MinVerifiersUpdated(_minVerifiers);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
