
//Developer Notes : 
//There is not a solution yet on how to transfer 
//images from the backend to the frontend. 
//----------------------------------------------
//Reviews since it would be by Tourist Would need 
//its own Model in the backend 
//-----------------------------------------------
//Seller Shoud just be the name of the Seller provided 
//by the Product Model in the backend

/**
 * products(including picture of product
 * , price, description, seller, 
 * ratings and reviews)
 * @param {string} name  
 * @param {string} description  
 * @param {string} seller  
 */
function ProductComp(photo, name , description, seller, rating, reviews){
    return(
        <div id={name + "" + seller}>
            <img src="" alt="" />
            <h3>Name : </h3>
            <h6>{rating}</h6>
            <h4>description : </h4>
            <h5>{description}</h5>
            <div>
                {reviews}
            </div>
        </div>
    )
}

export default ProductComp;
