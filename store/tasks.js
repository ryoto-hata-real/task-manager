export const state = () => ({
  mainItems: [],
  detailTask: '',
});

export const mutations = {
  getTasks(state, mainItem) {
    state.mainItems.push(mainItem)
  },
  updateDetailTask(state, value) {
    state.detailTask = value
  },

  async addTask(state ,{title, date, hour, minute, res}) {
    state.mainItems.push({
      documentId: res.id,
      show: false,
      title: title,
      timeLimit:
        String(date) +
        " " +
        String(hour) +
        ":" +
        String(minute),
      detailTasks: [],
    })
  },
  deleteData(state,  i) {
    state.mainItems.splice(i,1)
  },
  deleteDetailData(state, {item, j}) {
    item.detailTasks.splice(j, 1)
  },
  addDetailTask(state, {task, item, res}) {
    item.detailTasks.push({
      documentId: res.id,
      detail: task,
      isPending: true,
      isDoing: false,
      isDone: false,
    })
    state.detailTask = ''
  },
  isOpenDetails(state, item) {
    item.show = !item.show
  },
  changeStatus(state, {detailTask, status}) {
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
  }
};

export const actions = {
  async getTasks({commit, state, rootState}) {
    if (state.mainItems.length == 0) {
      try {
        const snapshot = await this.$fire.firestore.collection(rootState.user.uid).where('type', '==', 'doing').get();
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
          commit('getTasks', mainItem)
        })
        return;
      }catch(e){
        return console.log(e)
      }
    } else {
      return;
    }

  },
  async addTaskAction({commit, rootState} ,{title, date, hour, minute}) {
    const user = rootState.user
    const addTask = await this.$fire.firestore.collection(user.uid)
      .add({
        id: 0,
        type: 'doing',
        show: false,
        title: title,
        timeLimit:
          String(date) +
          " " +
          String(hour) +
          ":" +
          String(minute),
      })
    await commit('addTask', {
      title: title, 
      date: date,
      hour: hour, 
      minute: minute, 
      res: addTask
    })
  },
  deleteData({commit, rootState}, {documentId, i}) {
    const user = rootState.user
    const document = this.$fire.firestore.collection(user.uid).doc(documentId)
   

    const deleteDocumentRecursively = async (docRef) => {
      const collectionRef = await docRef.collection('detailTasks');
      const collection = await collectionRef.get();
      for (let doc of collection.docs) {
        await collectionRef.doc(doc.id).delete()
      }
    };
    deleteDocumentRecursively(this.$fire.firestore.collection(user.uid).doc(documentId))
    document.delete()
    commit('deleteData', i)
  },
  deleteDetailData({commit, rootState}, {item, deletedItem, j}){
    if (item['detailTasks'].length == 1) {
      commit('isOpenDetails', item)
    }
    const user = rootState.user
    
    this.$fire.firestore.collection(user.uid).doc(item.documentId).collection('detailTasks').doc(deletedItem.documentId).delete()
    commit('deleteDetailData', {item: item, j: j})
  },
  async addDetailTaskAction({commit, rootState}, {task, item}){
    const snapshot = this.$fire.firestore.collection(rootState.user.uid).doc(item.documentId)
    if (task != '') {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      const addTask = await this.$fire.firestore.collection(rootState.user.uid).doc(item.documentId).collection('detailTasks').add({
        id:0,
        detail: String(task),
        isPending: true,
        isDoing: false,
        isDone: false,
      })
      commit('addDetailTask', {task: task, item: item, res: addTask})
      commit('updateDetailTask', '')
    }
  }
};