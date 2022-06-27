<template>
  <div class="d-flex flex-column align-center justify-center pb-10 mt-4">
    <div>
      <v-tabs background-color="white" centered class="pt-4 mb-6">
        <v-tabs-slider class="blue"></v-tabs-slider>
        <v-tab
          v-for="hospitalName in getHospitalsFromState.map(
            (el) => el.hospitalName
          )"
          :key="hospitalName"
          @click="currentHospital = hospitalName"
          class="black--text"
        >
          {{ hospitalName }}
        </v-tab>
      </v-tabs>
    </div>
    <div
      v-for="hospital in getHashForHospitals"
      :key="hospital.hospitalName"
      v-show="hospital.hospitalName === currentHospital"
    >
      <!-- TABLE START -->
      <v-form v-model="isValidFormForDiets">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Название отделения</th>
                <th
                  v-for="dietTitle in hospital.includesDiets"
                  :key="dietTitle.id"
                >
                  {{ dietTitle.dietName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="department in hospital.departmentForUI"
                :key="department.departmentName"
              >
                <td>{{ department.departmentName }}</td>
                <td
                  v-for="diet in department.includesDiets"
                  :key="diet.dietName"
                >
                  <v-text-field
                    dense
                    v-model="diet.amount"
                    :rules="[(v) => !!v || '', (v) => +v >= 0 || '']"
                    class="diet-control"
                  >
                  </v-text-field>
                </td>
                <td v-if="department.isCalc">
                  <OverlayManualEditing :dishInfo="department.includesDishes" />
                </td>
                <td v-if="!department.isAnotherMenu">
                  <v-tooltip top color="black">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="calculateForDepartment(department)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon> mdi-calculator </v-icon>
                      </v-btn>
                    </template>
                    <span>Рассчитать с текущим меню</span>
                  </v-tooltip>
                </td>
                <td>
                  <MenuForDepartment
                    :depart="department"
                    @forceUpdateForMainForms="forceUpdateForMainForms"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-form>
      <!-- TABLE END -->
    </div>
    <v-tooltip top color="black">
      <template v-slot:activator="{ on, attrs }">
        <button
          class="btn--download"
          v-bind="attrs"
          v-on="on"
          @click="createHashAndDownload"
        >
          <v-icon>mdi-download </v-icon>
        </button>
      </template>
      <span>Скачать PDF-файл</span>
    </v-tooltip>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import OverlayManualEditing from "./OverlayManualEditing.vue";
import MenuForDepartment from "./MenuForDepartment.vue";
import createHashForCSV from "../utils/createhash";
import exportCSVFile from "../utils/convert";
export default {
  components: {
    OverlayManualEditing,
    MenuForDepartment,
  },
  computed: {
    ...mapGetters([
      "getDishesFromState",
      "getCurrentDayFromState",
      "getHospitalsFromState",
      "getDietsWithFilterByID",
      "getHashForHospitals",
      "getCurrentDayWithFilterByDiets",
      "getProductLineById",
      "getIngredietnsForDishForUIFromState",
      "getProductLinesFromState",
      "getUserNameFromState",
    ]),
  },
  data: function () {
    return {
      searchForMenu: "",
      currentHospital: "",
      isValidFormForDiets: true,
      isValidFormForCurrentDay: true,
    };
  },
  methods: {
    createHashAndDownload() {
      let hash = createHashForCSV(
        this.getProductLinesFromState,
        this.getHashForHospitals
      );
      exportCSVFile(hash, this.getUserNameFromState);
    },
    ...mapMutations([
      "addItemToCurrentDay",
      "deleteDishForCurrentDayFromState",
      "updateHashForHospitals",
      "updateCurrentDay",
    ]),
    forceUpdateForMainForms(department) {
      this.$forceUpdate();
      department.isCalc = true;
    },

    calculateForDepartment(department) {
      if (
        !department.includesDiets
          .map((el) => el.amount !== "" && +el.amount >= 0)
          .includes(false) &&
        department.includesDiets.reduce((acc, val) => (acc += +val.amount), 0) >
          0
      ) {
        for (let val of Object.values(department.includesDishes)) {
          val.map((dish) => {
            let dietsForCount = dish.includesDiets.map((dishDiet) => {
              return department.includesDiets.find(
                (diet) => diet.dietName === dishDiet.dietName
              );
            });
            let totalAmountForDish = dietsForCount
              .filter((el) => el !== undefined)
              .reduce((acc, curr) => acc + +curr.amount, 0);
            dish.totalAmountClients = totalAmountForDish;
            dish.totalWeight =
              dish.totalAmountClients * dish.dishWeight * dish.amount + "";
            dish.ingredients = this.getIngredietnsForDishForUIFromState(
              dish.ingredients
            );
            return dish;
          });
        }
        department.isCalc = true;
        this.$forceUpdate();
      }
    },
  },
  mounted() {
    let hash = [];
    let hospitals = JSON.parse(JSON.stringify(this.getHospitalsFromState));
    hospitals.forEach((hospital) => {
      hospital.includesDiets = JSON.parse(
        JSON.stringify(this.getDietsWithFilterByID(hospital.includesDiets))
      );

      hospital.departmentForUI = [];
      hospital.includesDepartments.forEach((department) => {
        let dep = {
          departmentName: department,
          includesDiets: [],
          isCalc: false,
          isAnotherMenu: false,
        };
        hospital.includesDiets.forEach((diet) => {
          let incDiet = {
            dietName: diet.dietName,
            amount: "0",
            id: diet.id,
          };
          dep.includesDiets.push(incDiet);
        });
        hospital.departmentForUI.push(dep);
      });
      delete hospital.includesDepartments;
      hash.push(hospital);
    });
    this.updateHashForHospitals(hash);
    this.getHashForHospitals.forEach((hospital) => {
      let currentDishes = this.getCurrentDayWithFilterByDiets(
        hospital.includesDiets
      );
      hospital.includesDishes = currentDishes;
      hospital.departmentForUI.forEach((department) => {
        if (!department.isCalc) {
          department.includesDishes = JSON.parse(
            JSON.stringify(hospital.includesDishes)
          );
        }
      });
    });
    this.currentHospital = this.getHospitalsFromState[0].hospitalName;
  },
};
</script>
<style lang="sass" scoped>
.menu-dishcard-wrapper
  display: grid
  grid-template-columns: repeat(3,1fr)
  grid-gap: 20px
  margin: 0 20%
.department-table-wrapper
  display: grid
  grid-template-columns: repeat(4, 1fr )
.diet-control
  font-size: 14px
  width: 30px
.current-dish-delete
  position: absolute
  right: 0
  top: 0
.btn--download
  position: fixed
  right: 1%
  bottom: 2%
  width: 60px
  height: 60px
  border-radius: 50%
  background-color: rgba(33,150,243,.3)
  transition: all .3s
  z-index: 800
  &:hover
    background-color: rgba(33,150,243,1)
    > *
      color: #fff
</style>
