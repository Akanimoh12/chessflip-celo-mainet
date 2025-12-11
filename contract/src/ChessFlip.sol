// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract ChessFlip is Ownable, Pausable, ReentrancyGuard {
    struct Player {
        string username;
        uint64 totalPoints;
        uint32 totalGames;
        uint32 wins;
        uint32 losses;
        uint64 unclaimedPoints;
        bool registered;
    }

    enum GameOutcome {
        Pending,
        Win,
        Loss,
        Surrender
    }

    struct Game {
        uint256 id;
        address player;
        GameOutcome outcome;
        uint8 matchedPairs;
        uint8 livesRemaining;
        uint64 createdAt;
        uint64 updatedAt;
        uint64 pointsAwarded;
        bool claimed;
    }

    event PlayerRegistered(address indexed player, string username);
    event GameStarted(uint256 indexed gameId, address indexed player);
    event GameResultSubmitted(
        uint256 indexed gameId,
        address indexed player,
        GameOutcome outcome,
        uint8 matchedPairs,
        uint8 livesRemaining,
        uint64 pointsAwarded
    );
    event PointsClaimed(uint256 indexed gameId, address indexed player, uint64 pointsAwarded);
    event Withdraw(address indexed to, uint256 amount);

    error UsernameTaken();
    error InvalidUsername();
    error PlayerNotRegistered();
    error InvalidOutcome();
    error GameNotFound();
    error NotGameOwner();
    error GameNotPending();
    error NothingToClaim();

    IERC20 public immutable cUsd;

    uint64 public constant ENTRY_FEE = 1_000_000_000_000_000; // 0.001 cUSD (18 decimals)
    uint64 public constant WIN_POINTS = 10;
    uint64 public constant LOSS_POINTS = 2;

    uint256 private _nextGameId = 1;

    mapping(address => Player) public players;
    mapping(bytes32 => address) private usernameOwner;
    mapping(uint256 => Game) public games;

    constructor(address cUsdToken, address initialOwner) Ownable(initialOwner) {
        require(cUsdToken != address(0), "cUSD required");
        cUsd = IERC20(cUsdToken);
    }

    function registerPlayer(string calldata username) external whenNotPaused {
        Player storage player = players[msg.sender];
        if (player.registered) {
            revert UsernameTaken();
        }

        _validateUsername(username);

        bytes32 usernameHash = keccak256(abi.encodePacked(_normalize(username)));
        if (usernameOwner[usernameHash] != address(0)) {
            revert UsernameTaken();
        }

        player.username = username;
        player.registered = true;
        usernameOwner[usernameHash] = msg.sender;

        emit PlayerRegistered(msg.sender, username);
    }

    function startGame() external whenNotPaused nonReentrant returns (uint256 gameId) {
        Player storage player = players[msg.sender];
        if (!player.registered) {
            revert PlayerNotRegistered();
        }

        bool transferSuccess = cUsd.transferFrom(msg.sender, address(this), ENTRY_FEE);
        require(transferSuccess, "Entry fee transfer failed");

        gameId = _nextGameId++;
        games[gameId] = Game({
            id: gameId,
            player: msg.sender,
            outcome: GameOutcome.Pending,
            matchedPairs: 0,
            livesRemaining: 5,
            createdAt: uint64(block.timestamp),
            updatedAt: uint64(block.timestamp),
            pointsAwarded: 0,
            claimed: false
        });

        emit GameStarted(gameId, msg.sender);
    }

    function submitGameResult(
        uint256 gameId,
        GameOutcome outcome,
        uint8 matchedPairs,
        uint8 livesRemaining
    ) external whenNotPaused {
        if (outcome == GameOutcome.Pending) {
            revert InvalidOutcome();
        }

        Game storage game = games[gameId];
        if (game.id == 0) {
            revert GameNotFound();
        }
        if (game.player != msg.sender) {
            revert NotGameOwner();
        }
        if (game.outcome != GameOutcome.Pending) {
            revert GameNotPending();
        }

        require(matchedPairs <= 6, "max 6 pairs");
        require(livesRemaining <= 5, "max 5 lives");

        game.outcome = outcome;
        game.matchedPairs = matchedPairs;
        game.livesRemaining = livesRemaining;
        game.updatedAt = uint64(block.timestamp);

        uint64 points = outcome == GameOutcome.Win ? WIN_POINTS : LOSS_POINTS;
        game.pointsAwarded = points;

        Player storage player = players[msg.sender];
        player.totalGames += 1;
        if (outcome == GameOutcome.Win) {
            player.wins += 1;
        } else {
            player.losses += 1;
        }
        player.unclaimedPoints += points;

        emit GameResultSubmitted(gameId, msg.sender, outcome, matchedPairs, livesRemaining, points);
    }

    function claimPoints(uint256 gameId) external whenNotPaused {
        Game storage game = games[gameId];
        if (game.id == 0) {
            revert GameNotFound();
        }
        if (game.player != msg.sender) {
            revert NotGameOwner();
        }
        if (game.outcome == GameOutcome.Pending || game.claimed) {
            revert NothingToClaim();
        }

        uint64 points = game.pointsAwarded;
        Player storage player = players[msg.sender];
        require(player.unclaimedPoints >= points, "insufficient points");

        player.unclaimedPoints -= points;
        player.totalPoints += points;
        game.claimed = true;

        emit PointsClaimed(gameId, msg.sender, points);
    }

    function getPlayer(address account) external view returns (Player memory) {
        return players[account];
    }

    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }

    function withdraw(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "invalid to");
        bool success = cUsd.transfer(to, amount);
        require(success, "withdraw failed");
        emit Withdraw(to, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _validateUsername(string calldata username) private pure {
        bytes memory nameBytes = bytes(username);
        uint256 length = nameBytes.length;
        if (length < 3 || length > 20) {
            revert InvalidUsername();
        }
        for (uint256 i = 0; i < length; i++) {
            bytes1 char = nameBytes[i];
            bool isNumber = char >= 0x30 && char <= 0x39;
            bool isUpper = char >= 0x41 && char <= 0x5A;
            bool isLower = char >= 0x61 && char <= 0x7A;
            bool isUnderscore = char == 0x5F;
            if (!isNumber && !isUpper && !isLower && !isUnderscore) {
                revert InvalidUsername();
            }
        }
    }

    function _normalize(string calldata username) private pure returns (string memory) {
        bytes memory input = bytes(username);
        bytes memory normalized = new bytes(input.length);
        for (uint256 i = 0; i < input.length; i++) {
            bytes1 char = input[i];
            if (char >= 0x41 && char <= 0x5A) {
                normalized[i] = bytes1(uint8(char) + 32);
            } else {
                normalized[i] = char;
            }
        }
        return string(normalized);
    }
}
