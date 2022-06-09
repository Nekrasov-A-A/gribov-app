const convertToCSV = (hash) => {
  let res = [];
  hash.forEach((prodLine) => {
    res.push(prodLine.productLineName + "\n");
    Object.keys(prodLine.dishes).forEach((dishName) => {
      let line =
        "," +
        dishName +
        "," +
        (prodLine.dishes[dishName].totalAmountOfWeight / 1000).toFixed(1) +
        "," +
        "кг" +
        "," +
        prodLine.dishes[dishName].totalAmountOfWeight +
        "," +
        "грамм" +
        "\n";
      res.push(line);
      prodLine.dishes[dishName].ingredients.forEach((ingred) => {
        let ingredLine =
          "," +
          "," +
          ingred.ingredientName +
          "," +
          (ingred.totalIngredientWeight / 1000).toFixed(1) +
          "," +
          "кг" +
          "," +
          ingred.totalIngredientWeight +
          "," +
          "грамм" +
          "\n";
        res.push(ingredLine);
      });
    });
    res.push(prodLine.productLineName + "\n");
    Object.keys(prodLine.hospitals).forEach((hospitalName) => {
      res.push("," + hospitalName + "\n");
      Object.keys(prodLine.hospitals[hospitalName]).forEach(
        (departmentName) => {
          res.push("," + "," + departmentName.replace(/,/g, "+") + "\n");
          Object.keys(prodLine.hospitals[hospitalName][departmentName]).forEach(
            (dishName) => {
              res.push(
                "," +
                  "," +
                  "," +
                  dishName +
                  "," +
                  (
                    prodLine.hospitals[hospitalName][departmentName][dishName] /
                    1000
                  ).toFixed(1) +
                  "," +
                  "кг" +
                  "," +
                  prodLine.hospitals[hospitalName][departmentName][dishName] +
                  "," +
                  "грамм" +
                  "\n"
              );
            }
          );
        }
      );
    });
  });
  return res.join("");
};

let helperForMonth = (month) => {
  let correctMonth = +month + 1;
  if (correctMonth < 10) {
    return "0" + correctMonth;
  } else {
    return "" + correctMonth;
  }
};
function exportCSVFile(hash) {
  const csv = convertToCSV(hash);

  let today = new Date(Date.now());
  const exportedFileName =
    today.getDate() +
    "." +
    helperForMonth(today.getMonth()) +
    "." +
    today.getFullYear() +
    ".csv";
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", exportedFileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default exportCSVFile;
