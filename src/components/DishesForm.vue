<template>
  <div class="dish-form-wrappper d-flex flex-column justify-center pa-6">
    <v-form v-model="isValidForm">
      <v-text-field
        v-model.trim="newDish"
        label="Введите название блюда"
        solo
        :rules="[
          (v) => !!v || 'Поле не может быть пустым',
          (v) =>
            getDishesFromState.findIndex(
              (el) =>
                el.dishName.toLowerCase().replace(/\s/g, '') ===
                v.toLowerCase().replace(/\s/g, '')
            ) < 0 || 'Такое блюдо уже создано',
        ]"
      ></v-text-field>
      <v-select
        :items="getProductLinesFromState.map((el) => el.productLineName)"
        label="Выберите производственную линию"
        v-model="selectProductLine"
        :rules="[(v) => !!v || 'Поле не может быть пустым']"
        solo
      ></v-select>
      <v-autocomplete
        :items="getDietsFromState.map((el) => el.dietName)"
        label="Выберите диеты"
        v-model="selectDiets"
        :rules="[(v) => v.length !== 0 || 'Поле не может быть пустым']"
        solo
        chips
        multiple
      ></v-autocomplete>
      <v-text-field
        v-model.trim="dishWeight"
        label="Введите вес блюда в"
        suffix="гр/мл"
        solo
        :rules="[
          (v) => !!v || 'Поле не может быть пустым',
          (v) => +v > 0 || 'Некорректное значение',
        ]"
      ></v-text-field>
      <v-autocomplete
        v-model="selectIngredients"
        :items="getIngredientsFromState.map((el) => el.ingredientName)"
        solo
        label="Выберите ингредиенты"
        multiple
        chips
        :rules="[(v) => v.length !== 0 || 'Поле не может быть пустым']"
      ></v-autocomplete>
      <div class="d-flex flex-column align-center justify-center">
        <v-text-field
          v-for="ingredient in setTest"
          :key="ingredient.id"
          label="Введите вес ингредиента"
          suffix="гр/мл"
          :prefix="ingredient.ingredientName"
          v-model="ingredient.ingredientWeightForNewDish"
          :rules="[
            (v) => !!v || 'Поле не может быть пустым',
            (v) => +v > 0 || 'Некорректное значение',
          ]"
          style="width: 60%"
        ></v-text-field>
      </div>
    </v-form>
    <div class="mt-6 d-flex justify-space-between">
      <v-btn @click="addNewDish" color="primary" class="pa-6"
        >Добавить блюдо</v-btn
      >
      <v-btn @click="dialogClose" class="pa-6">Закрыть</v-btn>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { v4 as uuidv4 } from "uuid";
export default {
  computed: {
    ...mapGetters([
      "getDishesFromState",
      "getProductLinesFromState",
      "getDietsFromState",
      "getIngredientsFromState",
      "getDietsWithFilterByName",
      "getProductLineIdByName",
    ]),
    setTest() {
      return this.selectIngredients.map((el) => {
        let current = this.getIngredientsFromState.find(
          (elem) => elem.ingredientName === el
        );
        current.ingredientWeightForNewDish
          ? null
          : (current.ingredientWeightForNewDish = "");
        return current;
      });
    },
  },
  data: function () {
    return {
      isValidForm: true,
      newDish: "",
      selectProductLine: "",
      selectDiets: [],
      dishWeight: "",
      selectIngredients: [],
    };
  },
  methods: {
    ...mapMutations(["clearIngredientsForState", "addNewDishesForState"]),
    ...mapActions(["setDishesForData", "createDishForData"]),
    dialogClose() {
      this.$root.$emit("closeDialogFullscreenRootEvent");
      this.newDish = "";
      this.selectProductLine = "";
      this.selectDiets = [];
      this.dishWeight = "";
      this.selectIngredients = [];
      this.clearIngredientsForState();
    },
    async addNewDish() {
      if (this.isValidForm) {
        let dishData = {
          dishName: this.newDish,
          id: uuidv4(),
          productLine: this.getProductLineIdByName(this.selectProductLine),
          includesDiets: this.getDietsWithFilterByName(this.selectDiets).map(
            (el) => el.id
          ),
          dishWeight: this.dishWeight,
          ingredients: [...this.setTest],
        };
        dishData.ingredients = dishData.ingredients.map((el) => {
          let obj = {
            id: el.id,
            ingredientWeight: el.ingredientWeightForNewDish,
            factor: el.ingredientWeightForNewDish / this.dishWeight,
          };
          return obj;
        });
        this.addNewDishesForState(dishData);
        await this.createDishForData([
          dishData,
          this.getDishesFromState.length - 1,
        ]);
        this.dialogClose();
      }
    },
  },
};
</script>
<style lang="sass" scoped>
.dish-form-wrappper
  margin: 0 20%
  height: calc(100vh - 84px)
</style>
