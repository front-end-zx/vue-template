<template>
    <div>
        <h1>登录</h1>
        <button @click="login">登录</button>
    </div>
</template>
<script>
import request from '@/utils/request';

export default ({
    name: "登录",
    created() {
    },
    methods: {
        login: async function (){
            const result = await request({
                method: "GET",
                url: "/multidimensionSearch/v1/3/hnul-project-base-infos?page=0&size=5&menuId=6504"
            })
            console.log(result);
        }
    },
})
</script>
