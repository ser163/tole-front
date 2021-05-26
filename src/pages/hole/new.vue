<template>
  <div>
    <div class="page">
      <div class="page-header">
        <div class="page-header-title">
          新建密码条目
        </div>
        <div class="page-header-desc">
          <Wb-button type="primary" @click="clickNewMainWin">新建主条目</Wb-button>
        </div>
      </div>
      <div class="page-body">
        <fes-search-panel>
          <Wb-form :label-width="80"
                   type="query">
            <Row>
              <Cell span="8" offset="1">
                <Form-item label="类型：" class="fes-search-panel-form-item">
                  <Radio-group v-model="paginationMain.flag" :vertical="false">
                    <Radio :value="0">
                      个人项目
                    </Radio>
                    <Radio :value="1">
                      团队项目
                    </Radio>
                    <Radio :value="2">
                      全部
                    </Radio>
                  </Radio-group>
                </Form-item>
              </Cell>
              <Cell span="12">
                <Form-item label="项目名: ">
                  <Wb-input v-model="paginationMain.name" placeholder="请输入" clearable/>
                </Form-item>
              </Cell>
            </Row>
          </Wb-form>
          <div slot="button" class="search-button">
            <Wb-button @click="searchNotes" type="primary" icon="md-search">查询</Wb-button>
          </div>
        </fes-search-panel>
        <fes-list-panel>
          <Row>
            <Cell span="10">
              <Panel title="主条目" class="PanelMainOption">
                <div v-for="item in mainData"
                     :key="item.id"
                     :value="item.id"
                     @click="viewSubItem(item)"
                     v-tooltip="tipText(item.desc)"
                     class="notes-main-list">
                  <div class="name-label">
                    {{ item.name }}
                  </div>
                  <div class="tool-label">
                    <icon v-if="item.flag == 0" type="md-person" color="Peru" size="18" class="team-icon"></icon>
                    <icon v-if="item.flag == 1" type="md-people" color="blue" size="18" class="team-icon"></icon>
                    <icon v-if="item.protect == 1" type="md-lock" color="red" size="18"></icon>
                    <icon v-if="item.protect == 0" type="md-unlock" color="green" size="18"></icon>
                    <Wb-button type="text" @click.stop="clickMainEditBut(item)">编辑</Wb-button>
                  </div>
                </div>
              </Panel>
              <Pagination
                  class="pagination-bottom"
                  @on-change="changeMainPage"
                  :current="paginationMain.current"
                  :size="paginationMain.size"
                  :total="paginationMain.total">
              </Pagination>
            </Cell>
            <Cell span="14">
              <Panel :title="itemTitle" class="PanelItemOption">
                <Wb-button icon="md-arrow-round-back" slot="action" @click="clickNewItemBut">新建密码条目</Wb-button>
                <Row>
                  <Cell span="24" class="item-border-all">
                    <div v-for="item in itemData" v-tooltip="item.desc"
                         :key="item.id"
                         @click="getItemDescData(item.id)"
                         class="item-option-div">
                      <div class="item-title">{{ item.name }}</div>
                    </div>
                  </Cell>
                </Row>
              </Panel>
              <Pagination
                  class="pagination-bottom"
                  @on-change="changeItemPage"
                  :current="paginationItem.current"
                  :size="paginationItem.size"
                  :total="paginationItem.total">
              </Pagination>
            </Cell>
          </Row>
        </fes-list-panel>
      </div>
    </div>
    <modal ref="newMainWin"
           width="600"
           title="新建密码主条目">
      <Wb-form ref="addNotesForm" :rule="ruleValidateMain" :label-width="100">
        <Row>
          <Cell span="12">
            <Form-item label="类型" prop="flag">
              <Radio-group v-model="mainFormData.flag" @on-change="typeChange">
                <Radio value="0">
                  个人
                </Radio>
                <Radio value="1">
                  团队
                </Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="角色：" prop="categoryId" v-if="showGroup">
              <wb-select v-model="mainFormData.role" multiple>
                <wb-option v-for="item in roleList" :key="item.id" :value="item.id">
                  {{ item.full_name }}
                </wb-option>
              </wb-select>
            </Form-item>
            <Form-item label="项目名称" prop="name">
              <wb-input
                  placeholder="请输入"
                  v-model="mainFormData.name"
              ></wb-input>
            </Form-item>
            <Form-item label="请选择类别" prop="cate">
              <wb-select v-model="mainFormData.cate">
                <wb-option v-for="item in cateList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </wb-option>
              </wb-select>
            </Form-item>
            <Form-item label="详细说明" prop="desc">
              <wb-input
                  placeholder="请输入密码条目说明"
                  type="textarea"
                  :rows=3
                  v-model="mainFormData.desc">
              </wb-input>
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item label="密码保护" prop="protect">
              <Radio-group v-model="mainFormData.protect" @on-change="protectChange">
                <Radio value="0">
                  否
                </Radio>
                <Radio value="1">
                  是
                </Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="保护密码" prop="showWord" v-if="showPW">
              <wb-input
                  placeholder="请输入保护密码"
                  type="password"
                  autocomplete="off"
                  v-model="mainFormData.showWord">
              </wb-input>
            </Form-item>
            <Form-item label="提示" prop="tip" v-if="showPW">
              <wb-input
                  placeholder="请输入密码提示"
                  v-model="mainFormData.tip">
              </wb-input>
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button type="primary" @click="clickPostMain">提交</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
    <modal ref="editMainWin"
           width="600"
           title="修改密码主条目">
      <Wb-form ref="editNotesForm" :rule="ruleValidateMain" :label-width="100" autocomplete="off">
        <Row>
          <Cell span="12">
            <Form-item label="类型" prop="flag">
              <Radio-group v-model="mainFormEditData.flag" @on-change="typeChange">
                <Radio value="0">
                  个人
                </Radio>
                <Radio value="1">
                  团队
                </Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="角色：" prop="categoryId" v-if="showGroup">
              <wb-select v-model="mainFormEditData.role" multiple>
                <wb-option v-for="item in roleList" :key="item.id" :value="item.id">
                  {{ item.full_name }}
                </wb-option>
              </wb-select>
            </Form-item>
            <Form-item label="项目名称" prop="name">
              <wb-input
                  placeholder="请输入"
                  v-model="mainFormEditData.name"
              ></wb-input>
            </Form-item>
            <Form-item label="请选择类别" prop="cate">
              <wb-select v-model="mainFormEditData.cate">
                <wb-option v-for="item in cateList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </wb-option>
              </wb-select>
            </Form-item>
            <Form-item label="详细说明" prop="desc">
              <wb-input
                  placeholder="请输入密码条目说明"
                  type="textarea"
                  :rows=3
                  v-model="mainFormEditData.desc">
              </wb-input>
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item label="密码保护" prop="protect">
              <Radio-group v-model="mainFormEditData.protect" @on-change="protectChange">
                <Radio value="0">
                  否
                </Radio>
                <Radio value="1">
                  是
                </Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="保护密码" prop="showWord" v-if="showPW">
              <wb-input
                  placeholder="请输入保护密码"
                  type="password"
                  autocomplete="off"
                  v-model="mainFormEditData.showWord">
              </wb-input>
            </Form-item>
            <Form-item label="提示" prop="tip" v-if="showPW">
              <wb-input
                  placeholder="请输入密码提示"
                  v-model="mainFormEditData.tip">
              </wb-input>
            </Form-item>
            <Row class="note-row-user">
              <Cell span="2" offset="6">
                <icon type="md-contact" size="20"></icon>
              </Cell>
              <Cell span="6">
                {{ mainFormEditData.username }}
              </Cell>
            </Row>
            <Row class="note-row-user">
              <Cell span="2" offset="6">
                <icon type="md-time" size="20"></icon>
              </Cell>
              <Cell span="12">
                {{ mainFormEditData.created }}
              </Cell>
            </Row>
          </Cell>
        </Row>
        <Row>
          <Cell span="12">
            <Form-item>
              <Wb-button type="primary" @click="clickPostMainUpdate">提交</Wb-button>
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item>
              <Wb-button type="error" @click="clickPostMainDel(mainFormEditData.id)"
                         v-if="canDelete(mainFormEditData.owner)">删除
              </Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
    <modal ref="inputPass"
           :closeOnClickShadow="false"
           :beforeClose="beforeCloseInputPass"
           title="请输入密码">
      <Wb-form>
        <Row>
          <Cell span="24">
            <Form-item label="提示">
              <span>{{ inputPWTip }}</span>
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item label="请输入密码">
              <!--查看时的密码-->
              <wb-input v-model="inputPW" v-if="!editFlag" type="password" autocomplete="off"/>
              <!--编辑时密码-->
              <wb-input v-model="inputPW" @keyup.enter="checkPassword" v-if="editFlag" type="password"
                        autocomplete="off"/>
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button type="primary" @click="viewItem" v-if="!editFlag">查看</Wb-button>
              <Wb-button type="primary" @click="checkPassword" v-if="editFlag">验证</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
    <modal ref="newItemWin"
           width="650"
           :closeOnClickShadow="false"
           class="item-pass-modal"
           title="新建附加条目">
      <Wb-form ref="addNotesItemForm" :rule="ruleValidateItem" :label-width="100">
        <Row>
          <Cell span="24">
            <Form-item label="项目名称" prop="name">
              <wb-input
                  placeholder="请输入"
                  clearable
                  :maxlength="29"
                  v-model="ItemFormData.name"
              ></wb-input>
            </Form-item>
            <Form-item label="详细说明" prop="desc">
              <wb-input
                  placeholder="请输入密码条目说明"
                  type="textarea"
                  :rows=2
                  :maxlength="119"
                  clearable
                  v-model="ItemFormData.desc">
              </wb-input>
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="12">
            <Form-item label="插入控件">
              <Wb-select v-model="goodType">
                <wb-option :value="0">文本</wb-option>
                <wb-option :value="1">密码</wb-option>
                <wb-option :value="2">网址</wb-option>
                <wb-option :value="3">IP</wb-option>
                <wb-option :value="4">文件</wb-option>
                <wb-option :value="5">图片</wb-option>
              </Wb-select>
            </Form-item>
          </Cell>
          <Cell span="4" offset="1">
            <Wb-button icon="md-add" circle @click="clickAddItemBut"></Wb-button>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Draggable :disabled="dragFlag" v-model="ItemFormData.list" @on-sort-ready="dragready"
                       @on-sort-end="dragend"
                       class="category-draggable">
              <template slot-scope="{item, index}">
                <Form-item>
                  <Row>
                    <Cell span="1">
                      <icon type="md-code-working" class="icon-move" size="20"></icon>
                    </Cell>
                    <!--name-->
                    <Cell span="4" v-if="(item.type != 4) && (item.type != 5)" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.name" autocomplete="off"></Wb-input>
                    </Cell>
                    <Cell span="13" v-if="(item.type == 4) || (item.type == 5)" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.name" autocomplete="off"></Wb-input>
                    </Cell>

                    <!-- value-->
                    <Cell span="13" offset="1" v-if="item.type==0" data="text" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" autocomplete="off"></Wb-input>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==1" data="password" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" autocomplete="off"></Wb-input>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==2" data="url" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" placeholder="请输入网址"/>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==3" data="ip" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" placeholder="IP地址"></Wb-input>
                    </Cell>
                    <Cell span="4" offset="1" v-if="item.type==4" data="file" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Upload :url="getFileUploadUrl(index)"
                              param="file"
                              @on-change="changeUpload"
                              @on-success="fileUploadSuccess"
                              @on-fail="fileUploadFail">
                        <Wb-button type="primary">文件上传</Wb-button>
                      </Upload>
                    </Cell>
                    <Cell span="4" offset="1" v-if="item.type==5" data="image" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Upload :url="getFileUploadImgUrl(index)" param="file"
                              @on-change="changeUpload"
                              @on-success="fileUploadSuccess"
                              @on-fail="fileUploadFail">
                        <Wb-button type="primary">图片上传</Wb-button>
                      </Upload>
                    </Cell>
                    <Cell span="4" offset="1" @mouseover.native="mouseover" @mouseout.native="mouseout">
                      <Wb-button icon="md-remove" circle type="error"
                                 @click="clickRemoveItemGoodType(index)"></Wb-button>
                    </Cell>
                  </Row>
                </Form-item>
              </template>
            </Draggable>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button type="primary" @click="clickPostItem">提交</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
    <modal ref="viewItemWin"
           width="650"
           :closeOnClickShadow="false"
           class="item-pass-modal"
           title="查看附加条目">
      <Wb-form ref="viewNotesItemForm" :label-width="100">
        <Row>
          <Cell span="12">
            <Form-item label="创建人" prop="username">
              {{ ItemDescData.username }}
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item label="创建时间" prop="created">
              {{ ItemDescData.created }}
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item label="项目名称" prop="name">
              <wb-input
                  :maxlength="29"
                  readonly
                  v-model="ItemDescData.name"
              ></wb-input>
            </Form-item>
            <Form-item label="详细说明" prop="desc">
              <wb-input
                  type="textarea"
                  :rows=2
                  readonly
                  v-model="ItemDescData.desc">
              </wb-input>
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Draggable :disabled="true" v-model="ItemDescData.list" @on-sort-ready="dragready"
                       @on-sort-end="dragend"
                       class="category-draggable">
              <template slot-scope="{item, index}">
                <Form-item>
                  <Row>
                    <!--name-->
                    <Cell span="4" v-if="(item.type != 4) && (item.type != 5)">
                      <Wb-input v-model="item.name" autocomplete="off" readonly class="item-title-input"></Wb-input>
                    </Cell>
                    <Cell span="18" v-if="(item.type == 4)||(item.type == 5)">
                      <Wb-input v-model="item.name" autocomplete="off" readonly></Wb-input>
                    </Cell>

                    <!-- value-->
                    <Cell span="13" offset="1" v-if="item.type==0" data="text">
                      <Wb-input v-model="item.value" autocomplete="off" readonly></Wb-input>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==1" data="password">
                      <Wb-input v-model="item.value" autocomplete="off" readonly></Wb-input>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==2" data="url">
                      <Wb-input v-model="item.value" readonly/>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==3" data="ip">
                      <Wb-input v-model="item.value" placeholder="IP地址" readonly></Wb-input>
                    </Cell>
                    <Cell span="4" v-if="item.type==4"
                          class="item-input-copy-div"
                          data="file">
                      <a :href="item.url"
                         target="_blank"
                         class="tag-download"
                         :download="item.name">
                        <icon type="md-cloud-download"
                              size="20"
                              v-tooltip="'下载'"
                              class="item-input-copy-icon"></icon>
                      </a>
                    </Cell>
                    <Cell span="4" v-if="item.type==5"
                          class="item-input-copy-div"
                          data="image">
                      <icon type="md-eye"
                            size="20"
                            v-tooltip="'查看'"
                            @click="viewUpImage(item.url)"
                            class="item-input-copy-icon"></icon>
                    </Cell>
                    <Cell span="4" v-if="item.type==0
                          || item.type==1
                          || item.type==2
                          || item.type==3"
                          class="item-input-copy-div">
                      <icon v-tooltip="'复制'"
                            type="md-copy"
                            size="20"
                            class="item-input-copy-icon"
                            @click="copy(item.value)">
                      </icon>
                    </Cell>
                  </Row>
                </Form-item>
              </template>
            </Draggable>
          </Cell>
        </Row>
        <Row>
          <Cell span="5" offset="4">
            <Form-item>
              <Wb-button type="primary" @click="clickPostItemEdit" v-if="ItemDescData.owner == 1">编辑</Wb-button>
            </Form-item>
          </Cell>
          <Cell span="5" offset="2">
            <Form-item>
              <Wb-button type="error" @click="clickPostItemDel" v-if="ItemDescData.owner == 1">删除</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
    <modal ref="imageViewWin"
           width="600"
           title="查看图片">
      <Row>
        <Cell span="24">
          <img :src="upImageUrl" style="width: 100%;"/>
        </Cell>
      </Row>
      <Row>
        <Cell span="24">
          <a :href="upImageUrl" target="_blank">在新窗口打开</a>
        </Cell>
      </Row>
    </modal>
    <modal ref="editItemWin"
           width="650"
           :closeOnClickShadow="false"
           class="item-pass-modal"
           title="编辑附加条目">
      <Wb-form ref="editNotesItemForm" :rule="ruleValidateItem" :label-width="100">
        <Row>
          <Cell span="12">
            <Form-item label="创建人" prop="username">
              {{ ItemDescData.username }}
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item label="创建时间" prop="created">
              {{ ItemDescData.created }}
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item label="项目名称" prop="name">
              <wb-input
                  placeholder="请输入"
                  clearable
                  :maxlength="29"
                  v-model="ItemDescData.name"
              ></wb-input>
            </Form-item>
            <Form-item label="详细说明" prop="desc">
              <wb-input
                  placeholder="请输入密码条目说明"
                  type="textarea"
                  :rows=2
                  :maxlength="119"
                  clearable
                  v-model="ItemDescData.desc">
              </wb-input>
            </Form-item>
          </Cell>
        </Row>
        <Row>
          <Cell span="12">
            <Form-item label="插入控件">
              <Wb-select v-model="goodType">
                <wb-option :value="0">文本</wb-option>
                <wb-option :value="1">密码</wb-option>
                <wb-option :value="2">网址</wb-option>
                <wb-option :value="3">IP</wb-option>
                <wb-option :value="4">文件</wb-option>
                <wb-option :value="5">图片</wb-option>
              </Wb-select>
            </Form-item>
          </Cell>
          <Cell span="4" offset="1">
            <Wb-button icon="md-add" circle @click="clickEditItemBut"></Wb-button>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Draggable :disabled="dragFlag" v-model="ItemDescData.list" @on-sort-ready="dragready"
                       @on-sort-end="dragendEdit"
                       class="category-draggable">
              <template slot-scope="{item, index}">
                <Form-item>
                  <Row>
                    <Cell span="1">
                      <icon type="md-code-working" class="icon-move" size="20"></icon>
                    </Cell>
                    <!--name-->
                    <Cell span="4" v-if="(item.type != 4) && (item.type != 5)" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.name" autocomplete="off"></Wb-input>
                    </Cell>
                    <Cell span="13" v-if="(item.type == 4) || (item.type == 5)" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.name" autocomplete="off"></Wb-input>
                    </Cell>

                    <!-- value-->
                    <Cell span="13" offset="1" v-if="item.type==0" data="text" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" autocomplete="off"></Wb-input>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==1" data="password" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" autocomplete="off"></Wb-input>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==2" data="url" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" placeholder="请输入网址"/>
                    </Cell>
                    <Cell span="13" offset="1" v-if="item.type==3" data="ip" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Wb-input v-model="item.value" placeholder="IP地址"></Wb-input>
                    </Cell>
                    <Cell span="4" offset="1" v-if="item.type==4" data="file" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Upload :url="getFileUploadUrl(index)"
                              param="file"
                              @on-change="changeUpload"
                              @on-success="fileUploadSuccessEdit"
                              @on-fail="fileUploadFail">
                        <Wb-button type="primary">文件上传</Wb-button>
                      </Upload>
                    </Cell>
                    <Cell span="4" offset="1" v-if="item.type==5" data="image" @mouseover.native="mouseover"
                          @mouseout.native="mouseout">
                      <Upload :url="getFileUploadImgUrl(index)" param="file"
                              @on-change="changeUpload"
                              @on-success="fileUploadSuccessEdit"
                              @on-fail="fileUploadFail">
                        <Wb-button type="primary">图片上传</Wb-button>
                      </Upload>
                    </Cell>
                    <Cell span="4" offset="1" @mouseover.native="mouseover" @mouseout.native="mouseout">
                      <Wb-button icon="md-remove" circle type="error"
                                 @click="clickRemoveItemGoodTypeEdit(index)"></Wb-button>
                    </Cell>
                  </Row>
                </Form-item>
              </template>
            </Draggable>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button type="primary" @click="clickPostEditItem">修改</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
  </div>
