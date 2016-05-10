function $(selector, container) {
    return (container || document).querySelector(selector);
}

(function() {
    
    var _ = self.Life = function(seed) {
        this.seed = seed;
        this.height = seed.length; //Quantidade de linhas do seed
        this.width = seed[0].length; //Quantidade de celulas em uma linha
        
        //Guarda o estado anterior
        this.prevBoard = [];
        this.board = cloneArray(seed);
    };
    
    _.prototype = {
        next: function() {
            this.prevBoard = cloneArray(this.board);
            
            for(var y = 0; y < this.height; y++) {
                for(var x = 0; x < this.width; x++) {
                    var neighbors = this.aliveNeighbors(this.prevBoard, x, y);
                    var alive = !!this.board[y][x]; //Converte para boolean
                    
                    //Regras do jogo
                    if(alive) {
                        if(neighbors < 2 || neighbors > 3) {
                            this.board[y][x] = 0;
                        }
                    }
                    else {
                        if(neighbors == 3) {
                            this.board[y][x] = 1;
                        }
                    }
                }
            }
        },
        
        //Pega os vizinhos adjacentes
        aliveNeighbors: function(array, x, y) {            
            
            //Para nao dar erro ao tentar acessar uma linha inexistente
            var prevRow = array[y-1] || [];
            var nextRow = array[y+1] || [];            
            
            return neighbors = [
                prevRow[x-1], prevRow[x], prevRow[x+1],
                array[y][x-1], array[y][x+1],
                nextRow[x-1], nextRow[x], nextRow[x+1]
            ].reduce(function(prev, cur) {
                return prev + +!!cur //converte para boolean e depois para numero, ficando 0 se era undefined
            }, 0);                        
        },
        
        toString: function() {
            return this.board.map(function(row){ return row.join(' '); }).join('\n');
        }
    };
    
    // Funcoes auxiliares
    //Clona apenas 2D arrays
    function cloneArray(array) {
        return array.slice().map(function(row) { return row.slice(); });
    }
    
})();

(function() {
    var _ = self.LifeView = function(table, size) {
        this.grid = table;
        this.size = size;
        this.started = false; //para verificar se precisa inicializar ou só dar next
        this.autoplay = false;
        this.createGrid();
    };
    
    _.prototype = {
        createGrid: function() {
            var me = this;
            //Cria os elementos no fragmento para nao impactar na performance do DOM
            var fragment = document.createDocumentFragment();
            this.grid.innerHTML = '';
            this.checkboxes = [];
            
            for(var y = 0; y < this.size; y++) {
                var row = document.createElement('tr');
                this.checkboxes[y] = [];
                
                for(var x = 0; x < this.size; x++) {
                    var cell = document.createElement('td');
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    this.checkboxes[y][x] = checkbox;
                    checkbox.coords = [y, x];
                    
                    cell.appendChild(checkbox);
                    row.appendChild(cell);
                }
                
                fragment.appendChild(row);
            }
            
            //Se algum checkbox foi alterado, precisa comecar novamente
            this.grid.addEventListener('change', function(event) {
                if(event.target.nodeName.toLowerCase() == 'input') {
                    me.started = false;
                }
            });

            this.grid.addEventListener('keyup', function(event) {
                var checkbox = event.target;

                if(checkbox.nodeName.toLowerCase() == 'input') {
                    var coords = checkbox.coords;
                    var y = coords[0];
                    var x = coords[1];

                    switch(event.keyCode) {
                        case 37: //Esquerda
                            if(x > 0) {
                                me.checkboxes[y][x - 1].focus();
                            }
                            else {
                                me.checkboxes[y][me.size - 1].focus();
                            }                       
                            break;
                        case 38: //Cima
                            if(y > 0) {
                                me.checkboxes[y - 1][x].focus();
                            }
                            else {
                                me.checkboxes[me.size - 1][x].focus();
                            }                           
                            break;
                        case 39: //Direita
                            if(x < me.size - 1) {
                                me.checkboxes[y][x + 1].focus();    
                            }
                            else {
                                me.checkboxes[y][0].focus();
                            }
                            break;
                        case 40: //Baixo        
                            if(y < me.size - 1) {
                                me.checkboxes[y + 1][x].focus();
                            }
                            else {
                                me.checkboxes[0][x].focus();
                            }
                            break;
                    }
                }
            });
            
            this.grid.appendChild(fragment);
        },
        
        //Transforma o array de checkbox em array de numeros
        get boardArray() {
            return this.checkboxes.map(function(row) {
                return row.map(function(checkbox) {
                    return +checkbox.checked; //Boolean para numero
                });
            });
        },
        
        play : function() {
            this.game = new Life(this.boardArray);
            this.started = true;
        },
        
        next: function() {
            var me = this;

            if(!this.started || this.game) {
                this.play();
            }   
            
            this.game.next();
            
            var board = this.game.board;
            
            for(var y = 0; y < this.size; y++) {
                for(var x = 0; x < this.size; x++) {
                    this.checkboxes[y][x].checked = !!board[y][x];
                }
            }

            if(this.autoplay) {
                this.timer = setTimeout(function() {
                    me.next();
                }, 1000);
            }
        }
    };
})();

var lifeView = new LifeView(document.getElementById('grid'), 30);

(function() {
    var buttons = {
        next: $("button.next")                
    };
    buttons.next.addEventListener("click", function() {
        lifeView.next();
    });

    $("#autoplay").addEventListener("change", function() {        
        buttons.next.textContent = this.checked ? "Start" : "Next";
        lifeView.autoplay = this.checked;
        
        buttons.next.disabled = this.checked;
        if(!this.checked) {
            clearTimeout(lifeView.timer);
        }
        else {
            lifeView.next();
        }
    });
})();
