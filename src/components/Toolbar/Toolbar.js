import React from 'react';
import './Toolbar.css';
import SidebarToggleButton from "../SideBar/SidebarToggleButton";
import logo from '../../assets/UofC_logo.png'
import logoText from '../../assets/UofC_Text.png'

const toolbar = props => (
    <header className="toolbar">
        <nav className="toolbar__navigation">
            <div>
                <SidebarToggleButton click={props.sidebarClickHandler}/>
            </div>

            <div className="toolbar__logo">PoMELO</div>
            <div className="spacer"/>
            <div className="toolbar__navigation-items">
                <ul>
                    {/*<li>University of Calgary</li>*/}
                    <li><img src={logo} width="40" height="40" /></li>
                    <li style={{marginTop:"0.4em"}}><img src={logoText} width="80" height="40" /></li>
                    {/*<li><a href="/">Setting</a></li>*/}
                </ul>
            </div>
        </nav>
    </header>

);

export default toolbar;
