import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import SignUpAll from "./components/signLogin/signUpAll";
import Login from "./components/signLogin/Login";
import AdminDash from "./components/Admin_Dashboard/Admin_dash";
import TouristDashboard from "./components/Toursit_Dashboard/Tourist_dash";
import ViewAdvertiserProfile from "./components/Profiles/Advertiser_profile";
import ViewTourGuideProfile from "./components/Profiles/Tour_guide_profile";
import ViewSellerProfile from "./components/Profiles/Seller_profile";

import AddTourismGovenor from "./components/Admin_/add_tourism_govenor";
import AddAdmin from "./components/Admin_/add_admin";

import ViewActivityAdv from "./components/viewActivityAdv";
import ViewActivityGuest from "./components/viewActivityGuest";
import AdvSales from "./components/Sales/AdvSales"

import ViewItineraryGuest from "./components/viewItineraryGuest";
import ViewItineraryGuide from "./components/ViewItineraryGuide";
import GuideSales from "./components/Sales/GuideSales"


import GovernorLandmarks from "./components/GovernorLandmarks";
import ViewLandmarks from "./components/viewLandmarks";

import ViewProductAdmin from "./components/viewProductAdmin";
import ViewProductSeller from "./components/viewProductSeller";
import ViewProductTourist from "./components/viewProductTourist";
import EditProduct from "./components/editProduct";
import SellerSales from './components/Sales/SellerSales';

import CrudCategory from "./components/Admin_Dashboard/manageActCategories";
import NavigationPage from "./components/TouristNavigationPage";
import CreateReview from "./components/CreateReview";
import HotelSearch from "./components/ThirdParty/HotelSearching";
import FlightSearch from "./components/ThirdParty/FlightSearch";
import FlightBooking from "./components/ThirdParty/FlightBooking";
import Bookmarks from './pages/Bookmarks';
import Notifications from './components/Notifications';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signUp" element={<SignUpAll />}></Route>
          <Route path="/login" element={<Login />}></Route>
          {/* <Route path="/Change" element={<ChangePassword />}></Route> */}
          <Route path="/nav" element={<NavigationPage />}></Route>
          <Route
            path="/Tourist_Dashboard"
            element={<TouristDashboard />}
          ></Route>
          <Route path="/Admin_Dashboard" element={<AdminDash />}></Route>
          <Route
            path="/addTourismGovenor"
            element={<AddTourismGovenor />}
          ></Route>

          <Route path="/addAdmin" element={<AddAdmin />}></Route>
          <Route path="/hotelBooking" element={<HotelSearch />}></Route>
          <Route path="/FlightSearch" element={<FlightSearch />}></Route>
          <Route path="/FlightBooking" element={<FlightBooking />}></Route>

          <Route
            path="/ViewAdvertiserProfile"
            element={<ViewAdvertiserProfile />}
          ></Route>
          <Route
            path="ViewTourGuideProfile"
            element={<ViewTourGuideProfile />}
          ></Route>
          <Route
            path="/ViewSellerProfile"
            element={<ViewSellerProfile />}
          ></Route>

          {/* <Route path="/ViewTourist" element={<ViewTouristProfile />}></Route> */}

          <Route path="/viewActivityAdv" element={<ViewActivityAdv />}></Route>
          <Route
            path="/viewActivityGuest"
            element={<ViewActivityGuest />}
          ></Route>
          <Route path="/advSales" element={<AdvSales />}></Route>

          <Route
            path="/viewItineraryGuest"
            element={<ViewItineraryGuest />}
          ></Route>
          <Route
            path="/viewItineraryGuide"
            element={<ViewItineraryGuide />}
          ></Route>
          <Route path="/guideSales" element={<GuideSales />}></Route>


          <Route path="/viewLandmarks" element={<ViewLandmarks />}></Route>
          <Route path="/GovernorLandmarks" element={<GovernorLandmarks />}></Route>

          <Route
            path="/viewProductAdmin"
            element={<ViewProductAdmin />}
          ></Route>
          <Route
            path="/viewProductSeller"
            element={<ViewProductSeller />}
          ></Route>
          <Route
            path="/viewProductTourist"
            element={<ViewProductTourist />}
          ></Route>
          <Route path="/editProduct" element={<EditProduct />}></Route>
          <Route path="/sellerSales" element={<SellerSales />}></Route>

          <Route path="/crudCategory" element={<CrudCategory />}></Route>
          <Route path="createReview" element={<CreateReview />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
