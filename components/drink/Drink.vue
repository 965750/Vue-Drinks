<template>
    <v-container>
        <v-layout row wrap v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate class="primary--text" color="green" :width="7" :size="70"></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs12>
                <v-card>
                    <v-container>
                        <!-- header of card -->
                        <v-layout row wrap>
                            <v-flex xs12> 
                                <v-card-media :src="drink.imageUrl"
                                    height="300px">
                                </v-card-media>
                                <v-card-title class="title">
                                    <h3>{{drink.title}}</h3>
                                    <template v-if="userIsCreator">
                                    <v-spacer></v-spacer>
                                    <AppEdit :drink="drink"></AppEdit>
                                    </template>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 v-if="userIsCreator">
                                <v-card-text class="py-0 caption"><v-icon left>assignment_ind</v-icon>Creator</v-card-text>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <!-- card content -->
                        <v-layout row wrap>
                            <v-flex xs12 sm3>
                                <v-card-title class="body-1">
                                    <h3>Ingredients:</h3>
                                </v-card-title>
                                <div class="text-xs-center" v-for="ing in drink.ingredients" :key="ing">
                                    <v-chip color="green accent-4">{{ing}}</v-chip>
                                </div>
                            </v-flex>
                            <v-flex xs12 sm9>
                                <v-card-text>
                                    <span>{{drink.description}}</span>
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-spacer></v-spacer>
                            <v-flex>
                                <v-card-actions>
                                    <app-favorites-dialog v-if="userIsAuth && !userIsCreator" :drinkId="drink.id"></app-favorites-dialog>
                                </v-card-actions>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap row>
                            <v-flex xs12>
                                <div class="info--text mt-3">{{drink.date | date}}</div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import AppEdit from "./edit/EditDrinkDetails";

export default {
  components: {
    AppEdit
  },
  props: ["id"],
  computed: {
    ...mapGetters({
      loading: "G_LOADING"
    }),
    drink() {
      return this.$store.getters.G_LOADED_DRINK(this.id);
    },
    userIsAuth() {
      return (
        this.$store.getters.G_USER !== null &&
        this.$store.getters.G_USER !== undefined
      );
    },
    userIsCreator() {
      if (!this.userIsAuth) {
        return false;
      }
      return this.$store.getters.G_USER.id === this.drink.creatorId;
    }
  }
};
</script>