</template>
<script>
export default {
  FesData() {
    return {
      // 网络图片的地址
      upImageUrl: '',
      // 上传url
      fileUploadUrl: this.FesEnv.api + '/api/file/upload',
      fileUploadImgUrl: this.FesEnv.api + '/api/file/imageUpload',
      accpetTypeFile: ['*'],
      dragFlag: false,
      goodType: 0,
      ItemFormData: {
        name: '',
        desc: '',
        list: []
      },
      ItemDescData: {
        id: null,
        name: '',
        desc: '',
        owner: 0,
        username: '',
        created: '',
        list: []
      },
      itemTitle: '附加条目',
      itemData: [],
      // 密码验证窗口
      editFlag: false,
      inputId: null,
      inputPWTip: '',
      inputPW: '',
      // 主选项选中
      mainSelectIndex: null,
      mainData: [],
      showPW: false,
      showGroup: false,
      roleList: [],
      cateList: [],
      mainObj: null,
      mainFormData: {
        role: [],
        flag: '0',
        name: '',
        cate: null,
        desc: '',
        protect: '0',
        showWord: '',
        tip: ''
      },
      mainFormEditData: {
        id: null,
        role: [],
        flag: '0',
        name: '',
        cate: null,
        desc: '',
        protect: '0',
        showWord: '',
        tip: '',
        oldWord: '',
        owner: null,
        usename: '',
        created: '',
      },
      paginationMain: {
        locking: false,
        size: 10,
        current: 1,
        total: 0,
        seach: false,
        name: '',
        flag: 2
      },
      paginationItem: {
        locking: false,
        size: 100,
        current: 1,
        total: 0,
        seach: false,
      },
      ruleValidateMain: {
        name: [{type: 'string', required: true, message: '请输入项目名称'}],
        desc: [{type: 'string', required: true, message: '请输入密码详情'}],
        protect: [{required: true, message: '不能为空'}]
      },
      ruleValidateItem: {
        name: [{type: 'string', required: true, message: '请输入附加项目名称'}],
      },
      tipText: function (text) {
        return {
          direction: 'top',
          align: 'left',
          text: text
        }
      },
      comList: [
        {
          name: '用户名',
          seq: 0,
          type: 0,
          value: '',
          up: 0,
          ext: '',
          accessory_id: null,
          salt: ''
        },
        {
          name: '密码',
          seq: 1,
          type: 1,
          value: '',
          up: 0,
          ext: '',
          accessory_id: null,
          salt: ''
        },
        {
          name: '网址',
          seq: 2,
          type: 2,
          value: '',
          up: 0,
          ext: '',
          accessory_id: null,
          salt: ''
        },
        {
          name: 'IP',
          seq: 3,
          type: 3,
          value: '',
          up: 0,
          ext: '',
          accessory_id: null,
          salt: ''
        },
        {
          name: '文件1',
          seq: 4,
          type: 4,
          value: '',
          up: 0,
          ext: '',
          accessory_id: null,
          salt: ''
        },
        {
          name: '图片1',
          seq: 5,
          type: 5,
          value: '',
          up: 0,
          ext: '',
          accessory_id: null,
          salt: '',
          key: ''
        },
      ]
    };
  },
  FesReady() {
    this.getAllMain()
  },
  methods: {
    // item修改按钮
    clickPostEditItem() {
      if (this.ItemDescData.list.length == 0) {
        return this.$Toast.warn('至少添加一项', {align: 'top'})
      }
      let pass = this.inputPW
      let id = this.mainObj.id
      let itemsId = this.ItemDescData.id
      this.FesApi.fetch("/api/items/desc/" + id + "/" + itemsId, {
        name: this.ItemDescData.name,
        desc: this.ItemDescData.desc,
        list: this.ItemDescData.list,
        note_id: this.mainObj.id
      }, 'put').then(rst => {
        this.retSucceedInfo(rst)
        if (rst.type == 0) {
          // 如果成功则关闭窗口
          this.$refs.editItemWin.close()
          this.getAllItems(id, pass)
        }
      })
    },
    // 点击删除items
    clickPostItemDel() {
      let notesId = this.mainObj.id
      let pass = this.inputPW
      const self = this
      this.$Message.confirm("警告", "删除之后上传的文件和资料将不可恢复！").then(function (index) {
        if (index == 0) {
          self.FesApi.fetch("/api/items/delete", {
            "id": self.ItemDescData.id
          }).then(rst => {
            self.retSucceedInfo(rst)
            if (rst.type === 0) {
              self.$refs.viewItemWin.close()
              self.getAllItems(notesId, pass)
            }
          })
        }
      })
    },
    //点击查看图片
    viewUpImage($url) {
      this.upImageUrl = $url
      this.$refs.imageViewWin.show()
    },
    // 执行复制
    copy(data) {
      let url = data;
      let oInput = document.createElement('input');
      oInput.value = url;
      document.body.appendChild(oInput);
      // 选择对象;
      oInput.select();
      // 执行浏览器复制命令
      document.execCommand("Copy");
      this.$Toast.success('复制成功', {align: 'top'})
      oInput.remove()
    },
    // 点击编辑附加选项
    clickPostItemEdit() {
      // 关闭查看窗口
      this.$refs.viewItemWin.close()
      // 打开编辑窗口
      this.$refs.editItemWin.show()
    },
    // 拼接上传图片
    getFileUploadImgUrl(index) {
      return this.fileUploadImgUrl + '?index=' + index
    },
    // 拼接上传url
    getFileUploadUrl(index) {
      return this.fileUploadUrl + '?index=' + index
    },
    // 执行搜索
    searchNotes() {
      this.paginationMain.seach = true
      this.getAllMain()
    },
    // 密码输入框关闭前
    beforeCloseInputPass() {
      let _this = this
      return new Promise((resolve, reject) => {
        this.$Message.confirm("是否关闭密码输入？").then(function (index) {
          if (index == 0) {
            // 清空主条目对象
            _this.mainObj = null
            // 清空标题
            _this.itemTitle = '附加条目'
            // 清空内容
            _this.itemData = []
            _this.paginationItem.total = 0
          }
          resolve(index === 0)
        })
      })
    },
    // 获取附加条目详情
    getItemDescData(id) {
      let noteId = this.mainObj.id
      let itemId = id
      this.FesApi.fetch("/api/items/desc/" + noteId + "/" + itemId, {}).then(rst => {
        if (rst.type == 0) {
          this.ItemDescData.id = rst.data.id
          this.ItemDescData.name = rst.data.name
          this.ItemDescData.desc = rst.data.desc
          this.ItemDescData.owner = rst.data.owner
          this.ItemDescData.list = rst.data.list
          this.ItemDescData.username = rst.data.username
          this.ItemDescData.created = rst.data.created
          this.$refs.viewItemWin.show()
          // 显示查看窗体
        } else {
          this.retSucceedInfo(rst)
        }
      })
    },
    changeUpload(e) {
    },
    action(valid, formData) {
    },
    // 文件上传失败
    fileUploadFail(files, result) {
      let rst = result.result
      this.retSucceedInfo(rst)
    },
    // 文件上传成功
    fileUploadSuccess(files, result) {
      if (result.code == "0") {
        let rst = result.result
        let idx = parseInt(rst.index)
        let fileArr = this.ItemFormData.list[idx]
        let name = files[0].name

        fileArr.name = name
        fileArr.value = rst.url
        fileArr.ext = rst.ext
        fileArr.up = 1
        fileArr.accessory_id = rst.acid
        fileArr.salt = rst.salt
      }
    },
    fileUploadSuccessEdit(files, result) {
      if (result.code == "0") {
        let rst = result.result
        let idx = parseInt(rst.index)
        let fileArr = this.ItemDescData.list[idx]
        let name = files[0].name

        fileArr.name = name
        fileArr.value = rst.url
        fileArr.ext = rst.ext
        fileArr.up = 1
        fileArr.accessory_id = rst.acid
        fileArr.salt = rst.salt
      }
    },
    // 单击删除控件
    clickRemoveItemGoodType(index) {
      if (this.ItemFormData.list.length > 1) {
        this.ItemFormData.list.splice(index, 1)
        this.sortArr(this.ItemFormData.list)
      } else {
        this.$Toast.warn('至少保留一项', {align: 'top'})
      }
    },
    // 编辑时单击，为啥要分开写。我也不知道为啥
    clickRemoveItemGoodTypeEdit(index) {
      if (this.ItemDescData.list.length > 1) {
        this.ItemDescData.list.splice(index, 1)
        this.sortArr(this.ItemDescData.list)
      } else {
        this.$Toast.warn('至少保留一项', {align: 'top'})
      }
    },
    // 单击添加按钮
    clickAddItemBut() {
      if (this.ItemFormData.list.length < 13) {
        let copyArr = Object.assign({}, this.comList[this.goodType]);
        this.ItemFormData.list.push(copyArr)
        this.sortArr(this.ItemFormData.list)
      } else {
        this.$Toast.warn('最多添加12项', {align: 'top'})
      }
    },
    clickEditItemBut() {
      if (this.ItemDescData.list.length < 13) {
        let copyArr = Object.assign({}, this.comList[this.goodType]);
        this.ItemDescData.list.push(copyArr)
        this.sortArr(this.ItemDescData.list)
      } else {
        this.$Toast.warn('最多添加12项', {align: 'top'})
      }
    },
    // 当鼠标移动到控件内时禁用拖拽
    mouseover() {
      this.dragFlag = true
    },
    // 当鼠标移出时启用拖拽
    mouseout() {
      this.dragFlag = false
    },
    dragready(drag) {
    },
    dragend(drag) {
      this.sortArr(this.ItemFormData.list)
    },
    dragendEdit(drag) {
      this.sortArr(this.ItemDescData.list)
    },
    // 重新排序
    sortArr(arr) {
      let len;
      len = arr.length
      for (let i = 0; i < len; i++) {
        arr[i].seq = i
      }
      return arr
    },
    // 新建附加条目提交
    clickPostItem() {
      if (this.ItemFormData.list.length == 0) {
        return this.$Toast.warn('至少添加一项', {align: 'top'})
      }
      let pass = this.inputPW
      let id = this.mainObj.id
      this.FesApi.fetch("/api/items/addItems", {
        name: this.ItemFormData.name,
        desc: this.ItemFormData.desc,
        list: this.ItemFormData.list,
        user_id: this.FesApp.get('uid'),
        note_id: this.mainObj.id
      }).then(rst => {
        this.retSucceedInfo(rst)
        if (rst.type == 0) {
          // 如果成功则关闭窗口
          this.$refs.newItemWin.close()
          this.getAllItems(id, pass)
        }
      })
    },
    // 单击新建密码条目
    clickNewItemBut() {
      if (this.mainObj == null) {
        this.$Toast.warn('请选中主条目', {align: 'top'})
        return
      }
      // 清空表单
      this.restItemFormData()
      this.$refs.newItemWin.show()
    },
    // 单击主条目时，查看
    viewItem() {
      let id = this.inputId
      let pass = this.inputPW
      this.FesApi.fetch("/api/items/getItems/" + id, {
        size: this.paginationItem.size,
        current: this.paginationItem.current,
        seach: this.paginationItem.seach,
        pass
      }).then(rst => {
        if (rst.type == 0) {
          this.itemData = rst.data
          this.paginationItem.size = rst.per_page
          this.paginationItem.current = rst.current_page
          this.paginationItem.total = rst.total_page
          if (rst.seach) {
            this.paginationItem.seach = true
          }
          // 将密码输入框隐藏
          this.$refs.inputPass.close()
        } else {
          this.retSucceedInfo(rst)
        }
      })
    },
    // 获取所有附加条目
    async getAllItems(id, oldPass) {
      let pass = oldPass
      await this.FesApi.fetch("/api/items/getItems/" + id, {
        size: this.paginationItem.size,
        current: this.paginationItem.current,
        seach: this.paginationItem.seach,
        pass
      }).then(rst => {
        if (rst.type == 0) {
          this.itemData = rst.data
          this.paginationItem.size = rst.per_page
          this.paginationItem.current = rst.current_page
          this.paginationItem.total = rst.total_page
          if (rst.seach) {
            this.paginationItem.seach = true
          }
        } else {
          this.retSucceedInfo(rst)
        }
      })
    },
    // 删除主条目
    clickPostMainDel(id) {
      this.$Message.confirm('警告', `确认删除此项吗？删除不可恢复`).then((index) => {
        if (index === 0) {
          this.FesApi.fetch("/api/notes/delete", {
            id
          }).then(rst => {
            if (rst.type == 0) {
              this.paginationMain.seach = false
              this.getAllMain()
              this.$refs.editMainWin.close();
            }
            this.retSucceedInfo(rst)
          })
        }
      });
    },
    // 修改主条目
    clickPostMainUpdate() {
      this.$refs.editNotesForm.validate((valid, errors) => {
        if (valid) {
          // 提交主项目
          this.FesApi.fetch("/api/notes/updateNotes", {
            "id": this.mainFormEditData.id,
            "name": this.mainFormEditData.name,
            "desc": this.mainFormEditData.desc,
            "protect": this.mainFormEditData.protect,
            "showWord": this.mainFormEditData.showWord,
            "tip": this.mainFormEditData.tip,
            "flag": this.mainFormEditData.flag,
            "role": this.mainFormEditData.role,
            "categoryId": this.mainFormEditData.cate,
            'oldPass': this.mainFormEditData.oldWord,
            'owner': this.mainFormEditData.owner
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type == 0) {
              this.paginationMain.seach = false
              this.getAllMain()
              this.$refs.editMainWin.close();
            }
          })
        }
      })
    },
    // 判断是否有删除权限
    canDelete(id) {
      let userId = this.FesApp.get('uid')
      if (userId == id) {
        return true
      }
      return false
    },
    // 验证密码
    checkPassword() {
      let id = this.inputId
      let pass = this.inputPW
      const _this = this
      this.FesApi.fetch("/api/notes/checkPassWord", {
        id,
        pass
      }).then(rst => {
        if (rst.type == 0) {
          this.$refs.inputPass.close()
          // 将旧密码存储起来
          this.mainFormEditData.oldWord = this.inputPW
          _this.mainEditEven(_this.editObj)
        } else {
          _this.retSucceedInfo(rst)
        }
      })
    },
    // 单击标签
    viewSubItem(item) {
      this.editFlag = false
      this.mainObj = item
      this.itemTitle = item.name
      if (item.protect == 1) {
        this.inputId = item.id
        this.inputPWTip = item.tip
        this.inputPW = ''
        this.$refs.inputPass.show()
      } else {
        this.getAllItems(item.id, '')
      }
    },
    // 获取提示
    getTip(text) {
      return {
        direction: 'top',
        align: 'left',
        text: text
      }
    },
    // 主项目编辑事件
    async mainEditEven(item) {
      this.getAllCate()
      this.getUserRoles()
      let id = item.id
      this.mainFormEditData.id = item.id
      this.mainFormEditData.name = item.name
      this.mainFormEditData.desc = item.desc
      this.mainFormEditData.protect = item.protect.toString()
      this.mainFormEditData.flag = item.flag.toString()
      this.mainFormEditData.cate = item.category_id
      this.mainFormEditData.tip = item.tip
      this.mainFormEditData.owner = item.owner
      this.mainFormEditData.username = item.username
      this.mainFormEditData.created = item.created
      await this.FesApi.fetch("/api/notes/getNotesRoles", {
        id
      }).then(rst => {
        if (rst.length > 0) {
          this.mainFormEditData.role = rst
        }
        this.$refs.editMainWin.show()
      })
    },
    // 主项目编辑按钮
    clickMainEditBut(item) {
      this.restMainFormDataEdit()
      this.editFlag = true
      this.editObj = null
      this.editObj = item
      if (item.protect == 1) {
        this.inputId = item.id
        this.inputPWTip = item.tip
        this.inputPW = ''
        this.$refs.inputPass.show()
      } else {
        this.mainEditEven(item)
      }
    },
    // 获取所有主条目
    async getAllMain() {
      await this.FesApi.fetch("/api/notes/getAllNotes", {
        size: this.paginationMain.size,
        current: this.paginationMain.current,
        seach: this.paginationMain.seach,
        flag: this.paginationMain.flag,
        name: this.paginationMain.name,
      }).then(rst => {
        this.mainData = rst.data
        this.paginationMain.size = rst.per_page
        this.paginationMain.current = rst.current_page
        this.paginationMain.total = rst.total_page
        if (rst.seach) {
          this.paginationMain.seach = true
          this.paginationMain.flag = rst.flag
          this.paginationMain.name = rst.name
        }
      })
    },
    // 显示错误信息
    retSucceedInfo(msg) {
      if (msg.type === 0) {
        this.$Toast.success(msg.msg, {align: 'top'})
      }
      if (msg.type === 1) {
        this.$Toast.warn(msg.msg, {align: 'top'})
      }
      if (msg.type === 2) {
        this.$Toast.error(msg.msg, {align: 'top'})
      }
    },
    // 当显示密码改变时
    protectChange(value) {
      if (value == "1") {
        this.showPW = true
      } else {
        this.showPW = false
      }
    },
    // 当值改变时
    typeChange(value) {
      if (value == "1") {
        this.showGroup = true
      } else {
        this.showGroup = false
      }
    },
    // 获取登录用户的角色
    async getUserRoles() {
      await this.FesApi.fetch("/api/notes/getUserRoles", {}).then(rst => {
        this.roleList = rst
      })
    },
    // 获取所有列表
    async getAllCate() {
      await this.FesApi.fetch("/api/cate/getAllData", {}).then(rst => {
        this.cateList = rst
        if (rst.length > 0) {
          this.mainFormData.cate = this.cateList[0].id
        }
      })
    },
    clickPostMain() {
      this.$refs.addNotesForm.validate((valid, errors) => {
        if (valid) {
          // 提交主项目
          this.FesApi.fetch("/api/notes/addNotes", {
            "name": this.mainFormData.name,
            "desc": this.mainFormData.desc,
            "user_id": this.FesApp.get('uid'),
            "protect": this.mainFormData.protect,
            "showWord": this.mainFormData.showWord,
            "tip": this.mainFormData.tip,
            "flag": this.mainFormData.flag,
            "role": this.mainFormData.role,
            "categoryId": this.mainFormData.cate,
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type == 0) {
              this.paginationMain.seach = false
              this.getAllMain()
              this.$refs.newMainWin.close();
            }
          })
        }
      })
    },
    clickNewMainWin() {
      // 重置表单
      this.restMainFormData()
      this.getAllCate()
      this.getUserRoles()
      this.$refs.newMainWin.show()
    },
    // 获取主条目
    changeMainPage({current, size}) {
      this.paginationMain.size = size
      this.paginationMain.current = current
      this.getAllMain()
    },
    // 获取分页条目
    changeItemPage({current, size}) {
      let pass = this.inputPW
      let id = this.mainObj.id
      console.log(this.mainObj)
      this.paginationItem.size = size
      this.paginationItem.current = current
      this.getAllItems(id, pass)
    },
    // 清空新建附加条目数据
    restItemFormData() {
      this.ItemFormData.name = ''
      this.ItemFormData.desc = ''
      this.ItemFormData.list = []
    },
    // 重置
    restMainFormData() {
      this.mainFormData.role = []
      this.mainFormData.name = ''
      this.mainFormData.flag = '0'
      this.mainFormData.cate = null
      this.mainFormData.desc = ''
      this.mainFormData.protect = '0'
      this.mainFormData.showWord = ''
      this.mainFormData.tip = ''
      this.mainFormData.owner = ''
      this.showGroup = false
      this.showPW = false
    },
    // 重置
    restMainFormDataEdit() {
      this.mainFormEditData.id = null
      this.mainFormEditData.role = []
      this.mainFormEditData.flag = '0'
      this.mainFormEditData.name = ''
      this.mainFormEditData.cate = null
      this.mainFormEditData.desc = ''
      this.mainFormEditData.protect = '0'
      this.mainFormEditData.showWord = ''
      this.mainFormEditData.tip = null
      this.mainFormEditData.oldWord = ''
      this.mainFormEditData.owner = null

      this.showGroup = false
      this.showPW = false
    }
  }
};
</script>
<style lang="scss">
.item-input-copy-div {
  padding-left: 10px;

  .item-input-copy-icon {
    vertical-align: middle;

    &:hover {
      cursor: pointer;
    }
  }

  .tag-download {
    &:visited, &:link {
      color: #65717F;
      text-decoration: none;
    }
  }
}

