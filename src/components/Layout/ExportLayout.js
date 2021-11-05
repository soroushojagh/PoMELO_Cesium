import React from 'react';
import Toolbar from "../Toolbar/Toolbar";
import SideBar from "../SideBar/SideBar";
import classes from "./Layout.module.css";
import MapPreviewExporter from "../Map/MapPreviewExporter";
import Auxiliary from "../../hoc/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";
import DatePicker from "../DatePicker/DatePicker";
import MapPreview from "../Filters/MapPreview";
import moment from 'moment';
import ExportDataSTA from "../ExportDataSTA/ExportDataSTA";
import ArchivedData from "../ExportDataSTA/ArchivedData";
import ReactiveRangeSlider from "../Slider/ReactiveRangleSlider";
import Loader from 'react-loader-spinner';
import ExportCsv from "../ExportCsv/ExportCsv";
import WaitingModal from '../../components/WaitingModal/WaitingModal'


class ExportLayout extends React.Component{
    showModal;
    constructor(props){
        super(props);
        this.state = {
            isLoading:false,
            thresholds: [2.5,4],
            startDate:moment(),
            endDate:moment().subtract('20', 'days'),
            mapPreview: false,
            sidebarOpen: false,
            archivedData:null,
            showing:false,
            isDownloading:false
        }
    }
    // Click handler for the sliding menu
    sidebarToggleClickHandler = () => {
        this.setState((prevState) => {
            return {sidebarOpen: !prevState.sidebarOpen};
        });
    };

    // How to hide the sliding menu bar
    backdropClickHandler =() => {
        this.setState({sidebarOpen:false})
    };
    dateHandler = (startDate,endDate)=> {
        this.setState({
            startDate:startDate,
            endDate:endDate
        });
    };
    mapPreviewHandler = (mapPreviewStatus) => {
        this.setState({
            mapPreview: mapPreviewStatus
        })
    };
    thresholdsHandler =  async (thresholds) => {
        this.setState({
            thresholds:[thresholds[0],thresholds[1]]
        })
        // await this.requestArchivedData(moment(this.state.startDate).toISOString(),moment(this.state.endDate).toISOString());
    }
    async componentWillUpdate(nextProps, nextState, nextContext) {
            if(nextState.startDate != this.state.startDate || nextState.endDate != this.state.endDate){
                this.setState({
                    isLoading:true,
                    showing:true,
                    isDownloading:true
                })
                let startDate= nextState.startDate;
                let endDate = nextState.endDate;
                await this.requestArchivedData(moment(startDate).toISOString(),moment(endDate).toISOString());
            }
    }

    requestArchivedData = async (startDate,endDate) => {
        const archivedData = await ExportDataSTA(startDate,endDate);
        const completedJSON = await ArchivedData(archivedData,this.state.thresholds);
        this.setState({
            isLoading: false,
            archivedData:completedJSON
        })
    };

    modalShowHandler = (status,from) => {
        this.setState({showing:status})
        if(from == "export"){
            this.setState({isDownloading:status})
        }
    }

    render(){
        let backdrop;
        if(this.state.sidebarOpen){
            backdrop = <Backdrop click={this.backdropClickHandler}/>;
        }
        return (
            <Auxiliary>
                {/*<div style={{'height':'100%'}}>*/}
                <div >
                    <Toolbar sidebarClickHandler={this.sidebarToggleClickHandler}/>
                    <SideBar show={this.state.sidebarOpen}/>
                    {backdrop}
                    <div className={classes.filters}>
                        <DatePicker changed={this.dateHandler} status={this.state.isDownloading}/>
                        <MapPreview changed={this.mapPreviewHandler}/>
                        <ExportCsv startDate={moment(this.state.startDate).toISOString()} endDate={moment(this.state.endDate).toISOString()} modalShowing={this.modalShowHandler}/>
                        {/*<ReactiveRangeSlider threshodChangedHandler={this.thresholdsHandler}/>*/}
                    </div>
                    {/*<div className={classes.content}>Data Exporter</div>*/}
                    <div className={classes.content}>

                        <div className={classes.loader}>
                            {this.state.isLoading ? <Loader
                                type="ThreeDots"
                                color="#00BFFF"
                                height={100}
                                width={100}
                                timeout={500000}
                            /> : null}
                        </div>
                        <div>
                            {this.state.showing ? <WaitingModal visibility={true} showing={this.modalShowHandler}/> : null}
                        </div>
                        <MapPreviewExporter previewStatus={this.state.mapPreview} archivedData={this.state.archivedData} thresholds={this.state.thresholds}/>
                    </div>
                </div>
            </Auxiliary>
        )
    }
}
export default ExportLayout;
