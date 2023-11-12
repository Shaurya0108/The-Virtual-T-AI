import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

class Latex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latexInput: '',
        };
    }

    handleLatexInputChange = (event) => {
        this.setState({ latexInput: event.target.value });
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    };

    render() {
        return (
            <div>
                <textarea
                    value={this.state.latexInput}
                    onChange={this.handleLatexInputChange}
                    placeholder="Enter LaTeX code here..."
                    className="latex-input-area"
                />
                <div className="latex-preview-area">
                    <BlockMath math={this.state.latexInput} errorColor={'#cc0000'} />
                </div>
            </div>
        );
    }
}

export default Latex;
