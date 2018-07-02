<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs6>
        <Drinks></Drinks>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Drinks from '../drink/Drinks'
  export default {
    components: {
      Drinks
    }
  }

</script>
