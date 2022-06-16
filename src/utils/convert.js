import { jsPDF } from "jspdf";
import "../fonts/RobotoRegular-normal";

const convertToCSV = (hash, dataName) => {
  const doc = new jsPDF();
  doc.setFont("RobotoRegular");
  let res = []; ////////////////
  hash.forEach((prodLine) => {
    res.push(prodLine.productLineName + "\n"); ////////////////
    hash.indexOf(prodLine) === 0 ? null : doc.addPage();

    //210 297 ___A4 size
    doc.setFontSize(12);
    doc.text(dataName, 4, 4);
    doc.setFontSize(16);
    doc.text(prodLine.productLineName, 100, 10, { align: "center" });
    let currentHeightOfPage = 14;
    Object.keys(prodLine.dishes).forEach((dishName) => {
      let line =
        dishName +
        " " +
        Math.round(prodLine.dishes[dishName].totalAmountOfWeight / 1000) +
        " " +
        "кг" +
        " " +
        prodLine.dishes[dishName].totalAmountOfWeight +
        " " +
        "гр";
      doc.setFontSize(12);
      let isCurrentPage = currentHeightOfPage + 6 <= 277;
      if (isCurrentPage) {
        currentHeightOfPage += 6;
        doc.text(line, 8, currentHeightOfPage);
      } else {
        doc.addPage();
        currentHeightOfPage = 10;
        doc.text(line, 8, currentHeightOfPage);
      }

      prodLine.dishes[dishName].ingredients.forEach((ingred) => {
        let ingredLine =
          ingred.ingredientName +
          " " +
          Math.round(ingred.totalIngredientWeight / 1000) +
          " " +
          "кг" +
          " " +
          ingred.totalIngredientWeight +
          " " +
          "гр";
        doc.setFontSize(10);
        let isCurrentPageForIngredients = currentHeightOfPage + 4 <= 277;
        if (isCurrentPageForIngredients) {
          currentHeightOfPage += 4;
          doc.text(ingredLine, 12, currentHeightOfPage);
        } else {
          doc.addPage();
          currentHeightOfPage = 10;
          doc.text(ingredLine, 12, currentHeightOfPage);
        }
      });
    });
    doc.addPage();
    doc.setFontSize(12);
    doc.text(dataName, 4, 4);
    doc.setFontSize(16);
    doc.text(`${prodLine.productLineName}:Отгрузка`, 100, 10, {
      align: "center",
    });
    res.push(prodLine.productLineName + "\n"); //////////////////
    let currentHeightOfPageForShipment = 14;
    let heightForSecondCol = 14;
    let heightForThirdCol = 14;
    Object.keys(prodLine.hospitals).forEach((hospitalName) => {
      let step = 0;
      doc.setFontSize(11);
      let isCurrentPageForShipment = currentHeightOfPageForShipment + 6 <= 277;
      if (isCurrentPageForShipment) {
        currentHeightOfPageForShipment += 6;
        heightForSecondCol = currentHeightOfPageForShipment;
        heightForThirdCol = currentHeightOfPageForShipment;
        doc.text(hospitalName, 100, currentHeightOfPageForShipment, {
          align: "center",
        });
      } else {
        doc.addPage();
        currentHeightOfPageForShipment = 10;
        heightForSecondCol = 10;
        currentHeightOfPageForShipment = 10;
        doc.text(hospitalName, 100, currentHeightOfPageForShipment, {
          align: "center",
        });
      }
      res.push("," + hospitalName + "\n"); /////////////////////////////
      Object.keys(prodLine.hospitals[hospitalName]).forEach(
        (departmentName) => {
          doc.setFontSize(10);
          isCurrentPageForShipment = currentHeightOfPageForShipment + 6 <= 277;
          if (isCurrentPageForShipment) {
            if (step === 0) {
              currentHeightOfPageForShipment += 6;
              doc.text(departmentName, 4, currentHeightOfPageForShipment);
            } else if (step === 1) {
              heightForSecondCol += 6;
              doc.text(departmentName, 74, heightForSecondCol);
            } else {
              heightForThirdCol += 6;
              doc.text(departmentName, 148, heightForThirdCol);
            }
          } else {
            doc.addPage();
            currentHeightOfPageForShipment = 10;
            heightForSecondCol = 10;
            heightForThirdCol = 10;
            step = 0;
            if (step === 0) {
              currentHeightOfPageForShipment += 6;
              doc.text(departmentName, 4, currentHeightOfPageForShipment);
            } else if (step === 1) {
              heightForSecondCol += 6;
              doc.text(departmentName, 74, heightForSecondCol);
            } else {
              heightForThirdCol += 6;
              doc.text(departmentName, 148, heightForThirdCol);
            }
          }

          res.push("," + "," + departmentName.replace(/,/g, "+") + "\n"); ///////////////////////////////
          Object.keys(prodLine.hospitals[hospitalName][departmentName]).forEach(
            (dishName) => {
              let dishLineForShipment =
                dishName +
                " " +
                Math.round(
                  prodLine.hospitals[hospitalName][departmentName][dishName] /
                    1000
                ) +
                " " +
                "кг" +
                " " +
                prodLine.hospitals[hospitalName][departmentName][dishName] +
                " " +
                "гр";
              doc.setFontSize(9);
              isCurrentPageForShipment =
                currentHeightOfPageForShipment + 4 <= 277 &&
                heightForSecondCol + 4 <= 277 &&
                heightForThirdCol + 4 <= 277;
              if (isCurrentPageForShipment) {
                if (step === 0) {
                  currentHeightOfPageForShipment += 4;
                  doc.text(
                    dishLineForShipment,
                    8,
                    currentHeightOfPageForShipment
                  );
                } else if (step === 1) {
                  heightForSecondCol += 4;
                  doc.text(dishLineForShipment, 78, heightForSecondCol);
                } else {
                  heightForThirdCol += 4;
                  doc.text(dishLineForShipment, 148, heightForThirdCol);
                }
              } else {
                doc.addPage();
                currentHeightOfPageForShipment = 10;
                heightForSecondCol = 10;
                heightForThirdCol = 10;
                step = 0;
                if (step === 0) {
                  currentHeightOfPageForShipment += 4;
                  doc.text(
                    dishLineForShipment,
                    8,
                    currentHeightOfPageForShipment
                  );
                } else if (step === 1) {
                  heightForSecondCol += 4;
                  doc.text(dishLineForShipment, 78, heightForSecondCol);
                } else {
                  heightForThirdCol += 4;
                  doc.text(dishLineForShipment, 148, heightForThirdCol);
                }
              }
              //
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
              ); //
            }
          );
          step = step + 1 > 2 ? 0 : step + 1;
        }
      );
    });
  });

  return doc;
};

