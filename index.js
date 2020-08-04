import { promises as fs } from 'fs';
import { stringify } from 'querystring';

async function getGames() {
    try {
        
        const championship = JSON.parse(await fs.readFile('./Dados-Campeonatos/2006.json'));
        const team = [];
    
        championship[0].partidas.forEach((game) => {
            team.push({ team: game.mandante, score: 0 });
            team.push({ team: game.visitante, score: 0 });
        });
    
        championship.forEach((allGames) => {
            allGames.partidas.forEach((game) => {
                const firstTeam = team.find(item => item.team === game.mandante);
                const secondTeam = team.find(item => item.team === game.visitante);
    
                if(game.placar_mandante > game.placar_visitante){
                    firstTeam.score += 3;
                } else if(game.placar_visitante > game.placar_mandante){
                    secondTeam.score += 3;
                } else {
                    firstTeam.score += 1;
                    secondTeam.score += 1;
                }
            });
        });
    
        //Classificação geral salva em um arquivo txt separado.
        team.sort((a,b) => b.score - a.score);
        fs.writeFile('Classificação Campeonato.txt', JSON.stringify(team, null, 2));

        //Classificados para a Copa Libertadores.
        const libertadores = team.slice(0,4);
        
        //Rebaixados para a Serie B.
        const rebaixados = team.slice(16,20);

        console.log(libertadores, rebaixados);
    } catch (err) {
        console.log(err);
    }
}

getGames()