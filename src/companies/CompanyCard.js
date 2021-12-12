import React from "react";
import { NavLink } from "react-router-dom";
import './CompanyCard.scss';

/** Component for listing all Companies on UI */
const CompanyCard = ({handle, name, description, numEmployees, logoUrl}) => {

    return (
            <div className="CompanyCard">
                <p>{name}</p>
                <p>Description: {description}</p>
                <p>Employees: {numEmployees}</p>
                <NavLink to={`/companies/${handle}`}>Details</NavLink>

                { logoUrl ? <img className="CompanyCard-img" src="/building.png" alt={`${name} logo`}></img> : null}
            </div>
    );
}

export default CompanyCard;
