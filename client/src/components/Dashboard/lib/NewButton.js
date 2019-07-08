import React, { Component } from 'react';
import "./NewButton.css";

export default ({ route, text, history }) => {
  return (
    <a href="" className="NewButton main-button-color" onClick={(e) => {
      e.preventDefault();
      history.push(route);
    }}>{text}</a>
  )
}