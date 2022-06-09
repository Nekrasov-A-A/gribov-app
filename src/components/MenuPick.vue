<template>
  <div class="d-flex flex-column mt-10">
    <div class="mb-10 d-flex flex-column align-center">
      <h2 class="mb-6">Выбранные</h2>
      <v-form v-model="isValidFormForCurrentDay" class="menu-dishcard-wrapper">
        <v-card
          v-for="dish in getCurrentDayFromState"
          :key="dish.id"
          class="d-flex flex-column"
        >
          <v-card-text class="d-flex justify-center mt-4">
            <h3>{{ dish.dishName }}</h3>
          </v-card-text>
          <v-card-actions class="d-flex justify-center" style="margin: 0 10%">
            <v-text-field
              class="blue--text"
              v-model="dish.amount"
              prefix="Количество"
              :rules="[
                (v) => !!v || 'Поле обязательно к заполнению',
                (v) => +v > 0 || 'Некорректное значение',
              ]"
            ></v-text-field>
          </v-card-actions>
          <v-btn
            @click.native="deleteFromTodayMenu(dish)"
            text
            class="current-dish-delete py-4"
          >
            <v-icon color="error">mdi-close-circle-outline </v-icon>
          </v-btn>
        </v-card>
      </v-form>
      <div class="mt-10">
        <v-btn @click="saveCurrentDay" color="primary" class="mr-6 pa-4"
          >Сохранить</v-btn
        >
      </div>
    </div>
    <v-text-field
      v-model="searchForMenu"
      append-icon="mdi-magnify"
      label="Поиск по названию"
      solo
      hide-details
      class="mb-8 align-self-center"
      style="width: 40%"
    ></v-text-field>
    <div v-if="searchForMenu" class="menu-dishcard-wrapper">
      <CardSimple
        v-for="dish in getDishesByName"
        :key="dish.id"
        :objectName="dish.dishName"
        @click.native="addToTodayMenu(dish)"
      />
    </div>
    <div v-else class="menu-dishcard-wrapper">
      <CardSimple
        v-for="dish in getNonSelectDishes"
        :key="dish.id"
        :objectName="dish.dishName"
        @click.native="addToTodayMenu(dish)"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import CardSimple from "./CardSimple.vue";
export default {
  components: { CardSimple },
  data: function () {
    return {
      isValidFormForCurrentDay: true,
      searchForMenu: "",
    };
  },
  computed: {
    ...mapGetters([
      "getCurrentDayFromState",
      "getDishesFromState",
      "getDietsWithFilterByID",
      "getProductLineById",
    ]),
    getDishesByName() {
      return this.getNonSelectDishes.filter((el) => {
        return el.dishName
          .toLowerCase()
          .includes(this.searchForMenu.toLowerCase());
      });
    },
    getNonSelectDishes() {
      return this.getCorrectDishes.filter(
        (el) => !this.getCurrentDayFromState.includes(el)
      );
    },
    getCorrectDishes() {
      return this.getDishesFromState.filter((dish) => {
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
  methods: {
    ...mapMutations([
      "addItemToCurrentDay",
      "deleteDishForCurrentDayFromState",
      "updateCurrentDay",
    ]),
    saveCurrentDay() {
      if (this.isValidFormForCurrentDay) {
        this.$router.push("/hospitals");
      }
    },
    addToTodayMenu(val) {
      val.includesDiets = this.getDietsWithFilterByID(val.includesDiets);
      val.productLine = this.getProductLineById(val.productLine);
      val.amount = "1";
      this.addItemToCurrentDay(val);
    },
    deleteFromTodayMenu(val) {
      let currentIdx = this.getCurrentDayFromState.findIndex(
        (el) => el.dishName === val.dishName
      );
      this.deleteDishForCurrentDayFromState(currentIdx);
    },
  },
};
</script>
<style lang="sass" scoped>
.menu-dishcard-wrapper
  display: grid
  grid-template-columns: repeat(3,1fr)
  grid-gap: 20px
  margin: 0 20%
.current-dish-delete
  position: absolute
  right: 0
  top: 0
</style>
