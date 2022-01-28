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
          single-line
          hide-details
        ></v-text-field>
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
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="이름"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.status"
                      label="상태"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.area"
                      label="지역"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.gender"
                      label="성별"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.birth"
                      label="생년월일"
                    ></v-text-field>
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
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
    pagination: {},
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    totalItems: 0,
    errors: {},
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const items = await this.$axios.$get('api/basic?page=' + this.pagination.page + '&per_page=' + this.pagination.itemsPerPage)
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
      this.errors = {};

      this.$axios({
          url: 'api/basic/delete', data: item.id,
      }).then(response => {
          this.close();
          this.fetchData();
      }).catch(error => {
          console.log(error);
      });
    },

    deleteItemConfirm () {
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false;
      this.errors = {};
      setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          /* TODO OPEN PHOTO
          this.$refs.photo.init(0, null);
          this.$refs.business_card.init(0, null);*/
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

    save () {
      this.errors = {};
      let method = 'post';
      if (this.editedIndex > -1) {
          method = 'put';
      }
      this.$axios({
          url: 'api/basic', method: method, data: this.editedItem,
      }).then(response => {
          this.close();
          this.fetchData();
      }).catch(error => {
          console.log(error);
      });
    },
  },
}
</script>

<style>

</style>
