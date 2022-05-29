export const state = () => ({
  mainItems: [],
});

export const mutations = {

  addTask(state ,{title, date, hour, minute, user}) {
    console.log(user)
    this.$fire.firestore.collection(user.uid)
      .add({
        id: 0,
        type: 'doing',
        show: false,
        title: title,
        timeLimit:
          date +
          " " +
          String(hour) +
          ":" +
          String(minute),
      })
      .then((response) => {
        state.mainItems.push({
          documentId: response.id,
          show: false,
          title: title,
          timeLimit:
            date +
            " " +
            String(hour) +
            ":" +
            String(minute),
          detailTasks: [],
      })
      })
      .catch((error) => {
        console.log(error);
      });
  },
  remove(item) {
    
  },
};

export const actions = {
  async getTasks(context, state) {
    try {
      const snapshot = await state.db.where('type', '==', 'doing').get();
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
        state.mainItems.push(mainItem)
      })
    }catch(e){
      return;
    }
  },
  addTask({state, commit, rootState} ,{title, date, hour, minute}) {
    const user = rootState.user
    console.log(rootState.user)
    console.log(rootState.user.uid)
    commit('addTask', {
      title: title, 
      date: date, 
      hour: hour, 
      minute: minute, 
      user: user
    })
  }
};