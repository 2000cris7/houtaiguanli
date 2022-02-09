<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0">
      </CategorySelect>
    </el-card>
    <el-card>
      <!-- 三部分切换展示 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
                >添加sku</hint-button
              >
              <hint-button
                type="warning"
                i9con="el-icon-edit"
                title="修改spu"
                @click="updateSpu(row)"
                >修改</hint-button
              >
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <div>
        <SpuForm
          v-show="scene == 1"
          @changeScene="changeScene"
          ref="spu"
        ></SpuForm>
      </div>
      <div>
        <SkuForm
          v-show="scene == 2"
          ref="sku"
          @changeScenes="changeScenes"
        ></SkuForm>
      </div>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- table展示sku列表 -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scoped="{row,$index}">
            <!-- <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            /> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  // 引入子组件
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 控制三级联动的可操作性

      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0, //0:展示spu列表数据  1：添加、修改spu   2：添加sku
      dialogTableVisible: false,
      spu: {},
      skuList: {},
      loading: true,
    };
  },
  methods: {
    // 三级联动的自定义事件，可以吧子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //  当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件回调（spuform）
    changeScene({ scene, flag }) {
      this.scene = scene;
      this.getSpuList(this.page);
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      // 切换场景2
      this.scene = 2;
      // 父组件让子组件调用子组件的方法，让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // skuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
      // 清除数据
      Object.assign(this._data, this.$option.data());
    },
    // 查看sku按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        // loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true;
      // 清除sku列表的数组
      this.skuList = [];
      done();
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>