/**
 * TourGuide Component for the User info page.
 * -------------------------------------------
 * @param {string} username 
 * @param {string} email 
 * @param {string} mobileNo 
 * @param {number} yearsEx 
 * @param {string} prevWork 
 * @returns 
 */

function TourGuideC (
   username,
   email,
   mobileNo,
   yearsEx,
   prevWork 
){
   return(
    <div id={username}>
        <span>Email : {email}</span>
        <span>Username : {username}</span>
        <span>MobileNo : {mobileNo}</span>
        <span>yearsEx : {yearsEx}</span>
        <span>prevWork : {prevWork}</span>
    </div>
   ) 
}

export default TourGuideC;