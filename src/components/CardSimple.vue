<template>
  <v-card class="d-flex pa-5 elevation-3" style="height: 100%">
    <v-card-text>
      <h3 class="text-center">{{ name }}</h3>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ["objectName"],
  data: function () {
    return {
      name: this.objectName,
    };
  },
};
</script>
