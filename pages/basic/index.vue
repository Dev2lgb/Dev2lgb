<template>

  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    class="elevation-2"
    :items-per-page="15"
    :server-items-length="totalItems"
    :options.sync="pagination"
    :footer-props="{ itemsPerPageOptions: [15, 30, 35] }"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>회원관리</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          v-model="keyword"
          @keyup.enter="searchItem" @click:append="searchItem"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              등록하기
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="이름"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.status"
                      label="상태"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.area"
                      label="지역"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-select
                      v-model="editedItem.gender"
                      :items="genders"
                      label="성별"
                      dense
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.birth"
                            label="생년월일"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="editedItem.birth"
                        :active-picker.sync="activePicker"
                        locale="ko-KR"
                        :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="saveDate"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                닫기
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                저장
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">정말 삭제하시겠습니까?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">취소</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">삭제</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { align: 'center', sortable: false, width: '10%', text: '등록일자',  value: 'created_at' },
      { align: 'center', sortable: false, width: '10%', text: '이름',  value: 'name' },
      { align: 'center', sortable: false, width: '25%', text: '상태', value: 'status' },
      { align: 'center', sortable: false, width: '20%', text: '지역', value: 'area' },
      { align: 'center', sortable: false, width: '20%', text: '성별', value: 'gender' },
      { align: 'center', sortable: false, width: '10%', text: '생년월일', value: 'birth' },
      { align: 'center', sortable: false, width: '5%', text: '관리', value: 'actions' },
    ],
    items: [],
    loading: true,
    genders : ['남자', '여자'],
    pagination: {},
    editedIndex: -1,
    editedItem: {},
    deleteItemId: 0,
    defaultItem: {},
    totalItems: 0,
    errors: {},
    keyword : '',
    filename: '',
    activePicker: null,
    date: null,
    menu: false,
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '등록하기' : '수정하기'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    pagination: {
        handler() {
            this.fetchData()
        },
        deep: true,
    },
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      let url = 'api/basic';
      url += '?page=' + this.pagination.page;
      url += '&per_page=' + this.pagination.itemsPerPage;
      if (this.keyword) url += '&keyword=' + this.keyword;

      const items = await this.$axios.$get(url)
      this.items = items.data
      this.pagination.page = items.current_page
      this.totalItems = items.total
      this.loading = false;
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try {
        await this.$axios.delete('api/basic/' + this.editedItem.id)
        this.items.splice(this.editedIndex, 1)
        this.fetchData();
        this.closeDelete()
      } catch (error) {
        console.log(error);
      }
    },

    close () {
      this.dialog = false;
      this.errors = {};
      setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
      }, 300)
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      this.errors = {};
      let method = 'post';
      let url = 'api/basic';
      if (this.editedIndex > -1) {
        url += '/' + this.editedItem.id;
        method = 'put';
      }

      if (!this.editedItem.name) {
        this.$toast.error('이름을 입력해주세요.');
        return;
      } else if (!this.editedItem.status) {
        this.$toast.error('상태를 입력해주세요.');
        return;
      } else if (!this.editedItem.area) {
        this.$toast.error('지역을 입력해주세요.');
        return;
      } else if (!this.editedItem.gender) {
        this.$toast.error('성별을 선택해주세요.');
        return;
      } else if (!this.editedItem.birth) {
        this.$toast.error('생년월일을 입력해주세요.');
        return;
      }

      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }
      try {
        await this.$axios({
          url: url, method: method, data:this.editedItem, config
        })
        this.close();
        this.fetchData();
      } catch (error) {
        this.$toast.error('오류가 발생했습니다.');
        console.log(error);
      }
    },
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    searchItem() {
        this.fetchData()
    },
  },
}
</script>

<style>

</style>
