<template>
  <div>
    <v-tooltip top color="black">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="showCorrectDialog"
          v-bind="attrs"
          v-on="on"
          class="white--text"
          color="teal"
        >
          <v-icon>mdi-clipboard-edit-outline </v-icon>
        </v-btn>
      </template>
      <span>Ручная правка</span>
    </v-tooltip>

    <v-dialog fullscreen v-model="dialog" style="z-index: 850" class="py-10">
      <div class="dialog-wrapper">
        <v-toolbar
          color="primary"
          class="d-flex justify-center align-center mb-2"
        >
          <v-btn @click="saveCorrectForDep" color="success" class="pa-4 mr-6"
            >Сохранить</v-btn
          >
          <v-btn @click="closeCorrectDialog" class="pa-4"> Закрыть </v-btn>
        </v-toolbar>
        <v-tabs background-color="white" centered class="pt-4 mb-2">
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
        <v-form
          v-model="isValidForBreakfast"
          class="correct-wrapper"
          v-if="dataForEating[0] === selectedEating"
        >
          <v-card
            v-for="dish in dishArray[dataForEating[0]]"
            :key="dish.id + dataForEating[0]"
            class="d-flex flex-column justify-center pa-6"
          >
            <h3>{{ dish.dishName }}</h3>
            <v-text-field
              class="blue--text"
              suffix="гр/мл"
              v-model="dish.correctWeight"
              :rules="[
                (v) => !!v || 'Поле не может быть пустым',
                (v) => +v >= 0 || 'Некорректные данные',
              ]"
            ></v-text-field>
          </v-card>
        </v-form>
        <v-form
          v-model="isValidForLunch"
          class="correct-wrapper"
          v-if="dataForEating[1] === selectedEating"
        >
          <v-card
            v-for="dish in dishArray[dataForEating[1]]"
            :key="dish.id + dataForEating[1]"
            class="d-flex flex-column justify-center pa-6"
          >
            <h3>{{ dish.dishName }}</h3>
            <v-text-field
              class="blue--text"
              suffix="гр/мл"
              v-model="dish.correctWeight"
              :rules="[
                (v) => !!v || 'Поле не может быть пустым',
                (v) => +v >= 0 || 'Некорректные данные',
              ]"
            ></v-text-field>
          </v-card>
        </v-form>
        <v-form
          v-model="isValidForDinner"
          class="correct-wrapper"
          v-if="dataForEating[2] === selectedEating"
        >
          <v-card
            v-for="dish in dishArray[dataForEating[2]]"
            :key="dish.id + dataForEating[2]"
            class="d-flex flex-column justify-center pa-6"
          >
            <h3>{{ dish.dishName }}</h3>
            <v-text-field
              class="blue--text"
              suffix="гр/мл"
              v-model="dish.correctWeight"
              :rules="[
                (v) => !!v || 'Поле не может быть пустым',
                (v) => +v >= 0 || 'Некорректные данные',
              ]"
            ></v-text-field>
          </v-card>
        </v-form>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: { dishInfo: Object },
  data: function () {
    return {
      dishArray: this.dishInfo,
      dialog: false,
      selectedEating: "завтрак",
      dataForEating: ["завтрак", "обед", "ужин"],
      isValidForBreakfast: true,
      isValidForLunch: true,
      isValidForDinner: true,
    };
  },
  methods: {
    clearFieldsAndCloseDialog() {
      this.dishArray.forEach((el) => (el.correctWeight = el.totalWeight));
      this.overlay = false;
    },
    saveCorrectChange() {
      if (this.isValid) {
        this.dishInfo.forEach((el) => (el.totalWeight = el.correctWeight));
        this.overlay = false;
      }
    },
    showOverlay() {
      this.dishInfo.forEach((el) => (el.correctWeight = el.totalWeight));
      this.dishArray = this.dishInfo;
      this.overlay = true;
    },
    closeCorrectDialog() {
      Object.values(this.dishArray).forEach(
        (el) => (el.correctWeight = el.totalWeight)
      );
      this.dialog = false;
    },
    saveCorrectForDep() {
      if (
        this.isValidForBreakfast &&
        this.isValidForLunch &&
        this.isValidForDinner
      ) {
        Object.values(this.dishInfo).forEach((mealTime) =>
          mealTime.forEach((el) => (el.totalWeight = el.correctWeight))
        );
        this.dialog = false;
      }
    },
    showCorrectDialog() {
      Object.values(this.dishInfo).forEach((mealTime) =>
        mealTime.forEach((el) => (el.correctWeight = el.totalWeight))
      );
      this.dishArray = this.dishInfo;
      this.dialog = true;
    },
  },
};
</script>
<style lang="sass" scoped>
.dialog-wrapper
  background-color: #fff
  width: 100vw
  min-height: 100vh
.correct-wrapper
  display: grid
  grid-template-columns: repeat(2,1fr)
  grid-gap: 20px
  padding: 0 40px
</style>
