import db from "../firebase";
import { ref, child, get, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default {
  state: {
    userUid: "",
    isError: false,
  },
  mutations: {
    setUserUid: (s, payload) => (s.userUid = payload),
    setIsErrorToTrue: (s) => (s.isError = true),
  },
  getters: {
    getUid: (s) => s.userUid,
    getIsError: (s) => s.isError,
  },
  actions: {
    async loginWith(state, { email, password }) {
      let auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          throw error;
        });
    },

    async getUidFromFirebase({ commit }) {
      let auth = getAuth();
      let user = auth.currentUser;
      if (user) {
        commit("setUserUid", user.uid);
      }
    },
    async logout({ commit }) {
      let auth = getAuth();
      await signOut(auth);
      commit("setUserUid", "");
    },
    //database start
    async getHospitalsData({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/hospitalData`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    async getProductLines({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/productLines`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    async getRation({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/ration`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data ration");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    async getUserName({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/userName`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data ration");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    async getDietTypes({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/dietTypes`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data for dietTypes");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    async getIngredients({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/ingredients`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data ingredients");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    async getDishes({ state, commit }) {
      let dbRef = ref(db);
      let uid = state.userUid;
      return await get(child(dbRef, `/users/${uid}/dishes`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            console.log("No data dishes");
          }
        })
        .catch((e) => {
          commit("setIsErrorToTrue");
          console.log(e);
        });
    },
    //API start
    async setProductLine({ state, commit }, productLines) {
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/productLines`);
      try {
        await set(dbRef, productLines);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    // dietTypes start
    async setNewDietForData({ state, commit }, payload) {
      let uid = state.userUid;
      let [value, idx] = payload;
      let dbRef = ref(db, `/users/${uid}/dietTypes/${idx}`);
      try {
        await set(dbRef, value);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async deleteDietForData({ state, commit }, payload) {
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dietTypes`);
      try {
        await set(dbRef, payload);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async changeDietNameForData({ state, commit }, payload) {
      let uid = state.userUid;
      let [value, idx] = payload;
      let dbRef = ref(db, `/users/${uid}/dietTypes/${idx}/dietName`);
      try {
        await set(dbRef, value);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    // dietTypes end

    // HOSPITALS START
    async setHospitalNameForData({ state, commit }, hospitalName) {
      let [value, idx] = hospitalName;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/hospitalData/${idx}/hospitalName`);
      try {
        await set(dbRef, value);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async deleteHospitalForData({ state, commit }, hospitals) {
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/hospitalData`);
      try {
        await set(dbRef, hospitals);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async createHospital({ state, commit }, payload) {
      let [hospitalData, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/hospitalData/${idx}`);
      try {
        await set(dbRef, hospitalData);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    // HOSPITALS END
    // DEPARTMENTS START
    async deleteDepartmentForData({ state, commit }, payload) {
      let [value, indexHospital] = payload;
      let uid = state.userUid;
      let dbRef = ref(
        db,
        `/users/${uid}/hospitalData/${indexHospital}/includesDepartments`
      );
      try {
        await set(dbRef, value);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async setDepartmentNameForData({ state, commit }, payload) {
      let [value, indexDepartment, indexHospital] = payload;
      let uid = state.userUid;
      let dbRef = ref(
        db,
        `/users/${uid}/hospitalData/${indexHospital}/includesDepartments/${indexDepartment}`
      );
      try {
        await set(dbRef, value);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    // DEPARTMENTS END
    // HOSPITAL => INCLUDES DIETS START
    async setIncludesDietsForHospital({ state, commit }, arr) {
      let [value, indexHospital] = arr;
      let uid = state.userUid;
      let dbRef = ref(
        db,
        `/users/${uid}/hospitalData/${indexHospital}/includesDiets`
      );
      try {
        await set(dbRef, value);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },

    // HOSPITAL => INCLUDES DIETS END
    //INGREDIENTS START
    async setIngredientsForData({ state, commit }, payload) {
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/ingredients`);
      try {
        await set(dbRef, payload);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async createIngredientForData({ state, commit }, payload) {
      let [ingredientData, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/ingredients/${idx}`);
      try {
        await set(dbRef, ingredientData);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    //INGREDIENTS END
    //DISHES START
    async setDishesForData({ state, commit }, payload) {
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes`);
      try {
        await set(dbRef, payload);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async createDishForData({ state, commit }, payload) {
      let [dishData, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes/${idx}`);
      try {
        await set(dbRef, dishData);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async changeDishNameForData({ state, commit }, payload) {
      let [newDishName, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes/${idx}/dishName`);
      try {
        await set(dbRef, newDishName);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async changeProductLineForDishForData({ state, commit }, payload) {
      let [newProductLineId, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes/${idx}/productLine`);
      try {
        await set(dbRef, newProductLineId);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async changeIncludesDietsForDishForData({ state, commit }, payload) {
      let [newIncludesDiets, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes/${idx}/includesDiets`);
      try {
        await set(dbRef, newIncludesDiets);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async changeWeightForDishForData({ state, commit }, payload) {
      let [newWeight, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes/${idx}/dishWeight`);
      try {
        await set(dbRef, newWeight);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    async changeIngredientsForDishForData({ state, commit }, payload) {
      let [newIngredients, idx] = payload;
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/dishes/${idx}/ingredients`);
      try {
        await set(dbRef, newIngredients);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
    //DISHES END
    async setUserName({ state, commit }, payload) {
      let uid = state.userUid;
      let dbRef = ref(db, `/users/${uid}/userName`);
      try {
        await set(dbRef, payload);
      } catch (e) {
        commit("setIsErrorToTrue");
        console.log(e);
      }
    },
  },
};
