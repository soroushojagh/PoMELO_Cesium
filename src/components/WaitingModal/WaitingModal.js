import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './WaitingModal.css'
import Loader from "react-loader-spinner";

class WaitingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.visibility != this.state.visible){
            this.setState({
                visible:this.props.visibility
            })
        }
    }

    closeModal() {
        this.props.showing(false,"modal");
        this.setState({
            visible : false
        });
    }

    render() {
        return (
            <section>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="150"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="modalContent">
                        <h1>Downloading Status</h1>
                        <p>Be patient, data is downloading...</p>
                        <div style={{textAlign:"center"}}>
                            <Loader
                                type="ThreeDots"
                                color="#00BFFF"
                                height={100}
                                width={100}
                                // timeout={500000}
                            />
                        </div>
                        {/*<a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>*/}
                        <button type="button" style={{marginTop:"3px",marginRight:"3px", position:"fixed", right:"0px", top:"0px"}} className="close" onClick={() => this.closeModal()} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                    </div>
                </Modal>
            </section>
        );
    }
}

export default WaitingModal;