.item-title-input {
  .ui-input-content {
    .ui-input {
      height: 32px;
      padding: 4px 8px;
      outline: 0;
      background-image: none;
      line-height: 1.5;
      font-size: 12px;
      color: #657180;
      background-color: #fff;
      text-align: center;

      border-color: #878787;
      border-style: solid;
      border-top-width: 0px;
      border-right-width: 0px;
      border-bottom-width: 1px;
      border-left-width: 0px;
      border-radius: 0px;
    }
  }
}

.query-page {
  .query-page-search {
    .fes-search-panel-form-item {
      width: 100%;
    }
  }
}

.note-row-user {
  margin-bottom: 24px;
}

.item-border-all {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;

  .item-option-div {
    width: 92px;
    height: 110px;
    border-bottom-left-radius: 33px;
    background: url("~@/static/tip.png") no-repeat;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 3px;

    &:hover {
      cursor: pointer;
      box-shadow: 2px 6px 10px 1px rgba(0, 0, 0, .1);
    }

    .item-title {
      margin-top: 5px;
      margin-left: 5px;
      margin-right: 5px;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

}

.item-pass-modal {
  .ui-modal-dialog {
    top: 2%;
  }
}

.icon-move {
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  vertical-align: middle;
}

.PanelMainOption {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 10px;
  margin-right: 10px;

  .ui-panel-content {
    .notes-main-list {
      &:nth-child(odd) {
        border: 1px solid #FFFFCC;
        background: #FFFFCC;
      }

      &:nth-child(even) {
        border: 1px solid #99CC99;
        background: #99CC99;
      }

      &:hover {
        cursor: pointer;
        /* 盒子阴影 */
        box-shadow: 2px 6px 10px 1px rgba(0, 0, 0, .1);
        /* 盒子向上移动效果，改变上外边距 */
      }

      padding-left: 20px;
      border-radius: 25px;
      -moz-border-radius: 25px;
      margin-bottom: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .name-label {
        text-align: center;
      }

      .tool-label {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .team-icon {
          margin-right: 8px;
        }
      }
    }
  }
}

.PanelItemOption {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 10px;
  margin-right: 10px;
}

.pagination-bottom {
  margin-left: 12px;
  margin-right: 12px;
  margin-bottom: 10px;
}
</style>
