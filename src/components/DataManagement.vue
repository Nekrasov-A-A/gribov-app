<template>
  <div class="data-management-wrapper">
    <v-tabs background-color="white" centered class="pt-4">
      <v-tabs-slider class="blue"></v-tabs-slider>
      <v-tab
        v-for="item in menuItems"
        :key="item"
        @click="selectedMenuItem = item"
        class="black--text"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-divider class="mt-4"></v-divider>
    <!-- MENU END -->
    <!-- PRODUCT LINES START -->
    <div v-if="menuItems[0] === selectedMenuItem" class="wrapp-card">
      <DialogBottom title="Добавить новую производственную линию">
        <template v-slot:content>
          <div class="pa-12">
            <div>
              <div class="text-h5 py-4">
                Введите название производственной линии
              </div>
              <v-form v-model="isValidFormForProductLines">
                <v-text-field
                  class="text-h6"
                  v-model.trim="newProductLine"
                  solo
                  autofocus
                  :rules="[
                    (v) => !!v || 'Поле не может быть пустым',
                    (v) =>
                      getProductLinesFromState.findIndex(
                        (el) =>
                          el.productLineName
                            .toLowerCase()
                            .replace(/\s/g, '') ===
                          v.toLowerCase().replace(/\s/g, '')
                      ) < 0 || 'Такая производственная линия уже создана',
                  ]"
                ></v-text-field>
              </v-form>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn
                @click="createNewProductLine(newProductLine)"
                color="primary"
                class="mr-6 pa-6"
              >
                Создать
              </v-btn>
              <v-btn @click="closeDialogForProductLines" class="pa-6"
                >Отменить</v-btn
              >
            </div>
          </div>
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Добавить новую производственную линию
        </template>
      </DialogBottom>
      <div class="control-cards">
        <CardForData
          v-for="(productLine, index) in getProductLinesFromState"
          :key="productLine.id"
          :objectName="productLine.productLineName"
          :idx="index"
          :formRules="[
            (v) => !!v || 'Поле не может быть пустым',
            (v) =>
              getProductLinesFromState.findIndex(
                (el) =>
                  el.productLineName.toLowerCase().replace(/\s/g, '') ===
                  v.toLowerCase().replace(/\s/g, '')
              ) < 0 || 'Такая производственная линия уже создана',
          ]"
          @changeName="changedProductLineName"
          @deleteItem="deleteProductLine"
        />
      </div>
    </div>
    <!-- PRODUCT LINES END -->
    <!-- DIET TYPES START -->
    <div v-if="menuItems[1] === selectedMenuItem" class="wrapp-card">
      <DialogBottom title="Добавить новую диету">
        <template v-slot:content>
          <div class="pa-12">
            <div>
              <div class="text-h5 py-4">Введите название диеты</div>
              <v-form v-model="isValidFromForDiet">
                <v-text-field
                  class="text-h6"
                  v-model.trim="newDietType"
                  solo
                  autofocus
                  :rules="[
                    (v) => !!v || 'Поле не может быть пустым',
                    (v) =>
                      getDietsFromState.findIndex(
                        (el) =>
                          el.dietName.toLowerCase().replace(/\s/g, '') ===
                          v.toLowerCase().replace(/\s/g, '')
                      ) < 0 || 'Такая диета уже создана',
                  ]"
                ></v-text-field>
              </v-form>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn @click="addNewDietType" color="primary" class="mr-6 pa-6">
                Создать
              </v-btn>
              <v-btn @click="closeDialogForDiets" class="pa-6">Отменить</v-btn>
            </div>
          </div>
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Добавить новую диету
        </template>
      </DialogBottom>
      <div class="d-flex flex-column">
        <v-text-field
          v-model="searchForDiets"
          append-icon="mdi-magnify"
          label="Поиск по названию"
          solo
          hide-details
          class="mb-8 align-self-center"
          style="width: 40%"
        ></v-text-field>
        <div v-if="searchForDiets" class="wrapper-control-diets">
          <CardForData
            v-for="(diet, index) in getDietsByName"
            :key="diet.id"
            :objectName="diet.dietName"
            :idx="index"
            :formRules="[
              (v) => !!v || 'Поле не может быть пустым',
              (v) =>
                getDietsFromState.findIndex(
                  (el) =>
                    el.dietName.toLowerCase().replace(/\s/g, '') ===
                    v.toLowerCase().replace(/\s/g, '')
                ) < 0 || 'Такая диета уже создана',
            ]"
            :isShowEdit="false"
            @deleteItem="deleteDiet"
          />
        </div>
        <div class="wrapper-control-diets" v-else>
          <CardForData
            v-for="(diet, index) in getDietsFromState"
            :key="diet.id"
            :objectName="diet.dietName"
            :idx="index"
            :formRules="[
              (v) => !!v || 'Поле не может быть пустым',
              (v) =>
                getDietsFromState.findIndex(
                  (el) =>
                    el.dietName.toLowerCase().replace(/\s/g, '') ===
                    v.toLowerCase().replace(/\s/g, '')
                ) < 0 || 'Такая диета уже создана',
            ]"
            :isShowEdit="false"
            @deleteItem="deleteDiet"
          />
        </div>
      </div>
    </div>
    <!-- DIET TYPES END -->
    <!-- HOSPITALS START -->
    <div v-if="menuItems[2] === selectedMenuItem" class="wrapp-card">
      <DialogBottom title="Добавить новую больницу">
        <template v-slot:content>
          <div class="pa-12">
            <div>
              <div class="text-h5 py-4">Введите название больницы</div>
              <v-form v-model="isValidFormForHospital">
                <v-text-field
                  class="text-h6"
                  v-model.trim="newHospital"
                  solo
                  autofocus
                  :rules="[
                    (v) => !!v || 'Поле не может быть пустым',
                    (v) =>
                      getHospitalsFromState.findIndex(
                        (el) =>
                          el.hospitalName.toLowerCase().replace(/\s/g, '') ===
                          v.toLowerCase().replace(/\s/g, '')
                      ) < 0 || 'Такая больница уже создана',
                  ]"
                ></v-text-field>
              </v-form>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn @click="addHospital" color="primary" class="mr-6 pa-6">
                Создать
              </v-btn>
              <v-btn @click="closeDialogForHospitals" class="pa-6"
                >Отменить</v-btn
              >
            </div>
          </div>
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Добавить новую больницу
        </template>
      </DialogBottom>
      <div class="hospitals-wrapper">
        <CardForHospital
          v-for="(hospital, index) in getHospitalsFromState"
          :key="hospital.hospitalName"
          :hospital="hospital"
          :hospitalIndex="index"
        />
      </div>
    </div>
    <!-- HOSPITALS END -->
    <!-- INGREDIENTS START -->
    <div v-if="menuItems[3] === selectedMenuItem" class="wrapp-card">
      <DialogBottom title="Добавить новый ингредиент">
        <template v-slot:content>
          <div class="pa-12">
            <div>
              <div class="text-h5 py-4">Введите название ингредиента</div>
              <v-form v-model="isValidFormForIngredient">
                <v-text-field
                  class="text-h6"
                  v-model.trim="newIngredient"
                  solo
                  autofocus
                  :rules="[
                    (v) => !!v || 'Поле не может быть пустым',
                    (v) =>
                      getIngredientsFromState.findIndex(
                        (el) =>
                          el.ingredientName.toLowerCase().replace(/\s/g, '') ===
                          v.toLowerCase().replace(/\s/g, '')
                      ) < 0 || 'Такой ингредиент уже создан',
                  ]"
                ></v-text-field>
              </v-form>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn @click="addIngredient" color="primary" class="mr-6 pa-6">
                Создать
              </v-btn>
              <v-btn @click="closeDialogForIngredients" class="pa-6"
                >Отменить</v-btn
              >
            </div>
          </div>
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Добавить новый ингредиент
        </template>
      </DialogBottom>
      <div class="d-flex flex-column">
        <v-text-field
          v-model="searchForIngredient"
          append-icon="mdi-magnify"
          label="Поиск по названию"
          solo
          hide-details
          class="mb-8 align-self-center"
          style="width: 40%"
        ></v-text-field>
        <div v-if="searchForIngredient" class="wrapper-ingredients">
          <CardForData
            v-for="(ingredient, index) in getIngredientByName"
            :key="ingredient.id"
            :objectName="ingredient.ingredientName"
            :idx="index"
            :formRules="[
              (v) => !!v || 'Поле не может быть пустым',
              (v) =>
                getIngredientsFromState.findIndex(
                  (el) =>
                    el.ingredientName.toLowerCase().replace(/\s/g, '') ===
                    v.toLowerCase().replace(/\s/g, '')
                ) < 0 || 'Такой ингредиент уже создан',
            ]"
            @changeName="changedIngredientName"
            @deleteItem="deleteIngredient"
          />
        </div>
        <div v-else class="wrapper-ingredients">
          <CardForData
            v-for="(ingredient, index) in getIngredientsFromState"
            :key="ingredient.id"
            :objectName="ingredient.ingredientName"
            :idx="index"
            :formRules="[
              (v) => !!v || 'Поле не может быть пустым',
              (v) =>
                getIngredientsFromState.findIndex(
                  (el) =>
                    el.ingredientName.toLowerCase().replace(/\s/g, '') ===
                    v.toLowerCase().replace(/\s/g, '')
                ) < 0 || 'Такой ингредиент уже создан',
            ]"
            @changeName="changedIngredientName"
            @deleteItem="deleteIngredient"
          />
        </div>
      </div>
    </div>
    <!-- INGREDIENTS END -->
    <!-- DISHES START -->
    <div v-if="menuItems[4] === selectedMenuItem" class="wrapp-card">
      <DialogFullscreen title="Добавить новое блюдо">
        <template v-slot:content>
          <DishesForm />
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Добавить новое блюдо
        </template>
      </DialogFullscreen>
      <div class="d-flex flex-column">
        <div v-if="getIncorrectDishes.length > 0">
          <h3 class="my-6 d-flex justify-center">
            Внесите данные для этих блюд
          </h3>
          <DishCard
            v-for="dish in getIncorrectDishes"
            :key="dish.id"
            :dishInfo="dish"
          />
          <v-divider class="mb-10 blue" style="width: 100%"></v-divider>
        </div>
        <v-text-field
          v-model="searchForDishes"
          append-icon="mdi-magnify"
          label="Поиск по названию"
          solo
          hide-details
          class="mb-8 align-self-center"
          style="width: 40%"
        ></v-text-field>
        <div v-if="searchForDishes">
          <DishCard
            v-for="dish in getDishesByName"
            :key="dish.id"
            :dishInfo="dish"
          />
        </div>
        <div v-else>
          <DishCard
            v-for="dish in getCorrectDishes"
            :key="dish.id"
            :dishInfo="dish"
          />
        </div>
      </div>
    </div>
    <!-- DISHES END -->
    <div
      v-if="menuItems[5] === selectedMenuItem"
      class="wrapp-card d-flex flex-column"
    >
      <DialogBottom title="Изменить имя пищеблока">
        <template v-slot:content>
          <div class="pa-12">
            <div>
              <div class="text-h5 py-4">Введите имя пищеблока</div>
              <v-form v-model="isValidNewUserName">
                <v-text-field
                  class="text-h6"
                  v-model.trim="newUserName"
                  solo
                  autofocus
                  :rules="[(v) => !!v || 'Поле не может быть пустым']"
                ></v-text-field>
              </v-form>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn @click="saveNewUserName" color="primary" class="mr-6 pa-6">
                Сохранить
              </v-btn>
              <v-btn @click="closeDialogForUserName" class="pa-6"
                >Отменить</v-btn
              >
            </div>
          </div>
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Изменить имя пищеблока
        </template>
      </DialogBottom>
      <CardSimple
        :objectName="getUserNameFromState"
        :key="getUserNameFromState"
        style="width: 60%"
        class="align-self-center mb-10 mt-4"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import CardForData from "./CardForData.vue";
