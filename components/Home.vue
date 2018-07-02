<template>
    <v-container fluid class="px-0 pt-0">
        <v-layout row v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular class="mt-4" indeterminate color="green" :width="9" :size="70"></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row justify-center v-if="!loading">
            <v-flex xs12>
                <v-carousel interval="3000" hide-delimiters>
                    <v-carousel-item router :to="'/drink/' + item.id" v-for="item in drinks" :src="item.imageUrl" :key="item.title"></v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4>
                <InfoCard
                title="Set Your account"
                desc="Sign up or Sign in"
                icon="playlist_add_check"></InfoCard>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <InfoCard
                title="Create Your drink"
                desc="Set all by Yourself"
                icon="local_bar"></InfoCard>
            </v-flex>
            <v-flex xs12 sm6 md4 offset-sm3 offset-md0>
                <InfoCard
                title="Edit afterwards"
                desc="Edit it, like it, learn it"
                icon="add_to_queue"></InfoCard>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import InfoCard from './shared/InfoCard'
export default {
  components: {
      InfoCard
  },
  computed: {
    drinks() {
      return this.$store.getters.newdrinks;
    },
    loading() {
      return this.$store.getters.loading;
    }
  }
}
</script>

<style>
.jumbotron__image {
  max-width: 100%;
}
.carousel {
  height: 360px;
}
@media screen and (max-width: 1000px) {
  .carousel {
    height: 270px;
  }
}
@media screen and (max-width: 600px) {
  .carousel {
    height: 180px;
  }
}
@media screen and (max-width: 480px) {
  .carousel {
    height: 150px;
  }
}
</style>
