export default function ({store, route, redirect}) {
  // ログインページでない場合
  if(route.path !== '/auth/signin') {

    if(!store.state.user) {
      console.log('currentUser is null')
      return redirect('/auth/signin')
    }

  // ログインページの場合
  } else if (route.path === '/auth/signin') {
    console.log(store.state.user)
    console.log(store.state)
    

    if(store.state.user) {
      return redirect('/top')
    }else{
      console.log('currentUser is null')
    }
  }
}