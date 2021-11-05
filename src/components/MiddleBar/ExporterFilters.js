import './ExporterFilters.css';
import React from 'react'
const ExporterFilters = (header, content) => {
    const filterContent = content;
    return(
        <div className="cardBodyExporter">
            <div className="headerMiddleBarExporter">
                <div className="textHeaderExport">{header}</div>
            </div>
            <div className="daterange">
                {filterContent}
            </div>

        </div>
    );
}

export default ExporterFilters;
