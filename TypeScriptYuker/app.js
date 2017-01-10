var Card = (function () {
    function Card(suit, value) {
        this.suit = suit;
        this.value = value;
    }
    return Card;
}());
var PlayedCard = (function () {
    function PlayedCard(card, playedBy) {
        this.suit = card.suit;
        this.value = card.value;
        this.playedBy = playedBy;
    }
    return PlayedCard;
}());
var Player = (function () {
    function Player(team, isComputer) {
        this.team = team;
        this.isComputer = isComputer;
        this.hand = [];
    }
    Player.prototype.setTeam = function (team) {
        this.team = team;
    };
    Player.prototype.addCard = function (card) {
        this.hand.push(card);
    };
    Player.prototype.playCard = function (card) {
        return this.hand.slice(this.hand.indexOf(card), 1)[0];
    };
    Player.prototype.playHighestOffSuit = function (trump) {
        var cardToPlay = null;
        this.hand.forEach(function (card) {
            if (card.suit !== trump) {
                if (cardToPlay === null) {
                    cardToPlay = card;
                }
                else if (cardToPlay.value < card.value) {
                    cardToPlay = card;
                }
            }
        });
    };
    Player.prototype.playLowestOffSuit = function (trump) {
        var cardToPlay = null;
        this.hand.forEach(function (card) {
            if (card.suit !== trump) {
                if (cardToPlay === null) {
                    cardToPlay = card;
                }
                else if (cardToPlay.value > card.value) {
                    cardToPlay = card;
                }
            }
        });
    };
    Player.prototype.setTrump = function (card) {
    };
    Player.prototype.playerTurn = function (cardsInPlay, winningCard, trumpForRound, playerNum) {
        var promptStatement = "";
        if (cardsInPlay.length > 0) {
            promptStatement += "Cards In Play: \n";
            promptStatement += generalFunctions.createCardStringArray(cardsInPlay);
        }
        promptStatement += "Suit for Round: " + trumpForRound + "\n";
        promptStatement += "Cards In Hand: \n";
        promptStatement += this.createPlayerOptions(this.hand);
        promptStatement += "Enter the number of the card you would like to play";
        var playerInput = prompt(promptStatement), playerSelectedNum = parseInt(playerInput);
        if (isNaN(playerSelectedNum) || playerSelectedNum > this.hand.length || playerSelectedNum < 0) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerTurn(cardsInPlay, winningCard, trumpForRound, playerNum);
        }
        else {
            return this.hand[playerSelectedNum];
        }
    };
    Player.prototype.playerDiscard = function (cardForTrump, playerNum) {
        var promptStatement = "Greetings Player " + playerNum + "\n Card Received: " + generalFunctions.mapValueToCardName(cardForTrump) + " of " + cardForTrump.suit + "\n";
        promptStatement += "Select Card from hand to discard \n";
        promptStatement += this.createPlayerOptions(this.hand);
        var playerSelectedNum = parseInt(prompt(promptStatement));
        if (isNaN(playerSelectedNum) || playerSelectedNum < 0 || playerSelectedNum > this.hand.length) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerDiscard(cardForTrump, playerNum);
        }
        else {
            this.hand.splice(playerSelectedNum, 1);
        }
    };
    Player.prototype.playerSelectTrumpFirstPass = function (cardForTrump, playerToReceiveNum, playerToReceive, playerNum) {
        var promptStatement = "Greetings Player " + playerNum + "\n Cards In Hand: \n";
        promptStatement += generalFunctions.createCardStringArray(this.hand);
        promptStatement += "Card To Determine Trump: " + generalFunctions.mapValueToCardName(cardForTrump) + " of " + cardForTrump.suit + "\n";
        promptStatement += "Player to Receive Card: " + "Player " + playerToReceiveNum + " on Team " + playerToReceive.team.teamNumber + "\n";
        promptStatement += "Enter 1 to set card as trump enter 0 to pass";
        var playerInput = prompt(promptStatement), playerSelectedNum = parseInt(playerInput);
        if (isNaN(playerSelectedNum) || playerSelectedNum !== 0 && playerSelectedNum !== 1) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerSelectTrumpFirstPass(cardForTrump, playerToReceiveNum, playerToReceive, playerNum);
        }
        else {
            return playerSelectedNum;
        }
    };
    Player.prototype.playerSelectTrumpSecondPass = function (cardForTrump, playerNum) {
        var promptStatement = "Greetings Player " + playerNum + "\n Cards In Hand: \n";
        promptStatement += generalFunctions.createCardStringArray(this.hand);
        promptStatement += "Select number to set trump suit \n";
        var suits = [new Suit("clubs", 0), new Suit("spades", 1), new Suit("hearts", 2), new Suit("diamonds", 3)], availableSuitNums = [];
        var num = 1;
        suits.forEach(function (suit) {
            if (suit.name !== cardForTrump.suit) {
                promptStatement += suit.value + " - " + suit.name + "\n";
                availableSuitNums.push(suit.value);
            }
        });
        var playerInput = prompt(promptStatement), playerSelectedNum = parseInt(playerInput);
        if (playerSelectedNum === 4) {
            return null;
        }
        else if (isNaN(playerSelectedNum) || availableSuitNums.indexOf(playerSelectedNum) === -1 && playerSelectedNum !== 4) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerSelectTrumpSecondPass(cardForTrump, playerNum);
        }
        else {
            var selectedSuit;
            suits.forEach(function (availableSuit) {
                if (availableSuit.value === playerSelectedNum) {
                    selectedSuit = availableSuit.name;
                }
            });
            return selectedSuit;
        }
    };
    Player.prototype.createPlayerOptions = function (cards) {
        var cardsString = "";
        cards.forEach(function (card, index) {
            cardsString += index.toString() + " - Card: " + generalFunctions.mapValueToCardName(card) + " of " + card.suit + "\n";
        });
        return cardsString;
    };
    return Player;
}());
var Team = (function () {
    function Team(teamNumber, points) {
        this.teamNumber = teamNumber;
        this.points = points;
        this.tricksWon = 0;
        this.setTrump = false;
    }
    Team.prototype.incrementTricksWon = function () {
        this.tricksWon++;
    };
    Team.prototype.teamSetTrump = function () {
        this.setTrump = true;
    };
    Team.prototype.clearForRound = function () {
        this.setTrump = false;
        this.tricksWon = 0;
    };
    Team.prototype.addPoints = function (points) {
        this.points += points;
    };
    Team.prototype.clear = function () {
        this.setTrump = false;
        this.tricksWon = 0;
        this.points = 0;
        this.tricksWon = 0;
    };
    return Team;
}());
var ComputerPlayer = (function () {
    function ComputerPlayer(team) {
        this.team = team;
        this.hand = [];
    }
    return ComputerPlayer;
}());
var Suit = (function () {
    //offSuit: string;
    function Suit(name, value) {
        this.name = name;
        this.value = value;
        //this.offSuit = offSuit;
    }
    return Suit;
}());
var Deck = (function () {
    function Deck() {
        this.initDeck();
    }
    Deck.prototype.initDeck = function () {
        var suits = ["clubs", "spades", "hearts", "diamonds"], self = this;
        this.cards = [];
        suits.forEach(function (suit) {
            for (var i = 0; i < 6; i++) {
                self.cards.push(new Card(suit, i));
            }
        });
    };
    Deck.prototype.shuffleDeck = function () {
        var newDeck;
        var oldDeck = this.cards;
        while (oldDeck.length > 0) {
            var randCard = Math.floor(Math.random() * oldDeck.length);
            newDeck.push(oldDeck.splice(randCard, 1)[0]);
        }
        this.cards = newDeck;
    };
    Deck.prototype.takeCard = function () {
        return this.cards.pop();
    };
    return Deck;
}());
var YukerGame = (function () {
    function YukerGame() {
        this.deck = new Deck();
        this.players = [new Player(this.team1, false), new Player(this.team2, false), new Player(this.team1, false), new Player(this.team2, false)];
    }
    YukerGame.prototype.beginGame = function () {
        this.currentTurn = Math.floor(Math.random() * 4);
        this.startingTurn = this.currentTurn + 1;
        this.team1 = new Team(1, 0);
        this.team2 = new Team(2, 0);
        this.players[0].setTeam(this.team1);
        this.players[1].setTeam(this.team2);
        this.players[2].setTeam(this.team1);
        this.players[3].setTeam(this.team2);
        this.beginRound();
    };
    YukerGame.prototype.beginRound = function () {
        this.cardsInPlay = [];
        this.winningCard = null;
        this.deck.initDeck();
        this.deck.shuffleDeck();
        this.currentTurn = (this.currentTurn + 1) % 4;
        this.startingTurn = (this.currentTurn + 1) % 4;
        this.dealCards();
        this.determineTrump();
        this.playRound();
    };
    YukerGame.prototype.playRound = function () {
        for (var j = 0; j < 5; j++) {
            for (var i = 0; i < 4; i++) {
                var playerTurn = (this.currentTurn + i) % 4, currentPlayer = this.players[playerTurn], cardPlayed;
                if (currentPlayer.isComputer === true) {
                    this.computerPlayerTurn(currentPlayer);
                }
                else {
                    cardPlayed = new PlayedCard(currentPlayer.playerTurn(this.cardsInPlay, this.winningCard, this.suitForRound, playerTurn), currentPlayer);
                    this.cardsInPlay.push(cardPlayed);
                    this.determineWinningCard(this.cardsInPlay);
                }
            }
            this.winningCard.playedBy.team.incrementTricksWon();
        }
        this.determineTeamPoints(this.team1);
        this.determineTeamPoints(this.team2);
        if (this.team1.points < 10 && this.team2.points < 10) {
            this.team1.clearForRound();
            this.team2.clearForRound();
            this.beginRound;
        }
        else {
            this.displayVictor();
            this.team1.clear();
            this.team2.clear();
            this.beginGame();
        }
    };
    YukerGame.prototype.determineWinningCard = function (cards) {
        var winningCard = cards[0], suitForRound = cards[0].suit, self = this;
        cards.forEach(function (card, index) {
            if (winningCard.suit === self.cardForTrump.suit && card.suit === self.cardForTrump.suit && card.value > winningCard.value) {
                winningCard = card;
            }
            else if (card.suit === self.cardForTrump.suit) {
                winningCard = card;
            }
            else if (winningCard.suit === suitForRound && card.suit === suitForRound && card.value > winningCard.value) {
                winningCard = card;
            }
        });
        this.winningCard = winningCard;
    };
    YukerGame.prototype.determineTeamPoints = function (team) {
        if (team.setTrump) {
            switch (team.tricksWon) {
                case 3:
                    team.addPoints(2);
                    break;
                case 4:
                    team.addPoints(2);
                    break;
                case 5:
                    team.addPoints(3);
                    break;
            }
        }
        else {
            switch (team.tricksWon) {
                case 3:
                    team.addPoints(3);
                case 4:
                    team.addPoints(3);
                case 5:
                    team.addPoints(4);
            }
        }
    };
    YukerGame.prototype.displayVictor = function () {
        var displayMessage, victor, loser;
        if (this.team1.points > this.team2.points) {
            victor = this.team1;
            loser = this.team2;
        }
        else {
            victor = this.team2;
            loser = this.team1;
        }
        displayMessage = "Team " + victor.teamNumber + " wins with " + victor.points + " points \n";
        displayMessage += "Team " + loser.teamNumber + " loses with " + loser.points + " points \n";
    };
    YukerGame.prototype.dealCards = function () {
        var self = this;
        for (var i = 0; i < 5; i++) {
            this.players.forEach(function (player) {
                player.addCard(self.deck.takeCard());
            });
        }
    };
    YukerGame.prototype.determineTrump = function () {
        this.cardForTrump = this.deck.takeCard();
        for (var i = 1; i < this.players.length + 1; i++) {
            var playerTurn = (this.currentTurn + i) % 4, currentPlayer = this.players[playerTurn], dealer = this.players[this.currentTurn];
            if (currentPlayer.isComputer) {
                //write logic for computer player
                currentPlayer.setTrump(this.cardForTrump);
            }
            else {
                var playerTrumpChoice = currentPlayer.playerSelectTrumpFirstPass(this.cardForTrump, this.currentTurn, dealer, playerTurn);
                if (playerTrumpChoice) {
                    this.players[this.currentTurn].addCard(this.cardForTrump);
                    this.players[this.currentTurn].playerDiscard(this.cardForTrump, this.currentTurn);
                    currentPlayer.team.teamSetTrump();
                    this.suitForRound = this.cardForTrump.suit;
                    return true;
                }
            }
        }
        for (var i = 1; i < this.players.length + 1; i++) {
            var playerTurn = (this.currentTurn + i) % 4, currentPlayer = this.players[playerTurn], dealer = this.players[this.currentTurn];
            if (currentPlayer.isComputer) {
                currentPlayer.setTrump(this.cardForTrump);
            }
            else {
                var playerTrumpChoiceRound2 = currentPlayer.playerSelectTrumpSecondPass(this.cardForTrump, playerTurn);
                if (playerTrumpChoiceRound2 !== null) {
                    this.suitForRound = this.cardForTrump.suit;
                    currentPlayer.team.teamSetTrump();
                }
                return true;
            }
        }
    };
    YukerGame.prototype.computerPlayerTurn = function (currentPlayer) {
        if (this.winningCard === null) {
            currentPlayer.playHighestOffSuit(this.suitForRound);
        }
    };
    return YukerGame;
}());
var YukerGeneralFunctions = (function () {
    function YukerGeneralFunctions() {
    }
    YukerGeneralFunctions.prototype.createCardStringArray = function (cards) {
        var cardsString = "";
        cards.forEach(function (card) {
            cardsString += "Card: " + generalFunctions.mapValueToCardName(card) + " of " + card.suit + "\n";
        });
        return cardsString;
    };
    YukerGeneralFunctions.prototype.mapValueToCardName = function (card) {
        switch (card.value) {
            case 0:
                return "Nine";
            case 1:
                return "Ten";
            case 2:
                return "Jack";
            case 3:
                return "Queen";
            case 4:
                return "King";
            case 5:
                return "Ace";
            default:
                return "Jack";
        }
    };
    return YukerGeneralFunctions;
}());
var generalFunctions = new YukerGeneralFunctions();
var yuker = new YukerGame();
yuker.beginGame();
//# sourceMappingURL=app.js.map