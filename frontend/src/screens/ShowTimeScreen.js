import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { Container } from "react-bootstrap";


export default function ShowTimeScreen() {
  return (
    <Container>
      <Helmet>
        <title>Show Time</title>
      </Helmet>
      <h1>Movie Showtimes</h1>
      <table className="table table-bordered table-striped">
        <thead className="thead">
          <tr>
              <th>Movie</th>
              <th>Showtime</th>
              <th>Location</th>
              <th>Tickets</th>
          </tr>
        </thead>
        <tbody className="tbody">
          <tr>
            <td>Movie 1</td>
            <td>10:00 AM</td>
            <td>Theater 1</td>
            <td><a href="#" class="btn btn-primary">Buy Tickets</a></td>
          </tr>
          <tr>
            <td>Movie 2</td>
            <td>2:30 PM</td>
            <td>Theater 2</td>
            <td><a href="#" class="btn btn-primary">Buy Tickets</a></td>
          </tr>
          <tr>
            <td>Movie 3</td>
            <td>2:30 PM</td>
            <td>Theater 3</td>
            <td><a href="#" class="btn btn-primary">Buy Tickets</a></td>
         </tr>
         <tr>
            <td>Movie 4</td>
            <td>1:30 PM</td>
            <td>Theater 4</td>
            <td><a href="#" class="btn btn-primary">Buy Tickets</a></td>
         </tr>

        </tbody>
      </table>
      
    </Container>

  )
}