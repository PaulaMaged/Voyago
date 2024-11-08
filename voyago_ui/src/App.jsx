import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AddTourismGovenor from "./components/Admin_/add_tourism_govenor";
import AddAdmin from "./components/Admin_/add_admin";
import ViewAdvertiserProfile from "./components/Profiles/Advertiser_profile";
import ViewTourGuideProfile from "./components/Profiles/Tour_guide_profile";
import ViewSellerProfile from "./components/Profiles/Seller_profile";
import ViewTourist from "./components/Profiles/Tourist_profile";
import ViewActivityAdv from "./components/viewActivityAdv";
import Login from "./components/signLogin/Login";
import ViewActivityGuest from "./components/viewActivityGuest";
import ViewItineraryGuest from "./components/viewItineraryGuest";
import ViewLandmarks from "./components/viewLandmarks";
import ViewProductAdmin from "./components/viewProductAdmin";
import ViewProductTourist from "./components/viewProductTourist";
import EditProduct from "./components/editProduct";
import SignUpAll from "./components/signLogin/signUpAll";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signUp" element={<SignUpAll />}></Route>
          <Route path="/login" element={<Login />}></Route>

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

          <Route path="/ViewTourist" element={<ViewTourist />}></Route>

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
