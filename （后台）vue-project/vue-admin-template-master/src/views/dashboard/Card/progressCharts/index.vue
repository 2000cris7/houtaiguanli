<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        type: "category",
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [78],
          //   柱状图的宽度
          barWidth: 10,
          color: "yellowgreen",
          //   背景颜色的设置
          showBackgroundStyle: true,
          backgroundStyle: {
            color: "#eee",
          },
          //   文本
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
        },
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>