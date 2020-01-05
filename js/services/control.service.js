import gameModel from '../gameModel.js';
import controls  from '../controls.js';

document.body.addEventListener('keydown', ev => {
    ev.preventDefault();

    const keyCode = ev.code;
    const control = getControl(keyCode);
    if(control) gameModel[control.action](control.options);
    else console.log('no command to exec');
});

function getControl(keyCode) {
    return controls.find(move=> move.keyCode === keyCode);
}