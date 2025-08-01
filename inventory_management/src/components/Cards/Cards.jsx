import React from "react";
import "./Cards.css";
import { cardsData } from "../Data/Data";
import Summary from "../Summary/Summary";
import Card from "../Card/Card";

const Cards = ({ refreshKey }) => {
  return (
    <div className="Cards">
      {/* {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              id={card.id}
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
            />
          </div>
        );
      })} */}
      <div className="parentContainer">
        <Summary refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default Cards;
