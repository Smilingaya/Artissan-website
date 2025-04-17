const express = require("express");
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0]; // Remove extension
    const folder = parts.pop(); // Folder before the file
    return `${folder}/${fileName}`;
  } catch (err) {
    return null;
  }
};

module.exports = { extractPublicId };
