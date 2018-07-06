<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Create a new Drink</h2>
      </v-flex>
    </v-layout>
    <!-- create content -->
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateDrink">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="title" label="Title" id="title" v-model="title" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="bar" label="Bar" id="bar" v-model="bar" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="light-green accent-3" raised @click="onPickFile" block><span style="color: #388E3C">Upload Image</span></v-btn>
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" width="100%">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="description" label="Description" id="description" multi-line rows="4" v-model="description" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm6 offset-sm3>
              <v-select :items="items" v-model="ingredients" label="Ingredients" multiple required></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
              <v-flex xs12 sm6 offset-sm3>
                <v-container>
                    <v-layout row wrap>
                        <v-flex xs4 v-for="ing in ingredients" :key="ing.text">
                            <div class="text-xs-center">
                                <v-chip class="green accent-4">{{ing.text}}</v-chip>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          <v-layout>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="light-green accent-3" :disabled="!formIsValid" type="submit" block><span style="color: #388E3C">Create Drink</span></v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        ingredients: null,
        title: "",
        bar: "",
        imageUrl: "",
        description: "",
        image: null
      };
    },
    methods: {
      onFilePicked(event) {
        const files = event.target.files;
        let filename = files[0].name;
        if (filename.lastIndexOf(".") <= 0) {
          return alert("Please add a valid file!");
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.imageUrl = fileReader.result;
        });
        fileReader.readAsDataURL(files[0]);
        this.image = files[0];
      },
      onPickFile() {
        this.$refs.fileInput.click();
      },
      onCreateDrink() {
        if (!this.formIsValid) {
          return;
        }
        if (!this.image) {
          return;
        }
        const drinkData = {
          title: this.title,
          bar: this.bar,
          image: this.image,
          description: this.description,
          ingredients: this.ingredients,
          date: new Date()
        };
        this.$store.dispatch("createDrink", drinkData);
        this.$router.push("/drinks");
      }
    },
    computed: {
      items() {
          return this.$store.getters.ingredients
      },
      formIsValid() {
        return (
          this.title !== "" &&
          this.bar !== "" &&
          this.imageUrl !== "" &&
          this.description !== "" &&
          this.ingredients !== null
        );
      }
    }
  }
</script>
