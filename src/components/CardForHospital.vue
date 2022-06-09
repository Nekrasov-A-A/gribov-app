<template>
  <div class="hospital-card-wrapper">
    <!-- HOSPITAL START -->
    <div>
      <v-card class="d-flex pa-5 elevation-4" v-if="!isEdit">
        <v-card-text>
          <h3>{{ hospitalName }}</h3>
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
            <span>Изменить название</span>
          </v-tooltip>
          <v-divider vertical class="mx-3 blue"></v-divider>
          <v-btn text @click="showDepartments"
            >Отделения <v-icon>mdi-menu-down </v-icon></v-btn
          >
          <v-divider vertical class="mx-3 blue"></v-divider>
          <v-btn text @click="showTypes"
            >Диеты <v-icon>mdi-menu-down </v-icon></v-btn
          >
          <v-divider vertical class="mx-3 blue"></v-divider>
          <v-tooltip left color="error">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="error"
                v-bind="attrs"
                v-on="on"
                @click="deleteCurrentHospital(hospitalName)"
              >
                <v-icon>mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Вы удалите больницу со всеми отделениями и диетами</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
      <v-card class="d-flex flex-column pa-5" v-else>
        <v-card-text>
          <v-form v-model="isValidEditValue">
            <v-text-field
              v-model="editName"
              solo
              autofocus
              :rules="[
                (v) => !!v || 'Поле не может быть пустым',
                (v) =>
                  getHospitalsFromState.findIndex(
                    (el) =>
                      el.hospitalName.toLowerCase() === v.toLowerCase().trim()
                  ) < 0 || 'Такая больница уже создана',
              ]"
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
                @click="changedHospitalName"
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
    <!-- HOSPITAL END -->
    <!-- DEPART START -->
    <div v-if="isShowDepartments">
      <DialogBottom title="Добавить новое отделение">
        <template v-slot:content>
          <div class="pa-12">
            <div>
              <div class="text-h5 py-4">Введите название отделения</div>
              <v-form v-model="isValidFormForNewDepartment">
                <v-text-field
                  class="text-h6"
                  v-model.trim="newDepartmentValue"
                  solo
                  autofocus
                  :rules="[
                    (v) => !!v || 'Поле не может быть пустым',
                    (v) =>
                      departments.findIndex(
                        (el) =>
                          el.toLowerCase().replace(/\s/g, '') ===
                          v.toLowerCase().replace(/\s/g, '')
                      ) < 0 || 'Такое отделение уже создано',
                  ]"
                ></v-text-field>
              </v-form>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn @click="addDepartment" color="primary" class="mr-6 pa-6">
                Создать
              </v-btn>
              <v-btn @click="closeDialogForDepartment" class="pa-6"
                >Отменить</v-btn
              >
            </div>
          </div>
        </template>
        <template v-slot:default>
          <v-icon class="mr-2">mdi-plus</v-icon>
          Добавить новое отделение
        </template>
      </DialogBottom>
      <div class="departments-wrapper">
        <CardForData
          v-for="(department, index) in departments"
          :key="department"
          :objectName="department"
          :idx="index"
          :formRules="[
            (v) => !!v || 'Поле не может быть пустым',
            (v) =>
              departments.findIndex(
                (el) =>
                  el.toLowerCase().replace(/\s/g, '') ===
                  v.toLowerCase().replace(/\s/g, '')
              ) < 0 || 'Такое отделение уже создано',
          ]"
          @changeName="updateDepartmentName"
          @deleteItem="deleteCurrentDepartment"
        />
      </div>
    </div>
    <!-- DEPART END -->
    <!-- DIETS START -->
    <div v-if="isShowTypes">
      <DialogBottom title="Управление диетами">
        <template v-slot:content>
          <CardSelectItem
            :alreadySelected="getDietsWithFilterByID(types)"
            :arrayData="getDietsFromState"
            @saveChangedItems="changeIncludesDiets"
            class="my-4"
          />
        </template>
        <template v-slot:default>Управлять диетами</template>
      </DialogBottom>
      <div class="wrapper-uncludes-diets">
        <CardSimple
          v-for="diet in getDietsWithFilterByID(types)"
          :key="diet.id"
          :objectName="diet.dietName"
        />
      </div>
    </div>
    <!-- DIETS END -->
  </div>
