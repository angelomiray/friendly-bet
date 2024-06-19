class Bet {
    constructor({ title, roomId, type, option1, option2, option3, option4, option5 }) {
        this.title = title;
        this.roomId = roomId;
        this.type = type;
        this.status = true; // OPEN
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.option5 = option5;
        //faltou adicionar uma lista de entidade com (apostador, opcao escolhida, valor apostado)
    }

}
