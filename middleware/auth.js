export default function ({store, route, redirect}) {
  // ログインページでない場合
  if(route.path !== '/auth/signin') {

    if(!store.getters.isAuthenticated) {
      console.log('currentUser is null')
      return redirect('/auth/signin')
    }

  // ログインページの場合
  } else if (route.path === '/auth/signin') {    
    console.log("aaaaa" + store.getters.isAuthenticated)

    if(store.getters.isAuthenticated) {
      return redirect('/top')
    }else{
      console.log("bbbbb" + store.getters.getUser)
    }
  }
}