// This component is responsible to display each of the received items from MiddleBar component
//
import React,{Component} from 'react';
import './ParameterItems.css';
import handle from '../../assets/handle.svg';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons'



class ParameterItems extends Component{
    state = {
        clicked: false
    }


    render() {
        return(
            <Container className='itemContainer'>
                <Row>
                    {/*<Col xs={1}>*/}
                    {/*    <img className="item-prepend handle" src={handle}/>*/}
                    {/*</Col>*/}
                    <Col className = 'textStyle' xs={7}>{this.props.item}</Col>
                    <Col xs={1}>
                    </Col>
                    <Col xs={1}>
                        <div onClick={() => {
                            this.props.click(this.props.itemId);
                            this.setState({clicked : !this.state.clicked})
                        }}>
                            <FontAwesomeIcon icon={this.state.clicked ? faEye : faEyeSlash} />
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default ParameterItems;
