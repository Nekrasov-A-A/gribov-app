<template>
  <div>
    <v-tooltip top color="black">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="showOverlay" v-bind="attrs" v-on="on">
          <v-icon>mdi-ballot-recount </v-icon>
        </v-btn>
      </template>
      <span>Рассчитать с другим меню</span>
    </v-tooltip>

    <v-dialog fullscreen v-model="dialog" style="z-index: 850" class="py-10">
      <div class="dialog-container">
        <v-toolbar
          color="primary"
          class="d-flex justify-center align-center mb-2"
        >
          <v-btn
            @click="saveMenuForDepartment"
            color="success"
            class="pa-4 mr-6"
            >Сохранить</v-btn
          >
          <v-btn @click="closeOverlay" class="pa-4"> Закрыть </v-btn>
        </v-toolbar>
        <v-tabs background-color="white" centered class="pt-4">
          <v-tabs-slider class="blue"></v-tabs-slider>
          <v-tab
            v-for="item in dataForEating"
            :key="item"
            @click="selectedEating = item"
            class="black--text"
          >
            {{ item }}
          </v-tab>
        </v-tabs>

        <!-- breakfastSTART -->
        <div
          class="d-flex flex-column mt-10"
          v-if="dataForEating[0] === selectedEating"
        >
          <div class="mb-10 d-flex flex-column align-center">
            <h2 class="mb-6">Выбранные</h2>
            <div class="menu-dishcard-wrapper">
              <v-card
                v-for="dish in currentMenu[selectedEating]"
                :key="dish.id"
                class="d-flex flex-column"
              >
                <v-card-text class="d-flex justify-center mt-4">
                  <h3>{{ dish.dishName }}</h3>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-center"
                  style="margin: 0 10%"
                >
                  <v-text-field
                    class="blue--text"
                    v-model="dish.amountForDepart"
                    prefix="Количество"
                    :rules="[
                      (v) => !!v || 'Поле обязательно к заполнению',
                      (v) => +v > 0 || 'Некорректное значение',
                    ]"
                  ></v-text-field>
                </v-card-actions>
                <v-btn
                  @click.native="deleteFromCurrentMenu(dish)"
                  text
                  class="current-dish--delete py-4"
                >
                  <v-icon color="error">mdi-close-circle-outline </v-icon>
                </v-btn>
              </v-card>
            </div>
          </div>
          <v-text-field
            v-model="searchForMenuDepartment"
            append-icon="mdi-magnify"
            label="Поиск по названию"
            solo
            hide-details
            class="mb-8 align-self-center"
            style="width: 40%"
          ></v-text-field>
          <div v-if="searchForMenuDepartment" class="menu-dishcard-wrapper">
            <CardSimple
              v-for="dish in getDishesByName"
              :key="dish.id"
              :objectName="dish.dishName"
              @click.native="addToCurrentMenu(dish)"
            />
          </div>
          <div v-else class="menu-dishcard-wrapper">
            <CardSimple
              v-for="dish in getNonSelectDishes"
              :key="dish.id"
              :objectName="dish.dishName"
              @click.native="addToCurrentMenu(dish)"
            />
          </div>
        </div>
        <!--breakfast END  -->
        <!-- lunch START -->
        <div
          class="d-flex flex-column mt-10"
          v-if="dataForEating[1] === selectedEating"
        >
          <div class="mb-10 d-flex flex-column align-center">
            <h2 class="mb-6">Выбранные</h2>
            <div class="menu-dishcard-wrapper">
              <v-card
                v-for="dish in currentMenu[selectedEating]"
                :key="dish.id"
                class="d-flex flex-column"
              >
                <v-card-text class="d-flex justify-center mt-4">
                  <h3>{{ dish.dishName }}</h3>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-center"
                  style="margin: 0 10%"
                >
                  <v-text-field
                    class="blue--text"
                    v-model="dish.amountForDepart"
                    prefix="Количество"
                    :rules="[
                      (v) => !!v || 'Поле обязательно к заполнению',
                      (v) => +v > 0 || 'Некорректное значение',
                    ]"
                  ></v-text-field>
                </v-card-actions>
                <v-btn
                  @click.native="deleteFromCurrentMenu(dish)"
                  text
                  class="current-dish--delete py-4"
                >
                  <v-icon color="error">mdi-close-circle-outline </v-icon>
                </v-btn>
              </v-card>
            </div>
          </div>
          <v-text-field
            v-model="searchForMenuDepartment"
            append-icon="mdi-magnify"
            label="Поиск по названию"
            solo
            hide-details
            class="mb-8 align-self-center"
            style="width: 40%"
          ></v-text-field>
          <div v-if="searchForMenuDepartment" class="menu-dishcard-wrapper">
            <CardSimple
              v-for="dish in getDishesByName"
              :key="dish.id"
              :objectName="dish.dishName"
              @click.native="addToCurrentMenu(dish)"
            />
          </div>
          <div v-else class="menu-dishcard-wrapper">
            <CardSimple
              v-for="dish in getNonSelectDishes"
              :key="dish.id"
              :objectName="dish.dishName"
              @click.native="addToCurrentMenu(dish)"
            />
          </div>
        </div>
        <!-- lunch END -->
        <!--  dinner START-->
        <div
          class="d-flex flex-column mt-10"
          v-if="dataForEating[2] === selectedEating"
        >
          <div class="mb-10 d-flex flex-column align-center">
            <h2 class="mb-6">Выбранные</h2>
            <div class="menu-dishcard-wrapper">
              <v-card
                v-for="dish in currentMenu[selectedEating]"
                :key="dish.id + selectedEating"
                class="d-flex flex-column"
              >
                <v-card-text class="d-flex justify-center mt-4">
                  <h3>{{ dish.dishName }}</h3>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-center"
                  style="margin: 0 10%"
                >
                  <v-text-field
                    class="blue--text"
                    v-model="dish.amountForDepart"
                    prefix="Количество"
                    :rules="[
                      (v) => !!v || 'Поле обязательно к заполнению',
                      (v) => +v > 0 || 'Некорректное значение',
                    ]"
                  ></v-text-field>
                </v-card-actions>
                <v-btn
                  @click.native="deleteFromCurrentMenu(dish)"
                  text
                  class="current-dish--delete py-4"
                >
                  <v-icon color="error">mdi-close-circle-outline </v-icon>
                </v-btn>
              </v-card>
            </div>
          </div>
          <v-text-field
            v-model="searchForMenuDepartment"
            append-icon="mdi-magnify"
            label="Поиск по названию"
            solo
            hide-details
            class="mb-8 align-self-center"
            style="width: 40%"
          ></v-text-field>
          <div v-if="searchForMenuDepartment" class="menu-dishcard-wrapper">
            <CardSimple
              v-for="dish in getDishesByName"
              :key="dish.id"
              :objectName="dish.dishName"
              @click.native="addToCurrentMenu(dish)"
            />
          </div>
          <div v-else class="menu-dishcard-wrapper">
            <CardSimple
              v-for="dish in getNonSelectDishes"
              :key="dish.id"
              :objectName="dish.dishName"
              @click.native="addToCurrentMenu(dish)"
            />
          </div>
        </div>
        <!--dinner END  -->
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CardSimple from "./CardSimple.vue";
export default {
  components: { CardSimple },
  props: { depart: Object },
  computed: {
    ...mapGetters([
      "getDishesFromState",
      "getIngredietnsForDishForUIFromState",
      "getProductLineById",
    ]),

    getDishesByName() {
      return this.getNonSelectDishes.filter((el) => {
        return el.dishName
          .toLowerCase()
          .includes(this.searchForMenuDepartment.toLowerCase());
      });
    },
    getNonSelectDishes() {
      return this.getCorrectDishes.filter(
        (el) =>
          !this.currentMenu[this.selectedEating].find(
            (elem) => el.id === elem.id
          )
      );
    },
    getCorrectDishes() {
      return this.menu.filter((dish) => {
        if (
          dish.productLine !== "" &&
          dish.includesDiets.length !== 0 &&
          dish.ingredients.length !== 0
        ) {
          return true;
        } else {
          return false;
        }
      });
    },
  },
  data: function () {
    return {
      department: this.depart,
      overlay: false,
      menu: [],
      searchForMenuDepartment: "",
      currentMenu: { завтрак: [], обед: [], ужин: [] },
      selectedEating: "завтрак",
      dataForEating: ["завтрак", "обед", "ужин"],
      dialog: false,
    };
  },
  methods: {
    addToCurrentMenu(dish) {
      let dishStatic = JSON.parse(JSON.stringify(dish));
      this.currentMenu[this.selectedEating].push(dishStatic);
    },
    deleteFromCurrentMenu(dish) {
      let currentIdx = this.currentMenu[this.selectedEating].findIndex(
        (el) => dish.id === el.id
      );
      this.currentMenu[this.selectedEating].splice(currentIdx, 1);
    },
    getFiltredDishes(array) {
      let helper = array.map((el) => el.id);
      let hash = {};
      return this.getDishesFromState
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
    },
    closeOverlay() {
      this.menu.forEach((el) => (el.amountForDepart = "1"));
      this.dialog = false;
    },
    saveMenuForDepartment() {
      let isValid = true;
      for (let val of Object.values(this.currentMenu)) {
        val.forEach((el) =>
          el.amountForDepart <= 0 ? (isValid = false) : null
        );
      }
      if (isValid) {
        for (let [key, val] of Object.entries(this.currentMenu)) {
          this.currentMenu[key] = val.map((dish) => {
            let dietsForCount = dish.includesDiets.map((dishDiet) => {
              return this.department.includesDiets.find((diet) =>
                typeof dishDiet === "string"
                  ? diet.id === dishDiet
                  : diet.id === dishDiet.id
              );
            });
            let totalAmountForDish = dietsForCount
              .filter((el) => el !== undefined)
              .reduce((acc, curr) => acc + +curr.amount, 0);
            dish.totalAmountClients = totalAmountForDish;
            dish.totalWeight =
              dish.totalAmountClients * dish.dishWeight * dish.amountForDepart +
              "";
            dish.ingredients = this.getIngredietnsForDishForUIFromState(
              dish.ingredients
            );
            dish.productLine = this.getProductLineById(dish.productLine);
            return dish;
          });
        }
        this.department.includesDishes = this.currentMenu;
        this.department.isAnotherMenu = true;
        this.$emit("forceUpdateForMainForms", this.department);
        this.dialog = false;
      }
    },
    showOverlay() {
      this.department = this.depart;
      this.menu = this.getFiltredDishes(this.department.includesDiets);
      this.menu.forEach((el) => (el.amountForDepart = "1"));
      this.dialog = true;
    },
  },
};
</script>
<style lang="sass" scoped>
.dialog-container
  background-color: #fff
  width: 100vw
  min-height: 100vh
.menu-dishcard-wrapper
  display: grid
  grid-template-columns: repeat(3,1fr)
  grid-gap: 20px
  margin: 0 20%
.current-dish--delete
  position: absolute
  right: 0
  top: 0
</style>
