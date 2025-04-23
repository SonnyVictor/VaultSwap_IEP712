// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract VaultSwap is EIP712 {
    string private constant SIGNING_DOMAIN = "Swap";
    string private constant SIGNATURE_VERSION = "1";

    struct SwapRequest {
        uint256 idRequest;
        address userA;
        address userB;
        address tokenContract;
        address nftContract;
        uint256 tokenAmount;
        uint256 nftId;
        uint256 nonceA;
        uint256 nonceB;
    }

    mapping(address => uint256) public nonces;

    bytes32 private constant SWAP_REQUEST_TYPEHASH = keccak256(
        "SwapRequest(uint256 idRequest,address userA,address userB,address tokenContract,address nftContract,uint256 tokenAmount,uint256 nftId,uint256 nonceA,uint256 nonceB)"
    );

    event SwapExecuted(
        uint256 indexed idRequest,
        address indexed userA,
        address indexed userB,
        uint256 tokenAmount,
        uint256 nftId
    );

    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {}

    function executeSwap(
        SwapRequest memory request,
        bytes memory signatureA,
        bytes memory signatureB
    ) external {
        require(
            request.nonceA == nonces[request.userA],
            "Invalid nonce for userA"
        );
        require(
            request.nonceB == nonces[request.userB],
            "Invalid nonce for userB"
        );
        require(
            _verifySignature(request, signatureA, request.userA),
            "Invalid signature from User A"
        );
        require(
            _verifySignature(request, signatureB, request.userB),
            "Invalid signature from User B"
        );

        nonces[request.userA]++;
        nonces[request.userB]++;

        IERC20 token = IERC20(request.tokenContract);
        require(
            token.transferFrom(request.userA, request.userB, request.tokenAmount),
            "Token transfer failed"
        );

        IERC721 nft = IERC721(request.nftContract);
        nft.safeTransferFrom(request.userB, request.userA, request.nftId);

        emit SwapExecuted(
            request.idRequest,
            request.userA,
            request.userB,
            request.tokenAmount,
            request.nftId
        );
    }

    function _verifySignature(
        SwapRequest memory request,
        bytes memory signature,
        address signer
    ) internal view returns (bool) {
        bytes32 digest = _hashTypedDataV4(_hashSwapRequest(request));
        address recoveredSigner = ECDSA.recover(digest, signature);
        return recoveredSigner == signer;
    }

    function _hashSwapRequest(SwapRequest memory request)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    SWAP_REQUEST_TYPEHASH,
                    request.idRequest,
                    request.userA,
                    request.userB,
                    request.tokenContract,
                    request.nftContract,
                    request.tokenAmount,
                    request.nftId,
                    request.nonceA,
                    request.nonceB
                )
            );
    }

    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }
}