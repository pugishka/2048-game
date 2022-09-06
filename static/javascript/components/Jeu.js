class Jeu extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            grilleCases : Array(parseInt(this.props.tailleGrille)).fill(Array(parseInt(this.props.tailleGrille)).fill(0)),  //[[0,0,0,0],[0,0,0,0],[0,0,1024,0],[0,0,1024,0]],
            count : 0,  // compteur
            end : "",   // "win" si gagné, "lost" si perdu
        }
        this.countChange = this.countChange.bind(this)
        this.grilleChange = this.grilleChange.bind(this)
        this.grilleInit = this.grilleInit.bind(this)
    }

    // incrémenter le compteur
    countChange(e) {
        if (e.keyCode >= 37 && e.keyCode <= 40 && this.state.end == ""){
            this.setState({
                count: this.state.count + 1
            })
        }
    }

    // changer la grille (update) et vérification si le jeu est fini
    grilleChange(e) {
        const n = parseInt(this.props.tailleGrille);
        const g = this.state.grilleCases;
        let changement = true;

        // compression des lignes ou colonnes
        switch(e.keyCode){
            case 37:        // left
                for (let i=0; i<n; i++){
                    changement = true;
                    while (changement === true){
                        changement = false;
                        for (let j=0; j<n-1; j++){
                            if (g[i][j] == 0 && g[i][j+1] !== 0){
                                g[i][j] = g[i][j+1];
                                g[i][j+1] = 0;
                                changement = true;
                            }
                        }
                    }
                    for (let j=0; j<n-1; j++){
                        if (g[i][j] !== 0 && g[i][j+1] === g[i][j]) {
                            g[i][j] = g[i][j] + g[i][j+1];
                            g[i][j+1] = 0;
                        }
                    }
                    changement = true;
                    while (changement === true){
                        changement = false;
                        for (let j=0; j<n-1; j++){
                            if (g[i][j] == 0 && g[i][j+1] !== 0){
                                g[i][j] = g[i][j+1];
                                g[i][j+1] = 0;
                                changement = true;
                            }
                        }
                    }
                }
                break;
            case 39:        // right
                for (let i=0; i<n; i++){
                    changement = true;
                    while (changement == true){
                        changement = false;
                        for (let j=n-1; j>=1; j--){
                            if (g[i][j] == 0 && g[i][j-1] !== 0){
                                g[i][j] = g[i][j-1];
                                g[i][j-1] = 0;
                                changement = true;
                            }
                        }
                    }
                    for (let j=n-1; j>=1; j--){
                        if (g[i][j] !== 0 && g[i][j-1] === g[i][j]) {
                            g[i][j] = g[i][j] + g[i][j-1];
                            g[i][j-1] = 0;
                        }
                    }
                    changement = true;
                    while (changement == true){
                        changement = false;
                        for (let j=n-1; j>=1; j--){
                            if (g[i][j] == 0 && g[i][j-1] !== 0){
                                g[i][j] = g[i][j-1];
                                g[i][j-1] = 0;
                                changement = true;
                            }
                        }
                    }
                }
                break;
            case 38:        // up
                for (let j=0; j<n; j++){
                    changement = true;
                    while (changement == true){
                        changement = false;
                        for (let i=0; i<n-1; i++){
                            if (g[i][j] == 0 && g[i+1][j] !== 0){
                                g[i][j] = g[i+1][j];
                                g[i+1][j] = 0;
                                changement = true;
                            }
                        }
                    }
                    for (let i=0; i<n-1; i++){
                        if (g[i][j] !== 0 && g[i+1][j] === g[i][j]) {
                            g[i][j] = g[i][j] + g[i+1][j];
                            g[i+1][j] = 0;
                        }
                    }
                    changement = true;
                    while (changement == true){
                        changement = false;
                        for (let i=0; i<n-1; i++){
                            if (g[i][j] == 0 && g[i+1][j] !== 0){
                                g[i][j] = g[i+1][j];
                                g[i+1][j] = 0;
                                changement = true;
                            }
                        }
                    }
                }
                break;
            case 40:        // down
                for (let j=0; j<n; j++){
                    changement = true;
                    while (changement == true){
                        changement = false;
                        for (let i=n-1; i>=1; i--){
                            if (g[i][j] == 0 && g[i-1][j] !== 0){
                                g[i][j] = g[i-1][j];
                                g[i-1][j] = 0;
                                changement = true;
                            }
                        }
                    }
                    for (let i=n-1; i>=1; i--){
                        if (g[i][j] !== 0 && g[i-1][j] === g[i][j]) {
                            g[i][j] = g[i][j] + g[i-1][j];
                            g[i-1][j] = 0;
                        }
                    }
                    changement = true;
                    while (changement == true){
                        changement = false;
                        for (let i=n-1; i>=1; i--){
                            if (g[i][j] == 0 && g[i-1][j] !== 0){
                                g[i][j] = g[i-1][j];
                                g[i-1][j] = 0;
                                changement = true;
                            }
                        }
                    }
                }
                break;
        }

        // vérifier si rempli ou non
        let zero = 0;
        for (let i=0; i<n; i++){
            for (let j=0; j<n; j++){
                if (g[i][j] == 0){zero++}
            }
            if (zero >= 1) {break;}
        }
        if(zero == 0){ 
            this.setState({
                end : "lost"
            })
            
        } else {

            // vérifier si on a un 2048
            let win = false;
            for (let i=0; i<n; i++){
                for (let j=0; j<n; j++){
                    if (g[i][j] == 2048){win = true}
                }
                if (win == true) {break;}
            }
            if(win == true){ 
                this.setState({
                    end : "win"
                })

            } else {

                // nouvelle case 2 ou 4
                let caseN = (Math.floor(Math.random()*2) + 1) * 2;
                let caseX = 0;
                let caseY = 0;
                do {
                    caseX = Math.floor(Math.random()*(n));
                    caseY = Math.floor(Math.random()*(n));
                } while (g[caseX][caseY] !== 0);
                g[caseX][caseY] = caseN;

                this.setState((state,props) => ({
                    grilleCases: g
                }))
            }

        }



    }

    // initialisation de la grille
    grilleInit() {
        const n = parseInt(this.props.tailleGrille);

        // grille vide
        let g = [];
        let r = [];
        for (let i=0; i<n; i++){
            for (let j=0; j<n; j++){
                r.push(0);
            }
            g.push(r);
            r = [];
        }
        
        // 2 cases random
        let case1 = 2
        let case2 = (Math.floor(Math.random()*2) + 1) * 2;
        let case1posX = Math.floor(Math.random()*(n));
        let case1posY = Math.floor(Math.random()*(n));
        let case2posX = 0;
        let case2posY = 0;
        do {
            case2posX = Math.floor(Math.random()*(n));
            case2posY = Math.floor(Math.random()*(n));
        } while (case2posX == case1posX && case2posY == case1posY);

        g[case1posX][case1posY] = case1;
        g[case2posX][case2posY] = case2;

        // initialisation du state
        this.setState({
            grilleCases: g,
            count: 0,
            end: "",
        })

    }   

    render() {
        return(
            <div>
                <div>
                    <Count count={this.state.count} countChange={this.countChange}/>
                    <Grille id = {this.props.id} count={this.state.count} end={this.state.end} numbers={this.state.grilleCases} taille={this.props.tailleGrille} grilleChange={this.grilleChange} grilleInit={this.grilleInit}/>
                </div>
            </div>
        )
    }
}
