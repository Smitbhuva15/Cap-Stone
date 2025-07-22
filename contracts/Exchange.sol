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
}
