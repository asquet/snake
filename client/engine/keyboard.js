//TODO refactor to single listener and switch-case
export default function keyboard(keyCode) {
    let key = {
        code : keyCode,
        isDown : false,
        press : undefined,
        release : undefined
    };

    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (!key.isDown && key.press) key.press();
            key.isDown = true;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            event.preventDefault();
        }

    };

    return key;
}
