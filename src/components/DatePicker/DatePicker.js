import React, {Component} from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import './DatePicker.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ExporterFilters from "../MiddleBar/ExporterFilters";
import {
    Button,
} from 'react-bootstrap';
import handle from "../../assets/handle.svg";

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleApply = this.handleApply.bind(this);
        this.state = {
            clicked: false,
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
        };
    }
    handleApply(event, picker) {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        });
        this.props.changed(this.state.startDate,this.state.endDate);
    }

    render() {
        let start = this.state.startDate.format('YYYY-MM-DD');
        let end = this.state.endDate.format('YYYY-MM-DD');
        let label = start + ' - ' + end;
        // if (start === end) {
        //     label = start;
        // }
        const datePicker = <div className={!this.props.status ? null :'disable-picker'}>
            <DateRangePicker startDate={this.state.startDate}
                                                 endDate={this.state.endDate}
                                                 onEvent={this.handleEvent}
                                                 onApply={this.handleApply}
        >
            <div>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className="dateContent">{label}</span>
            </div>
        </DateRangePicker></div>
        const card = ExporterFilters("Date",datePicker);
        return (
            <div className="parameter" >
                {card}
            </div>
        );
    }
}

export default DatePicker;
