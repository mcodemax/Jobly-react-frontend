import React, { useState } from "react";
import './SearchForm.scss'

const SearchForm = ({ search }) => {
    const [searchTerm, setSearchTerm] = useState("");

    /** Tell parent to filter */
    function handleSubmit(evt) {
        // take care of accidentally trying to search for just spaces
        evt.preventDefault();
        search(searchTerm.trim() || undefined);
        setSearchTerm(searchTerm.trim());
    }

    /** Update form fields */
    function handleChange(evt) {
        setSearchTerm(evt.target.value);
    }

    return (
        <div className="SearchForm">
            <form className="form-inline" onSubmit={handleSubmit}>
                <input
                    className=""
                    name="searchTerm"
                    placeholder="Enter search term"
                    value={searchTerm}
                    onChange={handleChange}
                />
                <button type="submit" className="">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default SearchForm;