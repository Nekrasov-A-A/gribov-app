<template>
  <v-app>
    <LoaderSimple v-if="isLoading" />
    <div v-if="getUid">
      <v-app-bar color="primary">
        <div
          class="d-flex justify-space-between align-center"
          style="width: 100%"
        >
          <div class="d-flex align-center">
            <router-link to="/" class="reset-link"
              ><v-btn text class="white--text">Меню</v-btn></router-link
            >
            <v-divider
              class="mx-4 white"
              vertical
              style="height: 40px"
            ></v-divider>
            <router-link to="/hospitals" class="reset-link"
              ><v-btn text class="white--text">Больницы</v-btn></router-link
            >
          </div>
          <div class="d-flex align-center">
            <div>
              <DialogBottom title="Подтвердите право доступа" :isTextBtn="true">
                <template v-slot:content>
                  <v-form v-model="isValidAdmin" class="pa-12">
                    <v-text-field
                      v-model="password"
                      autofocus
                      label="Введите пароль"
                      :rules="[
                        (v) => v === truePassword || 'Неправильный пароль',
                      ]"
                    ></v-text-field>
                  </v-form>
                  <v-btn
                    @click="checkIsAdmin"
                    color="primary"
                    class="pa-6 ml-12"
                    >Войти</v-btn
                  >
                </template>
                <template v-slot:default>
                  <span class="white--text">Управление данными</span></template
                >
              </DialogBottom>
            </div>
            <div class="text-center ml-2">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="grey lighten-5 blue--text darken-1--text"
                  >
                    {{ getUserNameFromState }}
                    <v-icon>mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <v-btn text color="primary" small @click="logout"
                        >Выйти из системы</v-btn
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </v-app-bar>
      <v-main class="pb-14">
        <keep-alive> <router-view /></keep-alive>
      </v-main>
    </div>
    <div v-else>
      <SignIn />
    </div>
    <ErrorDialog v-if="getIsError" />
  </v-app>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import SignIn from "./components/SignIn.vue";
import LoaderSimple from "./components/LoaderSimple.vue";
import DialogBottom from "./components/DialogBottom.vue";
import ErrorDialog from "./components/ErrorDialog.vue";
export default {
  data: () => ({
    isLoading: true,
    isValidAdmin: true,
    password: "",
    truePassword: "1111",
  }),
  computed: {
    ...mapGetters([
      "getUid",
      "getHospitals",
      "getUserNameFromState",
      "getIsError",
    ]),
  },
  components: { SignIn, LoaderSimple, DialogBottom, ErrorDialog },
  methods: {
    ...mapActions([
      "getUidFromFirebase",
      "logout",
      "getHospitalsData",
      "getProductLines",
      "getRation",
      "getUserName",
      "getDietTypes",
      "getIngredients",
      "getDishes",
    ]),
    ...mapMutations([
      "updateHospitalsForState",
      "updateProductLinesForState",
      "updateRationForState",
      "updateUserNameForState",
      "updateDietsForState",
      "updateIngredientsForState",
      "updateDishesForState",
      "setIsErrorToTrue",
    ]),
    checkIsAdmin() {
      if (this.isValidAdmin) {
        this.$root.$emit("closeDialogRootEvent");
        this.$router.push("/data");
      }
    },
  },
  async mounted() {
    await this.getUidFromFirebase();
    if (this.getUid) {
      try {
        let hospitals = (await this.getHospitalsData()) || [];
        let productLines = (await this.getProductLines()) || [];
        let userName = (await this.getUserName()) || "";
        let dietTypes = (await this.getDietTypes()) || [];
        let ingredients = (await this.getIngredients()) || [];
        let dishes = (await this.getDishes()) || [];
        this.updateHospitalsForState(hospitals);
        this.updateProductLinesForState(productLines);
        this.updateUserNameForState(userName);
        this.updateDietsForState(dietTypes);
        this.updateIngredientsForState(ingredients);
        this.updateDishesForState(dishes);
      } catch (e) {
        this.isLoading = false;
      }
    }
    this.isLoading = false;
    window.addEventListener("offline", () => {
      this.setIsErrorToTrue();
    });
  },
};
</script>
<style lang="sass" scoped>
.reset-link
  text-decoration: none
</style>
