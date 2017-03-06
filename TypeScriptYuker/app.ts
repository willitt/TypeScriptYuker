interface PlayingCard {
    suit: string;
    value: number;
}

class Card implements PlayingCard {
    suit: string;
    value: number;
    constructor(suit: string, value: number) {
        this.suit = suit;
        this.value = value;
    }
}

class PlayedCard implements PlayingCard {
    suit: string;
    value: number;
    playedBy: Player;
    constructor(card: Card, playedBy: Player) {
        this.suit = card.suit;
        this.value = card.value;
        this.playedBy = playedBy;
    }
}

class Player {
    hand: Array<Card>;
    team: Team;
    playerNum: number;
    isComputer: boolean;
    constructor(team: Team, isComputer: boolean, playerNum: number) {
        this.team = team;
        this.playerNum = playerNum;
        this.isComputer = isComputer;
        this.hand = [];
    }
    setTeam(team: Team) {
        this.team = team;
    }
    addCard(card: Card) {
        this.hand.push(card);
    }
    playCard(card: Card) {
        return this.hand.splice(this.hand.indexOf(card), 1)[0];
    }
    playHighestOffSuit(trump: string) {
        var cardToPlay: Card = null;
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
    }
    playLowestOffSuit(trump: string) {
        var cardToPlay: Card = null;
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
    }
    setTrump(card: Card) {

    }
    playerTurn(cardsInPlay: Array<PlayedCard>, winningCard: Card, trumpForRound: string, suitForRound: string) {
        var promptStatement: string = "";
        promptStatement += "Player " + this.playerNum + " for Team: " + this.team.teamNumber + " Turn\n";
        if (cardsInPlay.length > 0) {
            promptStatement += "Cards In Play: \n";
            promptStatement += generalFunctions.createCardStringArray(cardsInPlay);
        }
        promptStatement += "Suit for Round: " + suitForRound + "\n";
        promptStatement += "Trump for round: " + trumpForRound + "\n";
        promptStatement += "Cards In Hand: \n";
        promptStatement += this.createPlayerOptions(this.hand);
        promptStatement += "Enter the number of the card you would like to play";
        var playerInput: string = prompt(promptStatement),
            playerSelectedNum: number = parseInt(playerInput);

        if (isNaN(playerSelectedNum) || playerSelectedNum > this.hand.length || playerSelectedNum < 0) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            return this.playerTurn(cardsInPlay, winningCard, trumpForRound, suitForRound);
        }
        else {
            return this.hand.splice(playerSelectedNum, 1)[0];
        }
    }
    playerDiscard(cardForTrump: PlayingCard) {
        var promptStatement: string = "Greetings Player " + this.playerNum + "\n Card Received: " + generalFunctions.mapValueToCardName(cardForTrump) + " of " + cardForTrump.suit + "\n";
        promptStatement += "Select Card from hand to discard \n";
        promptStatement += this.createPlayerOptions(this.hand);
        var playerSelectedNum = parseInt(prompt(promptStatement));
        if (isNaN(playerSelectedNum) || playerSelectedNum < 0 || playerSelectedNum > this.hand.length) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerDiscard(cardForTrump);
        }
        else {
            this.hand.splice(playerSelectedNum, 1);
        }
    }
    playerSelectTrumpFirstPass(cardForTrump: Card, playerToReceiveNum: number, playerToReceive: Player) {
        var promptStatement = "Greetings Player " + this.playerNum + " on Team " + this.team.teamNumber + "\nCards In Hand: \n";
        promptStatement += generalFunctions.createCardStringArray(this.hand);
        promptStatement += "Card To Determine Trump: " + generalFunctions.mapValueToCardName(cardForTrump) + " of " + cardForTrump.suit + "\n";
        promptStatement += "Player to Receive Card: " + "Player " + playerToReceive.playerNum + " on Team " + playerToReceive.team.teamNumber + "\n";
        promptStatement += "Enter 1 to set card as trump enter 0 to pass";
        var playerInput: string = prompt(promptStatement),
            playerSelectedNum: number = parseInt(playerInput);
        if (isNaN(playerSelectedNum) || playerSelectedNum !== 0 && playerSelectedNum !== 1) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerSelectTrumpFirstPass(cardForTrump, playerToReceiveNum, playerToReceive);
        }
        else {
            return playerSelectedNum;
        }
    }
    playerSelectTrumpSecondPass(cardForTrump: Card) {
        var promptStatement: string = "Greetings Player " + this.playerNum + "\n Cards In Hand: \n";
        promptStatement += generalFunctions.createCardStringArray(this.hand);
        promptStatement += "Select number to set trump suit \n";
        var suits: Array<Suit> = [new Suit("clubs", 0), new Suit("spades", 1), new Suit("hearts", 2), new Suit("diamonds", 3)],
            availableSuitNums: Array<number> = [];
        var num: number = 1;
        suits.forEach(function (suit) {
            if (suit.name !== cardForTrump.suit) {
                promptStatement += suit.value + " - " + suit.name + "\n";
                availableSuitNums.push(suit.value);
            }
        });
        var playerInput: string = prompt(promptStatement),
            playerSelectedNum: number = parseInt(playerInput);
        if (playerSelectedNum === 4) {
            return null;
        }
        else if (isNaN(playerSelectedNum) || availableSuitNums.indexOf(playerSelectedNum) === -1 && playerSelectedNum !== 4) {
            alert("INVALID SELECTION PLEASE SELECT AGAIN");
            this.playerSelectTrumpSecondPass(cardForTrump);
        }
        else {
            var selectedSuit: string;
            suits.forEach(function (availableSuit) {
                if (availableSuit.value === playerSelectedNum) {
                    selectedSuit = availableSuit.name;
                }
            });
            return selectedSuit;
        }
    }
    createPlayerOptions(cards: Array<PlayingCard>) {
        var cardsString: String = "";
        cards.forEach(function (card, index) {
            cardsString += index.toString() + " - Card: " + generalFunctions.mapValueToCardName(card) + " of " + card.suit + "\n";
        });
        return cardsString;
    }
}

