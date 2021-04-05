// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

interface IMinter {
    function depositByCollateralAddress(
        uint256 _collateralAmount,
        uint256 _numTokens,
        address _collateralAddress
    ) external;

    function redeemByCollateralAddress(
        uint256 _tokenAmount,
        address _collateralAddress
    ) external;

    function getTotalCollateralByCollateralAddress(address _collateralAddress)
        external
        view
        returns (uint256);

    function getUserCollateralByCollateralAddress(
        address _user,
        address _collateralAddress
    ) external view returns (uint256);
}
