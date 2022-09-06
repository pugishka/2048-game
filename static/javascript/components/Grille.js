class Grille extends React.Component {

    constructor(props){
        super(props)
        this.grilleChange = this.grilleChange.bind(this)
        this.grilleInit = this.grilleInit.bind(this)
        this.restart = this.restart.bind(this)
    }

    // initialiser la grille
    grilleInit(e){
        this.props.grilleInit()
    }

    restart(){
    }

    // maj la grille
    grilleChange(e){
        if (e.keyCode >= 37 && e.keyCode <= 40 && this.props.end == ""){
            this.props.grilleChange(e)
        }
    }
    
    componentDidMount() {
        window.addEventListener("keydown", (event) => {
            this.grilleChange(event)
        });
        window.addEventListener("load", (event) => {
            this.grilleInit(event)
        });
        const restartB = document.getElementById("restartB");
        restartB.addEventListener('click', (e) => {
            if (this.props.end == "win"){
                window["updateScore"](this.props.count, this.props.id);
            }
            this.grilleInit(e)
        });
    }

    render(){
        const n = parseInt(this.props.taille);
        let g = this.props.numbers;
        return(
            <div>
                <table id="grille">
                    {[...Array(n)].map((undefined,indexY) => (
                        <tr key={indexY}>
                        {[...Array(n)].map((undefined,indexX) => (
                            <th class={"case case" + g[indexY][indexX]} key={indexX}
                            >{g[indexY][indexX] == 0 ? " " : g[indexY][indexX]}</th>
                        ))}
                        </tr>
                    ))}
                </table>
                <div id={"gameEnd" + this.props.end}><p id="win">Tu as gagné !</p><p id="lost">Game over !</p><button type="button" id="restartB" >RESTART</button></div>
            </div>
        )
    }
}