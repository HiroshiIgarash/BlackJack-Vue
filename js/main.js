new Vue({
    el: "#app",
    data: {
        deck: [],
        dealerCards: [],
        playerCards: [],
        splitCards: [],
        state: 0, //0:ディーラーのカード非公開　1:公開
        split: 0,
        histories: [],
        double: false,
        money: 1000,
        bet: 100,
        gameover: false,
    },
    computed: {
        displaySuit: function (suit) {
            switch (suit) {
                case 1: { return "♠️"; break; }
                case 2: { return "❤️"; break; }
                case 3: { return "♦️"; break; }
                case 4: { return "♣️"; break; }
                default: { return suit; break }
            }
        },
        displayNumber: function (number) {
            switch (number) {
                case 1: { return "A"; break; }
                case 11: { return "J"; break; }
                case 12: { return "Q"; break; }
                case 13: { return "K"; break; }
                default: { return number; break }
            }
        },
        cardColor: function () {
            return function (suit) {
                switch (suit) {
                    case 1: { return "black"; break; }
                    case 2: { return "red"; break; }
                    case 3: { return "blue"; break; }
                    case 4: { return "green"; break; }
                }
            }
        },
        count: function () {
            return function (cards) {
                let aceCount = 0;

                a = cards.reduce((prev, cur) => {
                    // console.log(prev)
                    switch (true) {
                        case cur.number > 10: { return prev + 10; break; }
                        case cur.number > 1: { return prev + cur.number; break; }
                        case cur.number == 1: { aceCount++; return prev + 1; break }
                    }
                }, 0)
                if (a > 21) {
                    if (this.split == 0) this.state = 1;
                    return "Burst!"
                }
                else if (aceCount > 0) {
                    for (let i = 0; i < aceCount; i++) {
                        if (a + 10 < 22) a = a + 10
                        else break;
                    }
                }
                if (a == 21) {
                    if (this.split == 0) this.state = 1;
                    return "Black Jack!!";
                } else return a;


            }
        },
        judge: function () {
            if (this.state == 0 || this.split != 0) return
            let dealer = this.count(this.dealerCards)
            let player = this.count(this.playerCards)
            if (player == "Burst!") {
                player = 0;
            } else if (player == "Black Jack!!") {
                player = 21;
            }
            if (dealer == "Burst!") {
                dealer = 0;
            } else if (dealer == "Black Jack!!") {
                dealer = 21;
            }

            if (player == 0 || dealer > player) {
                setTimeout(() => {
                    if (this.money < this.bet) {
                        this.gameover = true;
                        alert("あなたは破産してしまいました...")
                    }
                }, 0)
                return "あなたの負け..."
            } if (player == 21 && this.playerCards.length == 2) {
                this.money += this.bet * 2.5
                return "ナイスブラックジャック！！！"
            } else if (dealer < player) {
                this.money += this.bet * 2
                return "あなたの勝ち！！！"
            } else if (dealer == player) {
                this.money += this.bet
                return "引き分けです"
            } else return "エラー"
        },
        isSplit: function () {
            if (this.playerCards.length == 2) {
                let card1 = this.playerCards[0].number
                let card2 = this.playerCards[1].number

                return card1 == card2 || card1 >= 10 && card2 >= 10
            }
        },
        splitJudge: function () {
            return function (cards) {
                if (this.state == 0 || this.split != 2) return
                let dealer = this.count(this.dealerCards)
                let player = this.count(cards)
                if (player == "Burst!") {
                    player = 0;
                } else if (player == "Black Jack!!") {
                    player = 21;
                }
                if (dealer == "Burst!") {
                    dealer = 0;
                } else if (dealer == "Black Jack!!") {
                    dealer = 21;
                }

                // [this.playerCards,this.splitCards].map((cards)=>{
                //     if(dealer<this.count(cards)){
                //         this.money+=this.bet*2
                //     }else if (dealer == this.count(cards)) {
                //         this.money += this.bet
                //     }
                // })

                // this.split==0
                if (player == 0) {
                    return "あなたの負けです..."
                } else if (dealer < player) {
                    //  this.money += this.bet * 2
                    return "あなたの勝ち！！！"
                } else if (dealer == player) {
                    //  this.money += this.bet
                    return "引き分けです"
                } else return "あなたの負けです..."
            }
        }


    },//computed







    mounted() {
        this.init()
    },
    methods: {
        init: function () {
            this.deck = [];
            this.dealerCards = [];
            this.playerCards = [];
            this.splitCards = [];
            this.double = false;
            this.split = 0;
            this.createDeck();
            this.shuffle();
            this.state = 0;
            this.bet = 100;
            this.money -= this.bet
            setTimeout(() => this.hit("dealer"), 0);
            setTimeout(() => this.hit("player"), 500);
            setTimeout(() => this.hit("dealer"), 1000);
            setTimeout(() => this.hit("player"), 1500);

        },
        newGame: function () {
            if(this.judge!=undefined){
            this.histories.push(this.judge + "(" + this.money + ")")
            }else this.histories.push("スプリット(" + this.money + ")")
            this.init();
        },
        createDeck: function () {
            for (let i = 1; i <= 13; i++) {
                switch (i) {
                    case 1: { disNumber = "A"; break; }
                    case 11: { disNumber = "J"; break; }
                    case 12: { disNumber = "Q"; break; }
                    case 13: { disNumber = "K"; break; }
                    default: { disNumber = i; break }
                }
                for (let j = 1; j <= 4; j++) {
                    switch (j) {
                        case 1: { disSuit = "♠️"; break; }
                        case 2: { disSuit = "❤︎"; break; }
                        case 3: { disSuit = "♦︎"; break; }
                        case 4: { disSuit = "♣️"; break; }
                        default: { disSuit = j; break }
                    }

                    this.deck.push({
                        number: i,
                        suit: j,
                        disNumber: disNumber,
                        disSuit: disSuit,
                    })
                }
            }
        },

        shuffle: function () {
            for (let i = 0; i < 52; i++) {
                let tmp = this.deck[i];
                let rand = Math.floor(Math.random() * 52);
                this.deck[i] = this.deck[rand];
                this.deck[rand] = tmp;
            }
        },

        hit(toHit) {
            if (this.state == 1) return;
            //console.log(this.deck[0])
            if (toHit == "dealer") {
                if (this.count(this.dealerCards) < 21) {
                    this.dealerCards.push(this.deck[0]);
                }
            } else if (toHit == "player") {
                if (this.count(this.playerCards) < 21) {
                    this.playerCards.push(this.deck[0]);
                } else return;
            }

            this.deck.shift();
        },

        onHit: function () {
            this.double = true;
            this.hit("player");
            if (this.split == 1 && !(this.count(this.playerCards) < 21)) {
                this.splitChange();
            } else if (this.split == 2 && !(this.count(this.playerCards) < 21)) {
                while (this.count(this.dealerCards) < 17) {
                    this.hit("dealer")
                }
                this.state = 1;

            }
        },

        splitChange: function () {
            //スプリット中かつ合計が21orburst

            setTimeout(() => {
                tmp = this.playerCards
                this.playerCards = this.splitCards
                this.splitCards = tmp
                this.split = 2;
                this.onHit();
            }, 500)


        },
        stand: function () {
            if (this.split == 0 || this.split == 2) {
                while (this.count(this.dealerCards) < 17) {
                    this.hit("dealer")
                }
                this.state = 1;
            } else if (this.split == 1) {
                this.splitChange();

            }
            if (this.split == 2) {
                //console.log(this.splitJudge(this.playerCards))
                switch (this.splitJudge(this.playerCards)) {
                    case "あなたの勝ち！！！": {
                        console.log("p-win")
                        this.money += this.bet * 2
                        break;
                    }
                    case "引き分けです": {
                        console.log("p-wake")
                        this.money += this.bet
                        break;
                    }
                }
                switch (this.splitJudge(this.splitCards)) {
                    case "あなたの勝ち！！！": {
                        console.log("s-win")
                        this.money += this.bet * 2
                        break;
                    }
                    case "引き分けです": {
                        console.log("s-wake")
                        this.money += this.bet
                        break;
                    }
                }
            }
        },

        doubleDown: function () {
            this.double = true;
            this.money -= this.bet;
            this.bet *= 2
            this.hit("player");
        },

        onSplit: function () {
            this.split = 1
            this.money -= this.bet
            this.splitCards.push(this.playerCards[1])
            this.playerCards.splice(1, 1);
            this.onHit()
        },
    },
})