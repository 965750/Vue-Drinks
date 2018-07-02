<template>
    <v-container>
        <v-layout row wrap class="mb-2" v-for="drink in drinks" :key="drink.id">
            <v-flex xs12 sm10 md10 offset-md1 offset-sm1>
                <v-card class="info">
                    <v-container fluid>
                        <v-layout row wrap>
                            <v-flex xs12 sm3 md3>
                                <v-card-media :src="drink.imageUrl"
                                height="125px">
                                </v-card-media>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-card-title primary-title>
                                    <div>
                                        <h3 class="white--text mb-0">{{drink.title}}</h3>
                                        <div>{{drink.date | date}}</div>
                                    </div>
                                </v-card-title>
                                <v-card-actions>
                                    <v-btn small :to="/drink/ + drink.id" class="light-green accent-3">
                                        <v-icon color="green darken-2" left>arrow_forward</v-icon>
                                        <span style="color: #388E3C">View drink</span>
                                    </v-btn>    
                                </v-card-actions>
                            </v-flex>
                            <v-flex xs12 sm3 md5>
                                <v-card-text class="px-2 py-0">
                                    <div>
                                        <div style="opacity: .6">{{drink.description | longText}}</div>
                                    </div>
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  computed: {
    drinks () {
      return this.$store.getters.loadedDrinks
    },
  }
}
</script>

