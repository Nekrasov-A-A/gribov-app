<template>
  <div>
    <v-tooltip top color="black">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="white--text"
          color="teal"
          @click="showOverlay"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-clipboard-edit-outline </v-icon>
        </v-btn>
      </template>
      <span>Ручная правка</span>
    </v-tooltip>

    <v-overlay :value="overlay" :light="true" :dark="false">
      <div class="fast-test">
        <v-form v-model="isValid" class="correct-wrapper">
          <v-card
            v-for="dish in dishArray"
            :key="dish.id"
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
        <div class="mt-10">
          <v-btn @click="saveCorrectChange" color="primary" class="pa-4 mr-6"
            >Сохранить</v-btn
          >
          <v-btn @click="clearFieldsAndCloseDialog" class="pa-4">
            Закрыть
          </v-btn>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
export default {
  props: ["dishObject"],
  data: function () {
    return {
      dishArray: this.dishObject,
      isValid: true,
      overlay: false,
    };
  },
  methods: {
    clearFieldsAndCloseDialog() {
      this.dishArray.forEach((el) => (el.correctWeight = el.totalWeight));
      this.overlay = false;
    },
    saveCorrectChange() {
      if (this.isValid) {
        this.dishObject.forEach((el) => (el.totalWeight = el.correctWeight));
        this.overlay = false;
      }
    },
    showOverlay() {
      this.dishObject.forEach((el) => (el.correctWeight = el.totalWeight));
      this.dishArray = this.dishObject;
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
.correct-wrapper
  display: grid
  grid-template-columns: repeat(2,1fr)
  grid-gap: 20px
</style>
