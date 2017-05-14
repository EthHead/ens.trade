pragma solidity ^0.4.10;
contract Deed {
    function getRegistrar() constant returns(address);
    function getCreationDate() constant returns(uint);
    function getOwner() constant returns(address);
    function getPreviousOwner() constant returns(address);
    function getValue() constant returns(uint);
    function Deed(address _owner);
    function setOwner(address newOwner);
    function setRegistrar(address newRegistrar);
    function setBalance(uint newValue, bool throwOnFailure);
    function closeDeed(uint refundRatio);
    function destroyDeed();
}

// TODO: Events
contract ENSTrade {
    struct Record {
        //address owner;
        bool listed;
        bytes32 email;

        uint buyPrice;
        uint minimumOfferPrice;

        address nextRecord;
        address previousRecord;
    }

    struct Offer {
        uint value;
        string message;
    }

    address feeAddress;
    uint public fee = 100; // Out of 10000 = 1%

    uint public recordsCurrentlyListed;
    uint public totalRecordsTraded;
    uint public totalValueTraded;

    mapping (address => Record) records;
    mapping (address => mapping (address => Offer)) offers;
    address public lastRecord;

    modifier onlyOwner(address _deedAddress) {
        Deed d = Deed(_deedAddress);
        if (d.getOwner() != address(this)) throw;
        if (d.getPreviousOwner() != msg.sender) throw;
        _;
    }

    modifier onlyFeeAddress {
        if (msg.sender != feeAddress) throw;
        _;
    }

    function ENSTrade() {
        feeAddress = msg.sender;
    }
    function setFeeAddress(address _feeAddress) onlyFeeAddress {
        feeAddress = _feeAddress;
    }
    function setFee(uint _fee) onlyFeeAddress {
        if (_fee > 10000) throw;
        fee = _fee;
    }

    function newListing(address _deedAddress, bytes32 _email, uint _buyPrice, uint _minimumOfferPrice) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        if (lastRecord != 0x0) {
            records[lastRecord].nextRecord = _deedAddress;
        }
        r.previousRecord = lastRecord;
        r.listed = true;
        r.email = _email;
        r.buyPrice = _buyPrice;
        r.minimumOfferPrice = _minimumOfferPrice;
        lastRecord = _deedAddress;
        recordsCurrentlyListed++;
    }

    function setBuyPrice(address _deedAddress, uint _buyPrice) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        if (!r.listed) throw;
        r.buyPrice = _buyPrice;
    }

    function setMinimumOffer(address _deedAddress, uint _minimumOfferPrice) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        if (!r.listed) throw;
        r.minimumOfferPrice = _minimumOfferPrice;
    }

    function setEmail(address _deedAddress, bytes32 _email) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        if (!r.listed) throw;
        r.email = _email;
    }

    function updateListing(address _deedAddress, bytes32 _email, uint _buyPrice, uint _minimumOfferPrice) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        if (!r.listed) throw;
        r.email = _email;
        r.minimumOfferPrice = _minimumOfferPrice;
        r.buyPrice = _buyPrice;
    }

    function reclaim(address _deedAddress) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        Deed d = Deed(_deedAddress);
        d.setOwner(msg.sender);
        if (!r.listed) {
            records[r.previousRecord].nextRecord = r.nextRecord;
            deleteRecord(_deedAddress);
        }
    }

    function deleteRecord(address _deedAddress) internal {
        delete records[_deedAddress];
        recordsCurrentlyListed--;
    }

    function newOffer(address _deedAddress, string _message) payable {
        if (msg.value == 0) throw;
        Offer o = offers[_deedAddress][msg.sender];
        if (o.value > 0) throw; // Offer exists
        Record r = records[_deedAddress];
        if (o.value >= r.buyPrice && r.buyPrice != 0) {
            transferRecord(_deedAddress, msg.sender, o.value);
            return;
        }
        o.value = msg.value;
        o.message = _message;
    }

    function cancelOffer(address _deedAddress) {
        Offer o = offers[_deedAddress][msg.sender];
        msg.sender.transfer(o.value);
        delete offers[_deedAddress][msg.sender];
    }

    function acceptOffer(address _deedAddress, address _offerAddress, uint _offerValue) onlyOwner(_deedAddress) {
        Offer o = offers[_deedAddress][_offerAddress];
        if (o.value != _offerValue) throw; // For extra security and race conditions

        Record r = records[_deedAddress];
        if (!r.listed) throw;

        transferRecord(_deedAddress, _offerAddress, o.value);
        delete offers[_deedAddress][_offerAddress];
    }

    function transferRecord(address _deedAddress, address _toAddress, uint _value) internal {
        uint _fee = _value * fee / 10000;
        Deed d = Deed(_deedAddress);
        d.getPreviousOwner().transfer(_value - _fee);
        feeAddress.transfer(_fee);
        totalRecordsTraded++;
        totalValueTraded+=_value;

        d.setOwner(_toAddress);
        deleteRecord(_deedAddress);
    }

    function getRecord(address _deedAddress) constant returns(bytes32, uint, uint, address, address) {
        Record r = records[_deedAddress];
        return (r.email, r.buyPrice, r.minimumOfferPrice, r.nextRecord, r.previousRecord);
    }

    function getOffer(address _deedAddress, address _offerAddress) constant returns(uint, string) {
        Offer o = offers[_deedAddress][_offerAddress];
        return (o.value, o.message);
    }
}
