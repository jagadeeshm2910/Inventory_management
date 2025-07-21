import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, LayoutGroup } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Chart from "react-apexcharts";

// Parent Card
const Card = ({ id, title, color, barValue, value, png, series }) => {
  const [expanded, setExpanded] = useState(false);
  const layoutId = `expandableCard-${id}`; // Unique layout ID

  return (
    <LayoutGroup>
      {expanded ? (
        <ExpandedCard
          title={title}
          color={color}
          value={value}
          png={png}
          series={series}
          layoutId={layoutId}
          setExpanded={() => setExpanded(false)}
        />
      ) : (
        <CompactCard
          title={title}
          color={color}
          barValue={barValue}
          value={value}
          png={png}
          layoutId={layoutId}
          setExpanded={() => setExpanded(true)}
        />
      )}
    </LayoutGroup>
  );
};

// Compact Card
function CompactCard({
  title,
  color,
  barValue,
  value,
  png: Png,
  layoutId,
  setExpanded,
}) {
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
      layoutId={layoutId}
      onClick={setExpanded}
    >
      <div className="radialBar">
        <CircularProgressbar value={barValue} text={`${barValue}%`} />
        <span>{title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>${value}</span>
        <span>Last 24 hours</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({
  title,
  color,
  value,
  png: Png,
  series,
  layoutId,
  setExpanded,
}) {
  const data = {
    options: {
      chart: { type: "area", height: "auto" },
      stroke: { curve: "smooth", colors: ["white"] },
      fill: { colors: ["#fff"], type: "gradient" },
      dataLabels: { enabled: false },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm" },
      },
      grid: { show: true },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
    },
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
      layoutId={layoutId}
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <CloseIcon onClick={setExpanded} />
      </div>
      <span>{title}</span>
      <div className="chartContainer">
        <Chart options={data.options} series={series} type="area" />
      </div>
      <span>Last 24 hours</span>
    </motion.div>
  );
}

export default Card;