class Team {
    teamNumber: number;
    points: number;
    tricksWon: number;
    setTrump: boolean;
    wentAlone: boolean;

    constructor(teamNumber: number, points: number) {
        this.teamNumber = teamNumber;
        this.points = points;
        this.tricksWon = 0;
        this.setTrump = false;
    }
    incrementTricksWon() {
        this.tricksWon++;
    }
    teamSetTrump() {
        this.setTrump = true;
    }
    clearForRound() {
        this.setTrump = false;
        this.tricksWon = 0;
    }
    addPoints(points: number) {
        this.points += points;
    }
    clear() {
        this.setTrump = false;
        this.tricksWon = 0;
        this.points = 0;
        this.tricksWon = 0;
    }
}

class ComputerPlayer {
    hand: Array<number>;
    team: number;

    constructor(team: number) {
        this.team = team;
        this.hand = [];
    }
}

class Suit {
    name: string;
    value: number;
    //offSuit: string;
    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
        //this.offSuit = offSuit;
    }
}

class Deck {
    cards: Array<Card>;
    constructor() {
        this.initDeck();
    }
    initDeck() {
        var suits: Array<string> = ["Clubs", "Spades", "Hearts", "Diamonds"],
            self = this;
        this.cards = [];
        suits.forEach(function (suit) {
            for (var i = 0; i < 6; i++) {
                self.cards.push(new Card(suit, i));
            }
        });
    }
    shuffleDeck() {
        var newDeck: Array<Card> = [];
        var oldDeck: Array<Card> = this.cards;

        while (oldDeck.length > 0) {
            var randCard = Math.floor(Math.random() * oldDeck.length);
            newDeck.push(oldDeck.splice(randCard, 1)[0]);
        }

        this.cards = newDeck;
    }
    takeCard() {
        return this.cards.pop();
    }
}

