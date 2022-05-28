<template>
  <v-sheet
    min-height="70vh"
    rounded="sm"
    color="red lighten-4"
    class="pb-3"
    elevation="1"
  >
    <v-btn
      class="mx-2 float-right pa-2 ma-2"
      fab
      dark
      color="success"
      @click="show = !show"
    >
      <v-icon> mdi-plus </v-icon>
    </v-btn>
    <v-subheader>実行中</v-subheader>

    <v-card
      v-show="show"
      class="ml-2 mr-2 mt-5"
      color="grey lighten-3"
      elevation="5"
    >
      <v-form @submit.prevent>
        <v-col>
          <v-text-field
            v-model="mainTask.title"
            background-color="#fff"
            filled
            dence
            label="タスクを追加"
            height="50"
            class="mt-0 pt-0"
            required
          ></v-text-field>
          <v-date-picker
            v-model="mainTask.timeLimit.date"
            locale="ja-JP"
            color="grey"
            min="2022-01-01"
            max="2026-12-30"
          ></v-date-picker>
          <v-row align="center" class="mt-1">
            <v-col class="d-flex pr-1" cols="12" sm="6">
              <v-select
                v-model="mainTask.timeLimit.hour"
                :items="timeHourItems"
                label="時間"
                solo
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
              <v-select
                v-model="mainTask.timeLimit.minute"
                :items="timeMinuteItems"
                label="分"
                solo
              ></v-select>
            </v-col>
          </v-row>
          <v-btn tile color="success" @click="postData">
            <v-icon left> mdi-pencil </v-icon>
            タスク作成
          </v-btn>
        </v-col>
      </v-form>
    </v-card>

    <v-list color="red lighten-4 mt-3">
      <draggable ghostClass="on-drag_doing" @end="updateMainId($event)" tag="v-col" animation="300" group="items">
        <v-col
          v-for="(item, i) in sortedItemsById"
          :key="i"
          cols="12"
          class="pa-1 draggable"
        >
          <v-card :color="item.color">
            <div class="d-flex flex-column">
              <div class="d-flex flex-column">
                

                <v-card-title
                  v-text="item.title"
                  class="pa-2 pb-0"
                ></v-card-title>

                <div class="d-flex justify-space-between">
                  <div class="time-limit pl-2 pt-1">
                    <v-icon color="grey darken-2"
                      >mdi-timer-sand-complete</v-icon
                    ><span class="grey--text text--darken-2">{{
                      item.timeLimit
                    }}</span>
                  </div>
                  <v-spacer></v-spacer>
                  <v-card-actions class="pa-0">
                    <v-spacer></v-spacer>
                    <v-btn icon @click="item.show = !item.show">
                      <v-icon>{{
                        item.show ? "mdi-chevron-up" : "mdi-chevron-down"
                      }}</v-icon>
                    </v-btn>
                  </v-card-actions>
                  <v-hover v-slot="{hover}">
                    <v-btn
                      :elevation="hover ? 10 : 2"
                      small
                      x-small
                      absolute
                      right
                      top
                      color="error"
                      class="mt-n3 mr-n3"
                      :class="{ 'on-hover': hover }"
                      @click="deleteData(item, i)"
                      >タスクを削除
                    </v-btn>
                  </v-hover>
                </div>
              </div>
            </div>

            <v-expand-transition>
              <div v-show="item.show" class="pb-2">
                <v-divider></v-divider>
                <draggable v-if="item.detailTasks" animation="300" tag="v-col">
                  <v-col
                    v-for="(detailTask, j) in item.detailTasks"
                    :key="j"
                    cols="12"
                    class="pa-1"
                  >
                    <v-card color="red lighten-5" v-if="detailTask">
                      <div class="d-flex flex-no-wrap justify-space-between">
                        <div class="d-flex flex-column">
                          <v-card-subtitle
                            v-text="detailTask.detail"
                            class="pb-1"
                          ></v-card-subtitle>
                          <div class="d-flex ml-3 mb-1">
                            <v-btn
                              outlined
                              small
                              rounded
                              color="primary"
                              @click="changeStatus(detailTask, 1)"
                              :class="[
                                { 'chosen-process': detailTask.isPending },
                                'ma-1',
                              ]"
                              >確認待</v-btn
                            >
                            <v-btn
                              outlined
                              small
                              rounded
                              color="success"
                              @click="changeStatus(detailTask, 2)"
                              :class="[
                                { 'chosen-process': detailTask.isDoing },
                                'ma-1',
                              ]"
                              >実行中</v-btn
                            >
                            <v-btn
                              outlined
                              small
                              rounded
                              color="error"
                              @click="changeStatus(detailTask, 3)"
                              :class="[
                                { 'chosen-process': detailTask.isDone },
                                'ma-1',
                              ]"
                              >完了
                            </v-btn>
                            <v-btn
                              fab
                              small
                              absolute
                              right
                              color="error"
                              class="mt-n2"
                              @click="deleteDetailData(item, detailTask, j)"
                              ><v-icon>
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </div>
                      
                    </v-card>
                  </v-col>
                </draggable>
                <v-form sm="6" md="4" class="ma-4" @submit.prevent>
                    <v-row>
                      <v-text-field
                        v-model="item.detailPool"
                        label="タスク追加"
                        outlined
                        hide-details
                        dense
                        class="pl-3"
                        @keydown.enter="postSubData(item.title, item)"
                      ></v-text-field>
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        color="success"
                        @click="postSubData(item.title, item)"
                      >
                        <v-icon dark> mdi-pencil </v-icon>
                      </v-btn>
                    </v-row>
                </v-form>                
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </draggable>
    </v-list>
  </v-sheet>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },
  data: () => ({
    mainTask: {
      title: "",
      timeLimit: {
        date: "",
        hour: "",
        minute: "",
      },
    },
    detailTask: "",
    timeHourItems: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    timeMinuteItems: ['00', '15', '30', '45'],
    show: false,
    options: {
      animation: 300,
    },
    mainItems: [],
  }),
  async mounted() {

    try {
      const snapshot = await this.db.where('type', '==', 'doing').get();
      snapshot.forEach(async (doc) => {
      const hasDetailTasks = await doc.ref.collection('detailTasks').get()
      let mainItem = {}
      mainItem = doc.data()
      mainItem["detailTasks"] = []
      if (hasDetailTasks){
        const subCollection = await doc.ref.collection('detailTasks').where('type', '==', 'doing').get();
        subCollection.forEach(doc => {
          const detailItem = doc.data()
          detailItem["documentId"] = doc.id
          mainItem["detailTasks"].push(detailItem)
        });
      }
      mainItem["documentId"] = doc.id
      this.mainItems.push(mainItem)
    });
    }catch(e){
      return;
    }
    
  },
  computed: {
    db() {
      return this.$fire.firestore.collection(this.$store.state.user.uid)
    },
    sortedItemsById() {
      return this.mainItems.sort((a, b) => {
        return a.id - b.id;
      });
    }
  },
  methods: {
    changeStatus(detailTask, status) {
      detailTask.status = status;
      if (status == 1) {
        detailTask.isPending = true;
        detailTask.isDoing = false;
        detailTask.isDone = false;
      } else if (status == 2) {
        detailTask.isPending = false;
        detailTask.isDoing = true;
        detailTask.isDone = false;
      } else {
        detailTask.isPending = false;
        detailTask.isDoing = false;
        detailTask.isDone = true;
      }
    },
    postData() {
      this.db
        .add({
          id: 0,
          type: 'doing',
          show: false,
          title: this.mainTask.title,
          timeLimit:
            this.mainTask.timeLimit.date +
            " " +
            String(this.mainTask.timeLimit.hour) +
            ":" +
            String(this.mainTask.timeLimit.minute),
        })
        .then((response) => {
          this.mainItems.push({
            documentId: response.id,
            show: false,
            title: this.mainTask.title,
            timeLimit:
              this.mainTask.timeLimit.date +
              " " +
              String(this.mainTask.timeLimit.hour) +
              ":" +
              String(this.mainTask.timeLimit.minute),
            detailTasks: [],
        })
        })
        .catch((error) => {
          console.log(error);
        });
      
      this.show = false;
    },
    updateMainId(event) {
      this.db.doc(this.mainItems[event.oldIndex].documentId).update({
        id: event.newIndex
      })
      this.db.doc(this.mainItems[event.newIndex].documentId).update({
        id: event.oldIndex
      })
    },
    async postSubData(title, item) {
      const snapshot = await this.db.doc(item.documentId)
      if (item.detailPool != '') {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        await snapshot.collection('detailTasks').add({
          id: 0,
          type: 'doing',
          detail: item.detailPool,
          isPending: true,
          isDoing: false,
          isDone: false,
        })
        .then((response) => {     
          item.detailTasks.push({
            detail: item.detailPool,
            isPending: true,
            isDoing: false,
            isDone: false,
          })
        item.detailPool = ""
        item.show = false;
        item.show = true;
        })
        .catch((error) => {
          console.log(error);
        });
      }

    },
    deleteDetailData(item, deletedItem, j) {
      if (item['detailTasks'].length == 1) {
        item.show = false
      }
      this.db.doc(item.documentId).collection('detailTasks').doc(deletedItem.documentId).delete()
      item['detailTasks'].splice(j,1)
    },
    deleteData(item, i) {
      this.db.doc(item.documentId).delete()
      this.mainItems.splice(i,1)
    }
  },
};
</script>

<style>
.draggable:hover {
  cursor: grab;
}
.draggable:active {
  cursor: grabbing;
}
.grabing {
  background: #efefef;
}
.chosen-process {
  background: #fff;
}
.on-drag_doing {
  background: #e990b9;
  color: #fff;
  z-index: 10;
}

</style>
