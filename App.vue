<template>
  <v-app :dark="darkTheme">
    <header>
      <TheHeader></TheHeader>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>
<script>
import TheHeader from '@/components/TheHeader'
export default {
  components: {
    TheHeader
  },
  computed: {
    darkTheme() {
      return this.$store.getters.darkTheme
    }
  }
}
</script>
