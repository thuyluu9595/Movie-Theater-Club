import axios from "axios";
import React, { useContext, useReducer, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { URL } from "../Constants";
import { Store } from "../Stores";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CANCEL_REQUEST":
      return { ...state, loading: true };
    case "CANCEL_SUCCESS":
      return { loading: false, success: true };
    case "CANCEL_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  success: false,
  error: null,
  loading: false,
};

function CancelPremiumScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const { loading, success, error } = state;

  const { state: ctxState, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = ctxState;
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "CANCEL_REQUEST" });
    try {
      const { data } = await axios.put(
        `${URL}/user/${userInfo.id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CANCEL_SUCCESS" });
      navigate("/");
      window.location.reload();
    } catch (error) {
      dispatch({ type: "CANCEL_FAIL", payload: error.message });
    }
  };
  return (
    <Container>
      {loading && <LoadingBox />}
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      <h1>Cancel Premium</h1>
      <p>
        We're sorry to see you go. If you proceed with the cancellation, you
        will lose access to all premium features and benefits associated with
        your membership.
      </p>
      <Form>
        <Form.Group controlId="formCheckbox">
          <Form.Check
            type="checkbox"
            label="I have read and understand the consequences of canceling my membership."
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.value);
            }}
          />
        </Form.Group>
        <Button
          variant="danger"
          onClick={(e) => submitHandler(e)}
          disabled={!isChecked}
        >
          Cancel Membership
        </Button>
      </Form>
    </Container>
  );
}

export default CancelPremiumScreen;
