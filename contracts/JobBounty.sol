pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

/**
* @title JobBounty
* @author Otim Fredrick- <fredrickot@gmail.com>
* @dev A smart contract which allows someone [a poster] to post work in ETH linked with description
* And anyone [submitter] can submit a solution as evidence of fulfillment to the work.
*/
contract JobBounty is Initializable {

    bool private stopped = false;
    address private owner;

    /** Status of bounty */
    enum BountyStatus { CREATED, ACCEPTED, CANCELLED }
    
    /** Bounty details */
    struct BountyDetail {
        address payable issuer;
        uint deadline;
        string description;
        BountyStatus status;
        uint amount;         // in wei
    }

    /** Detail of Successful bounty */
    struct Success {
      bool accepted;
      address payable submitter;
      string data;
    }
    
    /** Storage for the bounty */
    BountyDetail[] public bountyDetails;

    /** Storage for the bounty successes */
    mapping(uint => Success[]) successes;
    
    /**
    * @dev Contructor
    */
    function initialize() public initializer {
    }

    /** Suspend the contract incase of bug  */
    function toggleContractActive() isAdmin public
    {
        stopped = !stopped;
    }
    
    /**
    * @dev issueBounty(): instantiates a new bountyDetail
    * @param _deadline the deadline for the bounty
    * @param _description the description of the bountyDetail
    * Can cancel sending funds incase bug with modifier stopInEmergency
    */
    function issueBounty(string memory _description, uint64 _deadline)
        public 
        stopInEmergency 
        payable 
        hasValue() 
        validateDeadline(_deadline) 
        returns(uint)
    {
        bountyDetails.push(BountyDetail(msg.sender, _deadline, _description, BountyStatus.CREATED, msg.value));
        emit BountyIssued(bountyDetails.length - 1, msg.sender, msg.value, _description);
        return (bountyDetails.length - 1);
    }
    
    /**
    * @dev fulfillBounty(): send a submission for the given bounty
    * @param _bountyId the index of the bounty to be fufilled
    * @param _description the ipfs hash which contains evidence of the submission
    */
    function fulfillBounty(uint _bountyId, string memory _description)
        public
        bountyExists(_bountyId)
        notIssuer(_bountyId)
        hasStatus(_bountyId, BountyStatus.CREATED)
        isBeforeDeadline(_bountyId)
    {
        successes[_bountyId].push(Success(false, msg.sender, _description));
        emit BountyFulfilled(_bountyId, msg.sender, (successes[_bountyId].length - 1), _description);
    }
    
    /**
    * @dev acceptFulfillment(): accept a given submission
    * @param _bountyId the index of the bounty
    * @param _fulfillmentId the index of the submission being accepted
    * Can fulfil submission in crucial state of the system
    */
    function acceptFulfillment(uint _bountyId, uint _fulfillmentId)
      public
      onlyInEmergency
      bountyExists(_bountyId)
      fulfillmentExists(_bountyId, _fulfillmentId)
      onlyIssuer(_bountyId)
      hasStatus(_bountyId, BountyStatus.CREATED)
      fulfillmentNotYetAccepted(_bountyId, _fulfillmentId)
    {
        successes[_bountyId][_fulfillmentId].accepted = true;
        bountyDetails[_bountyId].status = BountyStatus.ACCEPTED;
        successes[_bountyId][_fulfillmentId].submitter.transfer(bountyDetails[_bountyId].amount);
        emit FulfillmentAccepted(
          _bountyId, bountyDetails[_bountyId].issuer,
          successes[_bountyId][_fulfillmentId].submitter,
          _fulfillmentId, bountyDetails[_bountyId].amount
        );
    }
    
    /** @dev cancelBounty(): cancels the bounty and send the funds back to the issuer
    * @param _bountyId the index of the bounty
    */
    function cancelBounty(uint _bountyId)
      public
      bountyExists(_bountyId)
      onlyIssuer(_bountyId)
      hasStatus(_bountyId, BountyStatus.CREATED)
    {
      bountyDetails[_bountyId].status = BountyStatus.CANCELLED;
      bountyDetails[_bountyId].issuer.transfer(bountyDetails[_bountyId].amount);
      emit BountyCancelled(_bountyId, msg.sender, bountyDetails[_bountyId].amount);
    }
    
    /** Modifiers */
    modifier validateDeadline(uint _newDeadline) {
        require(_newDeadline > now, "Deadline should be in the future");
        _;
    }
    modifier hasValue() {
        require(msg.value > 0, "There should be a value");
        _;
    }
    modifier bountyExists(uint _bountyId){
        require(_bountyId < bountyDetails.length, "Bounty already exists");
        _;
    }
    modifier onlyIssuer(uint _bountyId) {
      require(msg.sender == bountyDetails[_bountyId].issuer, "You cannot call this method");
      _;
    }
    modifier notIssuer(uint _bountyId){
        require(msg.sender != bountyDetails[_bountyId].issuer, "Your not the issuer");
        _;
    }
    modifier hasStatus(uint _bountyId, BountyStatus _exactStatus) {
        require(bountyDetails[_bountyId].status == _exactStatus, "There should be a status");
        _;
    }
    modifier isBeforeDeadline(uint _bountyId) {
        require(now < bountyDetails[_bountyId].deadline, "Should be before deadline");
        _;
    }
    modifier fulfillmentNotYetAccepted(uint _bountyId, uint _fulfillmentId) {
        require(successes[_bountyId][_fulfillmentId].accepted == false, "Fulfillment not accepted");
        _;
    }
    modifier fulfillmentExists(uint _bountyId, uint _fulfillmentId){
        require(_fulfillmentId < successes[_bountyId].length, "The fulfillment already exists");
        _;
    }

    /**circuit breaker modifier */
    modifier isAdmin() {
        if(msg.sender != owner) {
            revert();
        }
        _;
    }
    modifier stopInEmergency { if (!stopped) _; }
    modifier onlyInEmergency { if (stopped) _; }
    
    /** Events */
    event BountyIssued(uint bounty_id, address issuer, uint amount, string description);
    event BountyFulfilled(uint bounty_id, address fulfiller, uint fulfillment_id, string description);
    event FulfillmentAccepted(uint bounty_id, address issuer, address fulfiller, uint indexed fulfillment_id, uint amount);
    event BountyCancelled(uint indexed bounty_id, address indexed issuer, uint amount);
}