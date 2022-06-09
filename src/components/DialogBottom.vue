<template>
  <div>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="1200"
      v-model="dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          class="my-4"
          :text="isTextBtn"
        >
          <slot name="default"></slot>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" dark>{{ title }}</v-toolbar>
        <v-card-text>
          <slot name="content"></slot>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
    isTextBtn: { type: Boolean, default: false },
  },
  data: function () {
    return {
      dialog: false,
      headline: this.title,
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
  },
  mounted() {
    this.$root.$on("closeDialogRootEvent", () => (this.dialog = false));
  },
};
</script>
