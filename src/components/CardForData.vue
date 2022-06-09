<template>
  <div>
    <v-card
      class="d-flex pa-5 elevation-3 align-center"
      v-if="!isEdit"
      style="height: 100%"
    >
      <v-card-text>
        <h3>{{ name }}</h3>
      </v-card-text>
      <v-card-actions>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              @click="startEditMode"
              v-if="isShowEditInner"
            >
              <v-icon>mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Изменить название</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="error"
              v-bind="attrs"
              v-on="on"
              @click="deleteValue(name)"
            >
              <v-icon>mdi-delete </v-icon>
            </v-btn>
          </template>
          <span>Удалить элемент</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
    <v-card class="d-flex flex-column pa-5" v-else>
      <v-card-text>
        <v-form v-model="isValid">
          <v-text-field
            v-model="editName"
            solo
            autofocus
            :rules="validRules"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              class="mr-4"
              @click="saveChangedValue"
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
  </div>
</template>
<script>
export default {
  props: {
    objectName: {},
    idx: {},
    isShowEdit: { type: Boolean, default: true },
    formRules: {
      type: Array,
      default: () => [(v) => !!v || "Поле не может быть пустым"],
    },
  },
  data: function () {
    return {
      isEdit: false,
      name: this.objectName,
      isValid: true,
      indexCard: this.idx,
      editName: "",
      isShowEditInner: this.isShowEdit,
      validRules: this.formRules,
    };
  },
  methods: {
    saveChangedValue() {
      if (this.isValid) {
        this.$emit("changeName", [this.name, this.editName]);
        this.name = this.editName;
        this.isEdit = false;
      }
    },
    deleteValue(value) {
      this.$emit("deleteItem", value);
    },
    cancelEditMode() {
      this.editName = this.name;
      this.isEdit = false;
    },
    startEditMode() {
      this.editName = this.name;
      this.isEdit = true;
    },
  },
};
</script>
