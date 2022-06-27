const createHashForCSV = (prodLines, hash) => {
  let productLineNames = prodLines.map((el) => el);
  productLineNames.forEach((el) => {
    el["завтрак"] = { hospitals: {}, dishes: {} };
    el["обед"] = { hospitals: {}, dishes: {} };
    el["ужин"] = { hospitals: {}, dishes: {} };
  });

  // productLineNames.forEach((el) => (el.hospitals = {}));
  // productLineNames.forEach(
  //   (el) => (el.dishes = { завтрак: {}, обед: {}, ужин: {} })
  // );
  hash.forEach((hospital) => {
    hospital.departmentForUI.forEach((department) => {
      for (let [eatingName, departmentDishes] of Object.entries(
        department.includesDishes
      )) {
        if (departmentDishes.length > 0) {
          departmentDishes.forEach((dish) => {
            if (+dish.totalWeight > 0) {
              let currentIdx = productLineNames.findIndex(
                (productLine) => productLine.id === dish.productLine.id
              );
              if (
                !(
                  hospital.hospitalName in
                  productLineNames[currentIdx][eatingName].hospitals
                )
              ) {
                productLineNames[currentIdx][eatingName].hospitals[
                  hospital.hospitalName
                ] = {};
              }
              if (
                !(
                  department.departmentName in
                  productLineNames[currentIdx][eatingName].hospitals[
                    hospital.hospitalName
                  ]
                )
              ) {
                productLineNames[currentIdx][eatingName].hospitals[
                  hospital.hospitalName
                ][department.departmentName] = {};
              }
              productLineNames[currentIdx][eatingName].hospitals[
                hospital.hospitalName
              ][department.departmentName][dish.dishName] = dish.totalWeight;
              //
              //
              //
              //
              if (
                !(
                  dish.dishName in
                  productLineNames[currentIdx][eatingName].dishes
                )
              ) {
                let obj = {
                  totalAmountOfWeight: 0,
                  ingredients: dish.ingredients,
                };
                productLineNames[currentIdx][eatingName].dishes[dish.dishName] =
                  obj;
              }
              productLineNames[currentIdx][eatingName].dishes[
                dish.dishName
              ].totalAmountOfWeight += +dish.totalWeight;
            }
          });
        }
      }
      // department.includesDishes.forEach((dish) => {
      //   if (+dish.totalWeight > 0) {
      //     let currentIdx = productLineNames.findIndex(
      //       (productLine) => productLine.id === dish.productLine.id
      //     );
      //     if (
      //       !(hospital.hospitalName in productLineNames[currentIdx].hospitals)
      //     ) {
      //       productLineNames[currentIdx].hospitals[hospital.hospitalName] = {};
      //     }
      //     if (
      //       !(
      //         department.departmentName in
      //         productLineNames[currentIdx].hospitals[hospital.hospitalName]
      //       )
      //     ) {
      //       productLineNames[currentIdx].hospitals[hospital.hospitalName][
      //         department.departmentName
      //       ] = {};
      //     }
      //     productLineNames[currentIdx].hospitals[hospital.hospitalName][
      //       department.departmentName
      //     ][dish.dishName] = dish.totalWeight;
      //     if (!(dish.dishName in productLineNames[currentIdx].dishes)) {
      //       let obj = {
      //         totalAmountOfWeight: 0,
      //         ingredients: dish.ingredients,
      //       };
      //       productLineNames[currentIdx].dishes[dish.dishName] = obj;
      //     }
      //     productLineNames[currentIdx].dishes[
      //       dish.dishName
      //     ].totalAmountOfWeight += +dish.totalWeight;
      //   }
      // });
    });
  });
  productLineNames.forEach((line) => {
    let helper = ["завтрак", "обед", "ужин"];
    helper.forEach((mealTime) => {
      if (Object.keys(line[mealTime].dishes).length > 0) {
        Object.values(line[mealTime].dishes).forEach((dishForCalc) => {
          dishForCalc.ingredients.forEach((ingred) => {
            ingred.totalIngredientWeight =
              dishForCalc.totalAmountOfWeight * ingred.factor;
          });
        });
      }
    });
    // for (let val of Object.values(line.dishes)) {
    //   for (let dishesValue of Object.values(val)) {
    //     dishesValue.ingredients.forEach((ingred) => {
    //       ingred.totalIngredientWeight =
    //         dishesValue.totalAmountOfWeight * ingred.factor;
    //     });
    //   }

    // }
  });
  return productLineNames;
};

export default createHashForCSV;
