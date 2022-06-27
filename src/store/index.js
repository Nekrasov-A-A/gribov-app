import Vue from "vue";
import Vuex from "vuex";
import firebaseapi from "./firebaseapi";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // currentDay: [], // {"завтрак": [], "обед": [], "ужин": []} fake
    currentDay: { завтрак: [], обед: [], ужин: [] },
    hospitals: [],
    productLines: [],
    ration: {},
    userName: "",
    diets: [],
    ingredients: [],
    dishes: [],
    hashForHospitals: {},
  },
  getters: {
    getHashForHospitals: (s) => s.hashForHospitals,
    getCurrentDayFromState: (s) => s.currentDay,
    getPartOfCurrentDayFromState: (s) => (part) => s.currentDay[part],
    getCurrentDayWithFilterByDiets: (s) => (array) => {
      let helper = array.map((el) => el.id);
      let hash = {};
      let obj = {};
      for (let [key, val] of Object.entries(s.currentDay)) {
        hash = {};
        obj[key] = val
          .map((dish) =>
            dish.includesDiets.filter((dishDiet) =>
              typeof dishDiet === "string"
                ? helper.includes(dishDiet)
                : helper.includes(dishDiet.id)
            ).length === 0
              ? undefined
              : dish
          )
          .filter((el) => el !== undefined)
          .filter((dish) => {
            if (hash[dish.id]) {
              return false;
            } else {
              hash[dish.id] = true;
              return true;
            }
          });
      }
      return obj;
    },
    getHospitalsFromState: (s) => s.hospitals,
    getUserNameFromState: (s) => s.userName,
    getProductLinesFromState: (s) => s.productLines,
    getDietsFromState: (s) => s.diets,
    getDietsWithFilterByID: (s) => (array) => {
      return array.map((el) =>
        s.diets.find(
          (elem) => elem.id === (typeof el === "string" ? el : el.id)
        )
      );
    },
    getDietsWithFilterByName: (s) => (array) => {
      return array.map((el) => s.diets.find((elem) => elem.dietName === el));
    },
    getTrueIndexOfHospitalFromState: (s) => (hospitalName) => {
      return s.hospitals.findIndex((el) => el.hospitalName === hospitalName);
    },
    getIngredientsFromState: (s) => s.ingredients,
    getDishesFromState: (s) => s.dishes,
    getTrueIndexOfDishFromState: (s) => (dishId) => {
      return s.dishes.findIndex((el) => el.id === dishId);
    },
    getProductLineById: (s) => (productLineId) => {
      return s.productLines.find(
        (el) =>
          el.id ===
          (typeof productLineId === "string" ? productLineId : productLineId.id)
      );
    },
    getProductLineIdByName: (s) => (productLineName) => {
      return s.productLines.find((el) => el.productLineName === productLineName)
        .id;
    },
    getIngredietnsForDishForUIFromState: (s) => (array) => {
      return array.map((el) => {
        let res = s.ingredients.find((elem) => elem.id === el.id);
        el.ingredientName = res.ingredientName;
        return el;
      });
    },
    getIngredietnsForDishFromState: (s) => (index) => {
      return s.dishes[index].ingredients;
    },
    getIngredietnsForDishForUIFromStateByName: (s) => (array) => {
      return array.map((el) => {
        let res = s.ingredients.find((elem) => elem.ingredientName === el);
        res.factor = el.factor;
        res.ingredientWeight = el.ingredientWeight;
        return res;
      });
    },
    getIngredientsForDishFromStateById: (s) => (dishId) => {
      let currentIdx = s.dishes.findIndex((el) => el.id === dishId);
      let arr = s.dishes[currentIdx].ingredients.map((ele) => {
        let res = s.ingredients.find((elem) => elem.id === ele.id);
        ele.ingredientName = res.ingredientName;
        return ele;
      });
      return arr;
    },
    getIngredientsForDishControlFormFromState: (s) => (array, dishId) => {
      let currentIdx = s.dishes.findIndex((el) => el.id === dishId);
      let allIngred = array.map((el) => {
        let incIngred = s.dishes[currentIdx].ingredients.find(
          (elem) => el === elem.ingredientName
        );
        if (incIngred) {
          return incIngred;
        } else {
          let ingred = s.ingredients.find(
            (element) => element.ingredientName === el
          );
          return ingred;
        }
      });
      return allIngred;
    },
  },
  mutations: {
    // UPDATE START
    updateCurrentDay: (state, payload) => {
      state.currentDay = payload;
    },
    updateHashForHospitals: (state, payload) => {
      state.hashForHospitals = payload;
    },
    updateHospitalsForState: (state, payload) => {
      state.hospitals = payload;
    },
    updateProductLinesForState: (state, payload) => {
      state.productLines = payload;
    },

    updateUserNameForState: (state, payload) => {
      state.userName = payload;
    },
    updateDietsForState: (state, payload) => {
      state.diets = payload;
    },
    updateIngredientsForState: (state, payload) => {
      state.ingredients = payload;
    },
    updateDishesForState: (state, payload) => {
      state.dishes = payload;
    },
    // UPDATE END
    // DELETE START
    deleteHospitalFromState: (state, payload) => {
      let currentIdx = state.hospitals.findIndex(
        (el) => el.hospitalName === payload
      );
      state.hospitals.splice(currentIdx, 1);
    },
    deleteProductLineFromState: (state, payload) => {
      let currentIdx = state.productLines.findIndex(
        (el) => el.productLineName === payload
      );
      //получить id
      let currentId = state.productLines[currentIdx].id;
      state.dishes.forEach((el) =>
        el.productLine === currentId ? (el.productLine = "") : null
      );
      //пробежаться по dishes.productLine и удалить все вхождения id + APIset
      state.productLines.splice(currentIdx, 1);
    },
    deleteDietFromState: (state, payload) => {
      let currentIdx = state.diets.findIndex((el) => el.dietName === payload);
      //получить id
      let currentId = state.diets[currentIdx].id;
      state.hospitals.forEach((el) => {
        let dietIdx = el.includesDiets?.findIndex((elem) => elem === currentId);
        if (dietIdx >= 0) {
          el.includesDiets.splice(dietIdx, 1);
        }
      });
      state.dishes.forEach((dish, dishIndex) => {
        dish.includesDiets?.forEach((el, idx) =>
          el === currentId
            ? state.dishes[dishIndex].includesDiets?.splice(idx, 1)
            : null
        );
      });
      //пробежаться по hospitals.includesDiets и удалить все вхождения id + APIset
      //пробежать по ration.includesDiets и удалить все вхождения id + APIset
      state.diets.splice(currentIdx, 1);
    },
    deleteDepartmentFromState: (state, payload) => {
      let [indexDepartment, indexHospital] = payload;
      state.hospitals[indexHospital].includesDepartments.splice(
        indexDepartment,
        1
      );
    },
    deleteIngredientFromState: (state, payload) => {
      let currentIdx = state.ingredients.findIndex(
        (el) => el.ingredientName === payload
      );

      let currentId = state.ingredients[currentIdx].id;
      state.dishes.forEach((el) =>
        el.ingredients.map((elem, idx) =>
          elem.id === currentId ? el.ingredients.splice(idx, 1) : elem
        )
      );
      state.ingredients.splice(currentIdx, 1);
    },
    deleteDishFromState: (state, payload) => {
      state.dishes.splice(payload, 1);
    },
    deleteIngredientForDishForState: (state, payload) => {
      let [dishIndex, ingredientId] = payload;
      let currentIdx = state.dishes[dishIndex].ingredients.findIndex(
        (el) => el.id === ingredientId
      );
      state.dishes[dishIndex].ingredients.splice(currentIdx, 1);
    },
    deleteDishForCurrentDayFromState: (state, payload) => {
      let [part, index] = payload;
      state.currentDay[part].splice(index, 1);
    },
    clearIngredientsForState: (state) => {
      state.ingredients.forEach((el) => delete el.ingredientWeightForNewDish);
    },
    //DELETE END
    // CHANGENAME START
    changeProductLineNameFromState: (state, payload) => {
      let [oldVal, newVal] = payload;
      let currentIdx = state.productLines.findIndex(
        (el) => el.productLineName === oldVal
      );
      state.productLines[currentIdx]["productLineName"] = newVal;
    },
    changeDietNameFromState: (state, payload) => {
      let [oldVal, newVal] = payload;
      let currentIdx = state.diets.findIndex((el) => el.dietName === oldVal);
      state.diets[currentIdx]["dietName"] = newVal;
    },
    changeHospitalNameFromState: (state, payload) => {
      let [oldVal, newVal] = payload;
      let currentIdx = state.hospitals.findIndex(
        (el) => el.hospitalName === oldVal
      );
      state.hospitals[currentIdx]["hospitalName"] = newVal;
    },
    changeDepartmentNameForState: (state, payload) => {
      let [oldVal, newVal, hosIdx] = payload;
      let currentIdx = state.hospitals[hosIdx].includesDepartments.findIndex(
        (el) => el === oldVal
      );
      state.hospitals[hosIdx].includesDepartments[currentIdx] = newVal;
    },
    changeIngredientNameFromState: (state, payload) => {
      let [oldVal, newVal] = payload;
      let currentIdx = state.ingredients.findIndex(
        (el) => el.ingredientName === oldVal
      );
      state.ingredients[currentIdx].ingredientName = newVal;
    },
    changeDishNameFromState: (state, payload) => {
      let [newVal, currentIdx] = payload;
      state.dishes[currentIdx].dishName = newVal;
    },
    changeProductLineForDishFromState: (state, payload) => {
      let [newVal, currentIdx] = payload;
      state.dishes[currentIdx].productLine = newVal;
    },
    changeIncludesDietsForDishFromState: (state, payload) => {
      let [newVal, currentIdx] = payload;
      state.dishes[currentIdx].includesDiets = newVal;
    },
    changeWeightForDishFromState: (state, payload) => {
      let [newVal, currentIdx] = payload;
      state.dishes[currentIdx].dishWeight = newVal;
    },
    changeIngredientsForDishFromState: (state, payload) => {
      let [newVal, currentIdx] = payload;
      state.dishes[currentIdx].ingredients = newVal;
    },
    // CHANGENAME END
    //ADD ITEM START
    addNewProductLineForState: (state, payload) => {
      state.productLines.push(payload);
    },
    addNewDietForState: (state, payload) => {
      state.diets.push(payload);
    },
    addNewHospitalForState: (state, payload) => {
      state.hospitals.push(payload);
    },
    addIncludesDietsForHospital: (state, payload) => {
      let [value, idx] = payload;
      state.hospitals[idx].includesDiets = value;
    },
    addNewIngredientForState: (state, payload) => {
      state.ingredients.push(payload);
    },
    addNewDishesForState: (state, payload) => {
      state.dishes.push(payload);
    },
    addItemToCurrentDay: (state, payload) => {
      let [part, dishes] = payload;
      state.currentDay[part].push(dishes);
    },
    // ADD ITEM END
  },
  actions: {},
  modules: { firebaseapi },
});
