import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SignUpAll from "./components/signLogin/signUpAll";
import Login from "./components/signLogin/Login";

import TouristDashboard from "./components/Toursit_Dashboard/Tourist_dash";
import ViewAdvertiserProfile from "./components/Profiles/Advertiser_profile";
import ViewTourGuideProfile from "./components/Profiles/Tour_guide_profile";
import ViewSellerProfile from "./components/Profiles/Seller_profile";

import AddTourismGovenor from "./components/Admin_/add_tourism_govenor";
import AddAdmin from "./components/Admin_/add_admin";

import ViewActivityAdv from "./components/viewActivityAdv";

import ViewActivityGuest from "./components/viewActivityGuest";
import ViewItineraryGuest from "./components/viewItineraryGuest";
import ViewLandmarks from "./components/viewLandmarks";
import ViewProductAdmin from "./components/viewProductAdmin";
import ViewProductTourist from "./components/viewProductTourist";
import EditProduct from "./components/editProduct";

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
          <Route
            path="/Tourist_Dashboard"
            element={<TouristDashboard />}
          ></Route>

          <Route
            path="/addTourismGovenor"
            element={<AddTourismGovenor />}
          ></Route>

          <Route path="/addAdmin" element={<AddAdmin />}></Route>

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
          <Route
            path="/viewItineraryGuest"
            element={<ViewItineraryGuest />}
          ></Route>
          <Route path="/viewLandmarks" element={<ViewLandmarks />}></Route>
          <Route
            path="/viewProductAdmin"
            element={<ViewProductAdmin />}
          ></Route>
          <Route
            path="/viewProductTourist"
            element={<ViewProductTourist />}
          ></Route>
          <Route path="/editProduct" element={<EditProduct />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
