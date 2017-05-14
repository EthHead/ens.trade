pragma solidity ^0.4.10;
contract Registrar {
    function entries(bytes32 _hash) constant returns (uint, address, uint, uint, uint);
}

contract Deed {
    address public registrar;
    function getCreationDate() constant returns(uint);
    uint public creationDate;
    address public owner;
    address public previousOwner;
    uint public value;
    function Deed(address _owner);
    function setOwner(address newOwner);
    function setRegistrar(address newRegistrar);
    function setBalance(uint newValue, bool throwOnFailure);
    function closeDeed(uint refundRatio);
    function destroyDeed();
}

contract ENSTrade {
    struct Record {
        string name;
        bool listed;
        uint buyPrice;
        address nextRecord;
        address previousRecord;
        string message;
    }

    struct RecordOffers {
        address lastOffer;
        uint totalOfferCount;
        uint totalOfferValue;
    }

    struct Offer {
        address nextOffer;
        address previousOffer;
        uint value;
        string message;
    }

    event tradeComplete(address indexed deedAddress, address from, address to, uint value);
    event offerCreated(address indexed deedAddress, address from, uint value);
    event offerCancelled(address indexed deedAddress, address from);
    event listingCreated(address indexed deedAddress, address from, uint buyPrice);
    event listingRemoved(address indexed deedAddress, address from);
    event recordReclaimed(address indexed deedAddress, address to);

    address feeAddress;
    uint public fee = 100; // Out of 10000 = 1%
    uint public minimumOfferPrice = 0.01 ether;

    uint public recordsCurrentlyListed;
    uint public totalRecordsTraded;
    uint public totalValueTraded;

    address public registrarAddress;

    mapping (address => Record) records;
    mapping (address => mapping (address => Offer)) offers;
    mapping (address => RecordOffers) recordOffers;
    address public lastRecord;

    modifier onlyOwner(address _deedAddress) {
        // Check who owns the using the previousOwner() function, as ens.trade currently own it.
        Deed d = Deed(_deedAddress);
        if (d.owner() != address(this)) throw;
        if (d.previousOwner() != msg.sender) throw;
        _;
    }

    modifier onlyFeeAddress {
        if (msg.sender != feeAddress) throw;
        _;
    }

    function ENSTrade(address _registrarAddress) {
        feeAddress = msg.sender;
        registrarAddress = _registrarAddress;
    }
    function setFeeAddress(address _feeAddress) onlyFeeAddress {
        feeAddress = _feeAddress;
    }
    function setMinimumOfferPrice(uint _minimumOfferPrice) onlyFeeAddress {
        minimumOfferPrice = _minimumOfferPrice;
    }
    function setFee(uint _fee) onlyFeeAddress {
        if (_fee > 500) throw; // Maximum 5%
        fee = _fee;
    }

    function sha(string _string) constant returns(bytes32) {
        return sha3(_string);
    }

    function newListing(string _name, uint _buyPrice, string _message) {
        // Hashes the name and checks that the sender previously owned it
        Registrar registrar = Registrar(registrarAddress);
        bytes32 hash = sha3(_name);
        var (,_deedAddress,,,) = registrar.entries(hash);
        Deed d = Deed(_deedAddress);
        if (d.owner() != address(this)) throw;
        if (d.previousOwner() != msg.sender) throw;

        Record r = records[_deedAddress];
        if (lastRecord != 0x0) {
            records[lastRecord].nextRecord = _deedAddress;
        }
        r.previousRecord = lastRecord;
        r.listed = true;
        r.name = _name;
        r.buyPrice = _buyPrice;
        r.message = _message;
        lastRecord = _deedAddress;
        recordsCurrentlyListed++;

        listingCreated(_deedAddress, msg.sender, _buyPrice);
    }

    function deList(address _deedAddress) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        if (r.listed) {
            deleteRecord(_deedAddress);
            listingRemoved(_deedAddress, msg.sender);
        }
    }

    function reclaim(address _deedAddress) onlyOwner(_deedAddress) {
        Record r = records[_deedAddress];
        Deed d = Deed(_deedAddress);
        d.setOwner(msg.sender);
        if (r.listed) {
            deleteRecord(_deedAddress);
            listingRemoved(_deedAddress, msg.sender);
        }
        recordReclaimed(_deedAddress, msg.sender);
    }

    function deleteRecord(address _deedAddress) internal {
        Record r = records[_deedAddress];
        records[r.previousRecord].nextRecord = r.nextRecord;
        if (_deedAddress == lastRecord) {
            lastRecord = r.previousRecord;
        }
        delete records[_deedAddress];
        recordsCurrentlyListed--;
    }

    function newOffer(address _deedAddress, string _message) payable {
        if (msg.value == 0) throw;
        Offer o = offers[_deedAddress][msg.sender];
        if (o.value > 0) throw; // Offer exists
        Record r = records[_deedAddress];
        if (msg.value >= r.buyPrice && r.buyPrice != 0) {
            // Offer is above asking price, finish trade
            transferRecord(_deedAddress, msg.sender, msg.value);
            return;
        }
        if (msg.value < minimumOfferPrice) throw;
        o.value = msg.value;
        o.message = _message;

        RecordOffers ro = recordOffers[_deedAddress];
        if (ro.lastOffer != 0x0) {
            offers[_deedAddress][ro.lastOffer].nextOffer = msg.sender;
        }
        o.previousOffer = ro.lastOffer;
        ro.lastOffer = msg.sender;
        ro.totalOfferCount++;
        ro.totalOfferValue += msg.value;

        offerCreated(_deedAddress, msg.sender, msg.value);
    }

    function cancelOffer(address _deedAddress) {
        Offer o = offers[_deedAddress][msg.sender];
        if (o.value == 0) throw;
        uint valueToSend = o.value;
        deleteOffer(_deedAddress, msg.sender);
        msg.sender.transfer(valueToSend);

        offerCancelled(_deedAddress, msg.sender);
    }

    function acceptOffer(address _deedAddress, address _offerAddress, uint _offerValue) onlyOwner(_deedAddress) {
        Offer o = offers[_deedAddress][_offerAddress];
        if (o.value != _offerValue) throw; // For extra security and race conditions

        Record r = records[_deedAddress];
        if (!r.listed) throw;

        transferRecord(_deedAddress, _offerAddress, o.value);
        deleteOffer(_deedAddress, _offerAddress);
    }

    function deleteOffer(address _deedAddress, address _offerAddress) internal {
        RecordOffers ro = recordOffers[_deedAddress];
        Offer o = offers[_deedAddress][_offerAddress];
        offers[_deedAddress][o.previousOffer].nextOffer = o.nextOffer;
        if (ro.lastOffer == _offerAddress) {
            ro.lastOffer = o.previousOffer;
        }
        ro.totalOfferCount--;
        ro.totalOfferValue -= offers[_deedAddress][_offerAddress].value;
        delete offers[_deedAddress][_offerAddress];
    }

    function transferRecord(address _deedAddress, address _toAddress, uint _value) internal {
        uint _fee = _value * fee / 10000;
        Deed d = Deed(_deedAddress);
        totalRecordsTraded++;
        totalValueTraded += _value;

        d.setOwner(_toAddress);
        deleteRecord(_deedAddress);

        d.previousOwner().transfer(_value - _fee);
        feeAddress.transfer(_fee);

        tradeComplete(_deedAddress, d.previousOwner(), _toAddress, _value);
    }

    function getRecord(address _deedAddress) constant returns(bool, string, uint, address, address, string) {
        Record r = records[_deedAddress];
        return (r.listed, r.name, r.buyPrice, r.nextRecord, r.previousRecord, r.message);
    }

    function getRecordOffers(address _deedAddress) constant returns(address, uint, uint) {
        RecordOffers ro = recordOffers[_deedAddress];
        return (ro.lastOffer, ro.totalOfferCount, ro.totalOfferValue);
    }

    function getOffer(address _deedAddress, address _offerAddress) constant returns(address, address, uint, string) {
        Offer o = offers[_deedAddress][_offerAddress];
        return (o.nextOffer, o.previousOffer, o.value, o.message);
    }
}
