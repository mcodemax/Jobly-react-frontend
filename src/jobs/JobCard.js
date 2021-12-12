import React, { useContext } from 'react';
import JoblyApi from '../api';
import UserContext from "../auth/UserContext";
import './JobCard.scss';

const JobCard = ({companyHandle, companyName, equity, id, salary, title}) => {
    const {setJobIds, jobIds, currentUser} = useContext(UserContext); //importing from context setState f() to add to jobIds applied to
    
    async function apply(evt) {
        evt.preventDefault();

        try {
            console.log(`poop1`, currentUser.username, id)
            const res = await JoblyApi.jobApply(currentUser.username, id);
            console.log(`soegsigsoegiseg`, res)
            setJobIds(ids => [...ids, res])    
        } catch (error) {
            alert('Job unable to be applied to');
        }
    }

    return (
        <div className="JobCard">
            <p>Company: {companyName}</p>
            <p>Job Title: {title}</p>
            <p>Salary: {salary ? salary : 0}</p>
            <p>Equity: {equity}</p>
            { jobIds.includes(id) ?
            <p className="JobCard-applied">Applied</p> :
            <form onSubmit={apply}>
                <button type="submit" className="JobCard-apply">
                    Apply
                </button>
            </form>
            }
        </div>
    )
}

export default JobCard;