class YukerGame {
    public deck: Deck;
    public players: Array<Player>;
    public cardsInPlay: Array<PlayedCard>;
    public winningCard: PlayedCard;
    public team1: Team;
    public team2: Team;
    public currentTurn: number;
    public startingTurn: number;
    public isFirstRound: boolean;
    public suitForRound: string;
    public cardForTrump: Card;
    public numRounds: number;
    public numTricks: number;

    constructor() {
        this.deck = new Deck();
        this.players = [new Player(this.team1, false, 1), new Player(this.team2, false, 2), new Player(this.team1, false, 3), new Player(this.team2, false, 4)];
    }

    beginGame() {
        this.currentTurn = Math.floor(Math.random() * 4);
        this.startingTurn = this.currentTurn + 1;
        this.team1 = new Team(1, 0);
        this.team2 = new Team(2, 0);
        this.numRounds = 0;
        this.numTricks = 0;
        this.players[0].setTeam(this.team1);
        this.players[1].setTeam(this.team2);
        this.players[2].setTeam(this.team1);
        this.players[3].setTeam(this.team2);
        this.beginRound();
    }

    beginRound() {
        this.numRounds++;
        this.cardsInPlay = [];
        this.winningCard = null;
        this.deck.initDeck();
        this.deck.shuffleDeck();
        this.currentTurn = (this.currentTurn + 1) % 4;
        this.startingTurn = (this.startingTurn + 1) % 4;
        this.dealCards();
        this.determineTrump();
        this.playRound();
    }

    playRound() {
        for (var j: number = 0; j < 5; j++) {
            for (var i: number = 0; i < 4; i++) {
                var playerTurn: number = (this.startingTurn + i) % 4,
                    currentPlayer: Player = this.players[playerTurn],
                    cardPlayed: PlayedCard;
                if (currentPlayer.isComputer === true) {
                    this.computerPlayerTurn(currentPlayer);
                }
                else {
                    cardPlayed = new PlayedCard(currentPlayer.playerTurn(this.cardsInPlay, this.winningCard, this.cardForTrump.suit, this.suitForRound), currentPlayer);
                    this.cardsInPlay.push(cardPlayed);
                    if (i === 0) this.suitForRound = cardPlayed.suit;
                    this.determineWinningCard(this.cardsInPlay);
                }

            }
            this.numTricks++;
            this.winningCard.playedBy.team.incrementTricksWon();
            this.declareTrickWinner(this.winningCard);
            this.cardsInPlay = [];
            this.startingTurn = this.players.indexOf(this.winningCard.playedBy);
        }
        this.numTricks = 0;
        this.determineTeamPoints(this.team1);
        this.determineTeamPoints(this.team2);
        if (this.team1.points < 10 && this.team2.points < 10) {
            this.displayCurrentStats();
            this.team1.clearForRound();
            this.team2.clearForRound();
            this.beginRound();
        }
        else {
            this.displayVictor();
            this.team1.clear();
            this.team2.clear();
            this.beginGame();
        }
    }

    determineWinningCard(cards: Array<PlayedCard>) {
        var winningCard: PlayedCard = cards[0],
            suitForRound: string = cards[0].suit,
            self = this;

        for (var index = 1; index < cards.length; index++) {
            var card = cards[index];
            if (winningCard.suit === self.cardForTrump.suit && card.suit === self.cardForTrump.suit) {
                if (card.value > winningCard.value) {
                    winningCard = card;
                }
            }
            else if (card.suit === self.cardForTrump.suit) {
                winningCard = card;
            }
            else if (winningCard.suit === suitForRound && card.suit === suitForRound && card.value > winningCard.value) {
                winningCard = card;
            }
        }

        this.winningCard = winningCard;
    }

    determineTeamPoints(team: Team) {
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
    }

    declareTrickWinner(winningCard: PlayedCard) {
        var displayMessage: string = "";
        displayMessage += "Trick number " + this.numTricks + " won by Team " + winningCard.playedBy.team.teamNumber + "\n";
        displayMessage += "With the " + generalFunctions.mapValueToCardName(winningCard) + " of " + winningCard.suit + "\n";
        displayMessage += "Played by Player" + winningCard.playedBy.playerNum;
        alert(displayMessage);
    }

