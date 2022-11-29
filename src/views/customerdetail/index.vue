<template>
  <div>
    <div class="customerInfoCard">
      <div>
        <span class="customerName">{{ customerInfo.name }}</span>
        <!-- <span>客户网络资讯</span> -->
      </div>
      <div class="concatInfo">
        <span><i>客户归属：</i>{{ customerInfo.userId }}</span>
        <span><i>首联系人：</i>{{ customerInfo.contactName }}</span>
        <span
          ><i>下次跟进：</i
          >{{
            customerInfo.nextFollowTime == null
              ? "无"
              : customerInfo.nextFollowTime
          }}</span
        >
      </div>
      <div class="btnWarp">
        <el-button
          plain
          icon="el-icon-plus"
          size="small"
          v-btnPermi="['kh_move_into_the_high_seas']"
          @click="handleAction('1')"
          >添加联系人</el-button
        >
        <el-button
          plain
          icon="el-icon-edit"
          size="small"
          v-btnPermi="['kh_new_follow_up']"
          @click="handleAction('2')"
          >写新跟进</el-button
        >
        <el-button
          plain
          icon="el-icon-document-add"
          size="small"
          v-btnPermi="['kh_new_task']"
          @click="handleAction('5')"
          >新建任务</el-button
        >
        <el-button
          plain
          icon="el-icon-refresh-left"
          size="small"
          v-btnPermi="['kh_transfer_customer']"
          @click="handleAction('3')"
          >转移客户</el-button
        >
        <el-button
          plain
          icon="el-icon-s-promotion"
          size="small"
          v-btnPermi="['kh_move_into_the_high_seas']"
          @click="handleAction('4')"
          >移入公海</el-button
        >
        <el-button
          plain
          icon="el-icon-date"
          size="small"
          v-btnPermi="['kh_add_collaboration']"
          @click="handleAction('6')"
          >添加协作</el-button
        >
        <el-button
          v-if="customerInfo.isImportant == 1"
          plain
          icon="el-icon-star-on"
          size="small"
          @click="handleAction('8')"
          >取消关注</el-button
        >
        <el-button
          v-else
          plain
          icon="el-icon-star-off"
          size="small"
          @click="handleAction('7')"
          >重点关注</el-button
        >
        <el-button
          plain
          icon="el-icon-edit-outline"
          size="small"
          @click="edit()"
          v-if="customerInfo.status == 0"
          v-btnPermi="['kh_edit_customer']"
          >编辑客户</el-button
        >
        <el-button
          v-else
          icon="el-icon-edit-outline"
          size="small"
          @click="editsea()"
          v-btnPermi="['kh_edit_customer']"
          >编辑客户</el-button
        >
        <el-button
          plain
          icon="el-icon-circle-close"
          size="small"
          v-btnPermi="['kh_delete_customer']"
          @click="delcustomer('2')"
          >删除客户</el-button
        >
      </div>
    </div>

    <div class="pd">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsSelf">
        <el-tab-pane
          v-if="istabShow('kh_general_info')"
          label="概况信息"
          name="1"
        >
          <div>
            <div>
              <div
                class="titleSelf"
                style="display: flex; justify-content: space-between"
              >
                <div><i class="el-icon-s-flag"></i> 基本信息</div>
                <div
                  @click="activeName = '2'"
                  style="font-weight: 500; cursor: pointer"
                >
                  查看详情 <i class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div class="tableSelf">
                <div class="box">
                  <div class="each">
                    <div>客户名称：</div>
                    <div>{{ customerInfo.name }}</div>
                  </div>
                  <div class="each">
                    <div>客户类型：</div>
                    <div>{{ customerInfo.type }}</div>
                  </div>
                  <div class="each">
                    <div>客户星级：</div>
                    <div>{{ customerInfo.star }}</div>
                  </div>
                  <div class="each">
                    <div>客户状态：</div>
                    <div>{{ customerInfo.state }}</div>
                  </div>
                </div>
                <div class="box">
                  <div class="each">
                    <div>系统编号：</div>
                    <div>{{ customerInfo.sysNo }}</div>
                  </div>
                  <div class="each">
                    <div>所属行业：</div>
                    <div>{{ customerInfo.industry }}</div>
                  </div>
                  <div class="each">
                    <div>客户来源：</div>
                    <div>{{ customerInfo.source }}</div>
                  </div>
                  <div class="each">
                    <div>客户归属：</div>
                    <div>{{ customerInfo.userId }}</div>
                  </div>
                </div>
              </div>
              <div
                class="titleSelf"
                style="display: flex; justify-content: space-between"
              >
                <div><i class="el-icon-s-flag"></i> 首联系人</div>
                <div
                  @click="JumpContactdetail(customerInfo.contactEntity.id)"
                  style="font-weight: 500; cursor: pointer"
                >
                  查看更多 <i class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div class="tableSelf">
                <div class="box">
                  <div class="each">
                    <div>联系人姓名：</div>
                    <div
                      style="
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                      "
                    >
                      <p style="padding: 0; margin: 0">
                        {{ customerInfo.contactEntity.contactName }}
                      </p>
                      <p style="padding: 0; margin: 0">
                        <span
                          class="action_span"
                          @click="handledelEdit(customerInfo.contactEntity.id)"
                          ><i class="el-icon-edit"></i>编辑</span
                        >
                        <span
                          class="action_span"
                          @click="
                            JumpContactdetail(customerInfo.contactEntity.id)
                          "
                          ><i class="el-icon-arrow-right"></i> 详情</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="each">
                    <div>角色：</div>
                    <div>{{ customerInfo.contactEntity.role }}</div>
                  </div>
                  <div class="each">
                    <div>生日：</div>
                    <div>{{ customerInfo.contactEntity.birthday }}</div>
                  </div>
                  <div class="each">
                    <div>固定电话：</div>
                    <div>{{ customerInfo.contactEntity.tel }}</div>
                  </div>
                </div>
                <div class="box">
                  <div class="each">
                    <div>手机号码：</div>
                    <div>{{ customerInfo.contactEntity.phone }}</div>
                  </div>
                  <div class="each">
                    <div>部门职务：</div>
                    <div>{{ customerInfo.contactEntity.deptRole }}</div>
                  </div>
                  <div class="each">
                    <div>电子邮箱：</div>
                    <div>{{ customerInfo.contactEntity.email }}</div>
                  </div>
                  <div class="each">
                    <div>传真号码：</div>
                    <div>{{ customerInfo.contactEntity.faxNo }}</div>
                  </div>
                </div>
              </div>
              <div class="titleSelf">
                <i class="el-icon-s-flag"></i>相关数据
              </div>
              <div class="dataWarp">
                <div @click="activeName = '3'">
                  <span>联系人</span>
                  <span>{{ dataVO.contactNum }}条</span>
                </div>
                <div @click="activeName = '5'">
                  <span>跟进记录</span>
                  <span>{{ dataVO.followRecordsNum }}条</span>
                </div>
                <div @click="activeName = '8'">
                  <span>归属记录</span>
                  <span>{{ dataVO.attrRecordsNum }}条</span>
                </div>
                <div @click="activeName = '9'">
                  <span>操作记录</span>
                  <span>{{ dataVO.operaLogNum }}条</span>
                </div>
                <div @click="activeName = '6'">
                  <span>任务记录</span>
                  <span>{{ dataVO.workRecordsNum }}条</span>
                </div>
                <div @click="activeName = '7'">
                  <span>工单记录</span>
                  <span>{{ dataVO.wordOrderRecordsNum }}</span>
                </div>
              </div>
            </div>
            <div
              class="titleSelf"
              style="display: flex; justify-content: space-between"
            >
              <div><i class="el-icon-s-flag"></i>客户动态</div>
              <div style="font-weight: 500; cursor: pointer">
                <el-checkbox v-model="onlySeeFollowUp">只看跟进</el-checkbox>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  style="margin-left: 10px"
                  v-btnPermi="['kh_new_follow_up']"
                  @click="handleAction('2')"
                  >写跟进</el-button
                >
              </div>
            </div>
            <div class="timelineBox">
              <el-timeline style="padding-left: 5px">
                <el-timeline-item
                  v-for="(item, index) in dynamicList"
                  :key="index"
                  color="#0079fe"
                  :timestamp="item.date"
                  placement="top"
                >
                  <el-card
                    style="margin-top: 10px; background: #f7fbfe"
                    v-for="(items, indexs) in item.list"
                    :key="indexs"
                  >
                    <h4 class="dynamicUserInfoDiv">
                      <div>
                        <img
                          :src="
                            items.avatar == '' || items.avatar == null
                              ? $store.state.user.defaultAvatar
                              : items.avatar
                          "
                          alt=""
                        />
                      </div>
                      <span>{{ items.userName }}</span>
                      <span>{{ items.dynamicTitle }}</span>
                    </h4>
                    <p>{{ items.dynamicContent }}</p>
                    <p>客户来自：{{ customerInfo.name }}</p>
                    <div
                      class="commentList"
                      v-for="(common, commonindex) in items.list"
                      :key="commonindex"
                    >
                      <i
                        @click="delComment(common)"
                        class="delIcon el-icon-close"
                      ></i>
                      <h4 class="dynamicUserInfoDiv">
                        <div>
                          <img
                            :src="
                              common.avatar == '' || common.avatar == null
                                ? $store.state.user.defaultAvatar
                                : common.avatar
                            "
                            alt=""
                          />
                        </div>
                        <span
                          >{{ common.userName }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                            common.createTime
                          }}</span
                        >
                      </h4>
                      <div>
                        <span>{{ common.commentContent }}</span>
                      </div>
                    </div>
                    <div v-if="items.type == 1">
                      <el-button
                        plain
                        v-btnPermi="['kh_follow_up_details']"
                        icon="el-icon-date"
                        size="small"
                        @click="detail(items.id)"
                        >详情</el-button
                      >
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click="comment(items)"
                        >评论</el-button
                      >
                    </div>
                    <div class="commentDiv" v-if="items.id == currentCommentId">
                      <el-input placeholder="请输入内容" v-model="comments">
                      </el-input>
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click.native="SendComment(items)"
                        >评论</el-button
                      >
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_data_details')"
          label="资料详情"
          name="2"
        >
          <div>
            <div
              class="titleSelf"
              style="display: flex; justify-content: space-between"
            >
              <div><i class="el-icon-s-flag"></i> 基本信息</div>
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-edit-outline"
                  size="small"
                  @click="edit()"
                  v-btnPermi="['kh_edit_customer']"
                  >编辑客户</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="customerDetailExport()"
                  >导出</el-button
                >
              </div>
            </div>
            <div class="tableSelf">
              <div class="box">
                <div class="each">
                  <div>客户名称：</div>
                  <div>{{ customerInfo.name }}</div>
                </div>
                <div class="each">
                  <div>客户类型：</div>
                  <div>{{ customerInfo.type }}</div>
                </div>
                <div class="each">
                  <div>客户星级：</div>
                  <div>{{ customerInfo.star }}</div>
                </div>
                <div class="each">
                  <div>客户状态：</div>
                  <div>{{ customerInfo.state }}</div>
                </div>
              </div>
              <div class="box">
                <div class="each">
                  <div>助记名称：</div>
                  <div>{{ customerInfo.shortName }}</div>
                </div>
                <div class="each">
                  <div>所属行业：</div>
                  <div>{{ customerInfo.industry }}</div>
                </div>
                <div class="each">
                  <div>客户来源：</div>
                  <div>{{ customerInfo.source }}</div>
                </div>
                <div class="each">
                  <div>客户归属：</div>
                  <div>{{ customerInfo.userId }}</div>
                </div>
              </div>
            </div>
            <div class="titleSelf"><i class="el-icon-s-flag"></i>附加信息</div>
            <div class="tableSelf">
              <div class="box">
                <div class="each">
                  <div>所在地区：</div>
                  <div>{{ customerInfo.address }}</div>
                </div>
                <div class="each">
                  <div>企业规模：</div>
                  <div>{{ customerInfo.scale }}</div>
                </div>
                <div class="each">
                  <div>下级客户：</div>
                  <div
                    @click="activeName = '4'"
                    style="color: #409eff; cursor: pointer"
                  >
                    {{ customerInfo.childCustomerNum }}
                  </div>
                </div>
              </div>
              <div class="box">
                <div class="each">
                  <div>详细地址：</div>
                  <div>{{ customerInfo.detailAddress }}</div>
                </div>
                <div class="each">
                  <div>上级客户：</div>
                  <div
                    @click="jumpToParentCustomer()"
                    style="color: #409eff; cursor: pointer"
                  >
                    {{ customerInfo.parentCustomerName }}
                  </div>
                </div>
                <div class="each">
                  <div>备注信息：</div>
                  <div>{{ customerInfo.remark }}</div>
                </div>
              </div>
            </div>
            <div class="titleSelf"><i class="el-icon-s-flag"></i>系统信息</div>
            <div class="tableSelf">
              <div class="box">
                <div class="each">
                  <div>系统编号：</div>
                  <div>{{ customerInfo.sysNo }}</div>
                </div>
                <div class="each">
                  <div>所属部门：</div>
                  <div>{{ customerInfo.deptId }}</div>
                </div>
                <div class="each">
                  <div>前归属人：</div>
                  <div>{{ customerInfo.beforeUserId }}</div>
                </div>
                <div class="each">
                  <div>创建时间：</div>
                  <div>{{ customerInfo.createTime }}</div>
                </div>
                <div class="each">
                  <div>最后跟进：</div>
                  <div>{{ customerInfo.followTime }}</div>
                </div>
              </div>
              <div class="box">
                <div class="each">
                  <div>协作人员：</div>
                  <div>{{ customerInfo.collaborators }}</div>
                </div>
                <div class="each">
                  <div>创建人员：</div>
                  <div>{{ customerInfo.createBy }}</div>
                </div>
                <div class="each">
                  <div>前所属部门：</div>
                  <div>{{ customerInfo.beforeDeptId }}</div>
                </div>
                <div class="each">
                  <div>更新时间：</div>
                  <div>{{ customerInfo.updateTime }}</div>
                </div>
                <div class="each">
                  <div>下次跟进：</div>
                  <div>{{ customerInfo.nextFollowTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="istabShow('kh_contact')" label="联系人" name="3">
          <div
            style="
              margin-bottom: 10px;
              display: flex;
              justify-content: flex-end;
            "
          >
            <el-button
              style="margin-right: 10px"
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="handleAddConcant"
              v-btnPermi="['contacts_add']"
              >添加</el-button
            >
            <el-button
              style="margin-left: 10px"
              type="primary"
              icon="el-icon-circle-plus"
              size="small"
              @click="exportContact(customerInfo.id)"
              v-btnPermi="['contacts_export']"
              >导出</el-button
            >
            <!--<el-dropdown
              trigger="click"
              v-btnPermi="['contacts_export']"
              style="margin-right: 10px"
            >
              <el-button type="primary" icon="el-icon-upload" size="small"
                >导出</el-button
              >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-circle-plus"
                  @click.native="exportByChoose"
                  >选中导出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>-->
            <el-button
              plain
              v-btnPermi="['contacts_delete']"
              icon="el-icon-switch-button"
              size="small"
              @click="handledelConcant()"
              >删除</el-button
            >
          </div>
          <el-table
            ref="multipleTable"
            :data="concantTableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeConcant"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="联系人姓名" prop="contactName">
            </el-table-column>
            <el-table-column prop="phone" label="手机号码"> </el-table-column>
            <el-table-column prop="role" label="角色"> </el-table-column>
            <el-table-column prop="deptRole" label="部门职务">
            </el-table-column>
            <el-table-column prop="birthday" label="生日"> </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  style="margin-right: 10px"
                  @click.native.prevent="JumpContactdetail(scope.row.id)"
                  size="mini"
                  type="primary"
                  plain
                >
                  详情
                </el-button>
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="delContant(scope.row.id)"
                >
                  <el-button slot="reference" size="mini" type="danger" plain>
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_lower_level_customers')"
          label="下级客户"
          name="4"
        >
          <div>
            <div
              style="
                margin-bottom: 10px;
                display: flex;
                justify-content: flex-end;
              "
            >
              <el-button
                style="margin-left: 10px"
                type="primary"
                icon="el-icon-circle-plus"
                size="small"
                @click="nextcustomerExport"
                >导出</el-button
              >
              <!--<el-dropdown
              trigger="click"
              v-btnPermi="['contacts_export']"
              style="margin-right: 10px"
            >
              <el-button type="primary" icon="el-icon-upload" size="small"
                >导出</el-button
              >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-circle-plus"
                  @click.native="nextcustomerExport"
                  >选中导出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>-->
            </div>
            <el-table
              ref="multipleTable"
              :data="nextcustomerTableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="name" label="客户名称" width="120">
              </el-table-column>
              <el-table-column prop="type" label="客户类型" width="120">
              </el-table-column>
              <el-table-column
                prop="state"
                label="客户状态"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="contactName"
                label="首联系人"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="contactPhone"
                label="手机号码"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="userId"
                label="客户归属"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_follow_up_record')"
          label="跟进记录"
          name="5"
        >
          <div>
            <div
              class="titleSelf"
              style="display: flex; justify-content: space-between"
            >
              <div><i class="el-icon-s-flag"></i> 跟进记录</div>

              <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-form-item prop="realName">
                  <el-input
                    v-model="queryParams.keyword"
                    placeholder="搜索关键词"
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="" prop="endLastLoginTime">
                  <el-date-picker
                    v-model="time"
                    size="mini"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                  <el-button size="mini" @click="searchFollowRecordList"
                    >查询</el-button
                  >
                </el-form-item>
                <el-form-item label="">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="followRecordDownload"
                    >导出</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
            <div
              style="text-align: center; padding-top: 30px; color: #999999"
              v-if="followRecordData.length == 0"
            >
              暂无数据
            </div>
            <div class="timelineBox">
              <el-timeline style="padding-left: 5px">
                <el-timeline-item
                  v-for="(item, index) in followRecordData"
                  :key="index"
                  color="#0079fe"
                  :timestamp="item.date"
                  placement="top"
                >
                  <el-card
                    style="margin-top: 10px; background: #f7fbfe"
                    v-for="(items, indexs) in item.list"
                    :key="indexs"
                  >
                    <h4 class="dynamicUserInfoDiv">
                      <div>
                        <img
                          :src="
                            items.avatar == '' || items.avatar == null
                              ? $store.state.user.defaultAvatar
                              : items.avatar
                          "
                          alt=""
                        />
                      </div>
                      <span>{{ items.userName }}</span>
                      <span>{{ items.dynamicTitle }}</span>
                    </h4>
                    <p>{{ items.dynamicContent }}</p>
                    <p>客户来自：{{ customerInfo.name }}</p>
                    <div
                      class="commentList"
                      v-for="(common, commonindex) in items.list"
                      :key="commonindex"
                    >
                      <h4 class="dynamicUserInfoDiv">
                        <div>
                          <img
                            :src="
                              common.avatar == '' || common.avatar == null
                                ? $store.state.user.defaultAvatar
                                : common.avatar
                            "
                            alt=""
                          />
                        </div>
                        <span
                          >{{ common.userName }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                            common.createTime
                          }}</span
                        >
                      </h4>
                      <div>
                        <span>{{ common.commentContent }}</span>
                      </div>
                    </div>
                    <div v-if="items.type == 1">
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        v-btnPermi="['kh_follow_up_details']"
                        @click="detail(items.id)"
                        >详情</el-button
                      >
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click="comment(items)"
                        >评论</el-button
                      >
                    </div>
                    <div class="commentDiv" v-if="items.id == currentCommentId">
                      <el-input placeholder="请输入内容" v-model="comments">
                      </el-input>
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click.native="SendComment(items)"
                        >评论</el-button
                      >
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_mission_record')"
          label="任务记录"
          name="6"
        >
          <div>
            <div class="titleSelf">
              <div
                class="titleSelf"
                style="display: flex; justify-content: space-between"
              >
                <div><i class="el-icon-s-flag"></i> 任务记录</div>

                <el-form
                  :model="taskqueryParams"
                  ref="queryForm"
                  :inline="true"
                >
                  <el-form-item label="">
                    <el-select
                      size="mini"
                      v-model="taskqueryParams.type"
                      placeholder="任务状态"
                    >
                      <el-option label="全部" value=""></el-option>
                      <el-option label="未开始" value="0"></el-option>
                      <el-option label="进行中" value="1"></el-option>
                      <el-option label="已超时" value="2"></el-option>
                      <el-option label="已完成" value="3"></el-option>
                      <el-option label="未完成" value="4"></el-option>
                      <el-option label="已取消" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="realName">
                    <el-input
                      v-model="taskqueryParams.keyword"
                      placeholder="搜索关键词"
                      clearable
                      size="mini"
                      @keyup.enter.native="searchtaskList"
                    />
                  </el-form-item>
                  <el-form-item label="" prop="endLastLoginTime">
                    <el-date-picker
                      v-model="time2"
                      size="mini"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button size="mini" @click="searchtaskList"
                      >查询</el-button
                    >
                  </el-form-item>
                  <el-form-item label="">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="workrecordexport"
                      >导出</el-button
                    >
                  </el-form-item>
                  <el-form-item label="">
                    <el-button
                      type="primary"
                      size="mini"
                      v-btnPermi="['kh_new_task']"
                      @click="handleAction('5')"
                      >添加</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div
              style="text-align: center; padding-top: 30px; color: #999999"
              v-if="workRecordData.length == 0"
            >
              暂无数据
            </div>
            <div
              class="TaskCard"
              v-for="(item, index) in workRecordData"
              :key="index"
            >
              <div>
                <span>开始时间</span>
                <span>{{ item.beginTime }}</span>
              </div>
              <div>
                <span>任务标题</span>
                <span>{{ item.headline }}</span>
              </div>
              <div>
                <span>负责人员</span>
                <span>{{ item.personId }}</span>
              </div>
              <div>
                <span>任务状态</span>
                <span>{{ item.taskType }}</span>
              </div>
              <div>
                <span>紧要程度</span>
                <span>{{ item.urgencydegree }}</span>
              </div>
              <div style="width: 100px">
                <el-button
                  plain
                  icon="el-icon-date"
                  size="small"
                  @click="taskDetailDialog(item.id)"
                  >详情</el-button
                >
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_work_order_record')"
          label="工单记录"
          name="7"
        >
          <div>
            <div
              class="titleSelf"
              style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
              "
            >
              <div><i class="el-icon-s-flag"></i> 工单记录</div>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  @click="customerworkorderrecordexport()"
                  >导出</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-edit-outline"
                  size="small"
                  @click="delOrder()"
                  >删除</el-button
                >
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="workOrderRecordData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChangeWorkOrder"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="workId" label="工单编号">
              </el-table-column>
              <el-table-column prop="workTitle" label="工单标题">
              </el-table-column>
              <el-table-column
                prop="createBy"
                label="发起人员"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="operationStaff"
                label="处理人员"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="发起时间"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column prop="workStatus" label="工单状态">
                <template slot-scope="scope">
                  {{
                    scope.row.workStatus == 1
                      ? "处理中"
                      : scope.row.workStatus == 2
                      ? "已完结"
                      : "被退回"
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="commentCount" label="评论记录">
                <template slot-scope="scope">
                  {{ scope.row.commentCount }}条
                </template>
              </el-table-column>
              <el-table-column prop="userId" label="操作">
                <template slot-scope="scope">
                  <el-button
                    style="margin-right: 10px"
                    @click.native.prevent="jumpWorkdetail(scope.row.id)"
                    size="mini"
                  >
                    详情
                  </el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="del(scope.row.id)"
                  >
                    <el-button slot="reference" size="mini"> 删除 </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_attribution_record')"
          label="归属记录"
          name="8"
        >
          <div>
            <div class="titleSelf">
              <div
                class="titleSelf"
                style="display: flex; justify-content: space-between"
              >
                <div><i class="el-icon-s-flag"></i> 归属记录</div>

                <el-form
                  :model="belongqueryParams"
                  ref="belongqueryParams"
                  :inline="true"
                >
                  <el-form-item label="" prop="endLastLoginTime">
                    <el-date-picker
                      v-model="time3"
                      size="mini"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button size="mini" @click="belongRecordSearch"
                      >查询</el-button
                    >
                  </el-form-item>
                  <el-form-item label="">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="belongRecordExport"
                      >导出</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="customerAttributionRecordData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="currentUserId" label="目前归属">
              </el-table-column>
              <el-table-column prop="originalUserId" label="原来归属">
              </el-table-column>
              <el-table-column
                prop="customerType"
                label="客户类型"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="customerIndustry"
                label="所属行业"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="startTime"
                label="保护起始"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column prop="endTime" label="保护截至">
              </el-table-column>
              <el-table-column prop="operaWay" label="操作方式">
              </el-table-column>
              <el-table-column prop="createBy" label="操作人">
              </el-table-column>
              <el-table-column prop="createTime" label="操作时间">
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="istabShow('kh_operation_log')"
          label="操作日志"
          name="9"
        >
          <div>
            <div class="titleSelf">
              <div
                class="titleSelf"
                style="display: flex; justify-content: space-between"
              >
                <div><i class="el-icon-s-flag"></i> 操作日志</div>

                <el-form
                  :model="operaqueryparams"
                  ref="belongqueryParams"
                  :inline="true"
                >
                  <el-form-item label="" prop="endLastLoginTime">
                    <el-date-picker
                      v-model="time4"
                      size="mini"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button size="mini" @click="operaSearch">查询</el-button>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button type="primary" size="mini" @click="operaExport"
                      >导出</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="operaLogData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="time" label="操作时间"> </el-table-column>
              <el-table-column prop="userId" label="操作人员">
              </el-table-column>
              <el-table-column prop="type" label="操作类型"> </el-table-column>
              <el-table-column prop="fieldName" label="字段名">
              </el-table-column>
              <el-table-column prop="fieldOld" label="旧字段值">
              </el-table-column>
              <el-table-column prop="field" label="新字段值"> </el-table-column>
              <el-table-column prop="remark" label="备注"> </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 跟进 -->
    <FollowUp
      ref="FollowUp"
      :customerId="currentCustomerId"
      @closeAdd="followRecordList"
      @reload="getData"
      :contactIds="customerInfo.contactId"
    />
    <!-- 转移客户 -->
    <TransferCustomer ref="TransferCustomer" :ids="ids" @reload="jumpList" />
    <!-- 移入公海 -->
    <ShiftInHigiSeas ref="ShiftInHigiSeas" @reload="jumpList" :ids="ids" />
    <!-- 新建编辑客户 -->
    <Customer v-if="open" :id="editId" ref="Customer" @reload="getData" />
    <!-- 新建任务 -->
    <Task
      ref="Task"
      :customerId="[currentCustomerId]"
      @closeAdd="workRecordList"
      @reload="workRecordList"
      :type="0"
    />
    <!-- 添加联系人 -->
    <ConnectPerson
      :customerId="currentCustomerId"
      ref="ConnectPerson"
      :id="editConcantId"
      @reload="getcontactList"
    />
    <!-- 添加协作 -->
    <CoopeaTion
      :customerId="currentCustomerId"
      ref="CoopeaTion"
      :ids="ids"
      :isCoop="customerInfo.collaboratorIds"
      @reload="getData"
    />
    <!-- 跟进详情 -->
    <FollowUpDetail ref="FollowUpDetail" @reload="getData" />
    <CustomerSea
      v-if="CustomerSeaopen"
      :id="editId"
      ref="CustomerSea"
      @reload="getData"
    />
  </div>
</template>

<script>
import {
  generalInfo,
  getcontactList,
  getnextcustomerList,
  workRecordList,
  workOrderRecordList,
  followRecordList,
  operaLogList,
  customerAttributionRecordList,
  customerremove,
  focusOrNot,
  followrecorddetail,
  deleteByIds,
} from "@/api/customer/index";
import { SendComment, deleCommentById } from "@/api/common/index";
import { removeWorkOrder } from "@/api/workOrder/index";
import CoopeaTion from "./components/cooperation.vue";
import FollowUp from "../add/followup.vue";
import TransferCustomer from "../customer/components/transfercustomer.vue";
import ShiftInHigiSeas from "../customer/components/shiftinhighseas.vue";
import Customer from "../add/customer.vue";
import CustomerSea from "../seascustomer/components/add.vue";
import Task from "../add/task.vue";
import ConnectPerson from "../add/connectperson.vue";
import FollowUpDetail from "./components/followupdetail.vue";
import concant from "./components/concant.vue";
import DownLoadMethods from "./components/downLoad.vue";
export default {
  mixins: [concant, DownLoadMethods],
  components: {
    FollowUp,
    TransferCustomer,
    ShiftInHigiSeas,
    Customer,
    CustomerSea,
    Task,
    ConnectPerson,
    CoopeaTion,
    FollowUpDetail,
  },
  data() {
    return {
      // 跟进记录搜索
      queryParams: {},
      time: "",
      // 详情弹窗
      followUpdetailDialog: false,
      // 当前客户ID
      currentCustomerId: "",
      CustomerSeaopen: false,
      onlySeeFollowUp: false, //只看跟进
      open: false,
      currentCommentId: "",
      comments: "",
      dataVO: {},
      activeName: "1",
      customerInfo: {
        contactEntity: {},
      },
      companyData: {},
      dynamicList: [],
      concantTableData: [],
      nextcustomerTableData: [],
      workRecordData: [],
      workOrderRecordData: [],
      followRecordData: [],
      operaLogData: [],
      customerAttributionRecordData: [],
      ids: [],
      editId: "",
      chooseWorkOrder: [],
    };
  },
  computed: {},
  watch: {
    "$route.query.id"(val) {
      this.getcustomerdetail();
      this.activeName = "1";
    },
    onlySeeFollowUp(val) {
      if (val) {
        followRecordList({ customerId: this.$route.query.id }).then((res) => {
          this.dynamicList = res.rows;
        });
      } else {
        this.getcustomerdetail();
      }
    },
    activeName(val) {
      switch (val) {
        case "1":
          this.getcustomerdetail();
          break;
        case "2":
          this.getcustomerdetail();
          break;
        case "3":
          this.getcontactList();
          break;
        case "4":
          this.getnextcustomerList();
          break;
        case "5":
          this.followRecordList();
          break;
        case "6":
          this.workRecordList();
          break;
        case "7":
          this.workOrderRecordList();
          break;
        case "8":
          this.customerAttributionRecordList();
          break;
        case "9":
          this.operaLogList();
          break;
      }
    },
  },
  mounted() {
    this.currentCustomerId = this.$route.query.id;
    this.ids = [this.$route.query.id];
    this.getcustomerdetail();
    this.whichActiveTab();
  },
  methods: {
    istabShow(item) {
      return this.$store.state.user.permissions.includes(item);
    },
    // 控制权限时tab栏默认选中的标签
    whichActiveTab() {
      let newArr = [];
      const Arr = [
        "kh_general_info",
        "kh_data_details",
        "kh_contact",
        "kh_lower_level_customers",
        "kh_follow_up_record",
        "kh_mission_record",
        "kh_work_order_record",
        "kh_attribution_record",
        "kh_operation_log",
      ];
      Arr.forEach((item, index) => {
        this.$store.state.user.permissions.forEach((items) => {
          if (items == item) {
            newArr.push(items);
          }
        });
      });
      if (newArr.length > 0) {
        switch (newArr[0]) {
          case "kh_general_info":
            this.activeName = "1";
            break;
          case "kh_data_details":
            this.activeName = "2";
            break;
          case "kh_contact":
            this.activeName = "3";
            break;
          case "kh_lower_level_customers":
            this.activeName = "4";
            break;
          case "kh_follow_up_record":
            this.activeName = "5";
            break;
          case "kh_mission_record":
            this.activeName = "6";
            break;
          case "kh_work_order_record":
            this.activeName = "7";
            break;
          case "kh_attribution_record":
            this.activeName = "8";
            break;
          case "kh_operation_log":
            this.activeName = "9";
            break;
        }
      }
    },
    // 上级客户详情
    jumpToParentCustomer() {
      this.$router.push({
        path: "/customerManager/customerdetail",
        query: {
          id: this.customerInfo.parentCustomerId,
        },
      });
    },
    editsea() {
      this.editId = this.$route.query.id;
      // this.$refs.Customer.open = true;
      this.CustomerSeaopen = true;
      this.$nextTick(() => {
        this.$refs.CustomerSea.open = true;
      });
    },
    // tab栏展示
    isShow(val) {
      return this.$store.state.user.permissions.includes(val);
    },
    getData() {
      this.getcustomerdetail();
      this.operaLogList();
      this.followRecordList();
    },
    //   归属记录
    customerAttributionRecordList() {
      customerAttributionRecordList({ customerId: this.$route.query.id }).then(
        (res) => {
          this.customerAttributionRecordData = res.rows;
        }
      );
    },

    //   操作记录
    operaLogList() {
      operaLogList({ customerId: this.$route.query.id }).then((res) => {
        this.operaLogData = res.rows;
      });
    },
    //   联系人列表
    getcontactList() {
      getcontactList({ customerId: this.$route.query.id }).then((res) => {
        this.concantTableData = res.rows;
      });
      this.getcustomerdetail();
    },
    // 下级客户
    getnextcustomerList() {
      getnextcustomerList({ customerId: this.$route.query.id }).then((res) => {
        this.nextcustomerTableData = res.rows;
      });
    },
    // 任务记录
    workRecordList() {
      workRecordList({ customerId: this.$route.query.id }).then((res) => {
        this.workRecordData = res.rows;
      });
    },
    // 工单记录
    workOrderRecordList() {
      workOrderRecordList({ customerId: this.$route.query.id }).then((res) => {
        this.workOrderRecordData = res.rows;
      });
    },
    // 跟进记录
    followRecordList() {
      followRecordList({ customerId: this.$route.query.id }).then((res) => {
        this.followRecordData = res.rows;
      });
    },
    searchFollowRecordList() {
      let data = {};
      data.customerId = this.$route.query.id;
      data.keyword = this.queryParams.keyword;
      if (this.time != "" && this.time != null) {
        data.startTime = this.time[0];
        data.endTime = this.time[1];
      }
      followRecordList(data).then((res) => {
        this.followRecordData = res.rows;
      });
    },
    // 客户详情
    getcustomerdetail() {
      generalInfo({ id: this.$route.query.id }).then((res) => {
        this.customerInfo = res.data.customerEntity;
        if (res.data.customerEntity.contactEntity == null) {
          this.customerInfo.contactEntity = {};
        }
        this.dynamicList = res.data.list;
        this.dataVO = res.data.dataVO;
      });
    },
    // 转移客户后跳转到列表页
    jumpList() {
      this.$router.push({
        path: "/customerManager/customerlist",
      });
    },
    // 联系人详情
    JumpContactdetail(id) {
      this.$router.push({
        path: "/customerManager/contactdetail",
        query: {
          id: id,
        },
      });
    },
    detail(id) {
      followrecorddetail({ id: id }).then((res) => {
        this.followUpdetailData = res.data;
        this.$refs.FollowUpDetail.open = true;
        this.$refs.FollowUpDetail.companyData = res.data;
        this.followUpdetailDialog = true;
      });
    },
    handleAction(type) {
      if (type == 1) {
        this.concantOpen = true;
        this.$nextTick(() => {
          this.$refs.ConnectPerson.open = true;
        });
      }
      if (type == 2) {
        this.$refs.FollowUp.open = true;
      }
      if (type == 3) {
        this.$refs.TransferCustomer.open = true;
      }
      if (type == 4) {
        this.$refs.ShiftInHigiSeas.open = true;
      }
      if (type == 5) {
        this.$refs.Task.open = true;
      }
      if (type == 6) {
        this.$refs.CoopeaTion.open = true;
      }
      if (type == 7) {
        this.$confirm("重点关注该客户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            focusOrNot({ id: this.$route.query.id }).then((res) => {
              this.getData();
              this.$message({
                type: "success",
                message: "关注成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
      if (type == 8) {
        this.$confirm("取消关注该客户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            focusOrNot({ id: this.$route.query.id }).then((res) => {
              this.getData();
              this.$message({
                type: "success",
                message: "取消关注成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    handleClick(val) {},
    comment(ob) {
      this.currentCommentId = ob.id;
    },
    SendComment(ob) {
      let data = {};
      data.commentContent = this.comments;
      // data.userId = ob.userId;
      if (this.comments == "") {
        this.$message.error("请输入评论内容");
        return false;
      }
      data.fkId = ob.id;
      SendComment(data).then((res) => {
        this.comments = "";
        this.getcustomerdetail();
        this.followRecordList();
      });
    },
    // 删除评论
    delComment(ob) {
      this.$confirm("是否确定删除该条评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleCommentById({ id: ob.id }).then((res) => {
            this.getcustomerdetail();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 表格
    handleSelectionChange() {},
    handleSelectionChangeWorkOrder(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseWorkOrder = ids;
    },
    // 选择联系人
    handleSelectionChangeConcant(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseConcantIds = ids;
    },
    edit(id) {
      this.editId = this.$route.query.id;
      // this.$refs.Customer.open = true;
      this.open = true;
      this.$nextTick(() => {
        this.$refs.Customer.open = true;
      });
    },
    // 跳转到工单详情
    jumpWorkdetail(id) {
      this.$router.push({
        path: "/menu/workOrderDetails",
        query: {
          id: id,
        },
      });
    },
    // 任务详情
    taskDetailDialog(id) {
      console.log(id);
      this.$router.push({
        path: "/officeManagement/taskDetail",
        query: {
          id: id,
        },
      });
    },
    del() {},
    delContant(id) {
      deleteByIds({ ids: [id] }).then((res) => {
        this.getcontactList();
        this.$message.success("删除成功");
      });
    },
    //删除工单
    delOrder(msg) {
      if (this.chooseWorkOrder.length <= 0) {
        this.$message.error("请选择要删除的工单");
        return;
      }
      this.$confirm("此操作将" + "删除该工单, 是否继续?", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let datas = {
            ids: this.chooseWorkOrder,
          };
          removeWorkOrder(datas).then((res) => {
            this.$notify.success({
              title: "工单" + "删除" + "成功",
              message: "工单" + "删除" + "成功",
              position: "bottom-right",
            });
            // this.$router.push('/workorderlist')
            this.workOrderRecordList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消工单" + msg,
          });
        });
    },
    delcustomer() {
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          customerremove({ ids: [this.$route.query.id] }).then((res) => {
            this.jumpList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
// p {
//   margin: 0;
//   padding: 0;
// }
.customerInfoCard {
  padding: 0px 30px;
  padding-top: 30px;
  .customerName {
    font-size: 18px;
    font-weight: 600;
    padding: 0 0px;
    margin-right: 20px;
  }
  .concatInfo {
    margin-top: 20px;
    font-size: 13px;
    span {
      margin-right: 20px;
      color: #977e7f;
    }
  }
  .btnWarp {
    margin-top: 20px;
  }
  i {
    font-style: normal;
    color: #999999;
  }
}
.pd {
  padding: 30px 30px;
}
::v-deep .el-tabs__item {
  font-weight: 600;
}
.titleSelf {
  font-size: 14px;
  font-weight: 600;
  margin-top: 20px;
}
.tableSelf {
  .box {
    flex: 1;
  }
  display: flex;
  margin-top: 20px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-left: none;
  .each {
    border-bottom: 1px solid #ccc;
    border-left: none;
  }
  .each:last-child {
    border-top: none;
    border-bottom: none;
  }
  .each {
    display: flex;
    align-items: center;
    height: 40px;
    div {
      height: 100%;
      line-height: 40px;
    }
    div:nth-child(1) {
      width: 150px;
      border-right: 1px solid #ccc;
      border-left: 1px solid #ccc;
      background: #f5f5f5;
      text-align: center;
      font-weight: 600;
    }
    div:nth-child(2) {
      padding-left: 20px;
    }
  }
}
.dataWarp {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  div {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 110px;
    flex-direction: column;

    span {
      padding: 10px 0;
    }
    span:nth-child(2) {
      color: #0079fe;
    }
  }
}
.timelineBox {
  margin-top: 20px;
  ::v-deep .el-timeline-item__timestamp.is-top {
    width: 100px;
    color: #f5f5f5;
    text-align: center;
    background: #0079fe;
    padding: 5px 0;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }
}
.commentDiv {
  display: flex;
  margin-top: 20px;
  ::v-deep .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
  ::v-deep .el-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.dynamicUserInfoDiv {
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  span:nth-child(2) {
    display: block;
    // border: 1px solid;
    margin-right: 10px;
    margin-left: 10px;
  }
}
.commentList {
  border: 1px solid #d7e8f4;
  width: 90%;
  padding: 0 10px 10px 20px;
  margin: 20px auto;
  color: #999999;
  background: #ffffff;
  position: relative;
  .delIcon {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
}
.TaskCard:nth-child(2n) {
  background: #f9f9f9;
}
.TaskCard {
  margin-top: 10px;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #e9e9e9;
  div {
    display: flex;
    flex-direction: column;
    width: 30%;
    font-size: 13px;
    padding-left: 20px;
    justify-content: center;
    span {
      padding: 10px 0;
      color: #9999b2;
    }
    span:nth-child(2) {
      padding: 10px 0;
      color: #666666;
    }
  }
}
.action_span {
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
</style>
