<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
import Cookie from "js-cookie";
export default {
  name: "app",
  watch: {
    "$store.state.ticket": function () {
      this.setTicket();
    },
  },
  methods: {
    setTicket() {
      let authorization = localStorage.getItem("authorization");
      this.setCookie("authorization", authorization);
      // account.GetUserInfo().then(res => {
      //   localStorage.setItem("user_info", JSON.stringify(res.data.data));
      //   this.user_info = JSON.parse(localStorage.getItem("user_info"));
      // });
    },
    setCookie(key, value) {
      value =
        value && typeof value === "string" ? value.replace(/=/g, ">") : "";
      Cookie.set(key, value, { expires: 9999 });
    },
  },
};
</script>

<style></style>
