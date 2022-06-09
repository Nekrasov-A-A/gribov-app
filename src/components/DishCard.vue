<template>
  <div class="d-flex flex-column" style="margin: 0 5%">
    <v-card v-if="!isEdit" class="d-flex align-center pa-4 elevation-4 mb-6">
      <v-card-text>
        <h3>
          {{ dish.dishName }}
        </h3>
      </v-card-text>
      <v-card-actions>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="startEditMode"
            >
              <v-icon>mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Изменить название блюда</span>
        </v-tooltip>
        <v-divider vertical class="mx-3 blue"></v-divider>
        <v-btn @click="showProductLine" text
          >Производственная линия <v-icon>mdi-menu-down </v-icon></v-btn
        >
        <v-divider vertical class="mx-3 blue"></v-divider>
        <v-btn @click="showDiets" text
          >Диеты <v-icon>mdi-menu-down </v-icon></v-btn
        >
        <v-divider vertical class="mx-3 blue"></v-divider>
        <v-btn @click="showWeight" text
          >Вес <v-icon>mdi-menu-down </v-icon></v-btn
        >
        <v-divider vertical class="mx-3 blue"></v-divider>
        <v-btn @click="showIngredients" text
          >Ингредиенты <v-icon>mdi-menu-down </v-icon></v-btn
        >
        <v-divider vertical class="mx-3 blue"></v-divider>
        <v-tooltip left color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="error"
              v-bind="attrs"
              v-on="on"
              @click="deleteCurrentDish"
            >
              <v-icon>mdi-delete </v-icon>
            </v-btn>
          </template>
          <span>Вы удалите блюдо</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>

    <!-- EDIT MODE START -->
    <v-card v-else class="py-12">
      <v-form v-model="isValidDishName">
        <v-text-field
          class="mx-12"
          v-model="newDishName"
          solo
          autofocus
          :rules="[
            (v) => !!v || 'Поле не может быть пустым',
            (v) =>
              getDishesFromState.findIndex(
                (el) => el.dishName.toLowerCase() === v.toLowerCase().trim()
              ) < 0 || 'Такое блюдо уже создано',
          ]"
        ></v-text-field>
      </v-form>
      <v-card-actions class="d-flex justify-center">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              class="mr-4"
              @click="setNewDishName"
            >
              Сохранить
            </v-btn>
          </template>
          <span>Сохраняет текущее значение</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="cancelEditMode">
              Отмена
            </v-btn>
          </template>
          <span>Отменяет все изменения</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
    <!-- EDIT MODE END -->
    <!-- PRODUCTLINE START -->
    <div v-if="isShowProductLine" class="d-flex flex-column">
      <DialogBottom title="Назначить производственную линию">
        <template v-slot:content>
          <v-form v-model="isValidSelectProductLine" class="mt-14">
            <v-select
              :items="getProductLinesFromState.map((el) => el.productLineName)"
              label="Выберите производственную линию"
              v-model="selectNewProductLine"
              :rules="[(v) => !!v || 'Поле не может быть пустым']"
              solo
            ></v-select>
          </v-form>
          <div class="my-6">
            <v-btn
              class="pa-6 mr-6"
              color="primary"
              @click="setNewProductLineForDish"
              >Внести изменения</v-btn
            >
            <v-btn class="pa-6" @click="closeDialogForProductLine"
              >Закрыть</v-btn
            >
          </div>
        </template>
        <template v-slot:default> Управять производственной линией </template>
      </DialogBottom>
      <CardSimple
        v-if="productLineName"
        :objectName="productLineName.productLineName"
        :key="productLineName.id"
        style="width: 60%"
        class="align-self-center mb-10 mt-4"
      />
    </div>
    <!-- PRODUCTLINE END -->
    <!-- DIETS START -->
    <div v-if="isShowDiets">
      <DialogBottom title="Управление диетами">
        <template v-slot:content>
          <CardSelectItem
            :alreadySelected="getDietsWithFilterByID(dish.includesDiets)"
            :arrayData="getDietsFromState"
            @saveChangedItems="changeIncludesDietsForDish"
            class="my-4"
          />
        </template>
        <template v-slot:default>Управлять диетами</template>
      </DialogBottom>
      <div class="dish-diets-wrapper">
        <CardSimple
          v-for="diet in getDietsWithFilterByID(dish.includesDiets)"
          :key="diet.id"
          :objectName="diet.dietName"
        />
      </div>
    </div>
    <!-- DIETS END -->
    <!-- WEIGHT START -->
    <div v-if="isShowWeight" class="d-flex flex-column">
      <DialogBottom title="Управление весом блюда">
        <template v-slot:content>
          <v-form v-model="isValidFormWeight">
            <v-text-field
              class="mt-14"
              v-model.trim="newDishWeight"
              label="Введите вес блюда в"
              suffix="гр/мл"
              solo
              :rules="[
                (v) => !!v || 'Поле не может быть пустым',
                (v) => +v > 0 || 'Некорректное значение',
              ]"
            ></v-text-field>
          </v-form>
          <div class="my-6">
            <v-btn
              color="primary"
              class="pa-6 mr-6"
              @click="setNewWeightForDish"
            >
              Сохранить</v-btn
            >
            <v-btn @click="closeDialogForWeight" class="pa-6"> Закрыть</v-btn>
          </div>
        </template>
        <template v-slot:default>Изменить вес блюда</template>
      </DialogBottom>
      <CardSimple
        :objectName="dish.dishWeight + ' гр/мл'"
        :key="dish.dishWeight"
        style="width: 60%"
        class="align-self-center mb-10 mt-4"
      />
    </div>
    <!-- WEIGHT END -->
    <!-- INGREDIENTS START -->
    <div v-if="isShowIngredients">
      <DialogBottom title="Управление ингредиентами">
        <template v-slot:content>
          <v-autocomplete
            v-model="selectIngredientsForDish"
            :items="getIngredientsFromState.map((el) => el.ingredientName)"
            solo
            label="Выберите ингредиенты"
            multiple
            chips
            :rules="[(v) => v.length !== 0 || 'Поле не может быть пустым']"
            class="mt-10 mb-4"
          ></v-autocomplete>
          <div class="d-flex flex-column align-center justify-center">
            <v-form v-model="isValidControlIngredientsForm" style="width: 80%">
              <v-text-field
                v-for="ingredient in getIngredientsForDishControlFormFromState(
                  selectIngredientsForDish,
                  dish.id
                )"
                :key="ingredient.id"
                label="Введите вес ингредиента"
                suffix="гр/мл"
                :prefix="ingredient.ingredientName"
                v-model="ingredient.ingredientWeight"
                :rules="[
                  (v) => !!v || 'Поле не может быть пустым',
                  (v) => +v > 0 || 'Некорректное значение',
                ]"
                class="blue--text"
              ></v-text-field>
            </v-form>
          </div>
          <div class="mt-6 mb-10">
            <v-btn
              class="pa-6 mr-6"
              @click="saveChangesForIngredients"
              color="primary"
              >Сохранить изменения</v-btn
            >
            <v-btn @click="closeDialogForIngredients" class="pa-6"
              >Закрыть</v-btn
            >
          </div>
        </template>
        <template v-slot:default>Управлять ингредиентами</template>
      </DialogBottom>
      <div class="ingredients--wrapper">
        <v-card
          v-for="ingredient in getIngredietnsForDishForUIFromState(
            dish.ingredients
          )"
          :key="ingredient.id"
        >
          <v-card-text>
            <div class="d-flex align-center justify-space-around pa-4">
              <div>
                <h3>{{ ingredient.ingredientName }}</h3>
              </div>
              <div>
                <h4>
                  {{ toFixedFloatNumber(ingredient.ingredientWeight) }} гр/мл
                </h4>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <!-- INGREDIENTS END -->
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import DialogBottom from "./DialogBottom.vue";
import CardSimple from "./CardSimple.vue";
import CardSelectItem from "./CardSelectItem.vue";
export default {
  props: ["dishObject"],
  components: { DialogBottom, CardSimple, CardSelectItem },
  computed: {
    ...mapGetters([
      "getTrueIndexOfDishFromState",
      "getDishesFromState",
      "getProductLineById",
      "getProductLinesFromState",
      "getProductLineIdByName",
      "getDietsWithFilterByID",
      "getDietsFromState",
      "getIngredietnsForDishForUIFromState",
      "getIngredietnsForDishFromState",
      "getIngredientsFromState",
      "getIngredietnsForDishForUIFromStateByName",
      "getIngredientsForDishFromStateById",
      "getIngredientsForDishControlFormFromState",
    ]),
  },
  data: function () {
    return {
      isEdit: false,
      newDishName: "",
      isValidDishName: true,
      dish: this.dishObject,
      isShowProductLine: false,
      productLineName: "",
      selectNewProductLine: "",
      isValidSelectProductLine: true,
      isShowDiets: false,
      isShowWeight: false,
      newDishWeight: "",
      isValidFormWeight: true,
      isShowIngredients: false,
      selectIngredientsForDish: [],
      isValidDishIngredients: true,
      isValidControlIngredientsForm: true,
    };
  },
  methods: {
    ...mapMutations([
      "changeDishNameFromState",
      "deleteDishFromState",
      "changeProductLineForDishFromState",
      "changeIncludesDietsForDishFromState",
      "changeWeightForDishFromState",
      "deleteIngredientForDishForState",
      "changeIngredientsForDishFromState",
    ]),
    ...mapActions([
      "changeDishNameForData",
      "setDishesForData",
      "changeProductLineForDishForData",
      "changeIncludesDietsForDishForData",
      "changeWeightForDishForData",
      "changeIngredientsForDishForData",
    ]),
    toFixedFloatNumber(num) {
      if (Number.isInteger(num)) {
        return num;
      }
      return (+num).toFixed(1);
    },
    async setNewDishName() {
      if (this.isValidDishName) {
        let currentIndex = this.getTrueIndexOfDishFromState(this.dish.id);
        this.changeDishNameFromState([this.newDishName, currentIndex]);
        await this.changeDishNameForData([this.newDishName, currentIndex]);
        this.cancelEditMode();
      }
    },
    cancelEditMode() {
      this.isEdit = false;
      this.newDishName = "";
    },
    startEditMode() {
      this.newDishName = this.dish.dishName;
      this.isEdit = true;
    },
    async deleteCurrentDish() {
      this.deleteDishFromState(this.getTrueIndexOfDishFromState(this.dish.id));
      await this.setDishesForData(this.getDishesFromState);
    },
    showProductLine() {
      this.isShowProductLine = this.isShowProductLine ? false : true;
      this.productLineName = this.getProductLineById(this.dish.productLine);
      this.selectNewProductLine = this.productLineName?.productLineName || "";
      this.isShowDiets = false;
      this.isShowWeight = false;
      this.isShowIngredients = false;
    },
    showDiets() {
      this.isShowDiets = this.isShowDiets ? false : true;
      this.isShowProductLine = false;
      this.isShowWeight = false;
      this.isShowIngredients = false;
    },
    showWeight() {
      this.isShowWeight = this.isShowWeight ? false : true;
      this.isShowProductLine = false;
      this.isShowDiets = false;
      this.isShowIngredients = false;
    },
    showIngredients() {
      this.isShowIngredients = this.isShowIngredients ? false : true;
      this.isShowProductLine = false;
      this.isShowDiets = false;
      this.isShowWeight = false;
      this.selectIngredientsForDish = this.getIngredientsForDishFromStateById(
        this.dish.id
      ).map((el) => el.ingredientName);
    },
    closeDialogForProductLine() {
      this.$root.$emit("closeDialogRootEvent");
      this.selectNewProductLine = this.productLineName.productLineName;
    },
    closeDialogForWeight() {
      this.$root.$emit("closeDialogRootEvent");
      this.newDishWeight = "";
    },
    closeDialogForIngredients() {
      this.$root.$emit("closeDialogRootEvent");
    },
    async setNewProductLineForDish() {
      if (this.isValidSelectProductLine) {
        let currentDishIndex = this.getTrueIndexOfDishFromState(this.dish.id);
        let productLineId = this.getProductLineIdByName(
          this.selectNewProductLine
        );
        this.changeProductLineForDishFromState([
          productLineId,
          currentDishIndex,
        ]);
        this.productLineName = this.getProductLineById(productLineId);
        await this.changeProductLineForDishForData([
          productLineId,
          currentDishIndex,
        ]);
        this.closeDialogForProductLine();
      }
    },
    // diets start
    async changeIncludesDietsForDish(payload) {
      let currentDishIndex = this.getTrueIndexOfDishFromState(this.dish.id);
      this.changeIncludesDietsForDishFromState([payload, currentDishIndex]);
      await this.changeIncludesDietsForDishForData([payload, currentDishIndex]);
    },
    async setNewWeightForDish() {
      if (this.isValidFormWeight) {
        let currentDishIndex = this.getTrueIndexOfDishFromState(this.dish.id);
        this.changeWeightForDishFromState([
          this.newDishWeight,
          currentDishIndex,
        ]);
        await this.changeWeightForDishForData([
          this.newDishWeight,
          currentDishIndex,
        ]);
        let newIngredients = this.dish.ingredients.map((el) => {
          el.ingredientWeight = this.newDishWeight * el.factor;
          delete el.ingredientName;
          return el;
        });
        await this.changeIngredientsForDishForData([
          newIngredients,
          currentDishIndex,
        ]);
        this.closeDialogForWeight();
      }
    },
    async saveChangesForIngredients() {
      if (this.isValidControlIngredientsForm) {
        let dataIngredients = this.getIngredientsForDishControlFormFromState(
          this.selectIngredientsForDish,
          this.dish.id
        );
        dataIngredients = JSON.parse(JSON.stringify(dataIngredients));
        dataIngredients.forEach((ingred) => {
          ingred.factor = ingred.ingredientWeight / this.dish.dishWeight;
        });

        this.changeIngredientsForDishFromState([
          dataIngredients,
          this.getTrueIndexOfDishFromState(this.dish.id),
        ]);
        dataIngredients = dataIngredients.map((el) => {
          let newIngredients = {
            id: el.id,
            factor: el.factor,
            ingredientWeight: el.ingredientWeight,
          };
          return newIngredients;
        });
        let currentDishIndex = this.getTrueIndexOfDishFromState(this.dish.id);
        this.changeIngredientsForDishForData([
          dataIngredients,
          currentDishIndex,
        ]);
        this.closeDialogForIngredients();
      }
    },
  },
};
</script>
<style lang="sass" scoped>
.dish-diets-wrapper
  display: grid
  grid-template-columns: repeat(4,1fr)
  grid-gap: 20px
  margin: 16px 20% 40px
.ingredients--wrapper
  display: grid
  grid-template-columns: repeat(1,1fr)
  grid-gap: 20px
  margin: 24px 20% 40px
</style>
