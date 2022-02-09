<template>
  <div class="dashboard-container">
    <div class="dashboard-text"></div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Sale from "./Sale";
import Card from "./Card";
import Observe from "./Observe";
export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe,
  },
  // Observe,
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
