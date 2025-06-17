import React from 'react';
import { Box } from '@mui/material';

const CircleProgressChart = ({ percentage }) => {
  // SVG circle values
  const radius = 60;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Box sx={{ position: 'relative' }}>
      <svg width="110" height="110" viewBox="0 0 150 150">
        <circle 
          cx="75" 
          cy="75" 
          r={radius} 
          strokeWidth="10" 
          fill="none" 
          stroke="#e9ecef"
        />
        <circle 
          cx="75" 
          cy="75" 
          r={radius} 
          strokeWidth="10" 
          fill="none" 
          stroke="#2E8B57"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90, 75, 75)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
        <text 
          x="75" 
          y="75" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#333" 
          style={{ fontSize: '1.5rem', fontWeight: 500 }}
        >
          {percentage}%
        </text>
      </svg>
    </Box>
  );
};

export default CircleProgressChart;