// Default export is a4 paper, portrait, using millimeters for units

// let helperForMonth = (month) => {
//   let correctMonth = +month + 1;
//   if (correctMonth < 10) {
//     return "0" + correctMonth;
//   } else {
//     return "" + correctMonth;
//   }
// };
function exportCSVFile(hash, fileName) {
  // const doc = new jsPDF();
  // doc.setFont("RobotoRegular");
  // doc.text("Hello мииип!", 90, 10);
  // doc.text("Hello word!", 5, 20);
  // doc.addPage();
  // doc.text("Hello word!", 20, 20);
  if (!fileName) {
    fileName = "Без-имени";
  }
  let today = new Date();
  let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let dayTomorrow = tomorrow.getDate();
  let monthTomorrow = tomorrow.getMonth() + 1;
  let yearTomorrow = tomorrow.getFullYear();
  let dataName = dayTomorrow + "." + monthTomorrow + "." + yearTomorrow;
  const doc = convertToCSV(hash, dataName);
  doc.save(`${fileName}-${dataName}.pdf`);
  //This is a key for printing
  // let today = new Date(Date.now());
  // const exportedFileName =
  //   today.getDate() +
  //   "." +
  //   helperForMonth(today.getMonth()) +
  //   "." +
  //   today.getFullYear();
  // const blob = new Blob([doc], {
  //   type: "application/pdf",
  // });
  // const url = URL.createObjectURL(blob);
  // let newWin = window.open(
  //   url,
  //   "_blank",
  //   "width=500,height=300,menubar=yes,scrollbars=yes,status=yes,resizable=yes"
  // );
  // newWin.focus();
  // newWin.print(); //чтобы эта строка сработала страница должна быть в сети, т.е. НЕ локально.

  // const link = document.createElement("a");
  // if (link.download !== undefined) {
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute("href", url);
  //   link.setAttribute("download", exportedFileName);
  //   link.style.visibility = "hidden";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }
}

export default exportCSVFile;
