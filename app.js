$(() => {
    // update window on state change
    window.addEventListener('state_change', (e) => {
        let state = e.detail;

        $('#PlayerNamesRow').html("");

        Object.keys(state).forEach(player => {
            $('#PlayerNamesRow').append(`<th>${player}</th>`)
        });
        $('#PlayerPointsBody').html("");
        $('#PlayerPointsBody').append(renderPointsTotal());
        $('#PlayerPointsBody').append(renderPointInput());
        $('#PlayerPointsBody').append(renderPointsBoard());

        $('.AddPointsInput').keyup(e => {
            if (e.keyCode === 13) {
                let player = $(e.target)[0].dataset.player;
                let state = readState();
                state[player].push(parseInt($(e.target).val()));
                setState(state);
            }
        });
        $('.UndoLastInputButton').click(e => {
            let player = $(e.target)[0].dataset.player;
            let state = readState();
            state[player].pop();
            setState(state);
        });
    });

    $('#AddPlayerButton').click(() => {
        let state = readState();
        let newPlayer = $('#AddPlayerInput').val().trim();

        state[newPlayer] = [];
        $('#AddPlayerInput').val("");
        setState(state);
    });

    $('#RemovePlayerButton').click(() => {
        let state = readState();
        delete state[Object.keys(state).pop()];
        setState(state);
    });

    $('#ResetGameButton').click(() => {
        localStorage.removeItem('state');
        window.dispatchEvent(new CustomEvent('state_change', { detail: readState() }));    
    });
    $('#NewGameButton').click(() => {
        let state = readState();
        Object.keys(state).forEach(player => {
            state[player] = [];
        });

        setState(state);
    });

    // once listeners are set, trigger ui.
    window.dispatchEvent(new CustomEvent('state_change', { detail: readState() }));
});

function readState () {
    let stateString = localStorage.getItem('state') || `{"Alice": [500, 1000], "Bob": [500], "Foo": [550]}`;
    return JSON.parse(stateString);
}
function setState (state) {
    let stateString = JSON.stringify(state);
    localStorage.setItem('state', stateString);
    window.dispatchEvent(new CustomEvent('state_change', { detail: state }));
}

function renderPointInput() {
    let html = "<tr>";
    let state = readState();
    
    Object.keys(state).forEach(player => {
        html += "<td>";
        html += `<div class="input-group mb-3">`;
        html += `<input type="number" data-player="${player}" class="form-control AddPointsInput" placeholder="Add Points Here">`;
        html += `<div class="input-group-append">`;
        html += `<button type="button" class="btn btn-warning UndoLastInputButton" data-player="${player}">Undo</button>`
        html += `</div>`
        html += `</div>`;
        html += "</td>";
    });

    html += "</tr>"
    return html;
}

function renderPointsTotal() {
    let html = "<tr>";
    let state = readState();
    
    Object.keys(state).forEach(player => {
        html += `<td><b>Total: ${_.sum(state[player])}</b></td>`
    });
    html += "</tr>";

    return html;
}

function renderPointsBoard() {
    let html = '';
    Object.keys(readState()).forEach(player => {
        html += renderPointsListForPlayer(player);
    });

    return html;
}

function renderPointsListForPlayer(playerName) {
    let html = `<td><ul class="list-group">`;
    let state = readState();
    _.reverse(state[playerName]).forEach(point => {
        html += `<li class="list-group-item">${point}</li>`;
    });
    html += '</ul></td>'

    return html;
}