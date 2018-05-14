let gameEvents = {
    render: new Event('render'),
    init: new Event('init'),
    readyForAction: new Event('readyForAction'),
    focuse: new Event('focused'),
    unfocuse: new Event('unfocuse')
};

export default gameEvents;