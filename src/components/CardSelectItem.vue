<template>
  <div>
    <div class="text-h5 pa-4">Добавленные</div>
    <div class="wrap-grid">
      <CardSimple
        v-for="item in selectedItems"
        :key="item.id"
        :objectName="item.dietName"
        @click.native="deleteFromSelect(item.dietName)"
        style="cursor: pointer"
      />
    </div>

    <div class="text-h5 pa-4">Добавьте из списка</div>
    <v-text-field
      v-model="searchForIncludesDiets"
      append-icon="mdi-magnify"
      label="Поиск по названию"
      solo
      hide-details
      class="mb-8 align-self-center"
      style="width: 40%"
    ></v-text-field>
    <div v-if="searchForIncludesDiets" class="wrap-grid">
      <CardSimple
        v-for="item in getDietsByName"
        :key="item.id"
        :objectName="item.dietName"
        @click.native="selectedItems.push(item)"
        style="cursor: pointer"
      />
    </div>
    <div class="wrap-grid" v-else>
      <CardSimple
        v-for="item in getNonSelectItems"
        :key="item.id"
        :objectName="item.dietName"
        @click.native="selectedItems.push(item)"
        style="cursor: pointer"
      />
    </div>
    <div class="d-flex justify-center mt-12">
      <v-btn color="primary" class="pa-4" @click="saveChanges"
        >Сохранить изменения</v-btn
      >
      <v-btn @click="closeDialogWindow" class="pa-4 ml-4">Закрыть</v-btn>
    </div>
  </div>
</template>
<script>
import CardSimple from "./CardSimple.vue";
export default {
  components: { CardSimple },
  props: { alreadySelected: Array, arrayData: Array },
  computed: {
    getNonSelectItems: function () {
      return this.dataArray.filter((el) => !this.selectedItems.includes(el));
    },
    getDietsByName() {
      return this.getNonSelectItems.filter((el) => {
        return el.dietName
          .toLowerCase()
          .includes(this.searchForIncludesDiets.toLowerCase());
      });
    },
  },
  data: function () {
    return {
      selectedItems: this.alreadySelected || [],
      dataArray: this.arrayData || [],
      searchForIncludesDiets: "",
    };
  },
  methods: {
    deleteFromSelect(value) {
      let idx = this.selectedItems.findIndex((el) => el.dietName === value);
      this.selectedItems.splice(idx, 1);
    },
    saveChanges() {
      this.$emit(
        "saveChangedItems",
        this.selectedItems.map((el) => el.id)
      );
      this.closeDialogWindow();
    },
    closeDialogWindow() {
      this.$root.$emit("closeDialogRootEvent");
    },
  },
};
</script>
<style lang="sass" scoped>
.wrap-grid
  display: grid
  grid-template-columns: repeat(5,1fr)
  grid-gap: 20px
</style>