import CardForHospital from "./CardForHospital.vue";
import DialogBottom from "./DialogBottom.vue";
import DialogFullscreen from "./DialogFullscreen.vue";
import DishesForm from "./DishesForm.vue";
import DishCard from "./DishCard.vue";
import CardSimple from "./CardSimple.vue";
import { v4 as uuidv4 } from "uuid";
export default {
  components: {
    CardForData,
    CardForHospital,
    DialogBottom,
    DialogFullscreen,
    DishesForm,
    DishCard,
    CardSimple,
  },
  computed: {
    ...mapGetters([
      "getHospitalsFromState",
      "getProductLinesFromState",
      "getDietsFromState",
      "getIngredientsFromState",
      "getDishesFromState",
      "getUserNameFromState",
    ]),
    getIngredientByName() {
      return this.getIngredientsFromState.filter((el) => {
        return el.ingredientName
          .toLowerCase()
          .includes(this.searchForIngredient.toLowerCase());
      });
    },
    getDishesByName() {
      return this.getCorrectDishes.filter((el) => {
        return el.dishName
          .toLowerCase()
          .includes(this.searchForDishes.toLowerCase());
      });
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
    getIncorrectDishes() {
      return this.getDishesFromState.filter((dish) => {
        if (
          dish.productLine !== "" &&
          dish.includesDiets.length !== 0 &&
          dish.ingredients.length !== 0
        ) {
          return false;
        } else {
          return true;
        }
      });
    },
    getDietsByName() {
      return this.getDietsFromState.filter((el) => {
        return el.dietName
          .toLowerCase()
          .includes(this.searchForDiets.toLowerCase());
      });
    },
  },
  data: () => ({
    menuItems: [
      "Производственные линии",
      "Диеты",
      "Больницы",
      "Ингредиенты",
      "Блюда",
      "Имя пищеблока",
    ],
    searchForIngredient: "",
    selectedMenuItem: "Производственные линии",
    ration: "",
    isShowPopUpForProductLine: false,
    newProductLine: "",
    isShowPopUpForHospitals: false,
    newHospital: "",
    newDeparttment: "",
    isShowPopUpForDiets: false,
    newDietType: "",
    isValidFromForDiet: true,
    isValidFormForHospital: true,
    isValidFormForProductLines: true,
    isValidFormForIngredient: true,
    newIngredient: "",
    searchForDiets: "",
    searchForDishes: "",
    isValidNewUserName: true,
    newUserName: "",
  }),
  methods: {
    ...mapActions([
      "createHospital",
      "setNewDietForData",
      "deleteDietForData",
      "setProductLine",
      "deleteHospitalForData",
      "createIngredientForData",
      "setIngredientsForData",
      "setDishesForData",
      "setUserName",
    ]),
    ...mapMutations([
      "deleteProductLineFromState",
      "changeProductLineNameFromState",
      "addNewProductLineForState",
      "addNewDietForState",
      "deleteDietFromState",
      "addNewHospitalForState",
      "addNewIngredientForState",
      "deleteIngredientFromState",
      "changeIngredientNameFromState",
      "updateUserNameForState",
    ]),
    // PRODUCT LINE START
    async updateProductLines(item) {
      let val = {
        productLineName: item,
        id: uuidv4(),
      };
      this.addNewProductLineForState(val);
      await this.setProductLine(this.getProductLinesFromState);
    },
    async deleteProductLine(value) {
      this.deleteProductLineFromState(value);
      await this.setProductLine(this.getProductLinesFromState);
      await this.setDishesForData(this.getDishesFromState);
    },
    async changedProductLineName(arr) {
      this.changeProductLineNameFromState(arr);
      await this.setProductLine(this.getProductLinesFromState);
    },
    createNewProductLine(item) {
      if (this.isValidFormForProductLines) {
        this.updateProductLines(item);
        this.closeDialogForProductLines();
      }
    },
    closeDialogForProductLines() {
      this.newProductLine = "";
      this.$root.$emit("closeDialogRootEvent");
    },
    showPopUpForProductLines() {
      this.isShowPopUpForProductLine = true;
    },
    // PRODUCT LINE END
    // DIET TYPES START
    async addNewDietType() {
      if (this.isValidFromForDiet) {
        let value = {
          dietName: this.newDietType,
          id: uuidv4(),
        };
        this.addNewDietForState(value);
        await this.setNewDietForData([
          value,
          this.getDietsFromState.length - 1,
        ]);
        this.closeDialogForDiets();
      }
    },
    async deleteDiet(value) {
      this.deleteDietFromState(value);
      await this.deleteDietForData(this.getDietsFromState);
      await this.deleteHospitalForData(this.getHospitalsFromState);
      await this.setDishesForData(this.getDishesFromState);
    },
    closeDialogForDiets() {
      this.$root.$emit("closeDialogRootEvent");
      this.newDietType = "";
    },
    // DIET TYPES END
    //HOSPITALS START
    async addHospital() {
      if (this.isValidFormForHospital) {
        let val = {
          hospitalName: this.newHospital,
          includesDepartments: [],
          includesDiets: [],
        };
        this.addNewHospitalForState(val);
        await this.createHospital([val, this.getHospitalsFromState.length - 1]);
        this.closeDialogForHospitals();
      }
    },

    closeDialogForHospitals() {
      this.$root.$emit("closeDialogRootEvent");
      this.newHospital = "";
    },
    //HOSPITALS END
    // INGREDIENTS START
    closeDialogForIngredients() {
      this.$root.$emit("closeDialogRootEvent");
      this.newIngredient = "";
    },
    async addIngredient() {
      if (this.isValidFormForIngredient) {
        let value = {
          ingredientName: this.newIngredient,
          id: uuidv4(),
          ingredientWeight: "",
        };
        this.addNewIngredientForState(value);
        await this.createIngredientForData([
          value,
          this.getIngredientsFromState.length - 1,
        ]);
        this.closeDialogForIngredients();
      }
    },
    async deleteIngredient(value) {
      this.deleteIngredientFromState(value);
      await this.setIngredientsForData(this.getIngredientsFromState);
      await this.setDishesForData(this.getDishesFromState);
    },
    async changedIngredientName(arr) {
      this.changeIngredientNameFromState(arr);
      await this.setIngredientsForData(this.getIngredientsFromState);
    },
    // INGREDIENTS END
    closeDialogForUserName() {
      this.$root.$emit("closeDialogRootEvent");
      this.newUserName = "";
    },
    saveNewUserName() {
      if (this.isValidNewUserName) {
        this.updateUserNameForState(this.newUserName);
        this.setUserName(this.newUserName);
        this.closeDialogForUserName();
      }
    },
  },
};
</script>
<style lang="sass" scoped>
.wrapp-card
  padding: 0 20px
.control-cards
  display: grid
  grid-template-columns: repeat(2,1fr)
  grid-gap: 20px
  margin: 0 20%
.wrapper-control-diets
  display: grid
  grid-template-columns: repeat(4,1fr)
  grid-gap: 20px
  margin: 0 20%
.hospitals-wrapper
  display: grid
  grid-template-columns: repeat(1,1fr)
  grid-gap: 40px
  margin: 0 20%
.data-management-wrapper
  position: relative
.wrapper-ingredients
  display: grid
  grid-template-columns: repeat(2,1fr)
  grid-gap: 20px
  margin: 0 20%
</style>
