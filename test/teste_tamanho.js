const chai = require('chai');
const expect = chai.expect;
const tamanhoCantor = require('../tamanho');
const tamanhoMusica = require('../tamanho');

describe('Tamanho dos textos', () => {
    it('Nome do cantor deve ser menor que a opinião', ()=>{
        const resultado = tamanhoCantor('A opinião sobre a música é essa!', 'Cantor1');
        expect(resultado).to.equal(op > cantor);
    });

    it('Nome da música deve ser Menor que a opinião', ()=>{
        const resultado = tamanhoMusica('A opinião sobre a música é essa!', 'Musica1');
        expect(resultado).to.equal(op > musica);
    });

})