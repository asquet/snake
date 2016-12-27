import GameRunner from './GameRunner';
import RemoteGameRunner from './RemoteGameRunner';
import PIXI from '~/pixi';
import RootContainer from '~/containers/RootContainer';
import UserInput from '~/engine/UserInput';

function setupRenderer(canvas, {sizeX = 100, sizeY = 100}) {
    const renderer = PIXI.autoDetectRenderer(sizeX, sizeY, {view: canvas});

    //TODO replace with loading background in loadLevel
    renderer.backgroundColor = 0x96C819;

    return renderer;
}

function loadResources(gameObjectClasses) {
    return new Promise(function (resolve) {
        const texturesMap = gameObjectClasses.reduce((res, ro) => {
            for (let i of Object.keys(ro.imagesUsed)) {
                if (res[i] && res[i] !== ro.imagesUsed[i]) {
                    throw new Error(`Name ${i} is already used and values differ: "${res[i]}" and "${ro.imagesUsed[i]}" `);
                } else {
                    res[i] = ro.imagesUsed[i];
                }
            }
            return res;
        }, {});

        const loader = Object.keys(texturesMap).reduce((loader, key) => {
            if (!PIXI.loader.resources[key]) {
                return loader.add(key, texturesMap[key]);
            } else {
                return loader;
            }
        }, PIXI.loader
        );

        loader.load(resolve);
    });
}



function loadObjects(rootContainer, topLevelObjects, serializedLevel) {
    if (topLevelObjects.length > 0) {
        topLevelObjects.forEach(obj => rootContainer.addGameObject(obj));
    }
    if (serializedLevel) {
        rootContainer.loadSerializedLevel(serializedLevel);
    }
}
export default function gameSetup({gameObjectClasses = [], topLevelObjects = [], serializedLevel, initialGlobalState = {}, drawCfg = {}, canvasSize, personalGlobalState},
    owner, window, canvas, remote) {
    let renderer = setupRenderer(canvas, canvasSize);

    let stage = new PIXI.Container();

    const classesByName = gameObjectClasses.reduce((res, clazz) => {
        res[clazz.name] = clazz;
        return res;
    }, {});
    let rootContainer = new RootContainer(stage, classesByName);

    let userInput = new UserInput(['left arrow', 'up arrow', 'right arrow', 'down arrow', 'escape', 'space'], window);

    return loadResources(gameObjectClasses).then(() => {
        loadObjects(rootContainer, topLevelObjects, serializedLevel);

        if (remote) {
            return new RemoteGameRunner({renderer, rootContainer, userInput, globalState: initialGlobalState, drawCfg, personalGlobalState}, owner, remote);
        } else {
            return new GameRunner({renderer, rootContainer, userInput, globalState: initialGlobalState, drawCfg, personalGlobalState}, owner);
        }
    });
}