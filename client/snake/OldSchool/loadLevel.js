import Container from '~/containers/Container';
import Snake from '~/snake/OldSchool/Snake';
import SnakeFood from '~/snake/OldSchool/SnakeFood';
import InvisibleWall from '~/snake/OldSchool/InvisibleWall';

const sizeY = 20, sizeX = 20;
const json = {'className':'RootContainer','gameObjects':[{'className':'Snake','state':{'dir':'right','faceDir':'right','speedDelayBaseValue':30,'speedDelayMinValue':8,'speedDelay':0},'head':{'x':5,'y':5,'texture':'snakeHead','scaleX':1,'scaleY':1,'rotation':1.5708,'visible':true},'body':[{'x':4,'y':5,'texture':'snakeBlock','scaleX':1,'scaleY':1,'rotation':1.5708,'visible':true}],'tail':{'x':3,'y':5,'texture':'snakeTail','scaleX':1,'scaleY':1,'rotation':1.5708,'visible':true}},{'className':'Container','gameObjects':[{'className':'InvisibleWall','state':{'x':0,'y':-1}},{'className':'InvisibleWall','state':{'x':0,'y':20}},{'className':'InvisibleWall','state':{'x':1,'y':-1}},{'className':'InvisibleWall','state':{'x':1,'y':20}},{'className':'InvisibleWall','state':{'x':2,'y':-1}},{'className':'InvisibleWall','state':{'x':2,'y':20}},{'className':'InvisibleWall','state':{'x':3,'y':-1}},{'className':'InvisibleWall','state':{'x':3,'y':20}},{'className':'InvisibleWall','state':{'x':4,'y':-1}},{'className':'InvisibleWall','state':{'x':4,'y':20}},{'className':'InvisibleWall','state':{'x':5,'y':-1}},{'className':'InvisibleWall','state':{'x':5,'y':20}},{'className':'InvisibleWall','state':{'x':6,'y':-1}},{'className':'InvisibleWall','state':{'x':6,'y':20}},{'className':'InvisibleWall','state':{'x':7,'y':-1}},{'className':'InvisibleWall','state':{'x':7,'y':20}},{'className':'InvisibleWall','state':{'x':8,'y':-1}},{'className':'InvisibleWall','state':{'x':8,'y':20}},{'className':'InvisibleWall','state':{'x':9,'y':-1}},{'className':'InvisibleWall','state':{'x':9,'y':20}},{'className':'InvisibleWall','state':{'x':10,'y':-1}},{'className':'InvisibleWall','state':{'x':10,'y':20}},{'className':'InvisibleWall','state':{'x':11,'y':-1}},{'className':'InvisibleWall','state':{'x':11,'y':20}},{'className':'InvisibleWall','state':{'x':12,'y':-1}},{'className':'InvisibleWall','state':{'x':12,'y':20}},{'className':'InvisibleWall','state':{'x':13,'y':-1}},{'className':'InvisibleWall','state':{'x':13,'y':20}},{'className':'InvisibleWall','state':{'x':14,'y':-1}},{'className':'InvisibleWall','state':{'x':14,'y':20}},{'className':'InvisibleWall','state':{'x':15,'y':-1}},{'className':'InvisibleWall','state':{'x':15,'y':20}},{'className':'InvisibleWall','state':{'x':16,'y':-1}},{'className':'InvisibleWall','state':{'x':16,'y':20}},{'className':'InvisibleWall','state':{'x':17,'y':-1}},{'className':'InvisibleWall','state':{'x':17,'y':20}},{'className':'InvisibleWall','state':{'x':18,'y':-1}},{'className':'InvisibleWall','state':{'x':18,'y':20}},{'className':'InvisibleWall','state':{'x':19,'y':-1}},{'className':'InvisibleWall','state':{'x':19,'y':20}},{'className':'InvisibleWall','state':{'x':-1,'y':0}},{'className':'InvisibleWall','state':{'x':20,'y':0}},{'className':'InvisibleWall','state':{'x':-1,'y':1}},{'className':'InvisibleWall','state':{'x':20,'y':1}},{'className':'InvisibleWall','state':{'x':-1,'y':2}},{'className':'InvisibleWall','state':{'x':20,'y':2}},{'className':'InvisibleWall','state':{'x':-1,'y':3}},{'className':'InvisibleWall','state':{'x':20,'y':3}},{'className':'InvisibleWall','state':{'x':-1,'y':4}},{'className':'InvisibleWall','state':{'x':20,'y':4}},{'className':'InvisibleWall','state':{'x':-1,'y':5}},{'className':'InvisibleWall','state':{'x':20,'y':5}},{'className':'InvisibleWall','state':{'x':-1,'y':6}},{'className':'InvisibleWall','state':{'x':20,'y':6}},{'className':'InvisibleWall','state':{'x':-1,'y':7}},{'className':'InvisibleWall','state':{'x':20,'y':7}},{'className':'InvisibleWall','state':{'x':-1,'y':8}},{'className':'InvisibleWall','state':{'x':20,'y':8}},{'className':'InvisibleWall','state':{'x':-1,'y':9}},{'className':'InvisibleWall','state':{'x':20,'y':9}},{'className':'InvisibleWall','state':{'x':-1,'y':10}},{'className':'InvisibleWall','state':{'x':20,'y':10}},{'className':'InvisibleWall','state':{'x':-1,'y':11}},{'className':'InvisibleWall','state':{'x':20,'y':11}},{'className':'InvisibleWall','state':{'x':-1,'y':12}},{'className':'InvisibleWall','state':{'x':20,'y':12}},{'className':'InvisibleWall','state':{'x':-1,'y':13}},{'className':'InvisibleWall','state':{'x':20,'y':13}},{'className':'InvisibleWall','state':{'x':-1,'y':14}},{'className':'InvisibleWall','state':{'x':20,'y':14}},{'className':'InvisibleWall','state':{'x':-1,'y':15}},{'className':'InvisibleWall','state':{'x':20,'y':15}},{'className':'InvisibleWall','state':{'x':-1,'y':16}},{'className':'InvisibleWall','state':{'x':20,'y':16}},{'className':'InvisibleWall','state':{'x':-1,'y':17}},{'className':'InvisibleWall','state':{'x':20,'y':17}},{'className':'InvisibleWall','state':{'x':-1,'y':18}},{'className':'InvisibleWall','state':{'x':20,'y':18}},{'className':'InvisibleWall','state':{'x':-1,'y':19}},{'className':'InvisibleWall','state':{'x':20,'y':19}}]}]};

export default function loadLevel() {

    /*
*/


    return {
        gameObjectClasses: [Snake, SnakeFood, InvisibleWall, Container],
        //topLevelObjects: [snake, snakeFood, wallContainer],
        serializedLevel : json,
        initialGlobalState: {level_size_x: sizeX, level_size_y: sizeY},
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