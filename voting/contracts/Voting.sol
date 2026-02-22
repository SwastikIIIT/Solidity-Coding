// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Voting{
    
    struct Voter{
        bool hasVoted; // delegated votes or voted. flag ki voted or not
        uint candidateVote; // jisko vote diya
        address delegatedPerson; //kisko apna vote right diya
        uint amt; //Kitne votes -- change nhi karna hai.audit trail 
    }

    struct Candidate{
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;

    Candidate[] public candidates;

    mapping(address=>Voter) public  voters;

    constructor(bytes32[] memory netas){
        chairperson=msg.sender;
        voters[chairperson].amt=1;

        for(uint i=0;i<netas.length;i++)
        {
            candidates.push(Candidate({
                name:netas[i],
                voteCount:0
            }));
        }
    }

    function giveRightToVote(address voter) external{
        require(msg.sender==chairperson,"Only chairperson can give right to vote.");
        require(!voters[voter].hasVoted,"Already delegated votes or voted.");
        require(voters[voter].amt==0,'De chuka hai votes ab sare.');
        voters[voter].amt=1;
    }
    
    function giveRightToVoteMultiple(address[] calldata votersList) external{
        require(msg.sender==chairperson,"Only chairperson can give right to vote.");
        for(uint i=0;i<votersList.length;i++){
            require(!voters[votersList[i]].hasVoted,"Already delegated votes or voted.");
            require(voters[votersList[i]].amt==0,'De chuka hai votes ab sare.');
            voters[voter].amt=1;
        }
    }

    // 0x0000000000000000000000000000000000000000 -- address(0).if voter is not set or defined.similar to null/undefined in js
    function delegate(address to) external{
        Voter storage sender=voters[msg.sender];
        require(!sender.hasVoted,'Already delegated or voted.Ab nhi delegation possible');
        require(sender.amt!=0,'No more votes possible to give.');
        require(to!=msg.sender,'Self-delegation not possible');

        while(voters[to].delegatedPerson!=address(0)){
            to=voters[to].delegatedPerson;

            require(to!=msg.sender,'Loop detected.');
        }

        Voter storage delegateVoter=voters[to];
        require(delegateVoter.amt!=0,'Khali votes power ko nhi de sakte votes.');
        sender.hasVoted=true;
        sender.delegatedPerson=to;

        if(delegateVoter.hasVoted)
        {
            candidates[delegateVoter.candidateVote].voteCount+=sender.amt;
        }
        else{
             voters[to].amt+=sender.amt;
        }
    }

    // external - function can be called from outside only 
    function voteKar(uint index) external{
        Voter storage caster=voters[msg.sender];
        require(caster.amt!=0,'Votes hone chaiye uske paas');
        require(!caster.hasVoted,'Already voted.');
        caster.hasVoted=true;
        caster.candidateVote=index;
        
        candidates[index].voteCount+=caster.amt;
    }

    // public - function can be called from outside and inside contract
    function winner() public view returns (uint winningIndex){
        uint votes=0;
        bool tie=false;
        for(uint i=0;i<candidates.length;i++)
        {
            if(candidates[i].voteCount>votes){
                votes=candidates[i].voteCount;
                winningIndex=i;
                tie=false;
            }
            else if(candidates[i].voteCount==votes && votes>0){
                tie=true;
            }
        }
        if(tie){
            Voter storage head=voter[chairperson];
            if(head.hasVoted)
            {
                uint jiskoDiyaVote=head.candidateVote;
                if(candidates[jiskoDiyaVote].voteCount==votes)
                return jiskoDiyaVote;
            }
        }
        return winningIndex;
    }

    function winnerName() external view returns (bytes32 name){
        uint winningIndex=winner();

        return candidates[winningIndex].name;
    }
}