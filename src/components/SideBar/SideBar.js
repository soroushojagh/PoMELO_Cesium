import React from 'react';
import './SideBar.css';
import homeIcon from '../../assets/home.jpg'
import exportIcon from '../../assets/export.png'


const SideBar = props => {
    let sidebarClasses = 'sidebar';
    if(props.show){
        sidebarClasses = 'sidebar open';
    }
    return(
        <nav className={sidebarClasses}>
            <ul>
                <li ><img src={homeIcon} width="40" height="40" />  <a href="/">
                    Overview</a></li>
                {/*<li ><a href="/graphoverview">*/}
                {/*    Graph Overview</a></li>*/}
                <li ><img src={exportIcon} width="40" height="40" />  <a href="/export">
                    Data Export</a></li>
            </ul>
        </nav>
    );

};

export default SideBar;
