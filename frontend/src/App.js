import {BrowserRouter, Link, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useReducer} from "react";
import {Navbar, Nav, Container, NavDropdown} from "react-bootstrap";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import HomeScreen from "./screens/HomeScreen";
import MovieScreen from "./screens/MovieScreen";
import SigninScreen from "./screens/SigninScreen";
import ShowTimeScreen from "./screens/ShowTimeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import {Store} from "./Stores";
import SearchBox from "./components/SearchBox";
import BookingScreen from "./screens/BookingScreen";
import {LocationScreen} from "./screens/LocationScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PremiumScreen from "./screens/PremiumScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ScreenScreen from "./screens/ScreenScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import axios from 'axios';
import {URL} from "./Constants";
import CancelPremiumScreen from "./screens/CancelPremiumScreen";
import StripeScreen from "./screens/StripeScreen";
import MembershipOptionsScreen from "./screens/MembershipOptionsScreen";

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, info: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

const initialState = {
    info: null,
    loading: false,
    error: null,
};

export default function App() {
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;

    const [state, dispatch] = useReducer(reducer, initialState);

    const signoutHandler = () => {
        ctxDispatch({type: "USER_SIGNOUT"});
        localStorage.removeItem("userInfo");
        localStorage.removeItem("paymenMethod");
    };

    const getInfo = async () => {
        dispatch({type: "FETCH_REQUEST"});
        try {
            const response = await axios.get(`${URL}/user/info`, {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: "FETCH_SUCCESS", payload: response.data});
        } catch (error) {
            dispatch({type: "FETCH_FAIL", payload: error.message});
        }
    };


    useEffect(() => {
        if (userInfo) getInfo();
    }, [userInfo])


    const {info} = state;
    const generateButton = () => {
        if (info && info.member.membershipTier == "Regular") {
            return (
                <LinkContainer to="/premium">
                    <NavDropdown.Item>Upgrade Premium</NavDropdown.Item>
                </LinkContainer>
            );
        } else {
            return (
                <LinkContainer to="/cancel">
                    <NavDropdown.Item>Cancel Premium</NavDropdown.Item>
                </LinkContainer>
            );
        }
    }


    return (
        <BrowserRouter>
            <div className="d-flex flex-column site-container">
                <header>
                    <Navbar
                        style={{
                            backgroundColor: "#9d1010",
                            fontFamily: "Luminari, fantasy",
                            color: "white",
                        }}
                    >
                        <Container>
                            <LinkContainer to="/">
                                <Navbar.Brand>THC Theater</Navbar.Brand>
                            </LinkContainer>
                            <SearchBox/>
                            <Nav className="me-auto">
                                {userInfo ? (
                                    <NavDropdown
                                        title={
                                            userInfo.role === "Employee"
                                                ? "Admin"
                                                : `${userInfo.firstname} (${info && info.member.membershipTier})`
                                        }
                                        id="basic-nav-dropdown"
                                    >
                                        {userInfo.role === "Employee" ? (
                                            <div>
                                                <LinkContainer to="/locations">
                                                    <NavDropdown.Item>Location</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to="/">
                                                    <NavDropdown.Item>Movies</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to="/showtimes">
                                                    <NavDropdown.Item>Showtime</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to="/analytics">
                                                    <NavDropdown.Item>Analytics</NavDropdown.Item>
                                                </LinkContainer>
                                            </div>
                                        ) : (
                                            <div>
                                                <LinkContainer to="/profile">
                                                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to="/history">
                                                    <NavDropdown.Item>History</NavDropdown.Item>
                                                </LinkContainer>
                                                {userInfo && generateButton()}
                                            </div>
                                        )}
                                        <NavDropdown.Divider/>
                                        <Link
                                            className="dropdown-item"
                                            to="#signout"
                                            onClick={signoutHandler}
                                        >
                                            Sign Out
                                        </Link>
                                    </NavDropdown>
                                ) : (
                                    <>
                                        <Link className="member-options" to="/membership-options">
                                            Membership Options
                                        </Link>
                                        <Link className="nav-Link" to="/signin">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </Nav>
                        </Container>
                    </Navbar>
                </header>
                <main>
                    <Container className="mt-3">
                        <Routes>
                            <Route path="/" element={<HomeScreen/>}/>
                            <Route path="/movie/:id" element={<MovieScreen/>}/>
                            <Route path="/signin" element={<SigninScreen/>}/>
                            <Route path="/showtimes/:id" element={<ShowTimeScreen/>}/>
                            <Route path="/register" element={<RegisterScreen/>}/>
                            <Route path="/bookings/:id" element={<BookingScreen/>}/>
                            <Route path="/locations" element={<LocationScreen/>}/>
                            <Route path="/payment/:id" element={<PaymentScreen/>}/>
                            <Route path="/analytics" element={<AnalyticsScreen/>}/>
                            <Route path="/cancel" element={<CancelPremiumScreen/>}/>
                            <Route path="/payment/stripe/:id" element={<StripeScreen/>}/>
                            <Route path="/membership-options" element={<MembershipOptionsScreen/>}/>
                            <Route path="/profile" element={<ProfileScreen/>}/>
                            <Route path="/premium" element={<PremiumScreen/>}/>
                            <Route path="/history" element={<HistoryScreen/>}/>
                            <Route path="/locations/:id" element={<ScreenScreen/>}/>
                        </Routes>
                    </Container>
                </main>
                <footer>
                    <Navbar
                        style={{
                            backgroundColor: "#9d1010",
                            fontFamily: "Luminari, fantasy",
                            color: "white",
                        }}
                    >
                        <Container className="d-flex justify-content-center align-items-center flex-grow-1">
                            <div className="text-center">
                                2003-2004 TCH Theater , Inc - All Right Reserver
                            </div>
                        </Container>
                    </Navbar>
                </footer>
            </div>
        </BrowserRouter>
    );
}
