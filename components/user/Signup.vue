<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <AlertCmp v-if="error" :text="error.message"></AlertCmp>
            </v-flex> 
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                          <!-- form inputs -->
                            <form @submit.prevent="onSignup">
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                        name="email"
                                        label="Mail"
                                        id="email"
                                        v-model="email"
                                        type="email"
                                        required></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                        name="password"
                                        label="Password"
                                        id="password"
                                        v-model="password"
                                        type="password"
                                        required></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        id="confirmPassword"
                                        v-model="confirmPassword"
                                        type="password"
                                        :rules="[comparePasswords]"
                                        required></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn type="submit" :disabled="loading" :loading="loading" class="light-green accent-3">
                                            <span style="color: #388E3C">Sign Up</span>
                                            <span slot="loader" class="custom-loader"><v-icon>cached</v-icon></span>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card> 
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AlertCmp from "../shared/Alert.vue"

export default {
  components: {
    AlertCmp
  },
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    ...mapActions({
      signUserUp: 'A_SIGN_USER_UP'
    }),
    onSignup() {
      // Vuex
      if (this.comparePasswords === true) {
        this.signUserUp({
          email: this.email,
          password: this.password
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'G_USER',
      error: 'G_ERROR',
      loading: 'G_LOADING'
    }),
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Password do not match"
        : true;
    }
  },
  watch: {
    user(value) {
      if (
        value !== null &&
        value !== undefined &&
        this.comparePasswords === true
      ) {
        this.$router.push("/");
      }
    }
  }
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
