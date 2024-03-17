const fs = require("fs");
const genAdminToken = () => {
  const characters = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  characters.sort(() => 0.5 - Math.random());
  return characters.join("");
};

for (let i = 0; i < 100; i++) {
  const token = genAdminToken();
  try {
    fs.appendFileSync("admintoken.txt", `${token}\n`);
  } catch (e) {
    console.log(e);
  }
}
