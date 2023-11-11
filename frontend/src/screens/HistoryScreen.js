import React, { useContext, useEffect, useReducer } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Store } from "../Stores";
import { getError } from "../utils";
import { URL } from "../Constants";
import axios from "axios";
import { Helmet } from "react-helmet";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HistoryScreen() {
    //TODO: connect backend

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`${URL}/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox varian="fanger">{error}</MessageBox>
      ) : (
        <Table className="table">
          <thead>
            <tr>
              <th>MOVIE</th>
              <th>SCREEN</th>
              <th>LOCATION</th>
              <th>SEATS</th>
              <th>STATUS</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
                <tr key={order.movie.name}>
                    <td>{order.screenAt}</td>
                </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
