<template>

</template>

<script>
    export default {
        data: function(){
            return {

            }
        },
        methods:{

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.$router.replace(from.path)
            })
        },
        created(){

        },
        watch: {

        },
    }
</script>

<style scoped>
    .error-handle{
        padding-bottom:15px;
    }
</style>
