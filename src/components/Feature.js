import React, { Fragment } from 'react';

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from '../api';

/**
 * We need a new component called Searchable which:
 * 
 * Has a template like this:
 * 
 * <span className="content">
 *  <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
 * </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 * 
 * When someone clicks the anchor tag, you should:
 * 
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 * 
 * Then start a try/catch/finally block:
 * 
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch: 
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */
const Searchable = ({ searchTerm, searchValue, setIsLoading, setSearchResults }) => {
    const handleClick = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetchQueryResultsFromTermAndValue(searchTerm, searchValue);
            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <span className="content">
            <a href="#" onClick={handleClick}>
                {searchTerm} {searchValue}
            </a>
        </span>
    );
};

/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 * 
 * <main id="feature"></main>
 * 
 * And like this when one is:
 * 
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 * 
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style, 
 * technique, medium, dimensions, people, department, division, contact, creditline
 * 
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 * 
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 * 
 * This component should be exported as default.
 */
const Feature = ({ featuredResult, setIsLoading, setSearchResults }) => {

    if (!featuredResult) {
        return <main id="feature"></main>;
    }

    const {
        title,
        dated,
        images,
        primaryimageurl,
        description,
        culture,
        style,
        technique,
        medium,
        dimensions,
        people,
        department,
        division,
        contact,
        creditline,
    } = featuredResult;

    return (
        <main id="feature">
            <div className="object-feature">
                <header>
                    <h3>{title}</h3>
                    <h4>{dated}</h4>
                </header>
                <section className="facts">
                    <span className="title">Description</span>
                    <span className="content">{description}</span>

                    <span className="title">Culture</span>
                    <span className="content">
                        <Searchable
                            searchTerm="culture"
                            searchValue={culture}
                            setIsLoading={setIsLoading}
                            setSearchResults={setSearchResults}
                        />
                    </span>

                    <span className="title">Style</span>
                    <span className="content">{style}</span>

                    <span className="title">Technique</span>
                    <span className="content">
                        <Searchable
                            searchTerm="technique"
                            searchValue={technique}
                            setIsLoading={setIsLoading}
                            setSearchResults={setSearchResults}
                        />
                    </span>

                    <span className="title">Medium</span>
                    <span className="content">
                        <Searchable
                            searchTerm="medium"
                            searchValue={medium.toLowerCase()}
                            setIsLoading={setIsLoading}
                            setSearchResults={setSearchResults}
                        />
                    </span>

                    <span className="title">Dimensions</span>
                    <span className="content">{dimensions}</span>

                    {people && people.length > 0 && (
                        <Fragment>
                            <span className="title">People</span>
                            {people.map((person) => (
                                <Fragment key={person.displayname}>
                                    <span className="content">
                                        <Searchable
                                            searchTerm="person"
                                            searchValue={person.displayname}
                                            setIsLoading={setIsLoading}
                                            setSearchResults={setSearchResults}
                                        />
                                    </span>
                                </Fragment>
                            ))}
                        </Fragment>
                    )}

                    <span className="title">Department</span>
                    <span className="content">{department}</span>
                    <span className="title">Division</span>
                    <span className="content">{division}</span>
                    <span className="title">Contact</span>
                    <span className="content">{contact}</span>
                    <span className="title">Credit Line</span>
                    <span className="content">{creditline}</span>
                </section>
                <section className="photos">
                    {primaryimageurl ? (
                        images && images.length > 0 ? (
                            images.map((image) => (
                                <img src={image.url} alt={image.alt} key={image.id} />
                            ))
                        ) : (
                            <span>IMAGE NOT FOUND</span>
                        )
                    ) : null}
                </section>
            </div>
        </main>
    );
};

export default Feature;