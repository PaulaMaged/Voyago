import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SignUpAll from "./components/signLogin/signUpAll";
import Login from "./components/signLogin/Login";
import AdminDash from "./components/Admin_Dashboard/Admin_dash";
import TouristDashboard from "./components/Toursit_Dashboard/Tourist_dash";
// import TourGuideDashboard from "./components/TourGuide_Dashboard/TourGuide_Dashboard";
// import AdvertiserDashboard from "./components/Advertiser_Dashboard/advertiserDashboard";
import ViewAdvertiserProfile from "./components/Profiles/Advertiser_profile";
import ViewTourGuideProfile from "./components/Profiles/Tour_guide_profile";
import ViewSellerProfile from "./components/Profiles/Seller_profile";

import AddTourismGovenor from "./components/Admin_/add_tourism_govenor";
import AddAdmin from "./components/Admin_/add_admin";

import ViewActivityAdv from "./components/viewActivityAdv";
import ViewActivityGuest from "./components/viewActivityGuest";
import ViewItineraryGuest from "./components/viewItineraryGuest";
import ViewItineraryGuide from "./components/ViewItineraryGuide";

import GovernorLandmarks from "./components/GovernorLandmarks";
import ViewLandmarks from "./components/viewLandmarks";
import ViewProductAdmin from "./components/viewProductAdmin";
import ViewProductSeller from "./components/viewProductSeller";
import ViewProductTourist from "./components/viewProductTourist";
import EditProduct from "./components/editProduct";
import CrudCategory from "./components/Admin_Dashboard/manageActCategories";
import NavigationPage from "./components/TouristNavigationPage";
import CreateReview from "./components/CreateReview";
import HotelSearch from "./components/ThirdParty/HotelSearching";
import FlightSearch from "./components/ThirdParty/FlightSearch";
import FlightBooking from "./components/ThirdParty/FlightBooking";

import Cart from "./components/Cart"; // Import Cart

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signUp" element={<SignUpAll />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/Change" element={<ChangePassword />} /> */}
        <Route path="/nav" element={<NavigationPage />} />
        <Route path="/Tourist_Dashboard" element={<TouristDashboard />} />
        <Route path="/Admin_Dashboard" element={<AdminDash />} />
        <Route path="/addTourismGovenor" element={<AddTourismGovenor />} />
        <Route path="/addAdmin" element={<AddAdmin />} />
        <Route path="/hotelBooking" element={<HotelSearch />} />
        <Route path="/FlightSearch" element={<FlightSearch />} />
        <Route path="/FlightBooking" element={<FlightBooking />} />
        <Route path="/ViewAdvertiserProfile" element={<ViewAdvertiserProfile />} />
        <Route path="ViewTourGuideProfile" element={<ViewTourGuideProfile />} />
        <Route path="/ViewSellerProfile" element={<ViewSellerProfile />} />
        <Route path="/viewActivityAdv" element={<ViewActivityAdv />} />
        <Route path="/viewActivityGuest" element={<ViewActivityGuest />} />
        <Route path="/viewItineraryGuest" element={<ViewItineraryGuest />} />
        <Route path="/viewItineraryGuide" element={<ViewItineraryGuide />} />
        <Route path="/viewLandmarks" element={<ViewLandmarks />} />
        <Route path="/GovernorLandmarks" element={<GovernorLandmarks />} />
        <Route path="/viewProductAdmin" element={<ViewProductAdmin />} />
        <Route path="/viewProductSeller" element={<ViewProductSeller />} />
        <Route path="/viewProductTourist" element={<ViewProductTourist />} />
        <Route path="/editProduct" element={<EditProduct />} />
        <Route path="/crudCategory" element={<CrudCategory />} />
        <Route path="/createReview" element={<CreateReview />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
