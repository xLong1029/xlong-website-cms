<template>
  <div id="editableTable">
    <!-- 可编辑表格 -->
    <table ref="table" class="m-table" width="100%" cellpadding="0" cellspacing="0">
      <!-- 表头名称 -->
      <th
        v-for="(item, index) in title"
        :key="'th'+index"
        :align="item.align"
        :style="{ 'width' : item.width + 'px'}"
      >
        <Checkbox
          v-if="item.type == 'CheckBox'"
          v-model="checkAll"
          @on-change="selectAll(checkAll)"
        ></Checkbox>
        <span v-else>{{ item.title }}</span>
      </th>
      <!-- 表格内容 -->
      <template v-if="data.length">
        <!-- 已有行 -->
        <tr v-for="(item, index) in data" :key="'tr'+index">
          <td v-for="(th, i) in title" :key="'td'+i" :align="th.align">
            <!-- 勾选框 -->
            <Checkbox
              v-if="th.type == 'CheckBox'"
              v-model="item.isCheck"
              @on-change="selectRow(index, item.isCheck)"
            ></Checkbox>
            <!-- 显示文本 -->
            <span v-if="th.type == 'Text'">
              <span v-if="th.key == 'isDisable' && item[th.key] == 0" class="status-success">启用</span>
              <span v-else-if="th.key == 'isDisable' && item[th.key] == 1" class="status-fail">禁用</span>
              <span v-else-if="th.key == 'target' && item[th.key] == 1">当前页打开</span>
              <span v-else-if="th.key == 'target' && item[th.key] == 2">新页面跳转</span>
              <span v-else>{{ item[th.key] }}</span>
            </span>
            <!-- 输入框 -->
            <Input v-if="th.type == 'Input'" v-model="item[th.key]" />
            <!-- 图片上传 -->
            <div v-if="th.type == 'UploadImg'">
              <!-- 组件-图片上传-单图片显示 -->
              <SingleImage
                :src="item[th.key]"
                :index="index"
                upload-dir="img/banner/"
                :preview="true"
                :show-hint="false"
                :file-size="imgMaxSize"
                @get-img-url="setImg"
              ></SingleImage>
              <!-- <div class="upload-img">
                          <img class="show-img" :src="item[th.key]" alt="图片加载失败" @error="notFoundPic"/>
                      </div>
                      <div class="upload-btn">
                          <Button type="default" :disabled="item[th.key] == ''" icon="ios-eye-outline" @click="viewImage(index)">查看图片</Button>
                          <Button type="default" icon="ios-cloud-upload-outline" @click="uploadClick(index)" style="margin-left:10px">上传图片</Button>
              </div>-->
            </div>
            <!-- 操作按钮 -->
            <div v-if="th.type == 'Button'">
              <span v-for="(button, i) in th.button" :key="i">
                <Button
                  class="table-btn"
                  :type="button.type"
                  :size="button.size"
                  :style="{ 'min-width' : button.minWidth + 'px' }"
                  @click="buttonOperate(button, index)"
                >{{ button.text }}</Button>
              </span>
            </div>
          </td>
        </tr>
      </template>
      <tr v-else>
        <td :colspan="title.length" align="center">{{ emptyText }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
// 组件
import SingleImage from "components/Image/UploadImage/SingleImage";
import { SetDefaultPic } from "utils";

export default {
  name: "editableTable",
  components: { SingleImage },
  // 获取父组件传值
  props: {
    // 表格表头名称
    title: {
      type: Array,
      default: () => [
        // {
        //     title: '',
        //     key: '',
        //     align: '',
        //     type: 'Text'
        // }
      ]
    },
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    // 空数据时显示的文本内容
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    // 图片可上传的文件大小
    imgMaxSize: {
      type: Number,
      default: 2048
    }
  },
  data() {
    return {
      // 选项列表
      selectList: [],
      //选中所有项
      checkAll: false,
      // 显示查看图片
      showImgModal: false,
      // 显示图片Url
      imgUrl: "",
      // 当前操作行索引
      rowIndex: -1
    };
  },
  methods: {
    // 全选
    selectAll(check) {
      this.data.forEach(item => {
        if (check) {
          item.isCheck = true;
          // 设置选项列表
          this.selectList.push(item);
        } else {
          item.isCheck = false;
          // 清空选项列表
          this.clearSelect();
        }
      });
      this.$emit("on-all-select", this.selectList);
    },
    // 选中一行
    selectRow(index, check) {
      let row = this.data[index];
      if (check) {
        this.selectList.push(row);
      } else {
        this.removeSelectRow(index);
      }
      // 返回当前选中的列表，当前项
      this.$emit("on-select", this.selectList, row);
    },
    // 移除选中的行
    removeSelectRow(index) {
      let row = this.data[index];
      this.selectList.forEach((item, i) => {
        if (item == row) {
          row.isCheck = false;
          this.selectList.splice(i, 1);
        }
      });
    },
    // 清空选项
    clearSelect() {
      this.selectList = [];
    },
    // 设置图片
    setImg() {
      this.data[index].imgUrl = url;
    },
    // 按钮操作
    buttonOperate(button, index) {
      let row = this.data[index];

      // 点击”保存“按钮触发，返回该行
      if (button.click == "save") {
        this.$emit("on-save", row);
      }
      // 点击”删除“按钮触发，返回该行
      else if (button.click == "delete") {
        this.$emit("on-delete", row);

        // 取消其选中效果
        if (row.isCheck) {
          this.removeSelectRow(index);
        }

        // 移除对应索引位置的内容
        this.data.splice(index, 1);
      }
    },
    // 无法显示图片
    notFoundPic(event) {
      SetDefaultPic(event, 2);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/color";
.m-table {
  position: relative;
  border: 1px solid @table_border_color;
  border-bottom: 0;
  border-right: 0;
  font-size: 12px;

  td,
  th {
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid @td_border_color;
    border-right: 1px solid @td_border_color;
    padding: 12px;
  }

  th {
    background-color: #f8f8f9;
  }

  .show-img {
    width: auto;
    max-height: 120px;
    max-width: 90%;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid rgb(228, 229, 231);
  }

  .table-btn {
    margin: 0 5px;
  }
}
</style>

