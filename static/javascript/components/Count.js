class Count extends React.Component {

    constructor(props) {
        super(props)
        this.countChange = this.countChange.bind(this)
    }

    componentDidMount() {
        window.addEventListener("keydown", (event) => {
            this.countChange(event)
        });
    }

    countChange(e) {
        this.props.countChange(e);
    }

    render(){
        let c = this.props.count;
        return(
            <p id="count">{c}</p>
        )

    }
}