    displayCurrentStats() {
        var displayMessage: string = "End of round " + this.numRounds + "\n";
        displayMessage += "Team 1 Points: " + this.team1.points + "\n";
        displayMessage += "Team 2 Points: " + this.team2.points;
        alert(displayMessage);
    }

    displayVictor() {
        var displayMessage: string,
            victor: Team,
            loser: Team;
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
    }

    dealCards() {
        var self = this;
        for (var i = 0; i < 5; i++) {
            this.players.forEach(function (player) {
                player.addCard(self.deck.takeCard());
            });
        }
    }

    determineTrump() {

        this.cardForTrump = this.deck.takeCard();
        for (var i: number = 1; i < this.players.length + 1; i++) {
            var playerTurn: number = (this.currentTurn + i) % 4,
                currentPlayer: Player = this.players[playerTurn],
                dealer: Player = this.players[this.currentTurn];
            if (currentPlayer.isComputer) {
                //write logic for computer player
                currentPlayer.setTrump(this.cardForTrump);
            }
            else {
                var playerTrumpChoice = currentPlayer.playerSelectTrumpFirstPass(this.cardForTrump, this.currentTurn, dealer);
                if (playerTrumpChoice) {
                    this.players[this.currentTurn].addCard(this.cardForTrump);
                    this.players[this.currentTurn].playerDiscard(this.cardForTrump);
                    currentPlayer.team.teamSetTrump();
                    this.suitForRound = this.cardForTrump.suit;
                    this.modifyCardsForTrump();
                    return true;
                }
            }
        }
        for (var i: number = 1; i < this.players.length + 1; i++) {
            var playerTurn: number = (this.currentTurn + i) % 4,
                currentPlayer: Player = this.players[playerTurn],
                dealer: Player = this.players[this.currentTurn];
            if (currentPlayer.isComputer) {
                currentPlayer.setTrump(this.cardForTrump);
            }
            else {
                var playerTrumpChoiceRound2: string = currentPlayer.playerSelectTrumpSecondPass(this.cardForTrump);
                if (playerTrumpChoiceRound2 !== null) {
                    this.suitForRound = this.cardForTrump.suit;
                    currentPlayer.team.teamSetTrump();
                    return true;
                }
            }
        }
    }

    modifyCardsForTrump() {
        this.players.forEach((player) => {
            player.hand.forEach((card) => {
                this.adjustForTrump(card);
            });
        });
    }

    adjustForTrump(card: Card) {
        if (card.value === 2 && card.suit === this.suitForRound) {
            card.value = 7;
        }
        else if (card.value === 2 && generalFunctions.mapToCorrespondingSuit(card.suit) === this.suitForRound) {
            card.value = 6;
        }
    }

    computerPlayerTurn(currentPlayer: Player) {
        if (this.winningCard === null) {
            currentPlayer.playHighestOffSuit(this.suitForRound);
        }
    }
}

class YukerGeneralFunctions {
    constructor() {
    }
    createCardStringArray(cards: Array<PlayingCard>) {
        var cardsString: String = "";
        cards.forEach(function (card) {
            cardsString += "Card: " + generalFunctions.mapValueToCardName(card) + " of " + card.suit + "\n";
        });
        return cardsString;
    }

    createPlayerCardStringArray(cards: Array<PlayedCard>) {
        var cardsString: String = "";
        cards.forEach(function (card) {
            cardsString += "Card: " + generalFunctions.mapValueToCardName(card) + " of " + card.suit + " played by " + card.playedBy.team + "\n";
        });
        return cardsString;
    }

    mapToCorrespondingSuit(suit: string) {
        switch (suit) {
            case "Spades":
                return "Clubs";
            case "Clubs":
                return "Spades";
            case "Hearts":
                return "Diamonds";
            case "Diamonds":
                return "Hearts";
        }
    }

    mapValueToCardName(card: PlayingCard) {
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
    }
}
var generalFunctions: YukerGeneralFunctions = new YukerGeneralFunctions();
var yuker = new YukerGame();
yuker.beginGame();