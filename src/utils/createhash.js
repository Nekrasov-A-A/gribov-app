const createHashForCSV = (prodLines, hash) => {
  let productLineNames = prodLines.map((el) => el);
  productLineNames.forEach((el) => (el.hospitals = {}));
  productLineNames.forEach((el) => (el.dishes = {}));
  hash.forEach((hospital) => {
    hospital.departmentForUI.forEach((department) => {
      department.includesDishes.forEach((dish) => {
        if (+dish.totalWeight > 0) {
          let currentIdx = productLineNames.findIndex(
            (productLine) => productLine.id === dish.productLine.id
          );
          if (
            !(hospital.hospitalName in productLineNames[currentIdx].hospitals)
          ) {
            productLineNames[currentIdx].hospitals[hospital.hospitalName] = {};
          }
          if (
            !(
              department.departmentName in
              productLineNames[currentIdx].hospitals[hospital.hospitalName]
            )
          ) {
            productLineNames[currentIdx].hospitals[hospital.hospitalName][
              department.departmentName
            ] = {};
          }
          productLineNames[currentIdx].hospitals[hospital.hospitalName][
            department.departmentName
          ][dish.dishName] = dish.totalWeight;
          if (!(dish.dishName in productLineNames[currentIdx].dishes)) {
            let obj = {
              totalAmountOfWeight: 0,
              ingredients: dish.ingredients,
            };
            productLineNames[currentIdx].dishes[dish.dishName] = obj;
          }
          productLineNames[currentIdx].dishes[
            dish.dishName
          ].totalAmountOfWeight += +dish.totalWeight;
        }
      });
    });
  });
  productLineNames.forEach((line) => {
    for (let val of Object.values(line.dishes)) {
      val.ingredients.forEach((ingred) => {
        ingred.totalIngredientWeight = val.totalAmountOfWeight * ingred.factor;
      });
    }
  });
  return productLineNames;
};

export default createHashForCSV;