</template>
<script>
import CardForData from "./CardForData.vue";
import CardSimple from "./CardSimple.vue";
import DialogBottom from "./DialogBottom.vue";
import CardSelectItem from "./CardSelectItem.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  props: ["hospital", "hospitalIndex"],
  components: { CardForData, CardSimple, DialogBottom, CardSelectItem },
  computed: {
    ...mapGetters([
      "getHospitalsFromState",
      "getTrueIndexOfHospitalFromState",
      "getDietsWithFilterByID",
      "getDietsFromState",
    ]),
  },
  data: function () {
    return {
      hospitalName: this.hospital.hospitalName,
      hospitalIdx: this.hospitalIndex,
      departments: this.hospital.includesDepartments || [],
      types: this.hospital.includesDiets || [],
      isShowDepartments: false,
      isShowTypes: false,
      newDepartmentValue: "",
      isEdit: false,
      editName: "",
      isValidEditValue: true,
      isValidFormForNewDepartment: true,
    };
  },

  methods: {
    ...mapMutations([
      "deleteHospitalFromState",
      "changeHospitalNameFromState",
      "deleteDepartmentFromState",
      "changeDepartmentNameForState",
      "addIncludesDietsForHospital",
    ]),
    ...mapActions([
      "setHospitalNameForData",
      "deleteHospitalForData",
      "deleteDepartmentForData",
      "setDepartmentNameForData",
      "setTypeName",
      "deleteTypeName",
      "setIncludesDietsForHospital",
    ]),
    // HOSPITALS START
    async changedHospitalName() {
      if (this.isValidEditValue) {
        this.changeHospitalNameFromState([this.hospitalName, this.editName]);
        await this.setHospitalNameForData([
          this.editName,
          this.getTrueIndexOfHospitalFromState(this.editName),
        ]);
        this.hospitalName = this.editName;
        this.isEdit = false;
      }
    },
    async deleteCurrentHospital(hospitalName) {
      this.deleteHospitalFromState(hospitalName);
      await this.deleteHospitalForData(this.getHospitalsFromState);
    },

    cancelEditMode() {
      this.editName = this.hospitalName;
      this.isEdit = false;
    },
    startEditMode() {
      this.editName = this.hospitalName;
      this.isEdit = true;
    },
    showDepartments() {
      this.isShowTypes = false;
      this.isShowDepartments = this.isShowDepartments ? false : true;
    },
    showTypes() {
      this.isShowDepartments = false;
      this.isShowTypes = this.isShowTypes ? false : true;
    },
    // HOSPITALS END
    //DEPARTMENTS START
    async deleteCurrentDepartment(value) {
      let idx = this.departments.findIndex((el) => el === value);
      this.departments.splice(idx, 1);
      await this.deleteDepartmentForData([this.departments, this.hospitalIdx]);
    },
    async addDepartment() {
      if (this.isValidFormForNewDepartment) {
        this.departments.push(this.newDepartmentValue);
        let arr = [
          this.newDepartmentValue,
          this.departments.length - 1,
          this.getTrueIndexOfHospitalFromState(this.hospitalName),
        ];
        await this.setDepartmentNameForData(arr);
        this.closeDialogForDepartment();
      }
    },
    async updateDepartmentName(arr) {
      arr.push(this.hospitalIdx);
      this.changeDepartmentNameForState(arr);
      let [, newVal] = arr;
      let depIdx = this.departments.findIndex((el) => el === newVal);
      await this.setDepartmentNameForData([
        newVal,
        depIdx,
        this.getTrueIndexOfHospitalFromState(this.hospitalName),
      ]);
    },
    closeDialogForDepartment() {
      this.newDepartmentValue = "";
      this.$root.$emit("closeDialogRootEvent");
    },
    //DEPARTMENTS END
    // HOSPITAL => INCLUDES DIETS START
    async changeIncludesDiets(value) {
      let idx = this.getTrueIndexOfHospitalFromState(this.hospitalName);

      await this.setIncludesDietsForHospital([value, idx]);
      this.addIncludesDietsForHospital([value, idx]);
      this.types = value;
    },
    // HOSPITAL => INCLUDES DIETS END
  },
};
</script>
<style lang="sass" scoped>
.diets-wrapper
  display: grid
  grid-template-columns: repeat(3,1fr)
  grid-gap: 10px
.departments-wrapper
  display: grid
  grid-template-columns: repeat(2,1fr)
  grid-gap: 20px
  & > *
    height: 100%
.wrapper-uncludes-diets
  display: grid
  grid-template-columns: repeat(3,1fr)
  grid-gap: 20px
</style>
