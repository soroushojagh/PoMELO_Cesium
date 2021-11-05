import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {Container, Row, Col} from 'react-bootstrap';
import ExporterFilters from "../MiddleBar/ExporterFilters";
import './MapPreview.css'

class MapPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        };
    }

    render() {
        const datePicker = <Container className="itemContainerMap">
            <Row onClick={() => {
                this.setState({clicked : !this.state.clicked})
                this.props.changed(!this.state.clicked);
            }}>
                <Col className = 'textStyle' xs={7}>Show on Map</Col>
                <Col xs={1}>
                </Col>
                <Col xs={1}>
                    <div >
                        <FontAwesomeIcon icon={this.state.clicked ? faEye: faEyeSlash } />
                    </div>
                </Col>
            </Row>
        </Container>;
        const card = ExporterFilters("Preview",datePicker);
        return (
            <div className="parameter">
                {card}
            </div>
        );
    }
}

export default MapPreview;
