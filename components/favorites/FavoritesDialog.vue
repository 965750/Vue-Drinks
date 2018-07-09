<template>
    <v-dialog persistent v-model="favoriteDialog" width="320px">
        <v-btn accent slot="activator" class="light-green accent-3" style="color: #388E3C">
            {{userIsRegistered ? 'Remove from Favorites' : 'Add to Favorites'}}
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title v-if="userIsRegistered">Remove from Favorites?</v-card-title>
                        <v-card-title v-else>Add to Favorites?</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-text>You can always change your decision later on.</v-card-text>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-btn class="red--text darken-1" @click="favoriteDialog = false">Cancel</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn class="green--text darken-1" @click="onAgree">Confirm</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["drinkId"],
  data() {
    return {
      favoriteDialog: false
    };
  },
  methods: {
    ...mapActions({
      removeFavFromUser: "A_REMOVE_FAV_FROM_USER",
      addFavForUser: "A_ADD_FAV_FOR_USER"
    }),
    onAgree() {
      if (this.userIsRegistered) {
        this.removeFavFromUser(this.drinkId);
      } else {
        this.addFavForUser(this.drinkId);
      }
    }
  },
  computed: {
    userIsRegistered() {
      return (
        this.$store.getters.G_USER.favDrinks.findIndex(drinkId => {
          return drinkId === this.drinkId;
        }) >= 0
      );
    }
  }
};
</script>
