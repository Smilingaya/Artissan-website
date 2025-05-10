import React from "react";
import landingVideo from "../../assets/landing.mp4"; 

const BackgroundVideo = () => {
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  };

  const videoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "auto",
    zIndex: "-1",
    transform: "translate(-50%, -50%)",
    objectFit: "cover",
  };

  const contentStyle = {
    position: "relative",
    zIndex: "1",
    textAlign: "center",
    color: "white",
    paddingTop: "20vh",
    color: "black",
  };

  return (
    <div style={containerStyle}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={videoStyle}
      >
        <source src={landingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={contentStyle}>
        <h1>Welcome!</h1>
        <p>This is on top of the background video.</p>
      </div>
    </div>
  );
};

export default BackgroundVideo;