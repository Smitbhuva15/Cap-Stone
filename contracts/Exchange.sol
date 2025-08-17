// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderCount = 0;

    /// mapping

    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

    // events

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );

    //////////////////////////      structure        //////////////////////////

    struct _Order {
        uint256 id; // unique identity for order
        address user; // User who made order
        address tokenGet; // Address of token they receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address of token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp; // when order is created
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        // fee Acoount is account,that get the all Transaction fees
        feeAccount = _feeAccount;
        // every Transaction fee in Percent
        feePercent = _feePercent;
    }

    // deposite Token

    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange(contract)

        ///////////////////////////////////////////////

        // token owner ----->msg.sender
        // token spender (for approve) --->exchange(contract) (address(this))
        // reciever token --> exchange(contract) (address(this))

        Token(_token).transferFrom(msg.sender, address(this), _amount);

        //////////////////////////////////////////////

        //update user balance

        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

        // emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // withdrawToken

    function withdrawToken(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount);

        // Transfer token to user
        Token(_token).transfer(msg.sender, _amount);

        //update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        //emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // check Balance

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // Make and Cancel Orders

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // token give(the token they want to spend)   (ex. rupees)
        // token get(the token they want to receive) (ex. BSE stoke)
        // _amountGive (ex. 300 rupess,CAP Token)
        // _amountGet (ex. 2 quntity,mDAIT Token)

        // prevent order if tokens are not on exchange
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

        //create order
        orderCount += 1;

        //map order
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        // emit event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 id) public {
        // Fetch order;
        _Order storage _order = orders[id];

        //ensure that caller of the function is the owner of the order
        require(address(_order.user) == msg.sender);

        //order must exist
        require(_order.id == id);

        //cancel the order
        orderCancelled[id] = true;

        // emit event
        emit Cancel(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }

    //Execute order

    function fillOrder(uint256 id) public {
        //orderId must be valid
        require(id > 0 && id <= orderCount, "order dose not exist");

        // order cann't cancelled
        require(orderCancelled[id] != true, "okkk");

        //order cann't filled
        require(orderFilled[id] != true, "nooo");

        // fetch order
        _Order storage _order = orders[id];

        // Excute
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );

        orderFilled[id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // function call make(create) order --->user
        // function call fill order ---> msg.sender
        // user 2 is pay the fee(the person, who is filled the order)

        //fee is deducted

        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        require(balanceOf(_tokenGet, msg.sender) >= _amountGet + _feeAmount);
        require(balanceOf(_tokenGive, _user) >= _amountGive);

        // msg.sender account
        tokens[_tokenGet][msg.sender] =
            tokens[_tokenGet][msg.sender] -
            (_amountGet + _feeAmount);
        tokens[_tokenGive][msg.sender] =
            tokens[_tokenGive][msg.sender] +
            _amountGive;

        //charge fee
        tokens[_tokenGet][feeAccount] =
            tokens[_tokenGet][feeAccount] +
            _feeAmount;

        // user account
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}
