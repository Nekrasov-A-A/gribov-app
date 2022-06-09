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

    <v-overlay :value="overlay" :light="true" :dark="false">
      <div class="fast-test">
        <div class="d-flex flex-column mt-10">
          <div class="mb-10 d-flex flex-column align-center">
            <h2 class="mb-6">Выбранные</h2>
            <v-form
              v-model="isValidFormForMenuDepartment"
              class="menu-dishcard-wrapper"
            >
              <v-card
                v-for="dish in currentMenu"
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
                  class="current-dish-delete py-4"
                >
                  <v-icon color="error">mdi-close-circle-outline </v-icon>
                </v-btn>
              </v-card>
            </v-form>
            <div class="mt-6">
              <v-btn
                @click="saveMenuForDepartment"
                color="primary"
                class="pa-4 mr-6"
                >Сохранить</v-btn
              >
              <v-btn @click="closeOverlay" class="pa-4"> Закрыть </v-btn>
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
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CardSimple from "./CardSimple.vue";
export default {
  components: { CardSimple },
  props: ["depart"],
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
        (el) => !this.currentMenu.includes(el)
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
      isValidFormForMenuDepartment: true,
      searchForMenuDepartment: "",
      currentMenu: [],
    };
  },
  methods: {
    addToCurrentMenu(dish) {
      this.currentMenu.push(dish);
    },
    deleteFromCurrentMenu(dish) {
      let currentIdx = this.currentMenu.findIndex((el) => dish.id === el.id);
      this.currentMenu.splice(currentIdx, 1);
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
      this.overlay = false;
    },
    saveMenuForDepartment() {
      if (this.isValidFormForMenuDepartment) {
        this.currentMenu = this.currentMenu.map((dish) => {
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

        this.department.includesDishes = this.currentMenu;
        this.department.isAnotherMenu = true;
        this.$emit("forceUpdateForMainForms", this.department);
        this.overlay = false;
      }
    },
    showOverlay() {
      this.department = this.depart;
      this.menu = this.getFiltredDishes(this.department.includesDiets);
      this.menu.forEach((el) => (el.amountForDepart = "1"));
      this.overlay = true;
    },
  },
};
</script>
<style lang="sass" scoped>
.fast-test
  background-color: #fff
  padding: 60px
  width: 100vw
  height: 100vh
.menu-dishcard-wrapper
  display: grid
  grid-template-columns: repeat(3,1fr)
  grid-gap: 20px
  margin: 0 20%
</style>
