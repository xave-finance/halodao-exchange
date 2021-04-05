// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import {IRewards} from "../interfaces/IRewards.sol";
import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Minter is Ownable {
    address public rewardsContract;
    address private phmAddress;
    address private _contractCreator;
    address public _financialContractAddress;
    mapping(address => mapping(address => CollateralPositions)) collateralBalances;
    address[] private collateralAddresses;
    mapping(address => uint256) totalCollateralAmount;
    using SafeMath for uint256;

    struct CollateralPositions {
        uint256 totalTokensMinted;
        uint256 totalCollateralAmount;
    }

    function depositByCollateralAddress(
        uint256 _collateralAmount,
        uint256 _numTokens,
        address _collateralAddress
    ) public {
        CollateralPositions storage collateralBalance =
            collateralBalances[_collateralAddress][msg.sender];
        totalCollateralAmount[_collateralAddress] = totalCollateralAmount[
            _collateralAddress
        ]
            .add(_collateralAmount);
        collateralBalance.totalTokensMinted = collateralBalance
            .totalTokensMinted
            .add(_numTokens);
        collateralBalance.totalCollateralAmount = collateralBalance
            .totalCollateralAmount
            .add(_collateralAmount);
        IERC20(_collateralAddress).transferFrom(
            msg.sender,
            address(this),
            _collateralAmount
        );
        IRewards(rewardsContract).depositMinter(
            _collateralAddress,
            msg.sender,
            _collateralAmount
        );
        IERC20(phmAddress).transfer(msg.sender, _numTokens);
    }

    function redeemByCollateralAddress(
        uint256 _collateralAmount,
        uint256 _tokenAmount,
        address _collateralAddress
    ) public {
        CollateralPositions storage collateralBalance =
            collateralBalances[_collateralAddress][msg.sender];
        totalCollateralAmount[_collateralAddress] = totalCollateralAmount[
            _collateralAddress
        ]
            .sub(_collateralAmount);
        IERC20(phmAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenAmount
        );
        collateralBalance.totalTokensMinted = collateralBalance
            .totalTokensMinted
            .sub(_tokenAmount);
        collateralBalance.totalCollateralAmount = collateralBalance
            .totalCollateralAmount
            .sub(_collateralAmount);
        IRewards(rewardsContract).withdrawMinter(
            _collateralAddress,
            msg.sender,
            _collateralAmount
        );
        IERC20(_collateralAddress).transfer(msg.sender, _collateralAmount);
    }

    function getTotalCollateralByCollateralAddress(address _collateralAddress)
        public
        view
        returns (uint256)
    {
        return totalCollateralAmount[_collateralAddress];
    }

    function getUserCollateralByCollateralAddress(
        address _user,
        address _collateralAddress
    ) public returns (uint256) {
        return
            collateralBalances[_collateralAddress][_user].totalCollateralAmount;
    }

    function setRewardsContract(address _rewardsContract) public onlyOwner {
        rewardsContract = _rewardsContract;
    }

    function setPhmContract(address _phmAddress) public onlyOwner {
        phmAddress = _phmAddress;
    }
}
