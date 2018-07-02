<template>
    <v-alert v-if="error" dismissible @input="onClose" :value="true" type="error">
      {{text}}
    </v-alert>
</template>
<script>
export default {
    props: ['text'],
    data () {
        return {
            alert: null,
        }
    },
    methods: {
        onClose () {
            this.$store.dispatch('clearError')
        }
    },
    computed: {
        error(){
            return this.$store.getters.error
        }
    }
}
</script>
