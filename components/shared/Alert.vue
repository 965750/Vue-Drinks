<template>
    <v-alert v-if="error" dismissible @input="onClose" :value="true" type="error">
      {{text}}
    </v-alert>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["text"],
  data() {
    return {
      alert: null
    };
  },
  methods: {
    ...mapActions({
      onClose: "A_CLEAR_ERROR"
    })
  },
  computed: {
    ...mapGetters({
      error: "G_ERROR"
    })
  }
};
</script>
