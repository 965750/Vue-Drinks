<template>
  <v-dialog width="320px" persistent v-model="editDialog">
    <v-btn fab accent class="light-green accent-3" slot="activator">
      <v-icon color="green darken-2">edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title class="info--text">Edit Drink</v-card-title>
          </v-flex>
        </v-layout>
        <!-- edit content -->
        <v-divider></v-divider>
        <v-layout row wrap class="mb-2">
          <v-flex xs12>
            <v-card-text>
              <v-textarea name="title" label="Title" id="title" v-model="editedTitle" required></v-textarea>
              <v-textarea name="description" label="Description" id="description" multi-line rows="4" v-model="editedDescription" required></v-textarea>
            </v-card-text>
          </v-flex>
          <v-flex xs12>
            <v-card-text>
              <v-select :items="ingredients" v-model="editedIngredients" label="Ingredients" multiple required></v-select>
            </v-card-text>
          </v-flex>
          <v-flex xs6 v-for="ing in editedIngredients" :key="ing">
            <v-card-text class="py-0">
              <div class="text-xs-center">
                <v-chip color="green accent-4">{{ing}}</v-chip>
              </div>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout>
          <v-flex xs12>
            <v-card-actions>
              <v-btn class="red--text darken-1" @click="editDialog = false">Close</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="green--text darken-1" @click="onSaveChanges">Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["drink"],
  data() {
    return {
      editedIngredients: this.drink.ingredients,
      editDialog: false,
      editedTitle: this.drink.title,
      editedDescription: this.drink.description
    };
  },
  methods: {
    onSaveChanges() {
      if (
        this.editedTitle.trim() === "" ||
        this.editedDescription.trim() === "" ||
        this.editedIngredients.length <= 0
      ) {
        return;
      }
      this.editDialog = false;
      this.updateDrinkData({
        id: this.drink.id,
        title: this.editedTitle,
        description: this.editedDescription,
        ingredients: this.editedIngredients
      });
    },
    ...mapActions({
      updateDrinkData: "A_UPDATE_DRINK_DATA"
    })
  },
  computed: {
    ...mapGetters({
      ingredients: "G_INGREDIENTS"
    })
  }
};
</script>
