import Container from '~/containers/Container';
import Snake from '~/snake/OldSchool/Snake';
import SnakeFood from '~/snake/OldSchool/SnakeFood';
import InvisibleWall from '~/snake/OldSchool/InvisibleWall';
import RemoteSnake from '~/snake/multiplayer/RemoteSnake';
import RemoteSnakeFood from '~/snake/multiplayer/RemoteSnakeFood';

const sizeY = 20, sizeX = 20;

export default function loadLevel(state, isServer, playerSelf) {

    let topLevelObjets;
    if (isServer) {
        let wallContainer = new Container();
        for (let i = 0; i < sizeX; i++) {
            wallContainer.addGameObject(new InvisibleWall({x: i, y: -1}));
            wallContainer.addGameObject(new InvisibleWall({x: i, y: sizeY}));
        }
        for (let j = 0; j < sizeY; j++) {
            wallContainer.addGameObject(new InvisibleWall({x: -1, y: j}));
            wallContainer.addGameObject(new InvisibleWall({x: sizeX, y: j}));
        }

        topLevelObjets = [wallContainer];
    }

    let wallContainer = new Container();
    for (let i = 0; i < sizeX; i++) {
        wallContainer.addGameObject(new InvisibleWall({x: i, y: -1}));
        wallContainer.addGameObject(new InvisibleWall({x: i, y: sizeY}));
    }
    for (let j = 0; j < sizeY; j++) {
        wallContainer.addGameObject(new InvisibleWall({x: -1, y: j}));
        wallContainer.addGameObject(new InvisibleWall({x: sizeX, y: j}));
    }
    if (state) {//TODO need a better way to replace foreign snakes with placeholders
        state = JSON.stringify(state);
        state = state.replace(/["|']Snake["|']/g, '"RemoteSnake"');
        state = state.replace(/["|']SnakeFood["|']/g, '"RemoteSnakeFood"');
        state = JSON.parse(state);
    }
    return {
        gameObjectClasses: [Snake, RemoteSnake, SnakeFood, RemoteSnakeFood, InvisibleWall, Container],
        topLevelObjects: topLevelObjets,
        serializedLevel: state,
        initialGlobalState: {level_size_x: sizeX, level_size_y: sizeY},
        personalGlobalState: {player: playerSelf, isServer},
        canvasSize: {sizeX: sizeX * 10, sizeY: sizeY * 10},
        drawCfg: {
            positionCfg: {
                scaleX: 10,
                scaleY: 10,
                offsetX: 5,
                offsetY: 5
            }
        }
    };
}