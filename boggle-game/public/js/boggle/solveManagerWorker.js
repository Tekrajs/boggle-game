/*
Boggle Solver
Created by by Kory Becker
http://primaryobjects.com
2/16/2017
*/

var SolveManager = {

    // Returns all valid words in a Boggle game.
    solve: function (board, callback) {
        var result = [];

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[0].length; x++) {
                if (callback) {
                    callback({
                        status: 'Solving position ' + x + ', ' + y + ' (' + board[y][x] + ')',
                        results: result.sort(function (a, b) {
                            return b.score - a.score
                        })
                    });
                }

                let words = SolveManager.solvePosition(board, x, y, callback);
                result = result.concat(words);
            }
        }

        self.postMessage({
            status: 'Complete!', done: true, results: result.sort(function (a, b) {
                return b.score - a.score
            })
        });
        self.close();
    },

    // Returns all valid words from a starting point on the board.
    solvePosition: function (board, x, y, callback) {
        let result = [];
        let iteration = 0;

        // Create a root node for our starting letter.
        let root = {val: board[y][x], x: x, y: y, children: [], used: [], length: 1, string: board[y][x]};
        root.used[y + ',' + x] = 1;

        // Add the root to the fringe.
        let fringe = [root];

        // Loop over the fringe for as long as there are child paths to explore.
        let current = fringe.pop();
        while (current) {
            // Find all adjacent tiles.
            current = SolveManager.adjacent(board, current.x, current.y, current);

            // Go through each child path and check if it's valid, a solution, or should stop exploring further on this path.
            for (let i = 0; i < current.children.length; i++) {
                let node = current.children[i];

                // Check if the path is at least 3 letters long.
                if (node.key && node.key.length >= 3) {
                        // Check if the entire word is a dictionary term.
                        let word = current.children[i].string;

                            result.push({word: word});
                            if (callback) {
                                callback({
                                    status: 'Found ' + current.children[i].string,
                                    result: {word: word}
                                });
                            }
                }
                // Add this node to be explored.
                fringe.push(node);
            }

            current = fringe.pop();
        }

        return result;
    },

    copy: function (used) {
        var copy = [];

        for (var prop in used) {
            // Make sure the object has this value, and not its prototype.
            if (used.hasOwnProperty(prop)) {
                copy[prop] = used[prop];
            }
        }

        return copy;
    },

    createNode: function (board, x, y, head) {
        // Create a new node for this letter.
        let node = {
            val: board[y][x],
            x: x,
            y: y,
            children: [],
            used: SolveManager.copy(head.used),
            length: head.length + 1,
            key: head.key
        };

        // Set this letter as visited for this path.
        node.used[y + ',' + x] = 1;

        // Set the chain of letters (word) up to this point.
        node.string = head.string + node.val;

        // If we've reached at least 3 letters, assign it as a key into the dictionary.
        if (node.string.length === 3) {
            node.key = node.string;
        }

        return node;
    },

    // Returns adjacent letters of the specific letter.
    adjacent: function (board, x, y, head) {
        let width = board[0].length;
        let height = board.length;

        // Add all adjacent letters as child nodes.

        if (x-1 > -1 && !head.used[y + ',' + (x-1)]) {
            head.children.push(SolveManager.createNode(board, x-1, y, head));
        }
        if (x+1 < width && !head.used[y + ',' + (x+1)]) {
            head.children.push(SolveManager.createNode(board, x+1, y, head));
        }
        if (y-1 > -1 && !head.used[(y-1) + ',' + x]) {
            head.children.push(SolveManager.createNode(board, x, y-1, head));
        }
        if (y+1 < height && !head.used[(y+1) + ',' + x]) {
            head.children.push(SolveManager.createNode(board, x, y+1, head));
        }
        if (x-1 > -1 && y-1 > -1 && !head.used[(y-1) + ',' + (x-1)]) {
            head.children.push(SolveManager.createNode(board, x-1, y-1, head));
        }
        if (x-1 > -1 && y+1 < height && !head.used[(y+1) + ',' + (x-1)]) {
            head.children.push(SolveManager.createNode(board, x-1, y+1, head));
        }
        if (x+1 < width && y-1 > -1 && !head.used[(y-1) + ',' + (x+1)]) {
            head.children.push(SolveManager.createNode(board, x+1, y-1, head));
        }
        if (x+1 < width && y+1 < height && !head.used[(y+1) + ',' + (x+1)]) {
            head.children.push(SolveManager.createNode(board, x+1, y+1, head));
        }

        // see details on its workout later
        /*let movement = [-1, 0, 1];
        for (let move_x in movement) {
            for (let move_y in movement) {
                if (move_x === move_y === 0)
                    continue;
                let start_i = x;
                let start_j = y;

                while (width > start_i >= 0 && height > start_j >= 0) {
                    console.log(board[start_i][start_j]);
                    /!*head.children.push(SolveManager.createNode(board, start_i, start_j, head));*!/
                    start_i += parseInt(move_x);
                    start_j += parseInt(move_y);
                }

            }
        }*/

        return head;
    }
};

// Listen for web worker messages.
addEventListener('message', function (event) {
    if (event.data.board) {
        SolveManager.solve(event.data.board, function (data) {
            postMessage(data);
        });
    }
});

