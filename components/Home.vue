<template>
    <v-container fluid class="px-0 pt-0">
      <!-- carousel -->
        <v-layout row v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular class="mt-4" indeterminate color="green" :width="9" :size="70"></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row justify-center v-if="!loading">
            <v-flex xs12>
                <v-carousel interval="2300" hide-delimiters>
                    <v-carousel-item router :to="'/drink/' + item.id" v-for="item in drinks" :src="item.imageUrl" :key="item.title"></v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>
        <!-- info cards -->
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
import { mapGetters } from "vuex";
import InfoCard from './shared/InfoCard'

export default {
  components: {
      InfoCard
  },
  computed: {
    ...mapGetters({
      drinks: 'G_NEW_DRINKS',
      loading: 'G_LOADING'
    })
  }
}
</script>

<style>
.jumbotron__image {
  max-width: 100%;
}
.v-carousel {
  height: 360px !important;
}
@media screen and (max-width: 1000px) {
  .v-carousel {
    height: 270px !important;
  }
}
@media screen and (max-width: 600px) {
  .v-carousel {
    height: 180px !important;
  }
}
@media screen and (max-width: 480px) {
  .v-carousel {
    height: 150px !important;
  }
}
</style>
