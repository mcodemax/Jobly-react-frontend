import React, { useEffect, useState } from "react";
import JoblyApi from "../api";
import { useParams, useNavigate } from "react-router-dom";
import CompanyDetailJobs from "./CompanyDetailJobs";
import './CompanyDetail.scss';

const CompanyDetail = () => {
    const { companyHandle } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getCompanyDetails(companyHandle){
            try {
                const res = await JoblyApi.getCompany(companyHandle);
                setCompany(res); 
            } catch (error) {
                alert(`Company DNE`)
                navigate("/companies");
            }
        }

        getCompanyDetails(companyHandle);
    }, [companyHandle, navigate]);

    
/**{handle: 'anderson-arias-morrow', name: 'Anderson, Arias and Morrow',
 *  description: 'Somebody program how I. Face give away discussion …. Your 
 * official relationship administration here.', numEmployees: 245, logoUrl: '/logos/logo3.png', …} */
    
    if(!company) return (<>{`Loading`}</>);

    return (
            <div className="CompanyDetail">
                <div>{ company.logoUrl ? <img src="/building.png" alt={`${company.name} logo`}></img> 
                    : null}</div>
                <p><h2 className="CompanyDetail-main">Company Name:</h2> <h2 className="CompanyDetail-desc">{company.name}</h2></p>
                <p><h2 className="CompanyDetail-main">Employees:</h2> <h2 className="CompanyDetail-desc">{company.numEmployees}</h2></p>
                <p><h2 className="CompanyDetail-main">Company Details:</h2> <h2 className="CompanyDetail-desc">{company.description}</h2></p>
                <p><h2 className="CompanyDetail-main">Jobs:</h2></p>
                <CompanyDetailJobs jobsArr={company.jobs}/>
            </div>
    )
}

export default CompanyDetail;
