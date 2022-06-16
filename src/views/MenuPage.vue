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
    <div v-if="dataForEating[0] === selectedEating">
      <MenuPick />
    </div>
    <div v-if="dataForEating[1] === selectedEating">
      <MenuPick />
    </div>
    <div v-if="dataForEating[2] === selectedEating">
      <MenuPick />
    </div>
    <div>
      <v-btn>Сохранить {{ selectedEating }}</v-btn>
      <v-btn>Закончить</v-btn>
    </div>
  </div>
</template>

<script>
import MenuPick from "../components/MenuPick.vue";
export default {
  components: { MenuPick },
  data: function () {
    return {
      selectedEating: "завтрак",
      dataForEating: ["завтрак", "обед", "ужин"],
    };
  },
};
</script>
