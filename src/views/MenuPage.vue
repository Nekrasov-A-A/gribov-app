<template>
  <div>
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
    <v-btn class="btn--absolute" color="primary" @click="saveCurrentDay"
      >Сохранить меню</v-btn
    >
    <div v-if="dataForEating[0] === selectedEating">
      <MenuPick :eatingTime="dataForEating[0]" />
    </div>
    <div v-if="dataForEating[1] === selectedEating">
      <MenuPick :eatingTime="dataForEating[1]" />
    </div>
    <div v-if="dataForEating[2] === selectedEating">
      <MenuPick :eatingTime="dataForEating[2]" />
    </div>
  </div>
</template>

<script>
import MenuPick from "../components/MenuPick.vue";
import { mapGetters } from "vuex";
export default {
  components: { MenuPick },
  computed: {
    ...mapGetters(["getCurrentDayFromState"]),
  },
  data: function () {
    return {
      selectedEating: "завтрак",
      dataForEating: ["завтрак", "обед", "ужин"],
    };
  },
  methods: {
    saveCurrentDay() {
      let isValid = true;
      for (let val of Object.values(this.getCurrentDayFromState)) {
        val.forEach((el) => (el.amount <= 0 ? (isValid = false) : null));
      }
      if (isValid) {
        this.$router.push("/hospitals");
      }
    },
  },
};
</script>
<style lang="sass" scoped>
.btn--absolute
  position: absolute
  top: 24px
  right: 5%
</style>
