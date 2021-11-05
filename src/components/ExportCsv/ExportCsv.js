import React, {Component} from 'react';
import ExporterFilters from "../MiddleBar/ExporterFilters";
import {CSVLink, CSVDownload} from "react-csv";
import RequestHeaders from "./RequestHeaders";
import RequestObservations from "./RequestObservations";

import {
    Button,
} from 'react-bootstrap';
import moment from "moment";

// let startDate = moment().subtract('7',"days");
// let endDate = moment();


let csvData;

let datastreamInfo;

class ExportCsv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRequesting: true,
            isReady: false,
            csvData: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate
        }
    }

    async componentDidMount() {
        datastreamInfo = await RequestHeaders();
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.startDate !== this.props.startDate || nextProps.endDate !== this.props.endDate) {

            this.setState({
                isRequesting: true,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
            });
            this.exportHandler(nextProps.startDate, nextProps.endDate)

        }
    }


    download_csv = async (data) => {
        let csv = '';
        await data.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });
        let hiddenElement = document.createElement('a');
        csvData = new Blob([csv], { type: 'text/csv' });
        let csvUrl = URL.createObjectURL(csvData);
        hiddenElement.href =  csvUrl;
        // hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'PoMELO.csv';
        hiddenElement.click();
    }

    exportHandler = async (start, end) => {
        csvData = await RequestObservations(datastreamInfo, moment(start).toISOString(), moment(end).toISOString());
        if (csvData) {
            this.props.modalShowing(false,"export");
            this.setState({
                isRequesting: false,
                csvData: csvData,
                isReady: true,
            })
        }
    };

    render() {
        let exportButton;
        if (!this.state.isRequesting && this.state.csvData.length > 1) {
            exportButton = <Button className="btn btn-primary" onClick={async () => {
                await this.download_csv(this.state.csvData)
            }
            }>
                Export
            </Button>

        } else {
            exportButton = <Button className="btn btn-primary" disabled>is Loading...</Button>
        }

        const card = ExporterFilters("Exporter", exportButton);
        return (
            <div className="parameter">
                {card}
            </div>
        );
    }
}

export default ExportCsv;
