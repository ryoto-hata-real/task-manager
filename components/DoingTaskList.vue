<template>
  <v-sheet
    min-height="70vh"
    rounded="sm"
    color="grey lighten-4"
    class="pb-3"
    elevation="2"
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
    <v-subheader>{{ date }}</v-subheader>

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
          <v-btn tile color="success" @click="addTask">
            <v-icon left> mdi-pencil </v-icon>
            タスク作成
          </v-btn>
        </v-col>
      </v-form>
    </v-card>

    <v-list class="mt-3" color="grey lighten-4">
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
                    <v-btn icon @click="isOpenDetail(item)">
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
                    <v-card v-bind:class="{
                      'red lighten-5': detailTask.isDone,
                      'blue lighten-5': detailTask.isPending, 
                      'green lighten-5': detailTask.isDoing,
                      
                    }" v-if="detailTask">
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
                              ><strong>確認待</strong>
                            </v-btn>
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
                              ><strong>実行中</strong>
                              </v-btn>
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
                              ><strong>完了</strong>
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
                        v-model="task"
                        label="タスク追加"
                        id="detail-task"
                        outlined
                        hide-details
                        dense
                        class="pl-3"
                        @keydown.enter="postDetailData(item)"
                      ></v-text-field>
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        color="success"
                        @click="postDetailData(item)"
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

const date = new Date();
const month = date.getMonth() + 1; //月が代入される
const day = date.getDate()

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
    date: String(month) + '月' + String(day) + '日のタスク',
    detailTask: "",
    timeHourItems: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    timeMinuteItems: ['00', '15', '30', '45'],
    show: false,
    options: {
      animation: 300,
    },
  }),
  created() {
    this.$store.dispatch("tasks/getTasks");
  },
  computed: {
    db() {
      return this.$fire.firestore.collection(this.$store.state.user.uid)
    },
    sortedItemsById() {
      return this.$store.state.tasks.mainItems
    },
    mainItems () {
      return this.$store.state.tasks.mainItems
    },
    task: {
      get () {
        return this.$store.state.tasks.detailTask
      },
      set (value) {
        this.$store.commit('tasks/updateDetailTask', value)
      },
    }

  },
  methods: {
    addTask() {
      this.show = !this.show
      this.$store.dispatch('tasks/addTaskAction', 
        {
          title: this.mainTask.title,
          date: this.mainTask.timeLimit.date,
          hour: this.mainTask.timeLimit.hour,
          minute: this.mainTask.timeLimit.minute
        }
      )
      this.mainTask.title = ''
      this.mainTask.timeLimit.date = ''
      this.mainTask.timeLimit.hour = ''
      this.mainTask.timeLimit.minute = ''

    },
    changeStatus(detailTask, status) {
      this.$store.commit('tasks/changeStatus', {detailTask: detailTask, status: status})
    },
    updateMainId(event) {
      this.db.doc(this.mainItems[event.oldIndex].documentId).update({
        id: event.newIndex
      })
      this.db.doc(this.mainItems[event.newIndex].documentId).update({
        id: event.oldIndex
      })
    },
    postDetailData(item) {
      this.$store.dispatch('tasks/addDetailTaskAction', {
        task: this.$store.state.tasks.detailTask,
        item:item
      })
    },
    isOpenDetail(item){
      this.$store.commit('tasks/isOpenDetails', item)
    },
    deleteDetailData(item, deletedItem, j) {
      this.$store.dispatch('tasks/deleteDetailData', {
        item: item,
        deletedItem: deletedItem,
        j: j
      })
    },
    deleteData(item, i) {
      this.$store.dispatch('tasks/deleteData', {
        documentId: item.documentId,
        i: i,
      })
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
.red {
  background-color: #e990b9;
}

</style>
