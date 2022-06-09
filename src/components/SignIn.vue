<template>
  <div class="form-wrapper">
    <LoaderSimple v-if="isLoading" />
    <v-form ref="form" v-model="valid" style="width: 40%">
      <h3>Вход в систему</h3>
      <v-text-field
        v-model="email"
        :rules="[(v) => !!v || 'Заполните поле']"
        label="Введите email"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="[(v) => !!v || 'Заполните поле']"
        label="Введите пароль"
        required
      ></v-text-field>
      <v-btn @click="login" color="primary" class="mr-4 mt-2"> Войти </v-btn>
      <v-alert
        color="red"
        dense
        dismissible
        elevation="3"
        type="error"
        v-model="isError"
        class="mt-3 mx-auto"
        style="width: 40%"
        >{{ errorMessage }}</v-alert
      >
    </v-form>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import LoaderSimple from "./LoaderSimple.vue";
export default {
  components: { LoaderSimple },
  data: function () {
    return {
      valid: true,
      email: "",
      password: "",
      errorMessage: "Неверно заполнены поля",
      isError: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["getUid"]),
  },
  methods: {
    ...mapActions([
      "loginWith",
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
    ]),
    async login() {
      if (this.valid) {
        let formData = {
          email: this.email,
          password: this.password,
        };
        try {
          this.isLoading = true;
          await this.loginWith(formData);
          await this.getUidFromFirebase();
          if (this.getUid) {
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
            this.isLoading = false;
            this.$router.push("/");
          }
        } catch (e) {
          this.isLoading = false;
          this.isError = true;
          this.email = "";
          this.password = "";
        }
      }
    },
  },
};
</script>
<style lang="sass" scoped>
.form-wrapper
  display: flex
  align-items: center
  justify-content: center
  height: 100vh
  width: 100vw
  position: relative
</style>
