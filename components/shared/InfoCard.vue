<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card color="green accent-4">
          <v-container>
            <v-layout row wrap>
              <v-flex xs10>
                <v-card-title class="py-0" primary-title>
                  <div>
                    <h3 class="title mb-0">{{title}}</h3>
                    <div>{{desc}}</div>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs2>
                <v-icon x-large>{{icon}}</v-icon>
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
      props: ['title', 'desc', 'icon']
  }

</script>
