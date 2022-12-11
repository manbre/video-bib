const fs = require("fs");

const writeLocationTxt = (req, res) => {
  fs.writeFile("location.txt", "", (err) => {
    if (err) throw err;
  });
  let data = req.params.location;
  let buff = new Buffer.from(data, "base64");
  let text = buff.toString("ascii");
  fs.writeFile("location.txt", text, (err) => {
    if (err) throw err;
  });
};

const readLocationTxt = (req, res) => {
  const location = fs.readFileSync("location.txt", "utf-8");
  console.log(location);
  const arr = [];
  arr.push(location);
  res.send(arr);
};

module.exports = { writeLocationTxt, readLocationTxt };
