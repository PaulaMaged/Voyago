/**
 * Activity category (food, stand up comedy, 
 * concert, party, bazaars. 
 * exhibitions, 
 * sports matches/ events, 
 * parks, etc)
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} date 
 * @param {string} location
 * @param {string} organizer  
 * @param {string} category 
 */

function ActivtiesC(
    title,
    description,
    date,
    location,
    organizer,
    category
){

    return(
        <div id = {organizer + "" + title}>
            <span>Title : {title}</span> 
            <span>Description : {description}</span> 
            <span>Organizer {oraganizer}</span> 
            <span>Location : {location} </span> 
            <span>Date : {date}</span> 
            <span>Category : {category}</span> 
        </div>
    )

}


export default ActivtiesC;